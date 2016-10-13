// @flow

// constants
import {
  AUTO_BOM_REGEXP,
  DEFAULT_MIME_TYPE,
  GLOBAL,
  IS_CHROME_OR_IOS,
  LINK,
  MIME_TYPE_REGEXP,
  READER_REPLACE_REGEXP,
  REVOKE_TIMEOUT
} from './constants';

// conditional dependencies
const mime = process.env.SAVERY === 'full' ? require('mime-types') : require('./mime');

const CONFIRMATION_MESSAGE: string = 'Displaying new document\n\n Use Save As... to download, ' +
  'then click back in your browser to return to this page.';

/**
 * generate a new blob based on the data and MIME type
 *
 * @param {*} data
 * @param {string} mimeType
 * @returns {Blob}
 */
const createBlob = (data: any, mimeType: string): Blob => {
  return new GLOBAL.Blob([data], {
    type: mimeType
  });
};

export {createBlob};

/**
 * create the objectUrl with the GLOBAL URL object
 *
 * @param {Blob} blob
 * @returns {string}
 */
const createObjectUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

export {createObjectUrl};

/**
 * get the MIME type of the file
 *
 * if the MIME type was explicitly passed, check if it exists in our list, and if not
 * check to see if it can be used directly (as in someone passed in the full MIME type)
 *
 * if no MIME type is passed, intuit the type from the file extension, and if that type
 * does not exist in our list then fall back to the DEFAULT_MIME_TYPE
 *
 * @param {string} passedMimeType
 * @param {string} fileName
 * @returns {string}
 */
const getMimeType = (passedMimeType: ?string, fileName: string): string => {
  if (!passedMimeType) {
    const fileExtension: string = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();

    return mime.lookup(fileExtension) || DEFAULT_MIME_TYPE;
  }

  const lowerCaseMimeType: string = passedMimeType.toLowerCase();

  if (MIME_TYPE_REGEXP.test(lowerCaseMimeType.split(';')[0])) {
    return lowerCaseMimeType;
  }

  const searchedMimeType: string = mime.lookup(lowerCaseMimeType);

  if (searchedMimeType) {
    return searchedMimeType;
  }

  return DEFAULT_MIME_TYPE;
};

export {getMimeType};

/**
 * no-no function
 *
 * @returns {null}
 */
const noop = (): null => {
  return null;
};

export {noop};

/**
 * either open a popup (if allowed) or navigate to the location
 *
 * @param {string} url
 */
const openPopupOrNavigate = (url: string) => {
  const popup: Object = GLOBAL.open(url, '_blank');

  if (!popup) {
    if (confirm(CONFIRMATION_MESSAGE)) {
      GLOBAL.location.href = url;
    }
  }
};

export {openPopupOrNavigate};

/**
 * pass-through function
 *
 * @param {*} object
 * @returns {T}
 */
const passThrough = (object: any): any => {
  return object;
};

export {passThrough};

/**
 * revoke the existing objectUrl
 *
 * @param {Object|string} file
 */
const revokeObjectUrl = (file: Object|string) => {
  setTimeout(() => {
    if (typeof file === 'string') {
      URL.revokeObjectURL(file);
    } else {
      file.remove();
    }
  }, REVOKE_TIMEOUT);
};

export {revokeObjectUrl};

/**
 * trigger a click event for the given node
 *
 * @param {HTMLAnchorElement} node
 */
const triggerClick = (node: HTMLElement) => {
  const event: MouseEvent = new MouseEvent('click');

  node.dispatchEvent(event);
};

export {triggerClick};

/**
 * use the download attribute to trigger save
 *
 * @param {string} objectUrl
 * @param {string} name
 */
const saveWithDownloadAttribute = (objectUrl: string, name: string) => {
  LINK.href = objectUrl;
  LINK.download = name;

  triggerClick(LINK);
};

export {saveWithDownloadAttribute};

/**
 * use the FileReader object (native) to trigger save
 *
 * @param {Blob} blob
 * @returns {Promise}
 */
const saveWithFileReader = (blob: Blob): Promise<string> => {
  if (!blob) {
    return Promise.reject(new Error('No data provided to FileReader.'));
  }

  return new Promise((resolve: Function) => {
    const reader: FileReader = new GLOBAL.FileReader();

    reader.onloadend = function() {
      const url = IS_CHROME_OR_IOS ? reader.result : reader.result.replace(READER_REPLACE_REGEXP, 'data:attachment/file;');

      openPopupOrNavigate(url);

      resolve(url);
    };

    reader.readAsDataURL(blob);
  });
};

export {saveWithFileReader};

/**
 * for IE10 (which has Blob but no URL support) use the native msSaveBlob
 *
 * @param {Blob} blob
 * @param {string} filename
 */
const saveWithSaveMsBlob = (blob: Blob, filename: string) => {
  GLOBAL.navigator.msSaveBlob(blob, filename);
};

export {saveWithSaveMsBlob};

/**
 * set the BOM for the blob
 *
 * @param {Blob} blob
 * @param {string} blob.type
 * @returns {Blob}
 */
const setAutoBom = (blob: Blob): Blob => {
  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (AUTO_BOM_REGEXP.test(blob.type)) {
    return new GLOBAL.Blob([String.fromCharCode(0xFEFF), blob], {
      type: blob.type
    });
  }

  return blob;
};

export {setAutoBom};
