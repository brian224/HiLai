$(document).ready(function(){
	var $switchBar     = $('.accordion-heading'),
		$btnDetailInfo = $('.detail-info'),
		$collapseWrap  = $('.collapse-wrap'),
		$slideshow     = $collapseWrap.find('.slideshow'),
		$checkLab      = $collapseWrap.find('.lab.check'),
		$btnApply      = $collapseWrap.find('.btn-apply'),
		$btnClose      = $collapseWrap.find('.btn-close'),
		$introTitle    = $slideshow.find('.intro-title'),
		_titleArray    = [];

	$introTitle.each(function(){
		_titleArray.push($(this).text());
	});

	$slideshow.owlCarousel({
		items      : 1,
		nav        : true,
		navText    : [_titleArray[_titleArray.length-1], _titleArray[1]],
		loop       : true,
		dots       : true,
		autoplay   : false,
		animateOut : 'fadeOut',
		animateIn  : 'fadeIn'
	});

	$slideshow.on('changed.owl.carousel', function(event) {
		// $('.owl-prev').text(_titleArray[event.item.index + 1]);
		// $('.owl-next').text(_titleArray[event.item.index - 1]);
	});

	$switchBar.on('click', function(){
		$(this).parent().toggleClass('open');
	});

	$btnDetailInfo.on('click', function(){
		$collapseWrap.attr('class', 'collapse-wrap open ' + $(this).attr('class').split('detail-info ')[1]);
	});

	$btnClose.on('click', function(){
		$collapseWrap.attr('class', 'collapse-wrap');
	});

	$checkLab.on('click', 'input[type="checkbox"]', function(){
		if ($(this).prop('checked') === true) {
			$(this).parent().addClass('is-curr');
		} else {
			$(this).parent().removeClass('is-curr');
		}
	});

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
});