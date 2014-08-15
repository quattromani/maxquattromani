/* ==========================================================================
    Main -- Version: 0.4.0 - Updated: 2/20/2014
    ========================================================================== */

// Add classes to first and last li's for every instance
$(function() {
  // Add classes to first and last of each list
  $('li:first-child').addClass('js-first');
  $('li:last-child').addClass('js-last');

  // Scroll to anchored link in Nav
  $('nav a').click(function(){
    $('html, body').animate({
      scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
    return false;
  });

  // Make the Nav sticky
  var num = 200; //number of pixels before modifying styles

  $(window).bind('scroll', function () {
    if ($(window).scrollTop() > num) {
      $('nav').addClass('fixed');
    } else {
      $('nav').removeClass('fixed');
    }
  });
});

// Set year
(function($) {

  $.fn.getYear = function() {
    var d = new Date();
    var x = document.getElementById("year");
    x.innerHTML=d.getFullYear();
  }

}(jQuery));

$('.getYear').getYear();
