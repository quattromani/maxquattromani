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
