var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var less         = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

// Static Server + watching scss/html files
gulp.task('serve', ['less'], function() {
  browserSync.init({
    browser: ['firefox'],
    server: './public',
    port: '3000'
  });

  gulp.watch('less/*.less', ['less']);
  gulp.watch('public/index.html').on('change', browserSync.reload);
});

// Compile less into CSS & auto-inject into browsers
gulp.task('less', function() {
  return gulp.src('less/*.scss')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/build'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
