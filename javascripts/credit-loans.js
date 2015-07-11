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
	$rwdMenuList.find('.loan-purpose').removeClass('curr');

	$sideTitle.on('click', function(){
		var _winWidth = $(window).width();

		if (_winWidth < 980) {
			$(this).parent().toggleClass('open');
		}
	});

	$switchBar.on('click', function(){
		$(this).parent().toggleClass('open');
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

	if ($('.slider-wrap').length !== 0) {
		$('.slider-money').rangeslider({
			polyfill    : false,
			rangeClass  : 'rangeslider-bar',
			fillClass   : 'rangeslider-fill',
			handleClass : 'rangeslider-handle',
			onSlide     : function(position, value) {
				var _sliderWrap = parseInt($('.slider-wrap').css('paddingLeft'), 10);
				
				$('.slider-wrap.money').find('output').css({'left' : (position + _sliderWrap) + 'px'}).text(value);
				PMT($('.slider-apr').val(), $('.slider-year').val(), value);
			}
		});

		$('.slider-year').rangeslider({
			polyfill    : false,
			rangeClass  : 'rangeslider-bar',
			fillClass   : 'rangeslider-fill',
			handleClass : 'rangeslider-handle',
			onSlide     : function(position, value) {
				var _sliderWrap = parseInt($('.slider-wrap').css('paddingLeft'), 10);
				
				$('.slider-wrap.year').find('output').css({'left' : (position + _sliderWrap) + 'px'}).text(value);
				PMT($('.slider-apr').val(), value, $('.slider-money').val());
			}
		});

		$('.slider-apr').rangeslider({
			polyfill    : false,
			rangeClass  : 'rangeslider-bar',
			fillClass   : 'rangeslider-fill',
			handleClass : 'rangeslider-handle',
			onSlide     : function(position, value) {
				var _sliderWrap = parseInt($('.slider-wrap').css('paddingLeft'), 10);
				
				$('.slider-wrap.apr').find('output').css({'left' : (position + _sliderWrap) + 'px'}).text(value);
				PMT(value, $('.slider-year').val(), $('.slider-money').val());
			}
		});
	}

	if (navigator.userAgent.indexOf('MSIE 8.0') > 0) {
		$('.fast-links .link').each(function(){
			$(this).hover(function(){
				$('.fast-links .link').removeClass('hover');
				$(this).addClass('hover');
			}, function(){
				$(this).removeClass('hover');
			});
		});
	}

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