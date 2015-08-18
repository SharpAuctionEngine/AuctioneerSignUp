var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    growl = require('gulp-notify-growl'),
    phpunit = require('gulp-phpunit'),
    replace = require('gulp-replace'),
    gulpIf = require('gulp-if'),
    gulpFilter = require('gulp-filter'),
    through = require('gulp-through'),
    gulpInject = require('gulp-inject'),
    gulpAddSrc = require('gulp-add-src'),
    es = require('event-stream')
    ;

var paths = {
    'dev': {
        'less': './resources/assets/less/',
        'js': './resources/assets/js/',
        'vendor': './resources/assets/vendor/'
    },
    'production': {
        'css': './public/assets/css/',
        'js': './public/assets/js/'
    }
};

// CSS
gulp.task('vendor-css', function() {
  var gritterStream = gulp.src([
      paths.dev.less+'jquery.gritter.less'
    ])
    .pipe(less())
    .pipe(replace('../images/','../img/gritter/'))
    ;

  var vendorLessStream = gulp.src([
      paths.dev.less+'vendor.less'
    ])
    .pipe(less())
    ;
  var vendorCssStream = gulp.src([
      paths.dev.vendor+'bootstrap-toggle/css/bootstrap-toggle.css'
    ])
    ;

  return es.merge(vendorLessStream,vendorCssStream,gritterStream)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(paths.production.css))
    .pipe(minify({keepSpecialComments:0}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.css));
});
// CSS
gulp.task('app-css', function() {
  var appLessStream = gulp.src([
    paths.dev.less+'app.less'
  ])
    .pipe(less())
    ;

  var appCssDepreciatedStream = gulp.src([
    paths.dev.less+'app.css'
  ])
    ;

  return es.merge(appCssDepreciatedStream,appLessStream)
    .pipe(concat('app.css'))
    .pipe(gulp.dest(paths.production.css))
    .pipe(minify({keepSpecialComments:0}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.css));
});
// JS
gulp.task('vendor-js', function(){
  return sae_buildJSFiles(null);
});
gulp.task('vendor-js-ie8', function(){
  return sae_buildJSFiles('ie8');
});
function sae_buildJSFiles(key){

  var jsf = [];
  var result_name = 'vendor.js';
  if (key=='ie8')
  {
    jsf.push(paths.dev.vendor+'jquery-ie8/dist/jquery.js');
    result_name = 'vendor-ie8.js';
  }
  else
  {
    jsf.push(paths.dev.vendor+'jquery/dist/jquery.js');
  }
  jsf = jsf.concat([
    paths.dev.vendor+'jquery.gritter/js/jquery.gritter.js',
    paths.dev.vendor+'kbw.countdown/jquery.countdown.js',
    paths.dev.vendor+'moment/moment.js',
    paths.dev.vendor+'bootstrap/dist/js/bootstrap.js',
    paths.dev.vendor+'bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',
    paths.dev.vendor+'fancybox/source/jquery.fancybox.js',
    paths.dev.vendor+'fancybox/source/helpers/jquery.fancybox-thumbs.js',
    paths.dev.vendor+'bootstrap-responsive-tabs/js/responsive-tabs.js',
    paths.dev.vendor+'bootstrap-toggle/js/bootstrap-toggle.js',
    paths.dev.vendor+'jquery-serialize-object/jquery.serialize-object.js',
    paths.dev.vendor+'bootbox/bootbox.js',
    paths.dev.vendor+'intercom.js/intercom.js',
    //paths.dev.vendor+'bootstrap-switch/dist/js/bootstrap-switch.js',
    paths.dev.vendor+'sg-laravel-array-helpers/laravel_helpers.js',
    paths.dev.vendor+'sg-laravel-array-helpers/spacegazebo_helpers.js',
    paths.dev.js+'library/Array.unique.js',
    paths.dev.js+'library/findModel.js',
    paths.dev.js+'library/Function.bind.js',
    paths.dev.js+'library/isEmpty.js',
    paths.dev.js+'library/isInt.js',
    paths.dev.js+'library/IE.CustomEvent.js',
    paths.dev.js+'library/jQuery.exists.js',
    paths.dev.js+'library/jQuery.getCursorPosition.js',
    paths.dev.js+'library/jQuery.getModel.js',
    paths.dev.js+'library/jQuery.outerHTML.js',
    paths.dev.js+'library/Object.keys.js',
    paths.dev.js+'library/objectMerge.js',
    paths.dev.js+'library/phpjs.money_format.js',
    paths.dev.js+'library/phpjs.setlocale.js',
    paths.dev.js+'library/String.replaceAll.js',
    paths.dev.js+'library/String.startsWith.js',
    paths.dev.js+'MessageBag.js',
    paths.dev.js+'alert.js',
    paths.dev.js+'localstorage.js',
    paths.dev.js+'selectall.js',
  ]);
  return gulp.src(jsf)
    .pipe(replace('glyphicon-ok','fa-check'))
    .pipe(replace('glyphicon-remove','fa-times'))
    .pipe(replace('glyphicon-time','fa-clock-o'))
    .pipe(replace('glyphicon','fa'))
    .pipe(concat(result_name))
    .pipe(gulp.dest(paths.production.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.js));
}
gulp.task('editme-js', function(){
  return gulp.src([
      paths.dev.vendor+'/x-editable/dist/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2.js',
      paths.dev.vendor+'/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.js',

      paths.dev.vendor+'/select2/select2.js',

      paths.dev.vendor+'/x-editable/dist/inputs-ext/typeaheadjs/lib/typeahead.js',
    ])
    //convert bootstrap 2 glyphicons
    .pipe(replace('icon-font','fa fa-font'))
    .pipe(replace('icon-list','fa fa-list'))
    .pipe(replace('icon-th-list','fa fa-th-list'))
    .pipe(replace('icon-indent-left','fa fa-indent'))
    .pipe(replace('icon-indent-right','fa fa-outdent'))
    .pipe(replace('icon-share','fa fa-share-o'))
    .pipe(replace('icon-picture','fa fa-picture-o'))
    .pipe(replace('icon-pencil','fa fa-pencil'))
    .pipe(replace('icon-arrow-right','fa fa-arrow-right'))
    .pipe(replace('icon-arrow-left','fa fa-arrow-left'))
    .pipe(replace('icon-arrow-up','fa fa-up'))
    .pipe(replace('icon-arrow-down','fa fa-down'))
    .pipe(replace('icon-th','fa fa-th'))
    .pipe(replace('glyphicon-ok','fa-check'))
    .pipe(replace('glyphicon-remove','fa-times'))
    .pipe(replace('glyphicon-time','fa-clock-o'))
    .pipe(replace('glyphicon','fa'))
    .pipe(concat('editme.js'))
    .pipe(gulp.dest(paths.production.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.js));
});

gulp.task('app-js', function(){
  return gulp.src([
    paths.dev.js+'/BaseModel.js',
    paths.dev.js+'/Collection.js',
    paths.dev.js+'/BidderRequest.js',
    paths.dev.js+'/Item.js',
    paths.dev.js+'/Notification.js',
    paths.dev.js+'/Catalog.js',
    paths.dev.js+'/Listing.js',
    paths.dev.js+'/notification_manager.js',
    paths.dev.js+'/polling_engine.js',
    paths.dev.js+'/User.js',
    paths.dev.js+'/Bid.js',
    paths.dev.js+'/login.js',
    paths.dev.js+'/main.js'
  ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.production.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.js));
});
gulp.task('auctioneer-js', function(){
  return gulp.src([
    paths.dev.js+'/auctioneer/BaseModel.js',
    paths.dev.js+'/auctioneer/Catalog.js',
    paths.dev.js+'/auctioneer/custom-attributes.js',
  ])
    .pipe(concat('auctioneer.js'))
    .pipe(gulp.dest(paths.production.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.js));
});
gulp.task('autosave-js', function(){
  return gulp.src([
    paths.dev.js+'/autosave.js',
  ])
    .pipe(concat('autosave.js'))
    .pipe(gulp.dest(paths.production.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.js));
});
gulp.task('custom-attr-js', function(){
  return gulp.src([
    paths.dev.js+'/auctioneer/custom-attributes.js',
  ])
    .pipe(concat('custom-attributes.js'))
    .pipe(gulp.dest(paths.production.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.js));
});
gulp.task('collection-js', function(){
  /**
   *  minifies at 45kb, not worth using.
   */
  return gulp.src([
    paths.dev.vendor+'/collectionjs/Collection.js'
  ])
    .pipe(concat('collection.js'))
    .pipe(gulp.dest(paths.production.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.js));
});


gulp.task('editme-css', function() {
  var bsWysiwygStream = gulp.src([
      paths.dev.vendor+'/x-editable/dist/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2.css',
    ])
    ;
  var xEditableStream = gulp.src([
      paths.dev.vendor+'/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css',
    ])
    .pipe(replace("url('../img/","url('../img/x-editable/"))
    ;
  var select2Stream = gulp.src([
      paths.dev.vendor+'/select2/select2.css',// this have image dependancies
      paths.dev.vendor+'/bootstrap-select2/select2-bootstrap.css',// there is a LESS version of this
    ])
    .pipe(replace("url('select2","url('../img/select2/select2"))
    ;
  var typeAheadJsStream = gulp.src([
      paths.dev.vendor+'/x-editable/dist/inputs-ext/typeaheadjs/lib/typeahead.js-bootstrap.css',
    ])
    ;
    
  return es.merge(bsWysiwygStream,xEditableStream,select2Stream,typeAheadJsStream)
    .pipe(concat('editme.css'))
    .pipe(gulp.dest(paths.production.css))
    .pipe(minify({keepSpecialComments:0}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.css));
});
/*
// PHP Unit
gulp.task('phpunit', function() {
  var options = {debug: false, notify: true};
  return gulp.src('./tests/*.php')
    .pipe(phpunit('./vendor/bin/phpunit', options))

    .on('error', notify.onError({
      title: 'PHPUnit Failed',
      message: 'One or more tests failed.'
    }))

    .pipe(notify({
      title: 'PHPUnit Passed',
      message: 'All tests passed!'
    }));
});
*/

gulp.task('icons', function() { 
    return gulp.src(paths.dev.vendor + '/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./public/assets/fonts')); 
});
gulp.task('bs-colorpicker', function() { 
    return gulp.src([
      paths.dev.vendor + '/mjolnix-bootstrap-colorpicker/dist/**/**.*',
    ]) 
    .pipe(gulp.dest('./public/libs/bs-colorpicker')); 
});
gulp.task('tinymce', function() { 
    return gulp.src([
      paths.dev.vendor + '/tinymce/**/**.*',
    ]) 
    .pipe(gulp.dest('./public/libs/tinymce')); 
});
gulp.task('bs-switch', function() { 
    return gulp.src([
      paths.dev.vendor + '/bootstrap-switch/dist/**/**.*',
    ]) 
    .pipe(gulp.dest('./public/libs/bootstrap-switch')); 
});
gulp.task('fancybox-img', function() { 
  return gulp.src([
    paths.dev.vendor + '/fancybox/source/**.gif',
    paths.dev.vendor + '/fancybox/source/**.png',
    paths.dev.vendor + '/fancybox/source/**.jpg'
    ]) 
    .pipe(gulp.dest('./public/assets/img/fancybox')); 
  });
gulp.task('gritter-img', function() { 
  return gulp.src([
    paths.dev.vendor + '/jquery.gritter/images/**.gif',
    paths.dev.vendor + '/jquery.gritter/images/**.png',
    paths.dev.vendor + '/jquery.gritter/images/**.jpg'
    ]) 
    .pipe(gulp.dest('./public/assets/img/gritter')); 
});
gulp.task('select2-img', function() { 
  return gulp.src([
    paths.dev.vendor + '/select2/**.gif',
    paths.dev.vendor + '/select2/**.png',
    paths.dev.vendor + '/select2/**.jpg'
    ]) 
    .pipe(gulp.dest('./public/assets/img/select2')); 
});
gulp.task('x-editable-img', function() { 
  return gulp.src([
    paths.dev.vendor + '/x-editable/dist/bootstrap3-editable/img/**.gif',
    paths.dev.vendor + '/x-editable/dist/bootstrap3-editable/img/**.png',
    paths.dev.vendor + '/x-editable/dist/bootstrap3-editable/img/**.jpg'
    ]) 
    .pipe(gulp.dest('./public/assets/img/x-editable')); 
});

gulp.task('watch', function() {
  gulp.watch(paths.dev.less + '/*.less', ['app-css']);
  gulp.watch(paths.dev.js + '/*.js', ['app-js','vendor-js','autosave-js']);
  gulp.watch(paths.dev.js + '/library/*.js', ['vendor-js','app-js']);
  gulp.watch(paths.dev.js + '/auctioneer/*.js', ['auctioneer-js','custom-attr-js']);
  gulp.watch('./tests/*.php', ['phpunit']);
});

gulp.task('default', [
  'vendor-css',
  'vendor-js',
  'vendor-js-ie8',
  'app-css',
  'app-js',
  'auctioneer-js',
  'autosave-js',
  'custom-attr-js',
  //'collection-js',
  //'bs-switch',
  'icons',
  'editme-js',
  'editme-css',
  'fancybox-img',
  'gritter-img',
  'x-editable-img',
  'select2-img',
  //'phpunit',
  'bs-colorpicker',
  'tinymce',
  'watch'
]);
