module.exports = {
    setupFilesAfterEnv: ['jest-extended'],
    moduleDirectories: ['node_modules', '.'],
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