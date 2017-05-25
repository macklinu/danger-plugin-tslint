import * as path from 'path'
import tslint from './src'

tslint({
  lintResultsJsonPath: path.resolve(__dirname, 'reports', 'lint-results.json'),
})
