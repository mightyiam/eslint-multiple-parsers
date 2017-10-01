# eslint-multiple-parsers

[![Build Status](https://travis-ci.org/mightyiam/eslint-multiple-parsers.svg?branch=master)](https://travis-ci.org/mightyiam/eslint-multiple-parsers)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Use multiple parsers in one ESLint run.

ESLint can currently have configured [only a single parser](https://eslint.org/docs/user-guide/configuring#specifying-parser).

If your code has multiple languages and thus requires multiple parsers, [you’re out of luck](https://github.com/eslint/eslint/issues/8543).

Or, *are you?*

## Usage

Install this package:

```
npm i --save-dev eslint-multiple-parsers
```
 
Specify this package  as the parser and configure the multiple parsers like so:

`.eslintrc.json`:
```json
{
  "parser": "eslint-multiple-parsers",
  "parserOptions": {
    "parsers": [
      {
        "test": ".*\\.js$",
        "path": "babel-eslint",
        "options": {
          "sourceType": "module"
        }
      },
      {
        "test": ".*\\.ts$",
        "path": "typescript-eslint-parser"
      }
    ]
  }
}
```

The `test` is a regular expression. It will be matched against the [`basename`](https://nodejs.org/api/path.html#path_path_basename_path_ext) of the file path.

Of course, any specified parsers must be installed.

Notice: the parser `path` must be a package path. A relative path will not work. PR welcome.
