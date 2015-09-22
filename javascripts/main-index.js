$(document).ready(function(){
	var $kvSlider       = $('.key-visual'),
		$btnLoginNormal = $('.btn-login-normal'),
		$switchArea     = $('.switch-area');

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

	$btnLoginNormal.on('click', function(){
		var $this       = $(this),
			_ss_numbers = $this.siblings('.ss-numbers').val(),
			_user_id    = $this.siblings('.user-id').val();

		if (navigator.userAgent.indexOf('MSIE 8.0') > 0) {
			var _ss_numbers_hint = $this.siblings('.ss-numbers').attr('placeholder'),
				_user_id_hint    = $this.siblings('.user-id').attr('placeholder');

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
});