$(document).ready(function(){
	var $quest         = $('.quest'),
		$selecter      = $('.selecter'),
		$tabList       = $('.tab-list'),
		$switchContent = $('.switch-content');

	$quest.on('click', function(){
		$(this).parent().toggleClass('open').siblings().removeClass('open');
	});

	$tabList.on('click', function(){
		var _idx = $(this).index();

		$(this).addClass('curr').siblings().removeClass('curr');
		$switchContent.removeClass('curr').eq(_idx).addClass('curr');
	});

	$selecter.hover(function(){
		$(this).addClass('open').removeClass('closed');
	}, function(){
		$(this).addClass('closed').removeClass('open');
	});
});