import test from 'ava';
import isFunction from 'lodash/isFunction';

import savery from '../src';

import Savery from '../src/Savery';

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