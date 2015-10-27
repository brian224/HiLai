$(document).ready(function(){
	var $kvSlider       = $('.key-visual'),
		$btnLoginNormal = $('.btn-login-normal'),
		$switchArea     = $('.switch-area'),
		$label          = $('.label');

	$kvSlider.owlCarousel({
		items              : 1,
		navText            : ['', ''],
		loop               : true,
		dots               : true,
		autoplay           : true,
		autoplayTimeout    : 3500,
		autoplayHoverPause : true,
		animateOut         : 'fadeOut',
		animateIn          : 'fadeIn'
	});

	$label.on('focusin', function(){
		$(this).find('.comment-box').addClass('show');
	});

	$label.on('focusout', function(){
		$(this).find('.comment-box').removeClass('show');
	});

	$btnLoginNormal.on('click', function(){
		var $this       = $(this),
			_ss_numbers = $this.siblings('.label').find('.ss-numbers').val(),
			_user_id    = $this.siblings('.label').find('.user-id').val();

		if (navigator.userAgent.indexOf('MSIE 8.0') > 0) {
			var _ss_numbers_hint = $this.siblings('.label').find('.ss-numbers').attr('placeholder'),
				_user_id_hint    = $this.siblings('.label').find('.user-id').attr('placeholder');

			if (_ss_numbers !== _ss_numbers_hint && _user_id !== _user_id_hint) {
				$switchArea.addClass('next-step');
			} else if (_ss_numbers === _ss_numbers_hint) {
				alert('請填寫身分證字號');
			} else if (_user_id === _user_id_hint) {
				alert('請填寫使用者代號');
			}
		} else if (_ss_numbers === '') {
			alert('請填寫身分證字號');
		} else if (_user_id === '') {
			alert('請填寫使用者代號');
		} else if (_ss_numbers !== '' && _user_id !== '') {
			$switchArea.addClass('next-step');
		}
	});

	$('.fancybox').fancybox({
		width : 850
	});

	$('.fancybox-navQuery').fancybox({
		width      : 1000,
		minHeight  : 640,
		fitToView  : true,
		autoResize : true
	});
});