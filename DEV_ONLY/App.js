import 'babel-polyfill';

import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';

import savery from '../src';

// const onAfterSave = (file) => {
//   console.log('done! waiting 2.5 seconds before continuing...');
//
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(file);
//     }, 2500);
//   });
// };

const onBeforeSave = (blob) => {
  console.log('starting in 5 seconds...');

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(blob);
    }, 5000);
  });
};

const data = `.foo {display: flex;}`;
const fileName = 'test.css';
const options = {
  // onAfterSave,
  // onBeforeSave
};

// const saveCssFile = savery(fileName, options);
//
// const file = saveCssFile(data);
//
// file.save()
//   .then((saveryInstance) => {
//     console.log(saveryInstance);
//   })
//   .catch((saveryInstance) => {
//     console.log(saveryInstance);
//
//     throw saveryInstance.error;
//   });
//
// Uncomment line to fire the abort
// file.abort();

const file = savery.save(data, fileName, options);

file
  .then((saveryInstance) => {
    console.log(saveryInstance);
  })
  .catch((saveryInstance) => {
    console.log(saveryInstance);

    throw saveryInstance.error;
  });

class App extends Component {
  render() {
    return (
      <div>
        <h1>
          App
        </h1>
      </div>
    );
  }
}

const div = document.createElement('div');

div.id = 'app-container';

render((
  <App/>
), div);

document.body.appendChild(div);