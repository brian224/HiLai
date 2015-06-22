$(document).ready(function(){
	var $quest            = $('.quest'),
		$mobileTitle      = $('.mobile-title'),
		$selecter         = $('.selecter'),
		$tabList          = $('.tab-list'),
		$switchContent    = $('.switch-content'),
		$sideTitle        = $('.side-title'),
		$accordionHeading = $('.accordion-heading');

	$quest.on('click', function(){
		$(this).parent().toggleClass('open').siblings().removeClass('open');
	});

	$tabList.on('click', function(){
		var _idx = $(this).index();

		$(this).addClass('curr').siblings().removeClass('curr');
		$switchContent.removeClass('curr').eq(_idx).addClass('curr');
	});

	$sideTitle.on('click', function(){
		var _winWidth = $(window).width();

		if (_winWidth < 980) {
			$(this).parent().toggleClass('open');
		}
	});

	$mobileTitle.on('click', function(){
		var _idx = $(this).parent().index();

		// $(this).parent().toggleClass('curr').siblings().removeClass('curr');
		// $tabList.removeClass('curr').eq(_idx).addClass('curr');

		$(this).parent().toggleClass('curr');
		$tabList.eq(_idx).addClass('curr');
	});

	$accordionHeading.on('click', function(){
		$(this).parent().toggleClass('open');
	});

	$selecter.hover(function(){
		$(this).addClass('open').removeClass('closed');
	}, function(){
		$(this).addClass('closed').removeClass('open');
	});
});