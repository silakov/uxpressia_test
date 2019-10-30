'use strict';

var gulp            = require('gulp');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var jade            = require('gulp-jade');
var imagemin        = require('gulp-imagemin');
var livereload      = require('gulp-livereload');
var server          = require('gulp-server-livereload');
var clean           = require('gulp-rimraf');

var src = {
  jade: "src/*.jade",
  img: "src/img/*.*",
  sass: "src/sass/",
  fonts: "src/fonts/*.*"
};

var dest = {
  html: "docs/",
  img: "docs/img",
  css: "docs/css",
  fonts: "docs/fonts/"
};

livereload({ start: true })

gulp.task('sass', function () {
  return gulp
    .src(src.sass + 'main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.css))
    .pipe(livereload());
});

gulp.task('jade', function() {
  return gulp
    .src(src.jade)
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(dest.html))
    .pipe(livereload());
});

gulp.task('copy-fonts', function () {
  return gulp
    .src(src.fonts)
    .pipe(gulp.dest(dest.fonts));
});

gulp.task('copy-img', function () {
  return gulp
    .src(src.img)
    .pipe(gulp.dest(dest.img));
});

gulp.task('server', ["jade"], function() {
  gulp
    .src(dest.html)
    .pipe(server({
      livereload: true,
      open: true
    }))
    .pipe(livereload());
});

gulp.task("watch", function() {
  livereload.listen();
  gulp.watch(src.jade, ["jade"]);
  gulp.watch(src.sass + '**/*.scss', ["sass"]);
  gulp.watch(src.img, ["copy-img"]);
});

gulp.task('default', ['sass', 'jade', 'copy-img', 'copy-fonts', 'server', 'watch'], function() {});

gulp.task('clean', function () {
  return gulp
    .src('docs', { read: false })
    .pipe(clean());
});

gulp.task('css', function () {
  return gulp
    .src(src.sass + 'main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version'],
      cascade: false
    }))
    .pipe(gulp.dest(dest.css));
});

gulp.task('html', function() {
  return gulp
    .src(src.jade)
    .pipe(jade())
    .pipe(gulp.dest(dest.html));
});

gulp.task('imagemin', function() {
  return gulp
    .src(src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(dest.img));
});

gulp.task('build', ['css', 'html', 'imagemin', 'copy-fonts'], function() {});