// @flow

// main class
import Savery from './Savery';

// utils
import {
  getMimeType
} from './utils';

// types
import type {
  Options,
  Savery as SaveryType
} from './types';

/**
 * return function that will receive data and trigger saveAs
 *
 * @param {string} fileName=download
 * @param {object} options
 * @param {function} [options.onAbort]
 * @param {function} [options.onAfterSave]
 * @param {function} [options.onBeforeSave]
 * @param {function} [options.onError]
 * @param {function} [options.onProgress]
 * @param {function} [options.onWrite]
 * @param {function} [options.onWriteStart]
 * @param {string} [options.type]
 * @returns {function(data: *): void}
 */
const saveFile = (fileName: string = 'download.txt', options: Options = {}): Function => {
  const {
    type,
    ...restOfOptions
  } = options;
  const mimeType: string = getMimeType(type, fileName);

  return (data: any = null): SaveryType => {
    return new Savery(data, fileName, {
      ...restOfOptions,
      mimeType
    });
  };
};

export default saveFile;
