var gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), //Подключаем Sass пакет
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS) 
    cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'), // Подключаем библиотеку для переименования файлов  
	del         = require('del'), // Подключаем библиотеку для удаления файлов и папок 
    imagemin    = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant    = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png	
    cache       = require('gulp-cache'); // Подключаем библиотеку кеширования  
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов             

/* тут начинаются таски */
	/* task для сбора sass файлов в css */
	gulp.task('sass', function(){ // Создаем таск "sass"
	    return gulp.src([
	    	'src/sass/**/*.sass'
	    	//'node_modules/normalize-scss/sass/normalize/_normalize.scss'
	    	]) // Берем все sass файлы из папки sass и дочерних, если таковые будут
	        .pipe(sass({
	        	includePaths: require('node-normalize-scss').includePaths
	        })) // Преобразуем Sass в CSS посредством gulp-sass
        	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы	        
	        .pipe(gulp.dest('src/css')) // Выгружаем результата в папку build/css
	        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
	});
	/* включаем sync */
	gulp.task('browser-sync', function() { // Создаем таск browser-sync
	    browserSync({ // Выполняем browserSync
	        server: { // Определяем параметры сервера
	            baseDir: 'src' // Директория для сервера - src
	        },
	        //tunnel: true,
	        notify: false // Отключаем уведомления
	    });
	});
	/* обработка html, js */
	gulp.task('scripts', function() {
	    return gulp.src(['src/js/common.js', 'src/libs/**/*.js'])
	    .pipe(browserSync.reload({ stream: true }))
	});
	gulp.task('code', function() {
	    return gulp.src('src/*.html')
	    .pipe(browserSync.reload({ stream: true }))
	});
	/* сборка и сжатие библиотек и js */
	gulp.task('all-scripts', function() {
	    return gulp.src([ // Берем все необходимые библиотеки из libs
	        'src/libs/jquery/dist/jquery.js', // Берем jQuery
	        'src/libs/bootstrap-4.3.1-dist/js/bootstrap.js'
	        ])
	        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
	        .pipe(uglify()) // Сжимаем JS файл
	        .pipe(gulp.dest('src/js')); // Выгружаем в папку src/js
	});
	/* минификации CSS библиотек */
	gulp.task('css-libs', function() {
	    return gulp.src([
	    	//'src/libs/normalize.css',
	    	'src/css/libs.css', // Выбираем файл для минификации
	    	'src/libs/bootstrap-4.3.1-dist/css/bootstrap.css'
	    	]) 
	    	.pipe(concat('libs.css'))
	        .pipe(cssnano()) // Сжимаем
	        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
	        .pipe(gulp.dest('src/css')); // Выгружаем в папку src/css
	});

	/* очистка dist перед выгрузкой в продакшен */
	gulp.task('clean', async function() {
	    return del.sync('dist'); // Удаляем папку dist перед сборкой
	});
	/* оптимизируем изображения */
	gulp.task('img', function() {
	    return gulp.src('src/img/**/*') // Берем все изображения из src
	        .pipe(cache(imagemin({ // С кешированием
	        // .pipe(imagemin({ // Сжимаем изображения без кеширования
	            interlaced: true,
	            progressive: true,
	            svgoPlugins: [{removeViewBox: false}],
	            use: [pngquant()]
	        }))/**/)
	        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
	});
	/* в продакшен */
	gulp.task('prebuild', async function() {

	    var buildCss = gulp.src([ // Переносим CSS стили в продакшен
	        'src/css/main.css',
	        'src/css/libs.min.css'
	        ])
	    .pipe(gulp.dest('dist/css'))

	    var buildFonts = gulp.src('src/fonts/**/*') // Переносим шрифты в продакшен
	    .pipe(gulp.dest('dist/fonts'))

	    var buildJs = gulp.src('src/js/**/*') // Переносим скрипты в продакшен
	    .pipe(gulp.dest('dist/js'))

	    var buildHtml = gulp.src('src/*.html') // Переносим HTML в продакшен
	    .pipe(gulp.dest('dist'));

	});
	/* очистка кэш Gulp */
	gulp.task('clear', function (callback) {
	    return cache.clearAll();
	})
	/* watch'er */
	gulp.task('watch', function() {
	    gulp.watch('src/sass/**/*.sass', gulp.parallel('sass')); // Наблюдение за sass файлами
	    gulp.watch('src/*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
	    gulp.watch(['src/js/common.js', 'src/libs/**/*.js'], gulp.parallel('scripts')); // Наблюдение за главным JS файлом и за библиотеками
	});
	                                                   /* 'all-scripts', */           
gulp.task('default', gulp.parallel('css-libs', 'sass', 'all-scripts', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass', 'all-scripts'));