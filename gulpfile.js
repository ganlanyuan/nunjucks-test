var config = {
  sassLang: 'libsass',
  sourcemaps: '../sourcemaps',
  browserSync: {
    server: {
      baseDir: './'
    },
    open: false,
    notify: false
  },

  html: {
    src: 'templates/*.njk',
    watch: ['templates/**/*.njk', 'templates/**/*.json'],
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
var browserSync = require('browser-sync').create();
var rename = require("gulp-rename");
var nunjucks = require('gulp-nunjucks');
// var nunjucksRender = require('gulp-nunjucks-md');
var htmltidy = require('gulp-htmltidy');

function requireUncached( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

// gulp.task('html', function () {
//   var n = 0;
//   data.getImageCount = function () { return n += 1; };

//   return gulp.src(config.html.src)
//     .pipe(gulpdata(data))
//     .pipe(nunjucksRender({
//       path: ['templates/'], // String or Array
//       envOptions: config.html.options,
//       // manageEnv: function(environment) {
//       //   environment.addGlobal('getImageCount', 1)
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
  var data = requireUncached('./templates/data.json');
  data.year = new Date().getFullYear();

  var imageCount = 0;
  data.getImageCount = function () { return imageCount += 1; };

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