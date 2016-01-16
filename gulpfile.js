'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var _ = require('underscore');
var browserSync = require('browser-sync').create();

var paths = {
  lint: ['*.js', './public/**/*.js'],
  watch: ['*.js', './public/**', '!bower_components'],
  tests: ['./test/**/*.js'],
  client: './public',
  source: ['./public/app/**/*.js'],
  html: './public/index.html',
  build: './public/build'
};

gulp.task('nodemon', function(cb) {
  var started = false;

  return $.nodemon({
    script: 'app.js'

  }).on('start', function() {
    // to avoid nodemon being started multiple times
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('lint', function() {
  return gulp.src(paths.lint)
    .pipe($.jshint('.jshintrc'))
    // .pipe($.plumber(plumberConf))
    // .pipe($.jscs())
    .pipe($.jshint.reporter('jshint-stylish'));
});

// Compile less into CSS & auto-inject into browsers
gulp.task('less', function() {
  return gulp.src('less/*.less')
    .pipe($.less())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.build))
    .pipe(browserSync.stream());
});

gulp.task('inject', function() {
  var injectScripts = gulp.src([
    path.join(paths.client, '/app/app.module.js'),
    path.join(paths.client, '/app/app.config.js'),
    path.join(paths.client, '/app/**/*.js')
  ]);
  // .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  return gulp.src(paths.html)
    .pipe($.inject(injectScripts, { addRootSlash: false }))
    .pipe($.wiredep(_.extend({}, {
      directory: paths.client,
      bowerJson: paths.client
    })));
// .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});

// gulp.task('minify', ['less'], function() {
//   return gulp.src('less/*.scss')
//     .pipe(less())
//     .pipe(autoprefixer({
//       browsers: ['last 2 versions'],
//       cascade: false
//     }))
//     .pipe(gulp.dest('public/build'))
//     .pipe(browserSync.stream());
// });

// gulp.task('clean', function (done) {
//   $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
// });

// Static Server + watching scss/html files
gulp.task('serve', ['less', 'inject', 'nodemon'], function() {
  browserSync.init({
    browser: ['firefox'],
    server: './public',
    port: '3000'
  });

  gulp.watch('less/*.less', ['less']);
  gulp.watch(paths.html).on('change', browserSync.reload);
});

gulp.task('start', ['less'], function() {});

gulp.task('default', ['serve']);