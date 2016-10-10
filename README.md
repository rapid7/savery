# savery

Save files on the client side with ease.

### Installation

```
$ npm i savery --save
```

### Usage

```javascript
// ES2015+
import savery from 'savery';

// CommonJS
const savery = require('savery');

// script
const savery = window.savery;

// create the function that will save the data
const SAVERY_OPTIONS = {
  onBeforeSave() {
    console.log('Starting!');
  }  
};

const saveCssFile = savery('foo.css', SAVERY_OPTIONS);

// then pass it the data
const file = saveCssFile('.foo { display: block; }');

// or you could do it in one line
const file = savery('foo.css', SAVERY_OPTIONS)('.foo { display: block; }');
```

The reason for the partial function is the ability for reuse. For example, if you know the file type and want a consistent filename from a remote download:

```javascript
import axios from 'axios';

const savePdfFile = savery('my-consistently-named-pdf.pdf');

const getPdf = () => {
  axios({
    method: 'get',
    responseType: 'arraybuffer',
    uri: '/location/of/pdf'
  })
    .then(savePdfFile);
};
```

This is an example using AJAX calls, however the same reusability is possible in all applications of `savery`.

### Methods

**savery(filename: string = 'download.txt', saveryOptions: Object = {}): Function**

The `savery` function accepts the `filename` and `options` parameter, both with defaults. 

**saveryOptions**
```javascript
{
  onAbort: ?Function,
  onAfterSave: ?Function,
  onBeforeSave: ?Function,
  onError: ?Function,
  onStartSave: ?Function,
  onEndSave: ?Function,
  shouldAutoBom: ?boolean = false,
  type: ?string
}
```

All `saveryOptions` properties are optional, and `type` specifically will default to being intuited from the filename extension and that extension's standard MIME type.

### Supported browsers

* Full support
  * Firefox 20+
  * Chrome
  * Edge
  * Internet Explorer 10+
  * Opera 15+
* Partial support (filenames not supported)
  * Firefox <20
  * Safari
  * Opera <15
* Requires [Blob.js](https://github.com/eligrey/Blob.js) dependency
  * Firefox <20
  * Opera <15
  * Safari <6
  
### Feature detection

```javscript
try {
  const isSaverySupported = !!new Blob;
} catch(e) {}
```

### Additional information

The `data` property in `savery` will accept anything for use in the `Blob` construction, however `canvas` elements specifically need to have the data converted by the `canvas.toBlob()` method prior to calling via `savery`.

### Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:
* `build` => run webpack to build savery-full.js with NODE_ENV=development
* `build:lite` => run webpack to build savery.js with NODE_ENV=development
* `build:minifed` => run webpack to build savery-full.min.js with NODE_ENV=production
* `build:minifed:lite` => run webpack to build savery.min.js with NODE_ENV=production
* `dev` => run webpack dev server to run example app based on full MIME type map provided by `mime-types` package
* `dev:lite` => run webpack dev server to run example app based on local lite MIME type map
* `flow` => run flowtype analysis on `src` folder
* `lint` => run ESLint against all files in the `src` folder
* `prepublish` => run `lint`, `test`, `transpile`, `build`, and `build-minified`
* `test` => run AVA test functions with `NODE_ENV=test`
* `test:watch` => same as `test`, but runs persistent watcher
* `transpile` => run babel against all files in `src` to create files in `lib`
