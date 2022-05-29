let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss/app.scss', 'public/css/app.css')

// setPublicPath('dist');


// mix.js('src/app.js', 'dist')
//    .sass('src/app.scss', 'dist')
//    .setPublicPath('dist');
mix.babelConfig({
    "plugins": ["@babel/plugin-proposal-class-properties"]
});