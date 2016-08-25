/*global __dirname */

'use strict';

var browserify = require( 'browserify' ),
  source = require( 'vinyl-source-stream' ),
  glob = require( 'glob' ),
  gulp = require( 'gulp' );

// Load all gulp plugins listed in package.json
var gulpPlugins = require( 'gulp-load-plugins' )( {
  pattern: [ 'gulp-*', 'gulp.*' ],
  replaceString: /\bgulp[\-.]/
} );

// Define file path variables
var paths = {
  src: 'src',
  dist: './'
};

/*
 * Useful tasks:
 * - gulp fast:
 *   - linting
 *   - unit tests
 *   - browserification
 *   - no minification, does not start server.
 * - gulp watch:
 *   - starts server with live reload enabled
 *   - lints, unit tests, browserifies and live-reloads changes in browser
 *   - no minification
 * - gulp:
 *   - linting
 *   - unit tests
 *   - browserification
 *   - minification and browserification of minified sources
 *   - start server for e2e tests
 *   - run Protractor End-to-end tests
 *   - stop server immediately when e2e tests have finished
 *
 * At development time, you should usually just have 'gulp watch' running in the
 * background all the time. Use 'gulp' before releases.
 */

var liveReload = true;


gulp.task( 'browserify', function () {
  return browserify( './src/app.js', {
      debug: true
    } )
    .bundle()
    .pipe( source( 'app.js' ) )
    .pipe( gulp.dest( './' ) )
    .pipe( gulpPlugins.connect.reload() );
} );

gulp.task( 'server', function () {
  gulpPlugins.connect.server( {
    root: './',
    livereload: liveReload
  } );
} );

gulp
gulp.task( 'watch', [ 'fast' ], function () {
  gulp.start( 'server' );
  gulp.watch( [
    paths.src + '**/*.js',
    paths.css + '**/*.css',
    paths.root + '**/*.html'
  ], [ 'fast' ] );
} );

gulp.task( 'fast', function () {
  gulp.start( 'browserify');
} );
