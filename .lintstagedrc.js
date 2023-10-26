module.exports = {
  '!(**/*.spec.*)**/*.{ts,tsx}': [
    'eslint --cache --fix',
    'prettier --write'
  ],
  '!(**/*.spec.*)**/*.{js,jsx}': [
    'eslint --cache --fix ',
    'prettier --write'
  ]
}
