import test from 'ava';
import sinon from 'sinon';

import Savery from '../src/Savery';

import {
  STATUSES,
  URL
} from '../src/constants';

const EXPECTED_SAVERY_KEYS = [
  '_onAfterSave',
  '_onBeforeSave',
  '_onCreateFile',
  '_onEndSave',
  '_onError',
  '_onSave',
  '_onStartSave',
  'autoBOM',
  'data',
  'error',
  'filename',
  'forceLoad',
  'mimeType',
  'onAbort',
  'onAfterSave',
  'onBeforeSave',
  'onEndSave',
  'onError',
  'onStartSave',
  'size',
  'status'
];

const createNewSaver = (options) => {
  return new Savery('foo', 'test.txt', options);
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

// mock the createObjectUrl function
URL.createObjectURL = function() {
  return 'blob:http://localhost:3000/98fb7822-0611-4b31-adfa-c7e00920f50c';
};

test('if Savery constructor creates a Savery with the appropriate keys', (t) => {
  const savery = createNewSaver();

  t.true(savery instanceof Savery);

  const keys = Object.keys(savery);

  t.is(keys.length, EXPECTED_SAVERY_KEYS.length);

  keys.forEach((key) => {
    t.true(EXPECTED_SAVERY_KEYS.includes(key));
  });
});

test('if lifecycle methods are fired in order', async (t) => {
  const onAfterSave = sinon.spy();
  const onBeforeSave = sinon.spy();
  const onStartSave = sinon.spy();
  const onEndSave = sinon.spy();

  const savery = createNewSaver({
    onAfterSave,
    onBeforeSave,
    onStartSave,
    onEndSave
  });

  t.is(savery.status, STATUSES.PENDING);

  const originalOnSave = savery._onSave;

  const _onAfterSaveSpy = sinon.spy(savery, '_onAfterSave');
  const _onBeforeSaveSpy = sinon.spy(savery, '_onBeforeSave');
  const _onEndSaveSpy = sinon.spy(savery, '_onEndSave');
  const _onSaveStub = sinon.stub(savery, '_onSave', (...args) => {
    t.is(savery.status, STATUSES.PROCESSING);

    originalOnSave(...args);
  });
  const _onStartSaveSpy = sinon.spy(savery, '_onStartSave');

  await savery.save();

  await sleep(250);

  t.true(_onBeforeSaveSpy.calledOnce);
  t.true(_onBeforeSaveSpy.calledBefore(_onStartSaveSpy));
  t.true(onBeforeSave.calledOnce);
  t.true(onBeforeSave.calledBefore(_onStartSaveSpy));

  t.true(_onStartSaveSpy.calledOnce);
  t.true(_onStartSaveSpy.calledBefore(_onSaveStub));
  t.true(onStartSave.calledOnce);
  t.true(onStartSave.calledBefore(_onSaveStub));

  t.true(_onSaveStub.calledOnce);
  t.true(_onSaveStub.calledBefore(_onEndSaveSpy));

  t.true(_onEndSaveSpy.calledOnce);
  t.true(_onEndSaveSpy.calledBefore(_onAfterSaveSpy));
  t.true(onEndSave.calledOnce);
  t.true(onEndSave.calledBefore(_onAfterSaveSpy));

  t.true(_onAfterSaveSpy.calledOnce);
  t.true(onAfterSave.calledOnce);

  _onBeforeSaveSpy.restore();
  _onStartSaveSpy.restore();
  _onSaveStub.restore();
  _onEndSaveSpy.restore();
  _onAfterSaveSpy.restore();

  t.is(savery.status, STATUSES.COMPLETE);
});

test('if abort will prevent the save from firing and fire the onAbort hook', async (t) => {
  const onAbort = sinon.spy();
  const onAfterSave = sinon.spy();
  const onBeforeSave = sinon.spy();
  const onEndSave = sinon.spy();
  const onError = sinon.spy();
  const onStartSave = sinon.spy();

  const savery = createNewSaver({
    onAbort,
    onAfterSave,
    onBeforeSave,
    onEndSave,
    onError,
    onStartSave
  });

  const _onAfterSaveSpy = sinon.spy(savery, '_onAfterSave');
  const _onBeforeSaveSpy = sinon.spy(savery, '_onBeforeSave');
  const _onEndSaveSpy = sinon.spy(savery, '_onEndSave');
  const _onErrorSpy = sinon.spy(savery, '_onError');
  const _onSaveSpy = sinon.spy(savery, '_onSave');
  const _onStartSaveSpy = sinon.spy(savery, '_onStartSave');

  savery.save().catch(() => {});
  savery.abort();

  await sleep(250);

  // the first call with fail because the status is not PENDING, and then reject the promise
  t.true(_onBeforeSaveSpy.calledOnce);

  // all others will not fire
  t.false(onBeforeSave.calledOnce);
  t.false(_onStartSaveSpy.calledOnce);
  t.false(onStartSave.calledOnce);
  t.false(_onSaveSpy.calledOnce);
  t.false(_onEndSaveSpy.calledOnce);
  t.false(onEndSave.calledOnce);
  t.false(_onAfterSaveSpy.calledOnce);
  t.false(onAfterSave.calledOnce);

  // make sure the abort and error functions fired
  t.true(onAbort.calledOnce);
  t.true(onAbort.calledBefore(_onErrorSpy));

  t.true(_onErrorSpy.calledOnce);
  t.true(_onErrorSpy.calledBefore(onError));

  t.true(onError.calledOnce);

  _onAfterSaveSpy.restore();
  _onBeforeSaveSpy.restore();
  _onEndSaveSpy.restore();
  _onErrorSpy.restore();
  _onSaveSpy.restore();
  _onStartSaveSpy.restore();

  t.is(savery.status, STATUSES.CANCELLED);
});