(function (window, document, jQuery, undefined) {
	'use strict';

	var common = new page();

	function page() {
		this._lFooter = '.l-footer';
		this._subMenu = '.jq-sub-menu';
		this._back    = '.jq-back';
		this._arrow   = '.jq-arrow';
	}

	page.prototype.showFooter = function() {
		var _totalH  = projects.$b.height(),
			_cutH    = projects.$w.height(),
			_scrollH = projects.$b.scrollTop();

		if (_totalH === _cutH + _scrollH) {
			$(common._lFooter).addClass('is-show');
		} else {
			$(common._lFooter).removeClass('is-show');
		}
	}

	projects.$w.load(function(){
		$('.m-datepicker').DatePicker();

		$(common._arrow).each(function(){
			var $this = $(this),
				$base = $this.parent().prev();

			$this.css('top', $base.offset().top - parseInt($('.m-header').css('top'), 10) + ($base.height() / 2) - ($this.outerHeight() / 2));
		});

		$('.btn-menu').on('click', function(){
			$(this).toggleClass('is-active');
			$(this).next('.menu-wrap').toggleClass('is-show');

			if ( projects.device() !== 'PC' ) {
				$(common._subMenu).removeClass('is-hover');
			}
		});

		$('.btn-sitemap').on('click', function(){
			$(this).toggleClass('is-active');
			$('.sitemap-wrap').toggleClass('is-show');
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
	});

	projects.$d.ready(function(){
		projects.owlCarousel();

		if ( projects.device() === 'PC' ) {
			common.showFooter();
		} else if ( projects.device() === 'Mobile') {
			$('.jQ-owl-dt').trigger('destroy.owl');
		}
	});

	projects.$w.on('scroll' , function(){
		if ( projects.device() === 'PC') {
			common.showFooter();
		}
	});

	projects.$w.resize(function(){
	});

	if ( ! window.common ) {
		window.common = common;
	}
}(window, document, $));