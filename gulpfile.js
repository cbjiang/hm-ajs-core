/**
 * Created by cbjiang on 2017/6/26.
 */
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');

gulp.task('copy-libs',  function() {
    return gulp.src('libs/**/*')
        .pipe(gulp.dest('release/libs'))
});

gulp.task('copy-css',  function() {
    return gulp.src('css/**/*')
        .pipe(gulp.dest('release/css'))
});

gulp.task('copy-img',  function() {
    return gulp.src('img/**/*')
        .pipe(gulp.dest('release/img'))
});

gulp.task('hmapp-min', function() {
    gulp.src([
        'src/hmapp.js',
        'src/hmapp.configs.js',
        'src/hmapp.directives.js',
        'src/hmapp.service.js',
        'src/Layout.js',
        'src/interceptor/interceptor.config.js',
        'src/interceptor/auth.interceptor.js',
        'src/interceptor/auth-expired.interceptor.js',
    ]).pipe(concat('hmapp.js'))
    .pipe(gulp.dest('release/src'))    //输出main.js到文件夹
    .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
    .pipe(uglify())    //压缩
    .pipe(gulp.dest('release/src'));  //输出
});

gulp.task('loginapp-min', function() {
    gulp.src([
        'src/login/loginapp.js',
    ]).pipe(concat('loginapp.js'))
        .pipe(gulp.dest('release/src'))    //输出main.js到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('release/src'));  //输出
});

gulp.task('hmapp-fileupload-min', function() {
    gulp.src([
        'src/compnents/fileupload/fileupload.js',
    ]).pipe(concat('hmapp-fileupload.js'))
    .pipe(gulp.dest('release/src'))    //输出main.js到文件夹
    .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
    .pipe(uglify())    //压缩
    .pipe(gulp.dest('release/src'));  //输出
});

gulp.task('clean', function(cb) {
    del(['release/src','release/libs','release/css','release/img'], cb);
});

gulp.task('default', function() {
    gulp.start('clean','hmapp-min','loginapp-min','hmapp-fileupload-min','copy-libs','copy-css','copy-img');
});
