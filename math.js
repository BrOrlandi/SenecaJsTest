var fs = require('fs')

module.exports = function math(options) {

  // the logging function, built by init
  var log

  // place all the patterns together
  // this make it easier to see them at a glance
  this.add('role:math,cmd:sum',     sum)
  this.add('role:math,cmd:product', product)

  // this is the special initialization pattern
  this.add('init:math', init)

//seneca.wrap method matches a set of patterns and overrides all of them with the same action extension function
  this.wrap('role:math', function (msg, respond) {
    msg.left  = Number(msg.left).valueOf()
    msg.right = Number(msg.right).valueOf()
    this.prior(msg, respond)
  })


  function init(msg, respond) {
    // log to a custom file
    fs.open(options.logfile, 'a', function (err, fd) {

      // cannot open for writing, so fail
      // this error is fatal to Seneca
      if (err) return respond(err)

      log = make_log(fd)
      respond()
    })
  }

  function sum(msg, respond) {
    var out = { answer: msg.left + msg.right }
    log('sum '+msg.left+'+'+msg.right+'='+out.answer+'\n')
    respond(null, out)
  }

  function product(msg, respond) {
    var out = { answer: msg.left * msg.right }
    log('product '+msg.left+'*'+msg.right+'='+out.answer+'\n')
    respond(null, out)
  }


  function make_log(fd) {
    return function (entry) {
        var msg = new Date().toISOString()+' '+entry;
        console.log(msg);
      fs.write(fd, msg, null, 'utf8', function (err) {
        if (err) return console.log(err)

        // ensure log entry is flushed
        fs.fsync(fd, function (err) {
          if (err) return console.log(err)
        })
      })
    }
  }
}
