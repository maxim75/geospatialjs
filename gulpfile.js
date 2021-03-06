var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var stylish = require('jshint-stylish');
var gutil = require('gulp-util');
var qunit = require('gulp-qunit');
var sourcemaps = require('gulp-sourcemaps');
var coveralls = require('gulp-coveralls');

gulp.task('test', function() {
    return gulp.src('./Tests/test-runner.html')
        .pipe(qunit())
        .on('qunit.report', function() { console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA") });

    gulp.src('test/coverage/**/lcov.info')
        .pipe(coveralls());
});


gulp.task('build', function() {
    gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))

    .pipe(sourcemaps.init())
    .pipe(concat('geospatialjs.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('geospatialjs.min.js'))
    .pipe(uglify({ outSourceMap: true }))
    .pipe(sourcemaps.write("."))
    
    .pipe(gulp.dest('dist'));

    
});

gulp.task('default', [ "build", "test" ]);
