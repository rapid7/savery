import test from 'ava';
import isFunction from 'lodash/isFunction';

import savery from '../src';

import Savery from '../src/Savery';

// mock the createObjectUrl function
URL.createObjectURL = function() {
  return 'blob:http://localhost:3000/98fb7822-0611-4b31-adfa-c7e00920f50c';
};

test('if savery returns a function', async (t) => {
  const result = savery();

  t.true(isFunction(result));
});

test('if savery returns a Savery that fires the save function on its prototype', async (t) => {
  const result = savery();

  t.true(isFunction(result));

  const saverInstance = await result('Hello world');

  t.true(saverInstance instanceof Savery);
});

test('if savery.save immediately runs the save process and returns a promise of the lifecycle', async (t) => {
  const result = savery.save();

  t.true(result instanceof Promise);

  return result.then((saveryInstance) => {
    t.is(saveryInstance.status, 'COMPLETE');

    return saveryInstance;
  });
});