$(document).ready(function(){
	var $kvSlider = $('.key-visual');

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
});