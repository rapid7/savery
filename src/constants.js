// @flow

import type {
  Statuses
} from './types';

const DEFAULT_MIME_TYPE: string = 'application/octet-stream';
const MIME_TYPE_REGEXP: RegExp = /^[a-zA-Z\-]+\/([a-zA-Z0-9.\-+]+)+$/;

const STATUSES: Statuses = {
  CANCELLED: 'CANCELLED',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING'
};

const GLOBAL: Object = window || global;
const DOCUMENT: Object = GLOBAL.document;

const URL: Object = GLOBAL.URL || GLOBAL.webkitURL;
const LINK: HTMLAnchorElement = DOCUMENT.createElementNS('http://www.w3.org/1999/xhtml', 'a');

const AUTO_BOM_REGEXP: RegExp = /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i;
const CHROME_OR_IOS_REGEXP: RegExp = /CriOS\/[\d]+/;
const READER_REPLACE_REGEXP: RegExp = /^data:[^;]*;/;
const SAFARI_REGEXP: RegExp = /constructor/i;

const HAS_DOWNLOAD_ATTRIBUTE_SUPPORT: boolean = 'download' in LINK;
const HAS_MSSAVEBLOB_SUPPORT: boolean = !!(GLOBAL.navigator && GLOBAL.navigator.msSaveBlob);
const IS_CHROME_OR_IOS: boolean = CHROME_OR_IOS_REGEXP.test(GLOBAL.navigator.userAgent);
const IS_SAFARI: boolean = SAFARI_REGEXP.test(GLOBAL.HTMLElement) || GLOBAL.safari;

const REVOKE_TIMEOUT: number = 30000;

export {AUTO_BOM_REGEXP};
export {CHROME_OR_IOS_REGEXP};
export {DEFAULT_MIME_TYPE};
export {GLOBAL};
export {HAS_DOWNLOAD_ATTRIBUTE_SUPPORT};
export {HAS_MSSAVEBLOB_SUPPORT};
export {IS_CHROME_OR_IOS};
export {IS_SAFARI};
export {LINK};
export {MIME_TYPE_REGEXP};
export {READER_REPLACE_REGEXP};
export {REVOKE_TIMEOUT};
export {SAFARI_REGEXP};
export {STATUSES};
export {URL};
