// including plugins
var gulp = require('gulp')
, minifyHtml = require("gulp-minify-html")
, minifyCss = require("gulp-minify-css")
, uglify = require("gulp-uglify")
, useref = require("gulp-useref")
, gulpif = require("gulp-if")
, rename = require("gulp-rename");
 
// task
gulp.task('minify', function () {
    return gulp.src('templates/base-raw.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(rename({
        basename: 'base'
    }))
    .pipe(gulp.dest('templates'));
})