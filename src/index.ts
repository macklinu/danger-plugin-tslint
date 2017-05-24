/**
 * @module tslint
 */
/**
 * This second comment is required until
 * https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/6 is resolved.
 */

import * as fs from 'fs'
import { Configuration, findFormatter, Linter, RuleFailure } from 'tslint'

/**
 * Possible TSLint [formatters](https://palantir.github.io/tslint/formatters/).
 */
type Formatter =
  | 'checkstyle'
  | 'codeFrame'
  | 'fileslist'
  | 'json'
  | 'msbuild'
  | 'pmd'
  | 'prose'
  | 'stylish'
  | 'tap'
  | 'verbose'
  | 'vso'

interface IPluginConfig {
  /**
   * The path to your project's `tslint.json` file.
   * @default `'tslint.json'`
   */
  tslintPath?: string
  /**
   * The path to your project's `tsconfig.json` file.
   * @default `'tsconfig.json'`
   */
  tsconfigPath?: string
  /**
   * A TSLint [formatter](https://palantir.github.io/tslint/formatters/).
   * @default `'prose'`
   */
  formatter?: Formatter
}

/**
 * Runs TSLint on a project's source code and reports results to Danger.
 * If there are any lint violations, Danger will fail the build and post results in a comment.
 * If there are no lint violations, Danger will comment saying that TSLint passed.
 *
 * @export
 * @param config The optional config object.
 */
export default function tslint(config: IPluginConfig = {}): void {
  const {
    tslintPath = 'tslint.json',
    tsconfigPath = 'tsconfig.json',
    formatter = 'prose',
  } = config

  // Set up TSLint
  const options = { fix: false }
  const program = Linter.createProgram(tsconfigPath)
  const linter = new Linter(options, program)
  const filenames = Linter.getFileNames(program)

  // Lint all files from tsconfig.json
  filenames.forEach((fileName) => {
    const configuration = Configuration.findConfiguration(tslintPath, fileName).results
    const fileContents = fs.readFileSync(fileName, 'utf8')
    linter.lint(fileName, fileContents, configuration)
  })

  // Handle lint output
  const { failures } = linter.getResult()
  if (failures.length > 0) {
    const formattedFailures = _getFormattedFailures(formatter, failures)
    fail(formattedFailures)
  } else {
    message(':white_check_mark: TSLint passed')
  }
}

function _getFormattedFailures(formatter: Formatter, failures: RuleFailure[]): string {
  const Formatter = findFormatter(formatter)
  if (Formatter !== undefined) {
    return new Formatter().format(failures)
  }
  throw new Error(`formatter '${formatter}' not found`)
}
