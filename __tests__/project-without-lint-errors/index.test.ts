import * as path from 'path'
import tslint from '../../src'

// tslint:disable:no-string-literal

beforeEach(() => {
  global['message'] = jest.fn()
})

test('Should pass because there are no lint errors', () => {
  tslint({
    tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
    tslintPath: path.resolve(__dirname, 'tslint.json'),
  })
  expect(global['message']).toHaveBeenCalledWith(':white_check_mark: TSLint passed')
})
