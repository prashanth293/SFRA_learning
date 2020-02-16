'use strict';

module.exports = function () {
	$('.notify-me-btn').on('click', function() {
		 var isauthenticated = $(this).data('authenticated');
		 var notifyMeUrl = $(this).data('url');
		 if (!isauthenticated) {
			 $(this).addClass('d-none');
			 $('.oos-notify-me').removeClass('d-none');
		 } else {
			 $.ajax({
                 url: notifyMeUrl,
                 type: 'POST',
                 success: function(data) {
                	 if (data.success && data.success === true) {
    					 $('.email-success').removeClass('d-none');
    				 }
                 }
             });
		 }
	});
	
	$('form.oos-notify-me').on('submit', function(e) {
		e.preventDefault();
		var form = $(this);
		var notifyMeUrl = form.data('url') + '?' + form.serialize();
		$.ajax({
			url: notifyMeUrl,
			type: 'POST',
			success: function (data) {
				 if (data.success && data.success === true) {
					 $('.email-success').removeClass('d-none');
				 }
			}
		});
		return false;
	});
};