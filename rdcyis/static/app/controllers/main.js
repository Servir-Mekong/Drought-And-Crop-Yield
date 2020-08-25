
!(function($) {
  "use strict";

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Stick the header at top on scroll
  $("#header").sticky({
    topSpacing: 0,
    zIndex: '9999'
  });

  // Smooth scroll for the navigation menu and links with .scrollto classes
  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      e.preventDefault();
      var target = $(this.hash);
      if (target.length) {

        var scrollto = target.offset().top;
        var scrolled = 2;

        if ($('#header-sticky-wrapper').length) {
          scrollto -= $('#header-sticky-wrapper').outerHeight() - scrolled;
        }

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 3500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 10;

    nav_sections.each(function() {
      var top = $(this).offset().top - main_nav_height,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
    });
  });

  // Intro carousel
  var heroCarousel = $("#heroCarousel");
  var heroCarouselIndicators = $("#hero-carousel-indicators");
  heroCarousel.find(".carousel-inner").children(".carousel-item").each(function(index) {
    (index === 0) ?
    heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "' class='active'></li>"):
      heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "'></li>");
  });

  heroCarousel.on('slid.bs.carousel', function(e) {
    $(this).find('h2').addClass('animated fadeInDown');
    $(this).find('p').addClass('animated fadeInUp');
    $(this).find('.btn-get-started').addClass('animated fadeInUp');
  });

  //library Navigation
  $("#li-code").click(function(){
    window.location.href = "/library/code";
  });

  $("#li-publication").click(function(){
    window.location.href = "/library/publication";
  });

  $("#li-events").click(function(){
    window.location.href = "/library/events";
  });

  //about Navigation
  $("#li-about1").click(function(){
    $("#about-1").show();
    $("#about-2").hide();
    $("#about-3").hide();
    $("#about-4").hide();
    $("#about-5").hide();
    $(this).addClass("active");
    $("#li-about2").removeClass("active");
    $("#li-about3").removeClass("active");
    $("#li-about4").removeClass("active");
    $("#li-about5").removeClass("active");
  });
  $("#li-about2").click(function(){
    $("#about-2").show();
    $("#about-1").hide();
    $("#about-3").hide();
    $("#about-4").hide();
    $("#about-5").hide();
    $(this).addClass("active");
    $("#li-about1").removeClass("active");
    $("#li-about3").removeClass("active");
    $("#li-about4").removeClass("active");
    $("#li-about5").removeClass("active");
  });
  $("#li-about3").click(function(){
    $("#about-3").show();
    $("#about-2").hide();
    $("#about-1").hide();
    $("#about-4").hide();
    $("#about-5").hide();
    $(this).addClass("active");
    $("#li-about1").removeClass("active");
    $("#li-about2").removeClass("active");
    $("#li-about4").removeClass("active");
    $("#li-about5").removeClass("active");
  });
  $("#li-about4").click(function(){
    $("#about-4").show();
    $("#about-2").hide();
    $("#about-1").hide();
    $("#about-3").hide();
    $("#about-5").hide();
    $(this).addClass("active");
    $("#li-about1").removeClass("active");
    $("#li-about2").removeClass("active");
    $("#li-about3").removeClass("active");
    $("#li-about5").removeClass("active");
  });
  $("#li-about5").click(function(){
    $("#about-5").show();
    $("#about-2").hide();
    $("#about-1").hide();
    $("#about-3").hide();
    $("#about-4").hide();
    $(this).addClass("active");
    $("#li-about1").removeClass("active");
    $("#li-about2").removeClass("active");
    $("#li-about3").removeClass("active");
    $("#li-about4").removeClass("active");
  });

  $('#blog-flters li').on('click', function() {
    $("#blog-flters li").removeClass('filter-active');
    $(this).addClass('filter-active');
    var blogIsotope = $('.blog-container').isotope({
      itemSelector: '.blog-item',
      layoutMode: 'fitRows'
    });

    blogIsotope.isotope({
      filter: $(this).data('filter')
    });
  });

  $("#grid-publication").click(function(){

    window.location.href = "/library";
    setTimeout(function() {
       //MyCode To Run After PageLoad
       alert();
    }, 1000);

  });


  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the venobox plugin
  $(window).on('load', function() {
    $('.venobox').venobox();
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Porfolio isotope and filter
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

    // Initiate venobox (lightbox feature used in portofilo)
    $(document).ready(function() {
      $('.venobox').venobox();
      // $("#li-code").click();
      $("#li-about1").click();
    });
  });

  // Initi AOS
  AOS.init({
    duration: 1000,
    easing: "ease-in-out-back"
  });


  $("#table-status").on('change', function(){
    //$('#tensor-table').DataTable().destroy();
    if($(this).val() === "1"){
      $('#tensor-table').dataTable({
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": true,
        "bInfo": false,
        "bAutoWidth": false,

      });
    }

  });




})(jQuery);
