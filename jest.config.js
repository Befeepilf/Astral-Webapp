module.exports = {
    setupFilesAfterEnv: ['jest-extended'],
    moduleDirectories: ['node_modules', '.'],
    moduleNameMapper: {
        "^react(.*)$": '<rootDir>/node_modules/react$1' // https://github.com/testing-library/react-hooks-testing-library/issues/294#issue-558549837
    },
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{js,jsx}',
        '!**/node_modules/**',
        '!**/.next/**',
        '!**/public/**',
        '!**/coverage/**',
        '!**/testUtils.js',
        '!**/colors.js',
        '!**/*.config.js'
    ]
}