$(document).ready(function(){
	var $quest    = $('.quest'),
		$selecter = $('.selecter');

	$quest.on('click', function(){
		$(this).parent().toggleClass('open').siblings().removeClass('open');
	});

	$selecter.hover(function(){
		$(this).addClass('open').removeClass('closed');
	}, function(){
		$(this).addClass('closed').removeClass('open');
	});
});