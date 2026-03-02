import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    "node_modules/",
    "**/node_modules/**/",
    "**/*.spec.*",
    "**/style/",
    "*.html","**/*.html/**","components/test/*","components/test/*/**","es/","**/es/**/","lib/","**/lib/**/","_site/","**/_site/**/","dist/","**/dist/**/","bin/","**/bin/**/"],
  formatters: true,
  unocss: true,
  vue: true,
  markdown: false
})
