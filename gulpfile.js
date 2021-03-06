var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var es = require('event-stream');
var concat = require('gulp-concat');


// Requires the gulp-sass plugin
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// start the gulp watch and refresh the browser
gulp.task('watch', ['browserSync', 'sass', 'useref'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/partials/**/*.html', browserSync.reload);
  gulp.watch('app/js/directive/**/**/*.html', browserSync.reload);
  gulp.watch('app/js/directive/**/**/*.js', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Live-reloading with Browser Sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
});

// mify js and css files
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('app/css/*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});


gulp.task('scripts', function () {

  var javaScript = gulp.src('app/js/*.js');
  var jsControllers = gulp.src('app/js/controllers/*.js');
  var jsDirectives = gulp.src('app/js/directives/**/*.js');
  var libs = gulp.src('app/lip/js/*.js');

  return es.merge(javaScript, jsControllers, jsDirectives, libs)
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist'));
});

// minify images
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'));
});