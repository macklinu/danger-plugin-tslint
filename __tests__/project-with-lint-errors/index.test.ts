import * as path from 'path'
import tslint from '../../src'

// tslint:disable:no-string-literal

beforeEach(() => {
  global['fail'] = jest.fn()
})

test('Should fail because of missing semicolon', () => {
  tslint({
    tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
    tslintPath: path.resolve(__dirname, 'tslint.json'),
  })
  expect(global['fail']).toHaveBeenCalledWith(
    expect.stringMatching(/add.ts\[2, 15\]: Missing semicolon/),
  )
})
