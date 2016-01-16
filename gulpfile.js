'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var _ = require('underscore');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var del = require('del');

var paths = {
  lint: ['*.js', './public/app/**/*.js'],
  // watch: ['*.js', './public/**', '!bower_components'],
  // tests: ['./test/**/*.js'],
  less: './client/less/*.less',
  html_template: './client/index.html',
  html: 'index.html',
  bower: './public/bower_components',
  css: './public/css/style.css'
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
  return gulp.src(paths.less)
    .pipe($.less())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./public/css'));
    // .pipe(browserSync.stream());
});

gulp.task('inject', function() {
  // .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));
  var inject_resources = gulp.src(['./public/app/**/*.js', './public/app/css/**/*.css'], {read: false});
  // var options = config.getWiredeFpDefaultOptions();
  // options.directory = 'public/bower_components';

  return gulp.src('./public/index.html')
    .pipe(wiredep({
      src: './public/index.html',
      directory: './public/bower_components'
    }))
    .pipe($.inject(inject_resources, { addRootSlash: false, read: false, relative: true }))
    .pipe(gulp.dest('./public'));
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

gulp.task('clean', function () {
  del(['./public/css/*']);
});

// Static Server + watching scss/html files
gulp.task('serve', ['clean', 'less', 'inject', 'nodemon'], function() {
  browserSync.init({
    browser: ['firefox'],
    server: './public',
    port: '3000'
  });

  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.html).on('change', browserSync.reload);
});

gulp.task('start', ['less'], function() {});

gulp.task('default', ['serve']);
