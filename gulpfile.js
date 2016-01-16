'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var _ = require('underscore');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var rimraf = require('rimraf');

var paths = {
  lint: ['*.js', './public/**/*.js'],
  watch: ['*.js', './public/**', '!bower_components'],
  tests: ['./test/**/*.js'],
  less_src: './less/*.less',
  client: './public',
  src: ['./public/app/**/*.js'],
  html: './public/index.html',
  build: './public/build',
  dist: './dist',
  livereload: './.tmp'
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
  return gulp.src(paths.less_src)
    .pipe($.less())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dist(paths.build));
    // .pipe(browserSync.stream());
});

gulp.task('inject', function() {
  // .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));
  // var inject_resources = gulp.src(['public/**/*.js', 'public/build/**/*.css']);
  // var options = config.getWiredeFpDefaultOptions();
  // options.directory = 'public/bower_components';

  return gulp.src(paths.html)
    // .pipe
    // .pipe($.inject(inject_resources, { addRootSlash: false, read: false }))
    .pipe(wiredep({
      src: 'public/index.html',
      directory: 'public/bower_components'
    }))
    .pipe(gulp.dest(paths.build));
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

gulp.task('clean:tmp', function (done) {
  return $.del(paths.livereload, done);
});

gulp.task('clean:dist', function (done) {
  return $.del(paths.dist, done);
});

// Static Server + watching scss/html files
gulp.task('serve', function() {
  browserSync.init({
    browser: ['firefox'],
    server: paths.livereload,
    port: '3000'
  });

  runSequence('clean:tmp', 'less', ['inject', 'nodemon'], function () {
    return browserSync.stream;
  });

  gulp.watch(paths.less_src, ['less']);
  gulp.watch(paths.html).on('change', browserSync.reload);
});

gulp.task('start', ['less'], function() {});

gulp.task('default', ['serve']);
