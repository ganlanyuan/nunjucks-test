var config = {
  sassLang: 'libsass',
  sourcemaps: '../sourcemaps',
  server: {
    base: '.',
    hostname: '0.0.0.0',
    keepalive: true,
    stdio: 'ignore',
  },
  browserSync: {
    proxy: '0.0.0.0:8000',
    open: true,
    notify: false
  },

  markup: {
    src: 'templates/*.njk',
    watch: 'templates/**/*.njk',
    options: {
      watch: true,
      noCache: true
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

var data = require('./templates/data.json');
data.year = new Date().getFullYear();

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

gulp.task('markup', () =>
  gulp.src(config.markup.src)
    .pipe(nunjucks.compile(data), config.markup.options)
    .pipe(rename(function (path) {
      path.extname = ".html";
    }))
    .pipe(gulp.dest(config.markup.dest))
);

// Server
gulp.task('server', function () {
  php.server(config.server);
});
gulp.task('sync', ['server'], function() {
  browserSync.init(config.browserSync);
});

// watch
gulp.task('watch', function () {
  // gulp.watch(config.markup.watch, ['markup']);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
})

// Default Task
gulp.task('default', [
  'sync', 
  'watch',
]);  