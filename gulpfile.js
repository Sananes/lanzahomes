// var gulp = require('gulp');
// var shell = require('gulp-shell');
// var browserSync = require('browser-sync').create();
//
// // Task for building blog when something changed:
// gulp.task('build', shell.task(['jekyll serve -w']));
// // Or if you don't use bundle:
// // gulp.task('build', shell.task(['jekyll build --watch']));
//
// // Task for serving blog with Browsersync
// gulp.task('serve', function () {
//     browserSync.init({server: {baseDir: 'build/'}});
//     // Reloads page when some of the already built files changed:
//     gulp.watch('build/**/*.*').on('change', browserSync.reload({stream:true}));
// });
//
// gulp.task('default', ['build', 'serve']);




// var gulp = require('gulp');
// var shell = require('gulp-shell');
// var browserSync = require('browser-sync').create();
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var shell       = require('gulp-shell');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');


var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Task for building blog when something changed:

// Or if you don't use bundle:
// gulp.task('build', shell.task(['jekyll build --watch']));

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});
gulp.task('serve', shell.task(['jekyll serve -w']));
/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('sass', ['jekyll-build'], function () {
    return gulp.src('build/assets/application.css')
        .pipe(sass({
            // includePaths: ['/Library/Ruby/Gems/2.0.0/gems/bourbon-4.2.7/app/assets/stylesheets', '/Library/Ruby/Gems/2.0.0/gems/neat-1.7.4/app/assets/stylesheets'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('browser-sync', ['sass','jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: 'build'
        }
    });
});
/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['source/_assets/stylesheets/*.scss'], ['sass']);
    gulp.watch(['source/*.haml', 'source/_layouts/*.haml', 'source/_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
