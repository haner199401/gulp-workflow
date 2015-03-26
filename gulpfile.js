var gulp        = require('gulp');
var gutil       = require('gulp-util');
var del         = require('del');
var size        = require('gulp-size');
var uglify      = require('gulp-uglify');
var minifyCSS   = require('gulp-minify-css');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var changed     = require('gulp-changed');
var imagemin    = require('gulp-imagemin');
var minifyHTML  = require('gulp-minify-html');
var sass        = require('gulp-sass');
var coffee      = require('gulp-coffee');
var bowerFiles  = require('main-bower-files');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('styles', function() {
  return gulp.src('src/scss/application.scss')
    .pipe(sass())
    .pipe(changed('build/css'))
    .pipe(rename('style.css'))
    .pipe(size())
    .pipe(gulp.dest('build/css'))
    .pipe(reload({stream:true}));
});

gulp.task('scripts', function() {
  return gulp.src('src/coffee/*.coffee')
    .pipe(changed('build/js'))
    .pipe(coffee())
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(size())
    .pipe(gulp.dest('build/js'))
    .pipe(reload({stream:true}));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(changed('build/img'))
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(size())
    .pipe(gulp.dest('build/img'))
    .pipe(reload({stream:true}));
});

gulp.task('html', function() {
  return gulp.src('src/html/**/*.html')
    .pipe(changed('./'))
    .pipe(minifyHTML())
    .pipe(size())
    .pipe(gulp.dest('./'))
    .pipe(reload({stream:true}));
});

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('build', function() {
  runSequence('clean', ['styles', 'scripts', 'images', 'html']);
});

gulp.task('serve', ['build'], function() {
  browserSync({
    server: {
      baseDir: __dirname,
    },
    open: false
  });

  gulp.watch('src/scss/*.scss', ['styles']);
  gulp.watch('src/coffee/*.coffee', ['scripts']);
  gulp.watch('src/img/**/*', ['images']);
  gulp.watch('src/html/**/*.html', ['html']);
});

gulp.task('default', ['serve']);
