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
 * @param {function} [options.onEndSave]
 * @param {function} [options.onError]
 * @param {function} [options.onStartSave]
 * @param {boolean} [options.shouldAutoBom]
 * @param {string} [options.type]
 * @returns {function(data: *): void}
 */
const savery = (fileName: string = 'download.txt', options: Options = {}): Function => {
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

/**
 * one-line function to create the savery on the spot and fire the .save()
 *
 * @param {*} data
 * @param {string} fileName
 * @param {object} options
 * @param {function} [options.onAbort]
 * @param {function} [options.onAfterSave]
 * @param {function} [options.onBeforeSave]
 * @param {function} [options.onEndSave]
 * @param {function} [options.onError]
 * @param {function} [options.onStartSave]
 * @param {boolean} [options.shouldAutoBom]
 * @param {string} [options.type]
 * @returns {Promise}
 */
savery.save = (data: any, fileName: string, options: Options): Promise<SaveryType> => {
  const saveryInstance: SaveryType = savery(fileName, options);

  return saveryInstance(data).save();
};

export default savery;
