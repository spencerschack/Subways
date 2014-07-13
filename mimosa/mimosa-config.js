exports.config = {
  modules: [
    "copy",
    "stream-copy",
    "server",
    "live-reload",
    "es6-module-transpiler",
    "require",
    "minify-js",
    "minify-css",
    "bower",
    "autoprefixer",
    "csslint",
    "jshint",
    "require-lint",
    "minify-svg",
    "minify-html",
    "minify-img",
    "testem-require",
    "web-package"
  ],
  testemRequire: {
    mochaSetup: {
      globals:["jQuery*"]
    }
  },
  server: {
    port: 4200
  }
}