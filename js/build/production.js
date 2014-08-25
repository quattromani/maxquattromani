var smallBreakPoint = 640;
var mediumBreakPoint = 768;

/* ==========================================================================
    Prototype Tools -- Version: 1.9.0.2 - Updated: 1/20/2014
   ========================================================================== */

// For DEMO site only - DO NOT EVER INGEST THESE !!
window.onload = getPageLoadTime;

// Calculate the viewport size on prototype site
$(window).resize(function() {
    $('.viewport').empty().append($(window).width(), "x", $(window).height());
}).resize();

//calculate the time before calling the function in window.onload
var beforeload = (new Date()).getTime();

function getPageLoadTime() {
    //calculate the current time in afterload
    var afterload = (new Date()).getTime();
    // now use the beforeload and afterload to calculate the seconds
    var seconds = (afterload - beforeload) / 1000;
    // Place the seconds in the innerHTML to show the results
    $('.loadtime').text( + seconds + ' sec');
}
/* ==========================================================================
    Styleguide -- Version: 0.4.1 - Updated: 2/22/2014
    ========================================================================== */

// Create Hex color code from color return
function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    color = '#' + parts.join('');
}

// Get color value of swatch and print to div
var color = '';
$('.swatch').each(function() {
    var classList = $(this).children('.swatch-color').attr('class').split(' ');
    for(i=0; i <= classList.length-1; i++){
     if(classList[i].match(/color-/g)){
         $(this).children('.swatch-info').prepend('<p>$' + classList[i] + '</p>');
         break;
     }
 }
 var x = $(this).children('.swatch-color').css('backgroundColor');
 hexc(x);
 $(this).children('.swatch-info').append('<p>' + color + '</p>');
 $(this).children('.swatch-info').append('<p>' + x + '</p>');
});

(function($) {

    $.fn.vs = function() {
        // View source buttons
        $('.vs').click(function(){
            $(this).parent().next().find('.prettyprint').toggle();
            $(this).not('.disabled').toggleClass('js-active');
            return false;
        });
    }

}(jQuery));

$('.vs').vs();

// Get font-family property and return
$('.fonts').each(function(){
    var fonts = $(this).css('font-family');
    $(this).prepend(fonts);
});

(function($) {

	$.fn.jumpTo = function() {
		$('<option value="">Jump to…</option>').appendTo('#anchor');
		$('.jumpTo-anchor').each(function(index){
			$('<option value="'+$(this).attr('id')+'">'+$(this).text()+'</option>').appendTo('#anchor');
		});

		$('#anchor').change(function(){
			var divPosition = $('#'+$(this).val()).offset();
			$('html, body').animate({scrollTop: divPosition.top}, "slow");
		});
	}

}(jQuery));

$('.jumpTo').jumpTo();
/* ==========================================================================
    Main -- Version: 0.4.0 - Updated: 2/20/2014
    ========================================================================== */

// Add classes to first and last li's for every instance
$(function() {
  // Add classes to first and last of each list
  $('li:first-child').addClass('js-first');
  $('li:last-child').addClass('js-last');
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

/* ==========================================================================
    Modal -- Version: 1.9.0.0 - Updated: 4/28/2014
    ========================================================================== */

    $(function(){

    	var index = $('.modal').index();

    	$(".modal").each(function(i) {
    		var total = $(".modal").size() - 1;

    		if (i != total) {
    			next = i + 2;
    			$(this).find('.modal-footer').append("<a href='#' class='btn btn-primary right mobile-full modal-next' rel='" + next + "'>Next</a>");
    		}

    		if (i != 0) {
    			prev = i;
    			$(this).find('.modal-footer').append("<a href='#' class='btn btn-primary left mobile-full modal-prev' rel='" + prev + "'>Previous</a>");
    		}
    	});

    	$('.modal-button').click(function() {
    		var modal = $(this).attr('id');
    		loadPopup(modal);
    		return false;
    	});

    	$('.modal-next').click(function() {
    		var modal = $(this).attr('next');
    		var currModal = modal - 1;
    		loadPopup(modal, currModal);
    		return false;
    	});

    	$('.modal-prev').click(function() {
    		var modal = $(this).attr('prev');
    		var currModal = modal - 1 + 2;
    		loadPopup(modal, currModal);
    		return false;
    	});

			// event for close the popup
			$('.modal-close').click(function() {
				disablePopup();
				return false;
			});

			$(this).keyup(function(event) {
				if (event.which === 27) {
					disablePopup();
				}
			});

			$('.modal-overlay').click(function() {
				disablePopup();
				return false;
			});
		});

		function loadPopup(modal, currModal) {
			$('#modal' + currModal).css({
				'display': 'none'
			});
			$('#modal' + modal).css({
				'margin-top': -$('#modal' + modal).height() / 2,
				'display': 'block'
			});
			$('.modal-next').attr('next', modal - 1 + 2);
			$('.modal-prev').attr('prev', modal - 1);
			$('#modal' + modal).fadeIn(0500);
			$('.modal-overlay').fadeIn('normal');
		}

		function disablePopup() {
			$('.modal-container').fadeOut('normal');
			$('.modal-overlay').fadeOut('normal');
		}

/* ==========================================================================
    Nav -- Version: 0.4.0 - Updated: 8/18/2014
    ========================================================================== */

  $(function() {

    var header = $('header')
    , header_height = header.outerHeight()
    , nav = $('nav')
    , nav_height = nav.outerHeight();

  // Scroll to anchored link in Nav
  $('nav a').click(function(){
    // Active Nav links
    $('nav a').parent('li').removeClass('active');
    $(this).parent('li').addClass('active');
    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top +1
    }, 500);
    return false;
  });

  if ($(window).scrollTop() >= (header_height - nav_height)) {
    $('nav').addClass('fixed');
    $('nav').css('margin-top','0');
  }

  // Make the Nav sticky
  $(window).bind('scroll', function () {
    if ($(window).scrollTop() >= (header_height - nav_height)) {
      $('nav').addClass('fixed');
      $('nav').css('margin-top','0');
    } else {
      $('nav').removeClass('fixed');
      $('nav').css('margin-top', '-49px');
    }
  });
});
