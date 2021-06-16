function setNav(page) {
    switch(page) {
        case "home":
        $(".nav-icon .fa").addClass("outline");
        $(".fa-home").removeClass("outline");
        break;

        case "quiz":
        $(".nav-icon .fa").addClass("outline");
        $(".fa-graduation-cap").removeClass("outline");
        break;

        case "games":
        $(".nav-icon .fa").addClass("outline");
        $(".fa-gamepad").removeClass("outline");
        break;

        case "about":
        $(".nav-icon .fa").addClass("outline");
        $(".fa-question-circle").removeClass("outline");
        break;

        default:
        $(".nav-icon .fa").addClass("outline");
        $(".fa-home").removeClass("outline");
    }
}

function loadHome() {
    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:20,
        dots:false,
        responsive:{
            0:{
                items:2
            },
            600:{
                items:3
            },
            1000:{
                items:3
            }
        }
    })

    setNav("home");
}

function loadQuiz() {
    $(".back").on("click", function() {
        window.history.back();
    })
    setNav("quiz");
}

function loadGames() {
    $(".back").on("click", function() {
        window.history.back();
    })
    setNav("games") 
}

function loadAbout() {
    $(".back").on("click", function() {
        window.history.back();
    })
    setNav("about") 
}

export {loadHome, loadQuiz, loadGames, loadAbout, setNav};