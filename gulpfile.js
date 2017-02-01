const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require("gulp-rename");
const nunjucks = require('gulp-nunjucks');
const htmltidy = require('gulp-htmltidy');

const config = {
  sassLang: 'libsass',
  sourcemaps: '../sourcemaps',
  browserSync: {
    server: {
      baseDir: './'
    },
    open: false,
    notify: false
  },

  nunjucks: {
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

function requireUncached( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

gulp.task('nunjucks', function() {
  let data = requireUncached('./templates/data.json');
  data.year = new Date().getFullYear();

  let imageCount = 0;
  data.getImageCount = function () { return imageCount += 1; };

  return gulp.src(config.nunjucks.src)
    .pipe(nunjucks.compile(data), config.nunjucks.options)
    .pipe(rename(function (path) { path.extname = ".html"; }))
    .pipe(htmltidy({
      doctype: 'html5',
      wrap: 0,
      hideComments: true,
      indent: true,
      'indent-attributes': false,
      'drop-empty-elements': false,
      'force-output': true
    }))
    .pipe(gulp.dest(config.nunjucks.dest))
});

// Server
gulp.task('sync', function() {
  browserSync.init(config.browserSync);
});

// watch
gulp.task('watch', function () {
  gulp.watch(config.nunjucks.watch, ['nunjucks']);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
})

// Default Task
gulp.task('default', [
  'sync', 
  'watch',
]);  