'use strict';

var gulp         = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync  = require('browser-sync').create();

var paths = {
  lint: ['*.js', './public/**/*.js'],
  watch: ['*.js', './public/**', '!bower_components'],
  tests: ['./test/**/*.js'],
  source: ['public/app/**/*.js']
};

gulp.task('nodemon', function (cb) {
	var started = false;
	
	return plugins.nodemon({
		script: 'app.js'

	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(plugins.jshint('.jshintrc'))
    // .pipe(plugins.plumber(plumberConf))
    // .pipe(plugins.jscs())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});


// Compile less into CSS & auto-inject into browsers
gulp.task('less', function() {
  return gulp.src('less/*.scss')
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/build'))
    .pipe(browserSync.stream());
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

// Static Server + watching scss/html files
gulp.task('serve', ['less', 'nodemon'], function() {
  browserSync.init({
    browser: ['firefox'],
    server: './public',
    port: '3000'
  });

  gulp.watch('less/*.less', ['less']);
  gulp.watch('public/index.html').on('change', browserSync.reload);
});

gulp.task('start', ['less'], function () {});

gulp.task('default', ['serve']);
