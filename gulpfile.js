/* --- Gulp --- */
const gulp = require('gulp')
const cache = require('gulp-cached')  // Filter for modified files
const rename = require('gulp-rename') // Renames files

/* --- Webserver --- */
const connect = require('gulp-connect')

gulp.task('connectDev', () => {
  connect.server({
    name: "Dev website",
    root: "src",
    port: 8080,
    livereload: true
  })
})

gulp.task('connectDist', () => {
  connect.server({
    name: "Dist website",
    root: "dist",
    port: 8081
  })
})

/* --- HTML --- */
const htmlBeautify = require('gulp-html-beautify')  // Cleans HTML
const htmlLint = require('gulp-htmlhint')           // Analyses SCSS
const htmlMinify = require('gulp-html-minify')      // Minifies HTML
const htmlReplace = require('gulp-html-replace')    // Replaces tag in HTML 

gulp.task('cleanHTML', () => {
  return gulp.src("src/*.html", { base: "." })
    .pipe(cache('HTML'))
    .pipe(htmlBeautify({ indent_size: 2 }))
    .pipe(htmlLint('.html-lint.json'))
    .pipe(htmlLint.reporter())
    .pipe(gulp.dest("."))
    .pipe(connect.reload())
})

/* --- Sass / CSS --- */
const sass = require('gulp-sass')             // Compiles SCSS
const sassBeautify = require('gulp-csscomb')  // Cleans SCSS
const sassLint = require('gulp-sass-lint')    // Analyses SCSS
const cssPaths = require('gulp-rewrite-css')  // Rewrites absolute paths
const cssPurify = require('gulp-purify-css')  // Removes unused CSS
const cssMinify = require('gulp-csso')        // Optimizes and minifies CSS

gulp.task('cleanSCSS', () => {
  return gulp.src("src/stylesheets/sass/**/*.s+(a|c)ss", { base: "." })
    .pipe(cache('SCSS'))
    .pipe(sassBeautify())
    .pipe(sassLint({ configFile: ".sass-lint.json" }))
    .pipe(sassLint.format())
    .pipe(gulp.dest("."))
})

gulp.task('compileSCSS', ['cleanSCSS'], () => {
  return gulp.src("src/stylesheets/sass/**/*.s+(a|c)ss")
    .pipe(sass().on('error', sass.logError))
    .pipe(rename("style.css"))
    .pipe(gulp.dest("src/stylesheets/css"))
    .pipe(connect.reload())
})

/* --- JavaScript --- */
const browserify = require('browserify')          // Resolves all dependencies
const babelify = require('babelify')              // Converts ES6 to ES5
const source = require('vinyl-source-stream')     // Links Browserify and Gulp
const jsBeautify = require('gulp-beautify')       // Cleans JS
const jsSemiColumns = require('gulp-semi').remove // Removes semi-columns
const jsUglify = require('gulp-uglify')           // Uglifies JS

gulp.task('cleanJS', () => {
  return gulp.src("src/scripts/modules/*.js", { base: "." })
    .pipe(cache('JS'))
    .pipe(jsBeautify({ indent_size: 2 }))
    .pipe(jsSemiColumns({ leading: true }))
    .pipe(gulp.dest(".")) 
})

gulp.task('compileJS', ['cleanJS'], () => {
  return browserify("src/scripts/modules/index.js")
    .transform('babelify', { presets: ['env'] })
    .bundle()
    .pipe(source("main.js"))
    .pipe(gulp.dest("src/scripts"))
    .pipe(connect.reload())
})

/* --- Watch --- */
gulp.task('watch', () => {
  // Clean
  gulp.watch("src/*.html", ['cleanHTML'])
  gulp.watch("src/stylesheets/sass/**/*.s+(a|c)ss", ['compileSCSS'])
  gulp.watch("src/scripts/modules/*.js", ['compileJS'])

  // Reload
  const files = ["src/images/*", "src/fonts/*"]
  gulp.watch(files, () => gulp.src(files).pipe(connect.reload()))
})

/* --- Build --- */
const clean = require ('gulp-clean')  // Deletes folder

gulp.task('clean', () => {
  return gulp.src("dist")
    .pipe(clean())
})

gulp.task('copyAssets', ['clean'], () => {
  return gulp.src(["src/*", "!src/*.html", "!src/stylesheets",  "!src/scripts"])
    .pipe(gulp.dest("dist"))
})

gulp.task('buildHTML', ['cleanHTML'], () => {
  return gulp.src("src/*.html")
    .pipe(htmlReplace({ 
      css: "css/style.min.css",
      js: "scripts/main.min.js"
    }))
    .pipe(htmlMinify())
    .pipe(gulp.dest("dist"))
})

gulp.task('buildCSS', ['compileSCSS', 'buildHTML', 'buildJS'], () => {
  return gulp.src("src/stylesheets/css/*.css")
    .pipe(cssPaths({ destination: "." }))
    .pipe(cssPurify(["dist/*.html", "dist/scripts/*.js"]))
    .pipe(cssMinify())
    .pipe(gulp.dest("dist/css"))
})

gulp.task('buildJS', ['compileJS'], () => {
  return gulp.src("src/scripts/*.js")
    .pipe(jsSemiColumns({ leading: true }))
    .pipe(jsUglify())
    .pipe(gulp.dest("dist/scripts"))
})

gulp.task('build', ['copyAssets', 'buildCSS'], () => {
  return gulp.src(["dist/css/*.css", "dist/*.html", "dist/scripts/*.js"], { base: "." })
    .pipe(gulp.dest("."))
})

/* --- Default task --- */
gulp.task('default', ['cleanHTML', 'compileSCSS', 'compileJS'], () => {
  return gulp.start(['connectDev', 'watch'])
})
