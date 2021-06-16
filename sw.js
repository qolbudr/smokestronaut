importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = "TeachKid";

workbox.core.setCacheNameDetails({
    prefix: CACHE_NAME,
    // suffix: "v1",
    precache: "cache",
    runtime: "cache",
})

workbox.precaching.precacheAndRoute([
    {url: "assets/css/bootstrap.min.css", revision: null},
    {url: "assets/css/fontawesome-all.css", revision: null},
    {url: "assets/css/main.css", revision: null},
    {url: "assets/css/owl.carousel.min.css", revision: null},
    {url: "assets/css/owl.theme.default.min.css", revision: null},
    {url: "assets/js/bootstrap.min.js", revision: null},
    {url: "assets/js/db.js", revision: null},
    {url: "assets/js/index.js", revision: null},
    {url: "assets/js/jquery-3.2.1.slim.min.js", revision: null},
    {url: "assets/js/owl.carousel.min.js", revision: null},
    {url: "assets/js/popper.min.js", revision: null},
    {url: "assets/js/script.js", revision: null},
    {url: "assets/js/typed.js", revision: null},
    {url: "assets/js/sweetalert.min.js", revision: null},
    {url: "assets/img/family.jpg", revision: null},
    {url: "assets/img/money.jpg", revision: null},
    {url: "assets/img/refuse.jpg", revision: null},
    {url: "assets/img/rokok.png", revision: null},
    {url: "assets/img/success.jpg", revision: null},
    {url: "assets/img/survey.png", revision: null}, 
    {url: "assets/page/about.html", revision: null},
    {url: "assets/page/assesment.html", revision: null},
    {url: "assets/page/daily.html", revision: null},
    {url: "assets/page/home.html", revision: null},
    {url: "assets/page/survey.html", revision: null},
    {url: "assets/page/tips.html", revision: null},
    {url: "index.html", revision: null},
    {url: "sw.js", revision: null},
]);