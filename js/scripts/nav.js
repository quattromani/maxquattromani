// Make room for the fixed header
headerHeight = $('header[role=banner]').outerHeight();
navHeight = $('nav[role=navigation]').outerHeight();

$(function() {
  $(".open-panel").click(function(){
    if($('html').hasClass('open-nav')) {
      $('html').removeClass('open-nav');
    } else {
      $('html').addClass('open-nav');
      $('.wrap').css('margin-top', 0);
    }
    $(this).toggleClass('active');
  });
});

$(window).on("resize", function () {
  if ($(window).width() > mediumBreakPoint) {
    $('.banner').css('margin-top', headerHeight);
  } else {
    $('.banner').css('margin-top', headerHeight);
  }
}).resize();

