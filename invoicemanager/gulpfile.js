// load gulp
var gulp = require('gulp');

// load other plugins
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
const del = require('del');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('sass', 'minifyJs');
});

gulp.task('sass', function() {
    return gulp.src('Src/assets/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
		.pipe(cleanCSS())
		.pipe(gulp.dest('Src/assets/css'));
});

/*gulp.task('minifyCSS', function(){
	return gulp.src('Src/assets/css/*.css')
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCSS())
		.pipe(gulp.dest('Src/assets/css'));
});*/

// define JS tasks
gulp.task('minifyJs', function() {
	return gulp.src('Src/assets/js/*.js')	  
	  	.pipe(rename({ suffix: '.min' }))
	  	.pipe(uglify())
	  	.pipe(gulp.dest('Src/assets/js'))
});

// files removed from src/ may still linger in Public/, so clean up your act before publishing again; ** includes parent folder!!
gulp.task('clean', function(cb) {
	return del(['', '']);
});
