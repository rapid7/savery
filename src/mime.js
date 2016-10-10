const MIME_TYPES = {
  '7z': 'application/x-7z-compressed',
  bmp: 'image/bmp',
  conf: 'text/plain',
  css: 'text/css',
  csv: 'text/csv',
  dmg: 'application/x-apple-diskimage',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  gz: 'application/x-gzip',
  html: 'text/html',
  jar: 'application/java-archive',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  js: 'application/javascript',
  json: 'application/json',
  log: 'text/plain',
  map: 'application/json',
  mov: 'video/quicktime',
  mp3: 'audio/mp3',
  mp4: 'video/mp4',
  oga: 'audio/ogg',
  ogg: 'audio/ogg',
  ogv: 'video/ogg',
  pdf: 'application/pdf',
  png: 'image/png',
  ps: 'application/postscript',
  pps: 'application/vnd.ms-powerpoint',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  psd: 'image/vnd.adobe.photoshop',
  qt: 'video/quicktime',
  rar: 'application/x-rar-compressed',
  rtf: 'text/rtf',
  svg: 'image/svg+xml',
  text: 'text/plain',
  torrent: 'application/x-bittorrent',
  txt: 'text/plain',
  tiff: 'image/tiff',
  war: 'application/java-archive',
  weba: 'audio/webm',
  webm: 'video/webm',
  webp: 'image/webp',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip'
};

/**
 * lookup the mapped MIME type based on the extension provided
 *
 * @param {string} extension
 * @returns {string}
 */
const lookup = (extension: string): string => {
  return MIME_TYPES[extension] || '';
};

export default {
  lookup
};
