const nunjucks = require('nunjucks');
var fs = require('fs');
var chokidar = require('chokidar');

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'), {
    autoescape: true,
    watch: true,
    noCache: true
});

function nunjucksRun(argument) {
  var output = env.render('index.html', { username: 'William Lin' });

  fs.open('www/index.html', 'a', function opened(err, fd) {
      if (err) { return callback(err); }

      function notifyError(err) {
        fs.close(fd);
      }
      var writeBuffer = output,
          bufferOffset = 0,
          bufferLength = writeBuffer.length,
          filePosition = null;
      fs.write(fd, writeBuffer, bufferOffset, bufferLength, filePosition,
        function wrote(err, written) {
          if (err) {
            return notifyError(err); }
          fs.close(fd);
        }
      );
  });
}

nunjucksRun();

var watcher = chokidar.watch('views/index.html', {
  persistent: true
});
watcher.on('change', (path, stats) => {
  nunjucksRun();
  if (stats) console.log(`File ${path} changed size to ${stats.size}`);
});