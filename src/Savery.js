// @flow

// constants {
import {
  DEFAULT_MIME_TYPE,
  GLOBAL,
  HAS_DOWNLOAD_ATTRIBUTE_SUPPORT,
  IS_CHROME_OR_IOS,
  IS_SAFARI,
  STATUSES
} from './constants';

// utils
import {
  createBlob,
  createObjectUrl,
  noop,
  openPopupOrNavigate,
  passThrough,
  revokeObjectUrl,
  saveWithDownloadAttribute,
  saveWithFileReader,
  setAutoBom
} from './utils';

// types
import type {
  Options,
  Savery as SaveryType
} from './types';

class Savery {
  constructor(data: any, name: string, options: Options = {}): SaveryType {
    const {
      mimeType,
      onAbort = noop,
      onAfterSave = passThrough,
      onBeforeSave = passThrough,
      onError = noop,
      onStartSave = noop,
      onEndSave = noop,
      shouldAutoBom = true
    } = options;

    this.autoBOM = shouldAutoBom;
    this.data = data;
    this.error = null;
    this.filename = name;
    this.forceLoad = mimeType === DEFAULT_MIME_TYPE;
    this.mimeType = mimeType;

    this.onAbort = onAbort;
    this.onAfterSave = onAfterSave;
    this.onBeforeSave = onBeforeSave;
    this.onError = onError;
    this.onStartSave = onStartSave;
    this.onEndSave = onEndSave;

    return this;
  }

  autoBOM: boolean = true;
  data: any = null;
  error: ?Error = null;
  filename: string = '';
  forceLoad: boolean = false;
  onAbort: Function = noop;
  onAfterSave: Function = passThrough;
  onBeforeSave: Function = passThrough;
  onEndSave: Function = noop;
  onError: Function = noop;
  onStartSave: Function = noop;
  size: number = 0;
  status: string = STATUSES.PENDING;
  mimeType: string = DEFAULT_MIME_TYPE;

  /**
   * execute the onAfterSave method and return the results
   *
   * @returns {*}
   * @private
   */
  _onAfterSave = (): any => {
    if (this.status !== STATUSES.COMPLETE) {
      return Promise.reject(this);
    }

    return this.onAfterSave(this);
  };

  /**
   * execute the onBeforeSave method and return the results
   *
   * @returns {*}
   * @private
   */
  _onBeforeSave = (): any => {
    if (this.status !== STATUSES.PENDING) {
      return Promise.reject(this);
    }

    return this.onBeforeSave(this.data);
  };

  /**
   * trigger the end of the save process
   *
   * @param {string} objectUrl
   * @returns {string|Promise}
   * @private
   */
  _onEndSave = (objectUrl: string): string|Promise<any> => {
    if (this.status !== STATUSES.PROCESSING) {
      return Promise.reject(this);
    }

    revokeObjectUrl(objectUrl);

    this.status = STATUSES.COMPLETE;
    this.onEndSave(this);

    return objectUrl;
  };

  /**
   * trigger the onError method and reject the promise
   *
   * @param {Error} error
   * @returns {Savery|Promise}
   * @private
   */
  _onError = (error: ?Error) => {
    if (this.status !== STATUSES.CANCELLED) {
      this.status = STATUSES.ERROR;
    }

    this.onError(error);

    return Promise.reject(error);
  };

  /**
   * save the file based on browser capabilities
   *
   * @returns {string|Promise}
   * @private
   */
  _onSave = () => {
    if (this.status !== STATUSES.PROCESSING) {
      return Promise.reject(this);
    }

    const blob: Blob = createBlob(this.data, this.mimeType);
    const file: Blob = this.autoBOM ? setAutoBom(blob) : blob;
    const objectUrl: string = createObjectUrl(file);

    this.size = blob.size;

    if (HAS_DOWNLOAD_ATTRIBUTE_SUPPORT) {
      saveWithDownloadAttribute(objectUrl, this.filename);

      return objectUrl;
    }

    if ((IS_CHROME_OR_IOS || (this.forceLoad && IS_SAFARI)) || GLOBAL.FileReader) {
      return saveWithFileReader(file);
    }

    if (this.forceLoad) {
      GLOBAL.location.href = objectUrl;
    } else {
      openPopupOrNavigate(objectUrl);
    }

    this.status = STATUSES.COMPLETE;

    return objectUrl;
  };

  /**
   * trigger the beginning of the save process
   *
   * @returns {Savery|Promise}
   * @private
   */
  _onStartSave = (): Promise<string>|string => {
    if (this.status !== STATUSES.PENDING) {
      return Promise.reject(this);
    }

    this.status = STATUSES.PROCESSING;
    this.onStartSave(this);

    return this;
  };

  /**
   * abort the save process
   *
   * @returns {Savery|Promise}
   */
  abort() {
    if (this.status === STATUSES.PENDING || this.status === STATUSES.PROCESSING) {
      this.status = STATUSES.CANCELLED;
      this.error = new Error(`Savery for ${this.filename} was aborted.`);

      this.onAbort(this);

      return this;
    }

    this.error = new Error(`Savery has already completed for ${this.filename}.`);

    return Promise.reject(this);
  }

  /**
   * execute the saving of the file
   *
   * @returns {Promise}
   */
  save() {
    return Promise.resolve()
      .then(this._onBeforeSave)
      .then(this._onStartSave)
      .then(this._onSave)
      .then(this._onEndSave)
      .then(this._onAfterSave)
      .catch(this._onError);
  }
}

export default Savery;
