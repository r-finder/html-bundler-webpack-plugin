import fs from 'fs';
import path from 'path';

import {
  compareFileListAndContent,
  exceptionContain,
  stdoutContain,
  watchExceptionContain,
  watchStdoutContain,
  watchStdoutCompare,
} from './utils/helpers';
import { removeDirsSync } from './utils/file';
import { parseQuery, getFileExtension } from '../src/Common/Helpers';
import { loadModule, resolveFile } from '../src/Common/FileUtils';
import AssetEntry from '../src/Plugin/AssetEntry';
import Template from '../src/Loader/Template';
import { injectBeforeEndHead, injectBeforeEndBody } from '../src/Loader/Utils';
import Options from '../src/Plugin/Options';
import { PATHS } from './config';

beforeAll(() => {
  // remove all 'dist/' directories from tests, use it only for some local tests
  //removeDirsSync(__dirname, /dist$/);
});

beforeEach(() => {});

describe('misc unit tests', () => {
  test('parseQuery array', (done) => {
    const received = parseQuery('file.html?key=val&arr[]=a&arr[]=1');
    const expected = {
      key: 'val',
      arr: ['a', '1'],
    };
    expect(received).toEqual(expected);
    done();
  });

  test('parseQuery json5', (done) => {
    const received = parseQuery('file.html?{sizes:[10,20,30], format: "webp"}');
    const expected = {
      format: 'webp',
      sizes: [10, 20, 30],
    };
    expect(received).toEqual(expected);
    done();
  });

  test('FileUtils: load module', (done) => {
    try {
      const ansis = loadModule('ansis');
      expect(ansis).toBeDefined();
      done();
    } catch (error) {
      throw error;
    }
  });

  test('FileUtils: resolveFile', (done) => {
    const received = resolveFile('not-exists-file', { fs, root: __dirname });
    expect(received).toBeFalsy();
    done();
  });
});

describe('file extension', () => {
  test('file.ext', (done) => {
    const received = getFileExtension('file.ext');
    const expected = 'ext';
    expect(received).toEqual(expected);
    done();
  });

  test('file.ext?query', (done) => {
    const received = getFileExtension('file.ext?query');
    const expected = 'ext';
    expect(received).toEqual(expected);
    done();
  });

  test('file', (done) => {
    const received = getFileExtension('file');
    const expected = '';
    expect(received).toEqual(expected);
    done();
  });

  test('file?query', (done) => {
    const received = getFileExtension('file?query');
    const expected = '';
    expect(received).toEqual(expected);
    done();
  });

  test('path.sample/file', (done) => {
    const received = getFileExtension('path.sample/file');
    const expected = '';
    expect(received).toEqual(expected);
    done();
  });

  test('path.sample/file?query', (done) => {
    const received = getFileExtension('path.sample/file?query');
    const expected = '';
    expect(received).toEqual(expected);
    done();
  });

  test('path.sample\\file', (done) => {
    const received = getFileExtension('path.sample\\file', true);
    const expected = '';
    expect(received).toEqual(expected);
    done();
  });

  test('path.sample\\file.ext?query', (done) => {
    const received = getFileExtension('path.sample\\file.ext?query', true);
    const expected = 'ext';
    expect(received).toEqual(expected);
    done();
  });
});

describe('utils unit tests', () => {
  test('injectBeforeEndHead', (done) => {
    const html = `<html><head><title>test</title></head><body><p>body</p></body></html>`;
    const received = injectBeforeEndHead(html, `<script src="test.js"></script>`);
    const expected = `<html><head><title>test</title><script src="test.js"></script></head><body><p>body</p></body></html>`;
    expect(received).toEqual(expected);
    done();
  });

  test('injectBeforeEndHead without head', (done) => {
    const html = `<html><body><p>body</p></body></html>`;
    const received = injectBeforeEndHead(html, `<script src="test.js"></script>`);
    const expected = `<html><body><p>body</p><script src="test.js"></script></body></html>`;
    expect(received).toEqual(expected);
    done();
  });

  test('injectBeforeEndBody', (done) => {
    const html = `<html><head><title>test</title></head><body><p>body</p></body></html>`;
    const received = injectBeforeEndBody(html, `<script src="test.js"></script>`);
    const expected = `<html><head><title>test</title></head><body><p>body</p><script src="test.js"></script></body></html>`;
    expect(received).toEqual(expected);
    done();
  });

  test('injectBeforeEndBody without body', (done) => {
    const html = `<html><head><title>test</title></head><p>body</p></html>`;
    const received = injectBeforeEndBody(html, `<script src="test.js"></script>`);
    const expected = `<html><head><title>test</title></head><p>body</p><script src="test.js"></script></html>`;
    expect(received).toEqual(expected);
    done();
  });

  test('injectBeforeEndBody without html', (done) => {
    const html = `<p>body</p>`;
    const received = injectBeforeEndBody(html, `<script src="test.js"></script>`);
    const expected = `<p>body</p><script src="test.js"></script>`;
    expect(received).toEqual(expected);
    done();
  });
});

describe('parse attributes unit tests', () => {
  test('parseAttr without attr', (done) => {
    const source = '<img alt="apple">';
    const received = Template.parseAttr(source, 'src');
    const expected = false;
    expect(received).toEqual(expected);
    done();
  });

  test('parseAttr empty value', (done) => {
    const source = '<img src="">';
    const received = Template.parseAttr(source, 'src');
    const expected = {
      attr: 'src',
      startPos: 10,
      endPos: 10,
      value: '',
    };
    expect(received).toEqual(expected);
    done();
  });

  test('parseAttr value', (done) => {
    const source = '<img src="img1.png" srcset="img1.png, img2.png 100w, img3.png 1.5x">';
    const received = Template.parseAttr(source, 'src');
    const expected = {
      attr: 'src',
      startPos: 10,
      endPos: 18,
      value: 'img1.png',
    };
    expect(received).toEqual(expected);
    done();
  });

  test('parseSrcset single value', (done) => {
    const source = '<source srcset="img1.png">';
    const received = Template.parseAttr(source, 'srcset');
    const expected = {
      attr: 'srcset',
      startPos: 16,
      endPos: 24,
      value: [
        {
          startPos: 0,
          endPos: 8,
          value: 'img1.png',
        },
      ],
    };
    expect(received).toEqual(expected);
    done();
  });

  test('parseSrcset multi values', (done) => {
    const source = '<img src="img1.png" srcset="img1.png, img2.png 100w, img3.png 1.5x">';
    const received = Template.parseAttr(source, 'srcset');
    const expected = {
      attr: 'srcset',
      startPos: 28,
      endPos: 66,
      value: [
        { startPos: 0, endPos: 8, value: 'img1.png' },
        { startPos: 10, endPos: 18, value: 'img2.png' },
        { startPos: 25, endPos: 33, value: 'img3.png' },
      ],
    };
    expect(received).toEqual(expected);
    done();
  });
});

describe('resolve parsed values', () => {
  test('https://example.com/style.css', (done) => {
    const received = Template.resolve({ type: 'style', file: 'https://example.com/style.css', issuer: '' });
    const expected = false;
    expect(received).toEqual(expected);
    done();
  });

  test('http://example.com/style.css', (done) => {
    const received = Template.resolve({ type: 'style', file: 'http://example.com/style.css', issuer: '' });
    const expected = false;
    expect(received).toEqual(expected);
    done();
  });

  test('//style.css', (done) => {
    const received = Template.resolve({ type: 'style', file: '//style.css', issuer: '' });
    const expected = false;
    expect(received).toEqual(expected);
    done();
  });

  test('/style.css', (done) => {
    const received = Template.resolve({ type: 'style', file: '/style.css', issuer: '' });
    const expected = false;
    expect(received).toEqual(expected);
    done();
  });
});

describe('parse tags unit tests', () => {
  test('parse single tag img', (done) => {
    //const html = `<img src="img1.png" alt="logo"><img src="img1.png" srcset="img2.png 100w, img3.png 500w, img4.png 1000w">`;
    const html = `<img src="img1.png" alt="logo">`;
    const received = Template.parseTag(html, { tag: 'img', attributes: ['src'] });
    const expected = [
      {
        tag: 'img',
        source: '<img src="img1.png" alt="logo">',
        type: 'asset',
        startPos: 0,
        endPos: 31,
        attrs: [
          {
            attr: 'src',
            value: 'img1.png',
            startPos: 10,
            endPos: 18,
          },
        ],
      },
    ];
    expect(received).toEqual(expected);
    done();
  });
});

describe('AssetEntry unit tests', () => {
  test('reset', (done) => {
    AssetEntry.compilationEntryNames = new Set(['home', 'about']);
    AssetEntry.reset();
    const received = AssetEntry.compilationEntryNames;
    expect(received).toEqual(new Set());
    done();
  });
});

describe('plugin options unit tests', () => {
  test('isTrue: defaultValue', (done) => {
    const received = Options.toBool(undefined, false, true);
    expect(received).toEqual(true);
    done();
  });

  test('isTrue: value false', (done) => {
    Options.prodMode = true;
    const received = Options.toBool(false, true, true);
    expect(received).toEqual(false);
    done();
  });

  test('isTrue: value true', (done) => {
    Options.prodMode = true;
    const received = Options.toBool(true, false, false);
    expect(received).toEqual(true);
    done();
  });

  test('isTrue: "auto", autoValue = true, prod mode', (done) => {
    Options.prodMode = true;
    const received = Options.toBool('auto', true, false);
    expect(received).toEqual(true);
    done();
  });

  test('isTrue: "auto", autoValue = false, prod mode', (done) => {
    Options.prodMode = true;
    const received = Options.toBool('auto', false, false);
    expect(received).toEqual(false);
    done();
  });

  test('isTrue: "auto", autoValue = true, dev mode', (done) => {
    Options.prodMode = false;
    const received = Options.toBool('auto', true, false);
    expect(received).toEqual(false);
    done();
  });

  test('isTrue: "auto", autoValue = false, dev mode', (done) => {
    Options.prodMode = false;
    const received = Options.toBool('auto', false, false);
    expect(received).toEqual(true);
    done();
  });
});

describe('features tests', () => {
  test('Hello World!', (done) => {
    compareFileListAndContent(PATHS, 'hello-world', done);
  });

  test('resolve-script-style-asset', (done) => {
    compareFileListAndContent(PATHS, 'resolve-script-style-asset', done);
  });

  test('resolve-in-many-pages-from-same-tmpl', (done) => {
    compareFileListAndContent(PATHS, 'resolve-in-many-pages-from-same-tmpl', done);
  });

  test('resolve-in-many-pages-from-one-html', (done) => {
    compareFileListAndContent(PATHS, 'resolve-in-many-pages-from-one-html', done);
  });

  test('resolve-relative-paths', (done) => {
    compareFileListAndContent(PATHS, 'resolve-relative-paths', done);
  });

  test('resolve-alias-in-html', (done) => {
    compareFileListAndContent(PATHS, 'resolve-alias-in-html', done);
  });

  test('resolve svg href with fragment', (done) => {
    compareFileListAndContent(PATHS, 'resolve-svg-use-fragment', done);
  });

  test('resolve svg href with fragment in filename', (done) => {
    compareFileListAndContent(PATHS, 'resolve-svg-use-fragment-filename', done);
  });
});

describe('resolve styles', () => {
  test('resolve styles with same name', (done) => {
    compareFileListAndContent(PATHS, 'resolve-styles-with-same-name', done);
  });

  test('resolve styles loaded from node_modules', (done) => {
    compareFileListAndContent(PATHS, 'resolve-styles-from-module', done);
  });
});

describe('resolve url in style', () => {
  test('resolve the url(image) in CSS', (done) => {
    compareFileListAndContent(PATHS, 'resolve-url-in-css', done);
  });

  test('@import url() in CSS', (done) => {
    compareFileListAndContent(PATHS, 'import-url-in-css', done);
  });

  test('@import url() in SCSS', (done) => {
    compareFileListAndContent(PATHS, 'import-url-in-scss', done);
  });

  test('resolve-url-deep', (done) => {
    compareFileListAndContent(PATHS, 'resolve-url-deep', done);
  });
});

describe('plugin options', () => {
  test('output.publicPath = auto', (done) => {
    compareFileListAndContent(PATHS, 'option-output-public-path-auto', done);
  });

  test('output.publicPath = function', (done) => {
    compareFileListAndContent(PATHS, 'option-output-public-path-function', done);
  });

  test('output.publicPath = ""', (done) => {
    compareFileListAndContent(PATHS, 'option-output-public-path-empty', done);
  });

  test('output.publicPath = "/"', (done) => {
    compareFileListAndContent(PATHS, 'option-output-public-path-root', done);
  });

  test('output.publicPath = "/sub-path/"', (done) => {
    compareFileListAndContent(PATHS, 'option-output-public-path-custom', done);
  });

  test('output.publicPath = "http://localhost:8080/"', (done) => {
    compareFileListAndContent(PATHS, 'option-output-public-path-url', done);
  });

  test('sourcePath and outputPath (default)', (done) => {
    compareFileListAndContent(PATHS, 'option-default-path', done);
  });

  test('sourcePath and outputPath', (done) => {
    compareFileListAndContent(PATHS, 'option-custom-path', done);
  });

  test('filename as function', (done) => {
    compareFileListAndContent(PATHS, 'option-filename-function', done);
  });

  test('js.filename', (done) => {
    compareFileListAndContent(PATHS, 'option-js-filename', done);
  });

  test('js and css outputPath absolute', (done) => {
    compareFileListAndContent(PATHS, 'option-js-css-outputPath-absolute', done);
  });

  test('js and css outputPath relative', (done) => {
    compareFileListAndContent(PATHS, 'option-js-css-outputPath-relative', done);
  });

  test('css.inline auto, dev', (done) => {
    compareFileListAndContent(PATHS, 'option-css-inline-auto-dev', done);
  });

  test('css.inline auto, prod', (done) => {
    compareFileListAndContent(PATHS, 'option-css-inline-auto-prod', done);
  });

  test('js.inline auto, dev', (done) => {
    compareFileListAndContent(PATHS, 'option-js-inline-auto-dev', done);
  });

  test('js.inline auto, prod', (done) => {
    compareFileListAndContent(PATHS, 'option-js-inline-auto-prod', done);
  });

  test('verbose', (done) => {
    compareFileListAndContent(PATHS, 'option-verbose', done);
  });

  test('extractComments = false', (done) => {
    compareFileListAndContent(PATHS, 'option-extract-comments-false', done);
  });

  test('extractComments = true', (done) => {
    compareFileListAndContent(PATHS, 'option-extract-comments-true', done);
  });

  test('postprocess', (done) => {
    compareFileListAndContent(PATHS, 'option-postprocess', done);
  });

  test('afterProcess', (done) => {
    compareFileListAndContent(PATHS, 'option-afterProcess', done);
  });

  test('minify HTML', (done) => {
    compareFileListAndContent(PATHS, 'option-minify', done);
  });

  test('minify HTML with custom options', (done) => {
    compareFileListAndContent(PATHS, 'option-minify-options', done);
  });

  test('minify auto prod', (done) => {
    compareFileListAndContent(PATHS, 'option-minify-auto-prod', done);
  });

  test('minify auto dev', (done) => {
    compareFileListAndContent(PATHS, 'option-minify-auto-dev', done);
  });

  test('minify auto options', (done) => {
    compareFileListAndContent(PATHS, 'option-minify-auto-options', done);
  });

  test('entry', (done) => {
    compareFileListAndContent(PATHS, 'option-entry', done);
  });

  test('entry path', (done) => {
    compareFileListAndContent(PATHS, 'option-entry-path', done);
  });

  test('preload', (done) => {
    compareFileListAndContent(PATHS, 'option-preload', done);
  });

  test('preload with responsive images', (done) => {
    compareFileListAndContent(PATHS, 'option-preload-responsive-images', done);
  });

  test('preload with split chunk', (done) => {
    compareFileListAndContent(PATHS, 'option-preload-split-chunk', done);
  });
});

describe('option watchFiles', () => {
  test('watchFiles.paths', (done) => {
    const containString = `
- src/index.html
- templates/footer.html`;
    watchStdoutContain(PATHS, 'option-watchFiles-paths', containString, done);
  });

  test('watchFiles.files', (done) => {
    const containString = `
- src/index.html
- src/style.css`;
    watchStdoutContain(PATHS, 'option-watchFiles-files', containString, done);
  });

  test('watchFiles.ignore', (done) => {
    const containString = ` html-bundler-webpack-plugin  Watch files
- src/index.html
- src/main.js`;
    watchStdoutCompare('toBeStringIgnoringWhitespace', PATHS, 'option-watchFiles-ignore', containString, done);
  });
});

describe('loader options', () => {
  test('defaults option when in module.rules is not defined', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-defaults', done);
  });

  test('disable the processing of all tags and attributes', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-sources-false', done);
  });

  test('add custom tags and attributes', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-sources-attrs', done);
  });

  test('filter tags and attributes', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-sources-attrs-filter', done);
  });

  test('filter property attribute', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-sources-attrs-filter-property', done);
  });

  test('preprocessor by defaults', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-default', done);
  });

  test('preprocessor disabled', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-disabled', done);
  });

  test('preprocessor return null', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-return-null', done);
  });

  test('root', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-root', done);
  });
});

describe('loader options for templating', () => {
  test('loader data', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-data', done);
  });

  test('preprocessor Eta', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-eta', done);
  });

  test('preprocessor Eta async', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-eta-async', done);
  });

  test('preprocessor EJS', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-ejs', done);
  });

  test('preprocessor EJS async', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-ejs-async', done);
  });

  test('preprocessor EJS as string', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-ejs-string', done);
  });

  test('preprocessor handlebars', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-handlebars', done);
  });

  test('preprocessor handlebars: register helper functions', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-handlebars-helpers', done);
  });

  test('preprocessor handlebars: register helpers from path', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-handlebars-helpers-path', done);
  });

  test('preprocessor handlebars: register partials', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-handlebars-partials', done);
  });

  test('preprocessor handlebars: register partials from paths', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-handlebars-partials-path', done);
  });

  test('preprocessor Mustache', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-mustache', done);
  });

  test('preprocessor for simple multipage', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-multipage', done);
  });

  test('preprocessor for multipage with nunjucks', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-nunjucks-multipage', done);
  });

  test('preprocessor for multipage with nunjucks async', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-nunjucks-async-multipage', done);
  });

  test('preprocessor liquid', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-liquid', done);
  });

  test('preprocessor liquid async', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-liquid-async', done);
  });

  test('preprocessor with multiple templating engines', (done) => {
    compareFileListAndContent(PATHS, 'loader-option-preprocessor-many-ejs-hbs', done);
  });
});

describe('inline images', () => {
  test('inline-asset-bypass-data-url', (done) => {
    compareFileListAndContent(PATHS, 'inline-asset-bypass-data-url', done);
  });

  test('inline-asset-decide-size', (done) => {
    compareFileListAndContent(PATHS, 'inline-asset-decide-size', done);
  });

  test('inline-asset-query', (done) => {
    compareFileListAndContent(PATHS, 'inline-asset-query', done);
  });

  test('inline-asset-html-css', (done) => {
    compareFileListAndContent(PATHS, 'inline-asset-html-css', done);
  });

  test('inline-asset-exclude-svg-fonts', (done) => {
    compareFileListAndContent(PATHS, 'inline-asset-exclude-svg-fonts', done);
  });

  test('inline-asset-svg-favicon', (done) => {
    compareFileListAndContent(PATHS, 'inline-asset-svg-favicon', done);
  });

  test('inline-asset-source-svg', (done) => {
    compareFileListAndContent(PATHS, 'inline-asset-source-svg', done);
  });
});

describe('inline styles & scripts', () => {
  test('inline style using URL query `?inline` and resolve url() in CSS', (done) => {
    compareFileListAndContent(PATHS, 'inline-style-query', done);
  });

  test('inline style with source map using URL query `?inline`', (done) => {
    compareFileListAndContent(PATHS, 'inline-style-query-with-source-map', done);
  });

  test('inline script using URL query `?inline`', (done) => {
    compareFileListAndContent(PATHS, 'inline-script-query', done);
  });

  test('inline script using when used runtimeChunk:single', (done) => {
    compareFileListAndContent(PATHS, 'inline-script-runtimeChunk-single', done);
  });
});

describe('split chunks', () => {
  test('extract css and js w/o runtime code of css-loader', (done) => {
    compareFileListAndContent(PATHS, 'split-chunk-css-js', done);
  });

  test('import source scripts and styles from many node module', (done) => {
    compareFileListAndContent(PATHS, 'split-chunk-node-module-many-vendors', done);
  });

  test('import source scripts and styles from node module', (done) => {
    compareFileListAndContent(PATHS, 'split-chunk-node-module-source', done);
  });

  test('resolve assets when used split chunk, development', (done) => {
    compareFileListAndContent(PATHS, 'split-chunk-resolve-assets-dev', done);
  });

  test('resolve assets when used split chunk, production', (done) => {
    compareFileListAndContent(PATHS, 'split-chunk-resolve-assets-prod', done);
  });

  test('load vendor scripts from node module', (done) => {
    compareFileListAndContent(PATHS, 'split-chunk-vendor', done);
  });
});

describe('special cases', () => {
  test('resolve values with invalid syntax', (done) => {
    compareFileListAndContent(PATHS, 'resolve-values-invalid-syntax', done);
  });

  test('resolve assets without extension', (done) => {
    compareFileListAndContent(PATHS, 'resolve-assets-without-ext', done);
  });

  test('resolve assets in entries with a query', (done) => {
    compareFileListAndContent(PATHS, 'resolve-in-entry-with-query', done);
  });

  test('resolve manifest.json', (done) => {
    compareFileListAndContent(PATHS, 'resolve-manifest.json', done);
  });

  test('Template with CRLF line separator', (done) => {
    compareFileListAndContent(PATHS, 'template-clrf', done);
  });

  test('encode / decode reserved HTML chars', (done) => {
    compareFileListAndContent(PATHS, 'decode-chars', done);
  });

  test('preprocessor for output php template', (done) => {
    compareFileListAndContent(PATHS, 'preprocessor-php', done);
  });

  test('resolve preloaded script and  style', (done) => {
    compareFileListAndContent(PATHS, 'resolve-preload-script-style', done);
  });
});

describe('extras: responsive images', () => {
  test('responsive images in template', (done) => {
    compareFileListAndContent(PATHS, 'responsive-images', done);
  });

  test('require images in template and in style', (done) => {
    compareFileListAndContent(PATHS, 'responsive-images-html-scss', done);
  });

  test('require many duplicate images in template and styles', (done) => {
    compareFileListAndContent(PATHS, 'responsive-images-many-duplicates', done);
  });
});

describe('verbose', () => {
  test('verbose-module-inline', (done) => {
    compareFileListAndContent(PATHS, 'verbose-module-inline', done);
  });
});

// Test Messages

describe('loader exceptions', () => {
  test('exception sync preprocessor', (done) => {
    const containString = 'Preprocessor failed';
    exceptionContain(PATHS, 'msg-exception-loader-preprocessor', containString, done);
  });

  test('exception unsupported preprocessor value', (done) => {
    const containString = 'Unsupported preprocessor';
    exceptionContain(PATHS, 'msg-exception-loader-preprocessor-unsupported', containString, done);
  });

  test('exception async preprocessor', (done) => {
    const containString = 'Preprocessor failed';
    exceptionContain(PATHS, 'msg-exception-loader-preprocessor-async', containString, done);
  });

  test('exception compile: missing the closing', (done) => {
    const containString = `missing the closing '>' char`;
    exceptionContain(PATHS, 'msg-exception-loader-compile-close-tag', containString, done);
  });

  test('exception compile: missing the closing at eof', (done) => {
    const containString = `missing the closing '>' char`;
    exceptionContain(PATHS, 'msg-exception-loader-compile-close-tag-eof', containString, done);
  });

  test('exception compile: resolve file', (done) => {
    const containString = `can't be resolved in the template`;
    exceptionContain(PATHS, 'msg-exception-loader-resolve-file', containString, done);
  });

  test('exception: resolve required file', (done) => {
    const containString = `Can't resolve the file`;
    exceptionContain(PATHS, 'msg-exception-resolve-file', containString, done);
  });

  test('exception export', (done) => {
    const containString = 'Export of compiled template failed';
    exceptionContain(PATHS, 'msg-exception-loader-export', containString, done);
  });

  test('watchFiles.paths: dir not found', (done) => {
    const containString = `The watch directory not found`;
    watchExceptionContain(PATHS, 'msg-exception-plugin-option-watchFiles-paths', containString, done);
  });

  test('exception: loader used without the plugin', (done) => {
    const containString = 'Illegal usage of the loader';
    exceptionContain(PATHS, 'msg-exception-loader-no-plugin', containString, done);
  });

  test('exception: handlebars include file not found', (done) => {
    const containString = 'Could not find the include file';
    exceptionContain(PATHS, 'msg-exception-handlebars-include', containString, done);
  });

  test('exception: handlebars partial file not found', (done) => {
    const containString = 'Could not find the partial';
    exceptionContain(PATHS, 'msg-exception-handlebars-partial', containString, done);
  });

  test('exception preprocessor: load module', (done) => {
    const containString = 'Cannot find module';
    try {
      loadModule('not-exists-module');
      throw new Error('the test should throw an error');
    } catch (error) {
      expect(error.toString()).toContain(containString);
      done();
    }
  });
});

describe('plugin exceptions', () => {
  test('@import CSS is not supported', (done) => {
    const containString = `Disable the 'import' option in 'css-loader'`;
    exceptionContain(PATHS, 'msg-exception-plugin-import-css-rule', containString, done);
  });

  test('entry directory not found', (done) => {
    const containString = 'The directory is invalid or not found';
    exceptionContain(PATHS, 'msg-exception-option-entry-dir-not-found', containString, done);
  });

  test('entry is not directory', (done) => {
    const containString = 'The directory is invalid or not found';
    exceptionContain(PATHS, 'msg-exception-option-entry-not-dir', containString, done);
  });

  test('option modules', (done) => {
    const containString = 'must be the array of';
    exceptionContain(PATHS, 'msg-exception-plugin-option-modules', containString, done);
  });

  test('execute postprocess', (done) => {
    const containString = 'Postprocess is failed';
    exceptionContain(PATHS, 'msg-exception-plugin-execute-postprocess', containString, done);
  });

  test('multiple chunks with same filename', (done) => {
    const containString = 'Multiple chunks emit assets to the same filename';
    exceptionContain(PATHS, 'msg-exception-plugin-multiple-chunks-same-filename', containString, done);
  });

  test('fail resolving asset without loader', (done) => {
    const containString = `Module parse failed: Unexpected character`;
    exceptionContain(PATHS, 'msg-exception-plugin-resolve-asset', containString, done);
  });
});
