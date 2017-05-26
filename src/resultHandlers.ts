import { stripIndents } from 'common-tags'
import { IRuleFailureJson } from 'tslint'
import { prettyResults } from './prettyResults'

export function defaultResultHandler(results: IRuleFailureJson[]): void {
  if (results.length > 0) {
    const prettyLintResults = prettyResults(results)
    const hasFixableViolations = results.filter((result) => result.hasOwnProperty('fix')).length > 0
    const fixMessage = hasFixableViolations
      ? 'You can fix them by adding `--fix` to your TSLint command. :+1:'
      : ''
    fail(stripIndents`
      There are ${results.length} lint violations:

      ${prettyLintResults}

      ${fixMessage}
    `.trim())
  } else {
    message(':white_check_mark: TSLint passed')
  }
}
