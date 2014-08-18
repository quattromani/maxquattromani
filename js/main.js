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
    // Active Nav links
    $('nav a').parent('li').removeClass('active');
    $(this).parent('li').addClass('active');
    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
    return false;
  });

  // Make the Nav sticky
  var num = 540; //number of pixels before modifying styles

  $(window).bind('scroll', function () {
    if ($(window).scrollTop() > num) {
      $('nav').addClass('fixed');
      $('nav').css('margin-top','0');
    } else {
      $('nav').removeClass('fixed');
      $('nav').css('margin-top','-61px');
    }
  });

  var aChildren = $('nav li').children(); // find the a children of the list items
  var aArray = []; // create the empty aArray
  for (var i=0; i < aChildren.length; i++) {
    var aChild = aChildren[i];
    var ahref = $(aChild).attr('href');
    aArray.push(ahref);
  } // this for loop fills the aArray with attribute href values

    $(window).scroll(function(){
      var windowPos = $(window).scrollTop(); // get the offset of the window from the top of page
      var windowHeight = $(window).height(); // get the height of the window
      var docHeight = $(document).height();

      for (var i=0; i < aArray.length; i++) {
        var theID = aArray[i];
        var divPos = $(theID).offset().top; // get the offset of the div from the top of page
        var divHeight = $(theID).height(); // get the height of the div in question
        if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
          $("a[href='" + theID + "']").parent('li').addClass("active");
        } else {
          $("a[href='" + theID + "']").parent('li').removeClass("active");
        }
      }

      if(windowPos + windowHeight == docHeight) {
        if (!$("nav li:last-child").hasClass("active")) {
          var navActiveCurrent = $(".active").attr("href");
          $("a[href='" + navActiveCurrent + "']").parent('li').removeClass("active");
          $("nav li:last-child").parent('li').addClass("active");
        }
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