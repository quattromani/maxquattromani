/* ==========================================================================
    Progress Buttons -- Version: 0.2.1 - Updated: 5/14/2014
   ========================================================================== */

(function($) {

  $.fn.progressButton = function() {
    $('.progress').click(function() {
      $(this).attr("disabled", true);
      $(this).addClass('js-active');
    });
  }

}(jQuery));

$('.progress').progressButton();
