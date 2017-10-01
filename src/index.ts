import * as path from 'path'
import * as clone from 'clone'

export interface ParserDefinition {
  test: string
  path: string
  options?: {}
}

export interface MultipleParsersOptions {
  parsers: ParserDefinition[]
}

export interface WorkingMultipleParsersOptions extends MultipleParsersOptions {
  filePath: string
}

export const parse = (code: string, options: WorkingMultipleParsersOptions) => {
  for (const parser of options.parsers) {
    if (new RegExp(parser.test).test(path.basename(options.filePath as string))) {
      const { parse } = require(parser.path)
      const passedOptions = clone(options)
      delete passedOptions.parsers
      return parse(code, { ...passedOptions, ...clone(parser.options) })
    }
  }
}
