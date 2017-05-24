import * as fs from 'fs'
import * as path from 'path'
import { Configuration, findFormatter, Formatters, Linter, RuleFailure } from 'tslint'

/**
 * Possible TSLint formatters.
 * See https://palantir.github.io/tslint/formatters/.
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

interface ILintOptions {
  /**
   * The path to your project's `tslint.json` file.
   * Defaults to the root directory.
   */
  tslintPath?: string
  /**
   * The path to your project's `tsconfig.json` file.
   * Defaults to the root directory.
   */
  tsconfigPath?: string
  /**
   * A TSLint [formatter](https://palantir.github.io/tslint/formatters/).
   * Defaults to 'prose' (the default TSLint formatter).
   */
  formatter?: Formatter
}

export default function tslint({
  tslintPath = 'tslint.json',
  tsconfigPath = 'tsconfig.json',
  formatter = 'prose',
}: ILintOptions = {}): void {
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
    const formattedFailures = getFormattedFailues(formatter, failures)
    fail(formattedFailures)
  } else {
    message(':white_check_mark: TSLint passed')
  }
}

function getFormattedFailues(formatter: Formatter, failures: RuleFailure[]): string {
  const Formatter = findFormatter(formatter)
  if (Formatter !== undefined) {
    return new Formatter().format(failures)
  }
  throw new Error(`formatter '${formatter}' not found`)
}
