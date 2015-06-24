$(document).ready(function(){
	var $accordionHeading = $('.accordion-heading'),
		$radioLab         = $('.lab.radio'),
		$checkLab         = $('.lab.check'),
		$selecter         = $('.selecter');

	$accordionHeading.on('click', function(){
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

	$selecter.hover(function(){
		$(this).addClass('focus open').removeClass('closed').find('.selecter-options').show();
	}, function(){
		$(this).addClass('closed').removeClass('focus open').find('.selecter-options').hide();
	});
});