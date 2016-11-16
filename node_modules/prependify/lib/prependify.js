var through = require('through2')

module.exports = function licensify (b, text) {
  b.on('bundle', function () {
    // thanks: https://github.com/twada/licensify/blob/master/lib/licensify.js
    // why r u not working?: https://www.npmjs.com/package/gulp-insert
    var first = true
    b.pipeline.get('wrap').push(through.obj(
      function (buf, enc, next) {
        if (first) {
            this.push(text)
            first = false
        }
        this.push(buf)
        next()
      }
    ))
  })
}
