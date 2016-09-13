(function (window, document, jQuery, undefined) {
	'use strict';

	var common = new page();

	function page() {
		this._lFooter      = '.l-footer';
		this._quickList    = '.quick-list';
		this._subMenu      = '.jq-sub-menu';
		this._search       = '.jq-search';
		this._searchClose  = '.jq-search-close';
		this._back         = '.jq-back';
		this._arrow        = '.jq-arrow';
		this._top          = '.jq-top';
		this._next         = '.jq-next';
		this._sitemap      = '.jq-sitemap';
		this._countHeight  = '.jq-count-height';
		this._animateSpeed = 400;
	}

	page.prototype.showFooter = function() {
		var _totalH  = projects.$hb.height(),
			_cutH    = projects.$w.height(),
			_scrollH = projects.$b.scrollTop();

		if (_totalH === _cutH + _scrollH) {
			$(common._lFooter).addClass('is-show');
		} else {
			$(common._lFooter).removeClass('is-show');
		}
	}

	page.prototype.countHeight = function() {
		$(common._countHeight).each(function(){
			var $list   = $(this).find('.item'),
				_middle = Math.round($list.length / 2);

			$(this).find('.item:gt(' + ($list.length - _middle - 1) + ')').wrapAll('<div class="list-block"></div>');
			$(this).find('.item:lt(' + _middle + ')').wrapAll('<div class="list-block"></div>');
		});
	}

	// 點擊目標區域以外的地方可關閉目標區域
	page.prototype.offClick = function(_target) {
		projects.$d.off('click').on('click' , function(e){
			if (_target === '.m-search-bar' && $(_target).hasClass('is-show')) {
				e.stopPropagation();

				if (!$(e.target).is(common._search + ', ' + common._search + ' *,' + _target + ', ' + _target + ' *')) {
					$('.m-search-bar').removeClass('is-show');
				}
			} else if (_target === common._sitemap && $(_target).hasClass('is-active')) {
				// 關閉網站地圖
				e.stopPropagation();

				if (!$(e.target).is(common._quickList + ', ' + common._quickList + ' *,' + _target + ', ' + _target + ' *')) {
					$(common._sitemap).removeClass('is-active');
					$(common._quickList).animate({
						height: $(common._quickList).find('.list').height()
					}, common._animateSpeed);
				}
			}
		});
	}

	projects.$w.load(function(){
		common.countHeight();
		$('.m-datepicker').DatePicker();

		$(common._arrow).each(function(){
			var $this = $(this),
				$base = $this.parent().prev();

			$this.css('top', $base.offset().top - parseInt($('.m-header').css('top'), 10) + ($base.height() / 2) - ($this.outerHeight() / 2));
		});

		$(common._search).on('click', function(){
			$('.m-search-bar').addClass('is-show');
			common.offClick('.m-search-bar');
		});

		$(common._searchClose).on('click', function(){
			$('.m-search-bar').removeClass('is-show');
		});

		$('.btn-menu').on('click', function(){
			$(this).toggleClass('is-active');
			$(this).next('.menu-wrap').toggleClass('is-show');

			if ( projects.device() !== 'PC' ) {
				$(common._subMenu).removeClass('is-hover');
			}
		});

		$(common._sitemap).on('click', function(){
			var $quickList  = $(common._quickList),
				_quickListH = $quickList.find('.list').height(),
				_mapH       = $('.sitemap-wrap').outerHeight();

			$(this).toggleClass('is-active');
			$('.sitemap-wrap').toggleClass('is-show');

			if ( projects.device() === 'PC') {
				if ($(this).hasClass('is-active')) {
					$quickList.animate({
						height: _quickListH + _mapH
					}, common._animateSpeed);
				} else {
					$quickList.animate({
						height: _quickListH
					}, common._animateSpeed);
				}
				common.offClick(common._sitemap);
			}
		});

		$(common._subMenu).on('click', function(){
			if ( projects.device() !== 'PC' ) {
				if ($(this).next().attr('class') === 'community-list') {
					if ($(this).hasClass('is-hover')) {
						$(common._subMenu).removeClass('is-hover');
					} else {
						$(common._subMenu).removeClass('is-hover');
						$(this).addClass('is-hover');
					}
				} else {
					$(this).toggleClass('is-hover');
				}
			}
		});

		$(common._back).on('click', function(){
			$(this).parent().parent().prev(common._subMenu).removeClass('is-hover');
		});

		$(common._top).on('click', function(){
			if (projects._ISIPHONE) {
				$('.l-body').animate({
					scrollTop: 0
				}, common._animateSpeed);
			} else {
				projects.$b.animate({
					scrollTop: 0
				}, common._animateSpeed);
			}

			common.offClick(common._sitemap);
			$('.sitemap-wrap').removeClass('is-show');

			if ($('.l-body').hasClass('index')) {
				$('.pagination .cut-dot .list').removeClass('is-curr').eq(0).addClass('is-curr');
			}
		});

		$(common._next).on('click', function(){
			$(this).parents('.jQ-owl-md').trigger('next.owl');
		});
	});

	projects.$d.ready(function(){
		projects.owlCarousel();

		if ( projects.device() !== 'Mobile') {
			common.showFooter();
			$('.jQ-owl-xs').trigger('destroy.owl');
		} else {
			projects.owlCarousel('.jQ-owl-xs');
			$('.jQ-owl-md').trigger('destroy.owl');
		}
	});

	projects.$w.on('scroll' , function(){
		if ( projects.device() !== 'Mobile') {
			common.showFooter();
		}
	});

	projects.$w.resize(function(){
		if (projects.$w.width() >= 740) {
			projects.owlCarousel('.jQ-owl-md');
			$('.jQ-owl-xs').trigger('destroy.owl');
		} else {
			$('.jQ-owl-md').trigger('destroy.owl');
			projects.owlCarousel('.jQ-owl-xs');
		}
	});

	if ( ! window.common ) {
		window.common = common;
	}
}(window, document, $));