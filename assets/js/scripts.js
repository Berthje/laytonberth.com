$(function () {
    "use strict";
    var wind = $(window);
    $.scrollIt({
        upKey: 38,                // key code to navigate to the next section
        downKey: 40,              // key code to navigate to the previous section
        easing: 'swing',          // the easing function for animation
        scrollTime: 600,          // how long (in ms) the animation takes
        activeClass: 'active',    // class given to the active nav element
        onPageChange: null,       // function(pageIndex) that is called when page is changed
        topOffset: -80            // offste (in px) for fixed top navigation
    });
    $(".setting-switch .switch-color li").on("click", function () {
        $(":root").css("--maincolor", $(this).data("color"));
        $(".setting-switch .switch-color li").removeClass("active")
        $(this).addClass("active");
    });
    $(".setting-switch .icon").on("click", function () {
        $(".setting-switch ").toggleClass("open");
    });
    $("main").on("click", function () {
        $(".setting-switch ").removeClass("open");
    });
    $('.navbar .dropdown').hover(function () {
        $(this).find('.dropdown-menu').addClass('show');
    }, function () {
        $(this).find('.dropdown-menu').removeClass('show')
    });
    $('.navbar .dropdown-item').hover(function () {
        $(this).find('.dropdown-side').addClass('show');
    }, function () {
        $(this).find('.dropdown-side').removeClass('show')
    });
    $(".navbar .search-form").on("click", ".search-icon", function () {
        $(".navbar .search-form").toggleClass("open");
        if ($(".navbar .search-form").hasClass('open')) {
            $(".search-form .close-search").slideDown();
        } else {
            $(".search-form .close-search").slideUp();
        }
    });
    $(".navbar").on("click", ".navbar-toggler", function () {
        $(".navbar .navbar-collapse").toggleClass("show");
    });
    wind.on("scroll", function () {
        var bodyScroll = wind.scrollTop(),
            navbar = $(".navbar"),
            logo = $(".navbar.change .logo> img");
        if (bodyScroll > 300) {
            navbar.addClass("nav-scroll");
            logo.attr('src', 'assets/imgs/logo-dark.png');
        } else {
            navbar.removeClass("nav-scroll");
            logo.attr('src', 'assets/imgs/logo-light.png');
        }
    });
    function noScroll() {
        window.scrollTo(0, 0);
    }
    var pageSection = $(".bg-img, section");
    pageSection.each(function (indx) {
        if ($(this).attr("data-background")) {
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });
    $('#tabs .tab-links').on('click', '.item-link', function () {
        var tab_id = $(this).attr('data-tab');
        $('#tabs .tab-links .item-link').removeClass('current');
        $(this).addClass('current');
        $('.tab-content').hide();
        $("#" + tab_id).show();
    });
    $('#tabs-fade .tab-links').on('click', '.item-link', function () {
        var tab2_id = $(this).attr('data-tab');
        $('#tabs-fade .tab-links .item-link').removeClass('current');
        $(this).addClass('current');
        $('.tab-content').fadeOut();
        $("#" + tab2_id).fadeIn();
    });
    $(".accordion").on("click", ".title", function () {
        $(this).next().slideDown();
        $(".accordion-info").not($(this).next()).slideUp();
    });
    $(".accordion").on("click", ".item", function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
    $('[data-tooltip-tit]').hover(function () {
        $('<div class="div-tooltip-tit"></div>').text($(this).attr('data-tooltip-tit')).appendTo('body').fadeIn('slow');
    }, function () {
        $('.div-tooltip-tit').remove();
    }).mousemove(function (e) {
        $('.div-tooltip-tit').css({ top: e.pageY + 10, left: e.pageX + 20 })
    });
    $('[data-tooltip-sub]').hover(function () {
        $('<div class="div-tooltip-sub"></div>').text($(this).attr('data-tooltip-sub')).appendTo('body').fadeIn('slow');
    }, function () {
        $('.div-tooltip-sub').remove();
    }).mousemove(function (e) {
        $('.div-tooltip-sub').css({ top: e.pageY + (-15), left: e.pageX + 30 })
    });
    wind.on('scroll', function () {
        $(".skill-progress .progres").each(function () {
            var bottom_of_object =
                $(this).offset().top + $(this).outerHeight();
            var bottom_of_window =
                $(window).scrollTop() + $(window).height();
            var myVal = $(this).attr('data-value');
            if (bottom_of_window > bottom_of_object) {
                $(this).css({
                    width: myVal
                });
            }
        });
    });
    /* ========== Sticky ========== */
    $("#sticky_item").stick_in_parent();
    $('.parallaxie').parallaxie({
        speed: 0.8,
        size: "cover"
    });
    $('.my-paroller').paroller();
    $(".hover3d").hover3d({
        selector: ".hover3d-child",
        invert: true
    });
    Splitting();
});
(function () {
    const link = document.querySelectorAll('.hover-this');
    const cursor = document.querySelector('.cursor');
    const animateit = function (e) {
        const hoverAnim = this.querySelector('.hover-anim');
        const { offsetX: x, offsetY: y } = e,
            { offsetWidth: width, offsetHeight: height } = this,
            move = 25,
            xMove = x / width * (move * 2) - move,
            yMove = y / height * (move * 2) - move;
        hoverAnim.style.transform = `translate(${xMove}px, ${yMove}px)`;
        if (e.type === 'mouseleave') hoverAnim.style.transform = '';
    };
    const editCursor = e => {
        const { clientX: x, clientY: y } = e;
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    };
    link.forEach(b => b.addEventListener('mousemove', animateit));
    link.forEach(b => b.addEventListener('mouseleave', animateit));
    window.addEventListener('mousemove', editCursor);
    $("a, .cursor-pointer").hover(
        function () {
            $(".cursor").addClass("cursor-active");
        }, function () {
            $(".cursor").removeClass("cursor-active");
        }
    );
    let elements = document.querySelectorAll(".rolling-text");
    elements.forEach((element) => {
        let innerText = element.innerText;
        element.innerHTML = "";
        let textContainer = document.createElement("div");
        textContainer.classList.add("block");
        for (let letter of innerText) {
            let span = document.createElement("span");
            span.innerText = letter.trim() === "" ? "\xa0" : letter;
            span.classList.add("letter");
            textContainer.appendChild(span);
        }
        element.appendChild(textContainer);
        element.appendChild(textContainer.cloneNode(true));
    });
    elements.forEach((element) => {
        element.addEventListener("mouseover", () => {
            element.classList.remove("play");
        });
    });
})();
$(document).ready(function () {
    "use strict";
    var progressPath = document.querySelector('.progress-wrap path');
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
    var updateProgress = function () {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var progress = pathLength - (scroll * pathLength / height);
        progressPath.style.strokeDashoffset = progress;
    }
    updateProgress();
    $(window).scroll(updateProgress);
    var offset = 150;
    var duration = 550;
    jQuery(window).on('scroll', function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.progress-wrap').addClass('active-progress');
        } else {
            jQuery('.progress-wrap').removeClass('active-progress');
        }
    });
    jQuery('.progress-wrap').on('click', function (event) {
        event.preventDefault();
        jQuery('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    });

    document.querySelector("#yearsofexperience").textContent = (new Date().getFullYear() - 2021) + " years";
});
$(function () {
    var width = $(window).width();
    if (width < 991) {
        "use strict";
        $(".navbar .navbar-nav").on("click", ".nav-link", function () {
            $(".navbar .navbar-nav .dropdown .dropdown-menu").removeClass("show");
            $(this).parent().find(".dropdown-menu").addClass("show");
        });
    }
});
