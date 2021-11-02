"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var objectfit = require("postcss-object-fit-images");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var concat = require("gulp-concat");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var uglify = require("gulp-uglify");
var del = require("del");

var ttf2woff = require("gulp-ttf2woff");
var ttf2woff2 = require("gulp-ttf2woff2");
var fonter = require("gulp-fonter");

gulp.task("css", function () {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), objectfit()]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/img/*.{png,jpg}", gulp.series("copy-image", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("scripts", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("images", function () {
  return gulp
    .src("./source/img/**/*.{jpg,png,svg,gif,ico}")
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [
          {
            removeViewBox: false,
          },
        ],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(
      webp({
        quality: 90,
      })
    )
    .pipe(gulp.dest("source/img"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {
  return gulp
    .src("source/img/sprite/*.svg")
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite_auto.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp
    .src("source/*.html")
    .pipe(posthtml([include()]))
    .pipe(gulp.dest("build"));
});

gulp.task("scripts", function () {
  return gulp
    .src(["source/js/vendor/*.js", "source/js/modules/*.js"])
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(concat("main.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(sourcemap.write(""))
    .pipe(gulp.dest("build/js"));
});

gulp.task("copy", function () {
  return gulp
    .src(["source/fonts/**/*.{woff,woff2}", "source/img/**", "source/*.ico"], {
      base: "source",
    })
    .pipe(gulp.dest("build"));
});

gulp.task("copy-image", function () {
  return gulp
    .src(["source/img/**"], {
      base: "source",
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("fonts", function () {
  gulp
    .src("./source/fonts/**/*.{ttf})")
    .pipe(ttf2woff())
    .pipe(gulp.dest("./source/fonts/"));
  return gulp
    .src("source/fonts/**/*.{ttf}")
    .pipe(ttf2woff2())
    .pipe(gulp.dest("./source/fonts/"));
});

gulp.task("otf2ttf", function () {
  return gulp
    .src(["./source/fonts/*.otf"])
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(gulp.dest("./source/fonts/"));
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    "copy",
    "css",
    "scripts",
    "sprite",
    "html",
    "images",
    "webp"
  )
);
gulp.task("start", gulp.series("build", "server"));
