var gulp = require('gulp'),
    bower = require('gulp-bower'),
    mainBowerFiles = require('gulp-main-bower-files'),
    gulpFilter = require('gulp-filter'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    flatten = require('gulp-flatten'),
    del = require('del'),
    cssnano = require('gulp-cssnano'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    ts = require('gulp-typescript'),
    replace = require('gulp-replace'),
    git = require('git-rev');

/** Production setting */
var isProduction = false;

gulp.task('env:production', function () {
    gutil.log(gutil.colors.red('Production enviroment set.'));
    isProduction = true;
});

gulp.task('env:develop', function () {
    gutil.log(gutil.colors.red('Develop enviroment set.'));
    isProduction = false;
});

/** output paths */
var dist = {
    js: './www/js',
};

gulp.task('clean', function () {
    gutil.log(gutil.colors.red('Cleaning files.'));
    return del([
        dist.js + '**/*.js',
        dist.css + '**/*.css',
        dist.fonts + '**/*',
    ]);
});



/** Application libs */
var appSources = {
    // js: './app/assets/js/**/*.js',
    ts: './app/assets/typescript/**/*.ts',
};

gulp.task('app:css', function () {
    return gulp.src(appSources.css)
        .pipe(concat('app.css'))
        .pipe(gulpif(isProduction, cssnano()))
        .pipe(gulp.dest(dist.css));
});

var tsProject = ts.createProject('tsconfig.json', {outFile: 'app.js'});
gulp.task('app:typescript', function () {
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulp.dest(dist.js));
});



gulp.task('app:production', ['env:production', 'app:typescript']);
gulp.task('app:develop', ['env:develop', 'app:typescript']);

gulp.task('all:production', ['clean', 'app:production']);
gulp.task('all:develop', ['clean', 'app:develop']);


gulp.task('watch', function () {
    gutil.log(gutil.colors.red('Watching for changes in app typescript/css files...'));
    gulp.watch(appSources.ts, ['app:typescript']);
});