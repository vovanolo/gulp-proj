const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browsersync = require('browser-sync').create();


function browserSync(done) {
    browsersync.init({
        server:{
            baseDir: './build'
        },
        port:4000
    })
    done();
}

function browserSyncReload(done) {
    browsersync().reload();
    done();
}




const paths = {
    styles:{
        src:'app/styles/**/*.scss',
        dest:'build/css'
    },
    js:{
        src: 'app/js/**/*.js',
        dest: 'build/js'
    },
    html:{
        src: 'app/**/*.html',
        dest: 'build/'
    },
    images: {
        src: 'app/images/*.*',
        dest: 'build/images'
    }

}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browsersync.stream())
}

function scripts() {
    return gulp.src(paths.js.src)
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browsersync.stream())

}

function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browsersync.stream())

}


function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.js.src, scripts);
    gulp.watch(paths.html.src, html);
    gulp.watch('./app/index.html',gulp.series(browserSyncReload))
}


const build = gulp.parallel(styles,scripts,html);
gulp.task('build', build);

gulp.task('default', gulp.parallel(watch,build,browserSync));