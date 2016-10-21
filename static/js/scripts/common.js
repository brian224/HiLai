(function (window, document, jQuery, undefined) {
	'use strict';

	var common = new page();

	function page() {
		this._lFooter      = '.l-footer';
		this._quickList    = '.quick-list';
		this._mTable       = '.m-table';
		this._mTab         = '.m-tab';
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
			$(common._sitemap).removeClass('is-active');
			$(common._quickList).stop().animate({
				height: $(common._quickList + ' .list').eq(-1).offset().top - $(common._quickList).offset().top + $(common._quickList + ' .list').height()
			}, common._animateSpeed, function() {
				$(common._quickList).attr('style', '');
			});
		}
	}

	page.prototype.footerHeight = function() {
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
			} else if (_target === '.m-lightbox') {
				// 關閉 lightbox
				e.stopPropagation();

				if (!$(e.target).is(spaceObj._btnLightbox + ', ' + spaceObj._btnLightbox + ' *,' + _target + ', ' + _target + ' *') && $(spaceObj._lBody).hasClass('show-lightbox')) {
					$(spaceObj._lBody).addClass('close-lightbox').on('webkitAnimationEnd oAnimationend oAnimationEnd msAnimationEnd animationend', function(){
						$(spaceObj._lBody).removeClass('show-lightbox close-lightbox').off('webkitAnimationEnd oAnimationend oAnimationEnd msAnimationEnd animationend');
					});
				}
			}
		});
	}

	// M版<table>生成
	page.prototype.mobileTable = function() {
		if (!$(common._mTable).hasClass('table-rotate')) {
			$(common._mTable).each(function(){
				var _tdLength = $(this).find('thead td').length,
					_trLength = $(this).find('tr').length,
					_tArray   = [],
					_str      = '';

				for (var i = 0; i < _trLength; i++) {
					_tArray.push($(this).find('tr').eq(i).find('td').eq(0).html());

					for (var j = 0; j < _tdLength - 1; j++) {
						_tArray.push($(this).find('tr').eq(i).find('td').eq(j + 1).html());
					}
				}

				for (var k = 1; k < _tdLength; k++) {
					_str += '<table class="m-table b-hide-dt"><thead><tr><td>' + _tArray[k] + '</td><td></td></tr></thead><tbody>';

					for (var l = 1; l < _tArray.length / _tdLength; l++) {
						_str += '<tr><td>' + _tArray[_tdLength * l] + '</td><td>' + _tArray[_tdLength * l + 1] + '</td></tr>';
					}

					_str += '</tbody></table>';
				}

				$(this).after(_str);
			});
		} else {
			$(common._mTable + ' tr').on('click', function(){
				$(this).toggleClass('is-show');
			});
		}
	}

	// M版 tab function
	page.prototype.mobileTab = function() {
		$(common._mTab).each(function(){
			var $this         = $(this),
				$slider       = $this.find('.m-tab-list'),
				$prev         = $this.prev('.arrow-prev'),
				$next         = $this.next('.arrow-next'),
				_wrapWidth    = $this.outerWidth(true),
				_wrapOffset   = $this.offset().left,
				_sliderWidth  = $slider.outerWidth(true);

			if (_sliderWidth > _wrapWidth && Math.abs($slider.offset().left) + _wrapOffset + _wrapWidth !== _sliderWidth) {
				$next.addClass('b-block-xs');
			}

			$this.on('scroll', function(){
				var _sliderOffset = $slider.offset().left;

				// 左箭頭隱藏與否
				if (_sliderOffset < _wrapOffset) {
					$prev.addClass('b-block-xs');
				} else {
					$prev.removeClass('b-block-xs');
				}

				// 右箭頭隱藏與否
				if (_sliderOffset < 0) {
					if (Math.abs(_sliderOffset) + _wrapOffset + _wrapWidth >= _sliderWidth - 1) {
						$next.removeClass('b-block-xs');
					} else {
						$next.addClass('b-block-xs');
					}
				} else {
					if (_wrapOffset + _wrapWidth >= _sliderWidth - 1) {
						$next.removeClass('b-block-xs');
					} else {
						$next.addClass('b-block-xs');
					}
				}
			});

			$prev.on('click', function(){
				$this.animate({
					scrollLeft: $this.scrollLeft() - _wrapWidth
				}, common._animateSpeed);
			});

			$next.on('click', function(){
				$this.animate({
					scrollLeft: $this.scrollLeft() + _wrapWidth
				}, common._animateSpeed);
			});
		});
	}

	projects.$w.load(function(){
		common.footerHeight();

		if ($('.m-datepicker').length !== 0) {
			$('.m-datepicker').DatePicker();
		}

		if ($(common._mTable).length !== 0) {
			common.mobileTable();
		}

		if ($(common._mTab).length !== 0 && projects.$w.width() <= 740) {
			common.mobileTab();
		}

		$(common._arrow).each(function(){
			var $this = $(this),
				$base = $this.parent().prev();

			$this.css('top', $base.offset().top - parseInt($('.m-header').css('top'), 10) + ($base.outerHeight() / 2) - ($this.outerHeight() / 2));
		});

		$(common._search).on('click', function(){
			$('.m-search-bar').addClass('is-show');
			common.offClick('.m-search-bar');
		});

		$(common._searchClose).on('click', function(){
			$('.m-search-bar').removeClass('is-show');
		});

		$('.btn-menu').on('click', function(){
			$('.l-body').toggleClass('no-scroll');
			$(this).toggleClass('is-active');
			$(this).next('.menu-wrap').toggleClass('is-show');

			if ( projects.device() !== 'PC' ) {
				$(common._subMenu).removeClass('is-hover');
			}
		});

		$(common._sitemap).on('click', function(){
			var $quickList  = $(common._quickList),
				_quickListH = $(common._quickList + ' .list').eq(-1).offset().top - $(common._quickList).offset().top + $(common._quickList + ' .list').height(),
				_mapH       = $('.sitemap-wrap').outerHeight();

			$(this).toggleClass('is-active');

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
			} else {
				$('.sitemap-wrap').toggleClass('is-show');
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
					$('.menu-wrap').animate({scrollTop: 0});
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

		$('.jQ-owl').on('changed.owl.carousel' , function(e){
			projects.owlArrowHide();
		});
	});

	projects.$d.ready(function(){
		projects.owlCarousel();

		if ($('.jQ-owl-xs').length !== 0) {
			if ( projects.device() !== 'Mobile') {
				common.showFooter();
				$('.jQ-owl-xs').trigger('destroy.owl');
			} else {
				projects.owlCarousel('.jQ-owl-xs');
			}
		}

		if ($('.jQ-owl-md').length !== 0) {
			if ( projects.device() !== 'PC') {
				$('.jQ-owl-md').trigger('destroy.owl');
			} else {
				projects.owlCarousel('.jQ-owl-md');
			}
		}

		if ( projects.device() === 'PC' ) {
			$('.sitemap-wrap').css({'top' : $(common._quickList + ' .list').eq(-1).offset().top - $(common._quickList).offset().top + $(common._quickList + ' .list').height()});
		}
	});

	projects.$w.on('scroll' , function(){
		if ( projects.device() !== 'Mobile') {
			common.showFooter();
		}
	});

	projects.$w.resize(function(){
		if ($('.jQ-owl-xs').length !== 0) {
			if (projects.$w.width() >= 740) {
				$('.jQ-owl-xs').trigger('destroy.owl');
			} else {
				projects.owlCarousel('.jQ-owl-xs');
			}
		}

		if ($('.jQ-owl-md').length !== 0) {
			if (projects.$w.width() >= 768) {
				projects.owlCarousel('.jQ-owl-md');
			} else {
				$('.jQ-owl-md').trigger('destroy.owl');
			}
		}

		if ($(common._mTab).length !== 0 && projects.$w.width() <= 740) {
			common.mobileTab();
		}

		if ( projects.device() === 'PC' ) {
			$('.sitemap-wrap').css({'top' : $(common._quickList + ' .list').eq(-1).offset().top - $(common._quickList).offset().top + $(common._quickList + ' .list').height()});

			if ($(common._sitemap).hasClass('is-active')) {
				$(common._quickList).height($('.sitemap-wrap').outerHeight() + parseInt($('.sitemap-wrap').css('top'), 10));
			}
		} else {
			$('.sitemap-wrap').attr('style', '');
		}

		if ( projects.device() !== 'Mobile') {
			common.showFooter();
		}
	});

	if ( ! window.common ) {
		window.common = common;
	}
}(window, document, $));