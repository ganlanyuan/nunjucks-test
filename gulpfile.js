var config = {
  sassLang: 'libsass',
  sourcemaps: '../sourcemaps',
  // server: {
  //   base: '.',
  //   hostname: '0.0.0.0',
  //   keepalive: true,
  //   stdio: 'ignore',
  // },
  browserSync: {
    server: {
      baseDir: './'
    },
    // proxy: '0.0.0.0:8000',
    open: false,
    notify: false
  },

  html: {
    src: 'templates/*.njk',
    watch: 'templates/**/*.njk',
    options: {
      watch: true,
      noCache: true,
    },
    dest: ''
  },

  // watch
  watch: {
    sass: 'src/scss/**/*.scss',
    php: '**/*.php',
    html: '*.html'
  },
};

var gulp = require('gulp');
var php = require('gulp-connect-php');
var browserSync = require('browser-sync').create();
var rename = require("gulp-rename");
var nunjucks = require('gulp-nunjucks');
// var nunjucksRender = require('gulp-nunjucks-md');
var prettify = require('gulp-html-prettify');
var htmltidy = require('gulp-htmltidy');
var gulpdata = require('gulp-data');

var data = require('./templates/data.json');
data.year = new Date().getFullYear();
// data.imageCount = 1;

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

// gulp.task('html', function () {
//   var n = 0;
//   data.imageCount = function () { return n += 1; };

//   return gulp.src(config.html.src)
//     .pipe(gulpdata(data))
//     .pipe(nunjucksRender({
//       path: ['templates/'], // String or Array
//       envOptions: config.html.options,
//       // manageEnv: function(environment) {
//       //   environment.addGlobal('imageCount', 1)
//       // }
//     }))
//     .pipe(htmltidy({
//       doctype: 'html5',
//       wrap: 0,
//       hideComments: true,
//       indent: true,
//       'indent-attributes': false,
//       'drop-empty-elements': false,
//       'force-output': true
//     }))
//     .pipe(gulp.dest(config.html.dest))
// });

gulp.task('html', function() {
  var n = 0;
  data.imageCount = function () { return n += 1; };

  return gulp.src(config.html.src)
    .pipe(nunjucks.compile(data), config.html.options)
    .pipe(rename(function (path) {
      path.extname = ".html";
    }))
    // .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(htmltidy({
      doctype: 'html5',
      wrap: 0,
      hideComments: true,
      indent: true,
      'indent-attributes': false,
      'drop-empty-elements': false,
      'force-output': true
    }))
    .pipe(gulp.dest(config.html.dest))
});

// Server
// gulp.task('server', function () {
//   php.server(config.server);
// });
gulp.task('sync', function() {
  browserSync.init(config.browserSync);
});

// watch
gulp.task('watch', function () {
  gulp.watch(config.html.watch, ['html']);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
})

// Default Task
gulp.task('default', [
  'sync', 
  'watch',
]);  