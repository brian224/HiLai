$(document).ready(function(){
	var $switchBar   = $('.accordion-heading, .feature-desc'),
		$kvSlider    = $('.key-visual-slider'),
		$radioLab    = $('.lab.radio'),
		$checkLab    = $('.lab.check'),
		$selecter    = $('.selecter'),
		$rwdMenuList = $('.rwd-menu-list'),
		$hasSubMenu  = $('.has-sub-menu'),
		$sideTitle   = $('.side-title'),
		_rwdMenu     = $('.credit-loans .side-menu-list').html();

	$kvSlider.owlCarousel({
		items              : 1,
		nav                : true,
		navText            : ['', ''],
		loop               : true,
		dots               : true,
		autoplay           : true,
		autoplayTimeout    : 3500,
		autoplayHoverPause : true,
		animateOut         : 'fadeOut',
		animateIn          : 'fadeIn'
	});

	$rwdMenuList.html(_rwdMenu);

	$sideTitle.on('click', function(){
		var _winWidth = $(window).width();

		if (_winWidth < 980) {
			$(this).parent().toggleClass('open');
		}
	});

	$switchBar.on('click', function(){
		$(this).parent().toggleClass('open').siblings().removeClass('open');
	});

	$radioLab.on('click', 'input[type="radio"]', function(){
		$(this).prop('checked', true).parent().addClass('is-curr').siblings().removeClass('is-curr');
	});

	$checkLab.on('click', 'input[type="checkbox"]', function(){
		if ($(this).prop('checked') === true) {
			$(this).parent().addClass('is-curr');
		} else {
			$(this).parent().removeClass('is-curr');
		}
	});

	$hasSubMenu.on('click', function(){
		$(this).find('>a').toggleClass('curr');
	});

	$rwdMenuList.on('click', '.has-sub-menu', function(){
		$(this).find('>a').toggleClass('curr');
	});

	$selecter.hover(function(){
		$(this).addClass('focus open').removeClass('closed').find('.selecter-options').show();
	}, function(){
		$(this).addClass('closed').removeClass('focus open').find('.selecter-options').hide();
	});

	$('.slider-money').slider({
		range  : 'min',
		value  : 6,
		min    : 6,
		max    : 300,
		create : function( event, ui ) {
			$('.money .ui-slider-handle').text(6);
		},
		slide  : function( event, ui ) {
			$('.money .ui-slider-handle').text(ui.value);
			PMT($('.apr .ui-slider-handle').text(), $('.year .ui-slider-handle').text(), ui.value);
		}
	});

	$('.slider-year').slider({
		range  : 'min',
		value  : 1,
		min    : 1,
		max    : 7,
		create : function( event, ui ) {
			$('.year .ui-slider-handle').text(1);
		},
		slide  : function( event, ui ) {
			$('.year .ui-slider-handle').text(ui.value);
			PMT($('.apr .ui-slider-handle').text(), ui.value, $('.money .ui-slider-handle').text());
		}
	});

	$('.slider-apr').slider({
		range  : 'min',
		value  : 0,
		min    : 0,
		max    : 1800,
		create : function( event, ui ) {
			$('.apr .ui-slider-handle').text('0.00');
		},
		slide : function( event, ui ) {
			$('.apr .ui-slider-handle').text((ui.value/100).toFixed(2));
			PMT((ui.value/100).toFixed(2), $('.year .ui-slider-handle').text(), $('.money .ui-slider-handle').text());
		}
	});

	// 計算貸款金額
	function PMT(i, n, p) {
		// I 利率, N 期數, P 價格
		var _total = Math.ceil((i/100/12)*(-p*10000)*Math.pow((1+(i/100/12)),(n*12))/(1-Math.pow((1+(i/100/12)),(n*12))));

		if (isNaN(_total) === true) {
			$('.result-price').text(0);
		} else {
			$('.result-price').text(setPercentile(_total));
		}
	}

	// 記算百分位
	function setPercentile(num) {
		num = num.toString().replace(/\$|\,/g, '');
		if (isNaN(num)) num = '0';
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num * 100 + 0.50000000001);
		cents = num % 100;
		num = Math.floor(num / 100).toString();
		if (cents < 10) cents = '0' + cents;
		for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
			num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
		return (((sign) ? '' : '-') + num);
	}
});