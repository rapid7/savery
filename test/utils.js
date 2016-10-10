import test from 'ava';
import sinon from 'sinon';

import {
  DEFAULT_MIME_TYPE,
  LINK,
  MIME_TYPE_REGEXP,
  REVOKE_TIMEOUT,
  URL
} from '../src/constants';

import {
  createBlob,
  createObjectUrl,
  getMimeType,
  noop,
  openPopupOrNavigate,
  passThrough,
  revokeObjectUrl,
  saveWithDownloadAttribute,
  saveWithFileReader,
  setAutoBom,
  triggerClick
} from '../src/utils';

const PDF_MIME = 'application/pdf';
const SVG_MIME = 'image/svg+xml';
const EXCEL_MIME = 'application/vnd.ms-excel';
const TEXT_CHARSET_MIME = 'text/html; charset=utf-8';

const PDF = 'pdf';
const SVG = 'svg';
const EXCEL = 'xls';

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

test('if MIME_TYPE_REGEXP matches cases correctly', (t) => {
  t.true(MIME_TYPE_REGEXP.test(PDF_MIME));
  t.true(MIME_TYPE_REGEXP.test(SVG_MIME));
  t.true(MIME_TYPE_REGEXP.test(EXCEL_MIME));
  t.true(MIME_TYPE_REGEXP.test(TEXT_CHARSET_MIME.split(';')[0]));

  t.false(MIME_TYPE_REGEXP.test(TEXT_CHARSET_MIME));
  t.false(MIME_TYPE_REGEXP.test(PDF));
  t.false(MIME_TYPE_REGEXP.test(SVG));
  t.false(MIME_TYPE_REGEXP.test(EXCEL));
});

test('if createBlob creates a blob from the parameters passed', (t) => {
  const data = 'Hello world!';
  const blob = createBlob(data, 'text/html');

  t.true(blob instanceof Blob);
});

test('if createObjectUrl fires the createObjectURL function on URL', (t) => {
  const blob = 'foo';

  let fired = false,
      item;

  URL.createObjectURL = function(blob) {
    fired = true;
    item = blob;
  };

  createObjectUrl(blob);

  t.true(fired);
  t.is(item, blob);
});

test('if getMimeType returns the same MIME type passed if it matches regexp', (t) => {
  const exact = getMimeType(PDF_MIME, 'test.pdf');
  const exactSvg = getMimeType(SVG_MIME, 'test.svg');
  const exactExcel = getMimeType(EXCEL_MIME, 'test.xls');
  const exactTextCharset = getMimeType(TEXT_CHARSET_MIME, 'test.xls');

  t.is(exact, PDF_MIME);
  t.is(exactSvg, SVG_MIME);
  t.is(exactExcel, EXCEL_MIME);
  t.is(exactTextCharset, TEXT_CHARSET_MIME);
});

test('if getMimeType returns the valid MIME type if passed the file extension', (t) => {
  const pdfResult = getMimeType(PDF, 'test.pdf');
  const svgResult = getMimeType(SVG, 'test.svg');
  const excelResult = getMimeType(EXCEL, 'test.xls');

  t.is(pdfResult, PDF_MIME);
  t.is(svgResult, SVG_MIME);
  t.is(excelResult, EXCEL_MIME);
});

test('if getMimeType returns the default MIME type when one cannot be found', (t) => {
  const result = getMimeType('unrecognized', 'test.pdf');

  t.is(result, DEFAULT_MIME_TYPE);
});

test('if noop returns null', (t) => {
  t.is(noop(), null);
});

test('if openPopupOrNavigate will correctly open a popup', (t) => {
  const href = 'http://foo.com';

  const stub = sinon.stub(window, 'open');

  openPopupOrNavigate(href);

  t.true(stub.calledOnce);

  stub.restore();
});

test('if passThrough returns the value passed', (t) => {
  const object = {};
  const result = passThrough(object);

  t.is(result, object);
});

test('if revokeObjectUrl fires the createObjectURL function on UR', async (t) => {
  const url = 'foo';

  let fired = false,
    item;

  URL.revokeObjectURL = function(url) {
    fired = true;
    item = url;
  };

  revokeObjectUrl(url);

  console.log(`Please wait ${REVOKE_TIMEOUT / 1000} seconds for completion...`);

  await sleep(REVOKE_TIMEOUT);

  t.true(fired);
  t.is(item, url);
});

test('if saveWithDownloadAttribute sets the attributes correctly and triggers click', (t) => {
  const url = 'http://foo.com/';
  const name = 'bar';

  LINK.onclick = sinon.spy();

  saveWithDownloadAttribute(url, name);

  t.is(LINK.href, url);
  t.is(LINK.download, name);
  t.true(LINK.onclick.calledOnce);
});

test('if saveWithFileReader will fire the correct events', async (t) => {
  const originalFileReader = window.FileReader;

  const stub = sinon.stub(window, 'open');
  const url = 'http://foo.com/';

  window.FileReader = function() {
    this.result = url;

    return this;
  };

  window.FileReader.prototype = {
    readAsDataURL() {
      this.onloadend();
    }
  };

  const result = await saveWithFileReader('foo');

  t.true(stub.calledOnce);
  t.is(result, url);

  stub.restore();

  window.FileReader = originalFileReader;
});

test('if setAutoBom will return the same blob if it does not match the regexp', (t) => {
  const blob = 'foo';

  const result = setAutoBom(blob);

  t.is(result, blob);
});

test('if triggerClick will trigger click on the node passed', (t) => {
  const a = document.createElement('a');

  let fired = false;

  a.onclick = function() {
    fired = true;
  };

  triggerClick(a);

  t.true(fired);
});