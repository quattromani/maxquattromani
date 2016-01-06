$('a').each(function() {
  var a = new RegExp('/' + window.location.host + '/');
  if(!a.test(this.href)) {
    $(this).click(function(event) {
      event.preventDefault();
      event.stopPropagation();
      window.open(this.href, '_blank');
    });
  }
});

var smallBreakPoint = 640;
var mediumBreakPoint = 768;

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

/* ==========================================================================
    Accordion -- Version: 1.9.0.0 - Updated: 12/31/2013
   ========================================================================== */

$('.accordion ul li').each(function() {
	if ($(this).has('ul').length) {
		$(this).addClass('js-expandable');
	} else {
		$(this).addClass('js-notexpandable');
	}
});

$('.accordion h6').click(function() {
	var categoryText = $(this).text();
	$(this).parent().addClass('js-active').find('ul').slideToggle(function() {
		if ($(this).is(':hidden')) {
			$(this).parent().removeClass('js-active');
		}
	});
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
    Modal -- Version: 1.9.0.0 - Updated: 4/28/2014
    ========================================================================== */

    $(function(){

    	var index = $('.modal').index();

    	$(".modal").each(function(i) {
    		var total = $(".modal").size() - 1;

    		if (i != total) {
    			next = i + 2;
    			$(this).find('.modal-footer').append("<a href='#' class='btn btn-primary right modal-next' rel='" + next + "'>Next</a>");
    		}

    		if (i != 0) {
    			prev = i;
    			$(this).find('.modal-footer').append("<a href='#' class='btn btn-primary left modal-prev' rel='" + prev + "'>Previous</a>");
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


// Make room for the fixed header
navHeight = $('nav').height();

$('a[href*=#]:not([href=#])').click(function() {

  var windowWidth = $("body").width();
  var offset = windowWidth > 1020 ? $('nav') : $('header[role=banner]');
  var offset_height = offset.outerHeight();

  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
    || location.hostname == this.hostname) {

    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
     if (target.length) {
       $('html,body').animate({
           scrollTop: target.offset().top - navHeight
      }, 1000);
      return false;
    }
  }
});

/* ==========================================================================
    Select with Link -- Version: 1.9.0.2 - Updated: 3/24/2014
   ========================================================================== */

(function($) {

  $.fn.selectLink = function() {
  	$('.selectLink').change(function(){
  		// Ignore null value -- shown at top of dropdown
  		if ($(this).val() != 'null'){
  			window.location.href = $(this).val();
  		}
  	});
  }

}(jQuery));

$('.selectLink').selectLink();
/* ==========================================================================
    Tabs to Accordion -- Version: 1.9.0.2 - Updated: 1/7/2013
   ========================================================================== */
$(function() {
    tabCount = 1;
    $('.tab-component').each(function(index){
        $(this).addClass('onState_'+tabCount);
        tabCount++;
    });

    buildAccordion();

    $(window).bind("load", function(){
        adjustContent();
    });

    $('[class*=onState_] .tabs li').click(function() {
        var selected_tab = $(this).find('a').attr('data-ref');
        var onState =  $(this).parent().parent().parent().attr('class');
        var className = onState.split(" ");
        var finalName = className.pop();

        $('.'+finalName+' .tabs li').removeClass('js-active');
        $(this).addClass('js-active');

        if ($(window).width() > mediumBreakPoint) {
            $('.'+finalName+' .tab-content').hide();
            $('.'+finalName+' '+selected_tab).show();
        } else {
            $('.'+finalName+' .tab-content').slideUp();
            $(this).next().slideDown();
        }

        return false;
    });

    $(window).resize(function() {
       adjustContent();
    });
});

function adjustContent() {
    if ($(window).width() < mediumBreakPoint) {
        $('[class*=onState_] .tabs ul').find('li.js-active').next('div').show();
    } else {
        $('.cloned').hide();
        $('[class*=onState_]').each(function(index){
            var onState =  $(this).attr('class');
            var className = onState.split(" ");
            var finalName = className.pop();
            var toShow = $('.'+finalName+' .js-active a').attr('data-ref');
            $('.'+finalName+' .tab-content-container').find(toShow).show();
        });
    }
}

function buildAccordion(){
    $('.tab-component .tabs ul li').each(function(){
        id = $(this).find('a').attr('data-ref');
        $(id).clone().removeAttr('id').addClass('cloned').insertAfter($(this)).hide();

        if ($(window).width() < mediumBreakPoint && $(this).hasClass('js-active')) {
            $(id).clone().removeAttr('id').addClass('cloned').insertAfter($(this)).show();
        }
    });
}
