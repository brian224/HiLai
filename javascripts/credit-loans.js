$(document).ready(function(){
	var $switchBar   = $('.accordion-heading, .feature-desc'),
		$radioLab    = $('.lab.radio'),
		$checkLab    = $('.lab.check'),
		$selecter    = $('.selecter'),
		$rwdMenuList = $('.rwd-menu-list'),
		$hasSubMenu  = $('.has-sub-menu'),
		$sideTitle   = $('.side-title'),
		_rwdMenu     = $('.credit-loans .side-menu-list').html();

	$rwdMenuList.html(_rwdMenu);

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
});