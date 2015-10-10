$(document).ready(function(){
	var $switchBar     = $('.accordion-heading'),
		$collapseWrap  = $('.collapse-wrap'),
		$fastLinksList = $('.fast-links .list'),
		$introList     = $collapseWrap.find('.intro-list'),
		$slideshow     = $collapseWrap.find('.slideshow'),
		$checkLab      = $collapseWrap.find('.lab.check'),
		$btnClose      = $collapseWrap.find('.btn-close, .btn-m-close'),
		$introTitle    = $slideshow.find('.intro-title'),
		_timer         = null,
		_titleArray    = [];

	$introList.each(function(){
		var _idx = $(this).index();

		$(this).prepend($fastLinksList.eq(_idx).html());
	});

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
		var _idx   = event.page.index,
			_count = event.page.count;

		if (_idx === _count - 1) {
			$('.owl-prev').text(_titleArray[_idx - 1]);
			$('.owl-next').text(_titleArray[0]);
		} else if (_idx === 0) {
			$('.owl-prev').text(_titleArray[_count - 1]);
			$('.owl-next').text(_titleArray[_idx + 1]);
		} else {
			$('.owl-prev').text(_titleArray[_idx - 1]);
			$('.owl-next').text(_titleArray[_idx + 1]);
		}
	});

	$switchBar.on('click', function(){
		$(this).parent().toggleClass('open');
	});

	$('.l-main').on('click', '.detail-info', function(){
		if ($(window).width() <= 600) {
			$(this).parent().addClass('is-curr');
		} else {
			$(this).parent().addClass('is-curr').siblings().removeClass('is-curr');
		}

		$collapseWrap.attr('class', 'collapse-wrap open ' + $(this).attr('class').split('detail-info ')[1]);
		$collapseWrap.find('.' + $(this).attr('class').split('detail-info ')[1]).addClass('is-curr');
	});

	$btnClose.on('click', function(){
		if ($(window).width() <= 600) {
			$(this).parents('.intro-list').removeClass('is-curr');
		} else {
			$('.detail-info').parent().removeClass('is-curr');
		}

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