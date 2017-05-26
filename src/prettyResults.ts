import { oneLine } from 'common-tags'
import { IRuleFailureJson, IRuleFailurePositionJson } from 'tslint'

const lineAndCharacter = (position: IRuleFailurePositionJson) => {
  const line = position.line + 1
  const character = position.character + 1
  return `${line}, ${character}`
}

export function prettyResults(results: IRuleFailureJson[]): string {
  return results
    .map((result) => oneLine`
      ${result.ruleSeverity}:
      ${result.name}[${lineAndCharacter(result.startPosition)}]:
      ${result.failure}
    `)
    .map((item: string) => `- ${item}`)
    .join('\n')
}
