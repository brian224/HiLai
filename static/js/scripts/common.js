(function (window, document, jQuery, undefined) {
	'use strict';

	var common = new page();

	function page() {
		this._lBody        = '.l-body';
		this._lFooter      = '.l-footer';
		this._quickList    = '.quick-list';
		this._mTable       = '.m-table';
		this._mTab         = '.m-tab';
		this._breadcrumb   = '.m-breadcrumb';
		this._photoList    = '.photo-list';
		this._previewList  = '.preview-list';
		this._subMenu      = '.jq-sub-menu';
		this._search       = '.jq-search';
		this._searchClose  = '.jq-search-close';
		this._login        = '.jq-login';
		this._order        = '.jq-order';
		this._language     = '.jq-language';
		this._back         = '.jq-back';
		this._arrow        = '.jq-arrow';
		this._top          = '.jq-top';
		this._next         = '.jq-next';
		this._sitemap      = '.jq-sitemap';
		this._countHeight  = '.jq-count-height';
		this._btnLightbox  = '.jq-lightbox';
		this._btnBoxClose  = '.jq-box-close';
		this._btnAccordion = '.jq-btn-accordion';
		this._checkbox     = '.jq-checkbox';
		this._radio        = '.jq-radio';
		this._breadcrumb   = '.jq-breadcrumb';
		this._animateSpeed = 400;
		this._BCOffsetTop  = ($(this._breadcrumb).length !== 0) ? $(this._breadcrumb).offset().top : 0;
		this._paddingTop   = parseInt($('.m-content-bd').css('padding-top'), 10);
	}

	// 將麵包屑訂在頂部
	page.prototype.breadcrumb = function() {
		if (projects.device() === 'PC') {
			if (projects.$d.scrollTop() >= common._BCOffsetTop) {
				$(common._breadcrumb).parent().addClass('is-fixed');
			} else {
				$(common._breadcrumb).parent().removeClass('is-fixed');
			}
		} else if (projects.device() === 'Tablet') {
			if (projects.$d.scrollTop() + $('.l-header').height() + common._paddingTop >= common._BCOffsetTop) {
				$(common._breadcrumb).parent().addClass('is-fixed');
			} else {
				$(common._breadcrumb).parent().removeClass('is-fixed');
			}
		}
	}

	page.prototype.showFooter = function() {
		var _totalH  = projects.$hb.height(),
			_cutH    = projects.$w.height(),
			_scrollH = (projects._browsers.chrome) ? projects.$b.scrollTop() : projects.$hb.scrollTop();

		if (_totalH <= _cutH + _scrollH) {
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

	// 計算 footer 高度
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
			} else if (_target === '.login-state' && $(_target).hasClass('is-show')) {
				e.stopPropagation();

				if (!$(e.target).is(common._login + ', ' + common._login + ' *,' + _target + ', ' + _target + ' *')) {
					$('.login-state').removeClass('is-show');
				}
			} else if (_target === '.m-order' && $(_target).hasClass('is-show')) {
				e.stopPropagation();

				if (!$(e.target).is(common._order + ', ' + common._order + ' *,' + _target + ', ' + _target + ' *')) {
					$('.m-order').removeClass('is-show');
				}
			} else if (_target === '.m-language' && $(_target).hasClass('is-show')) {
				// 切換語系
				e.stopPropagation();

				if (!$(e.target).is(common._language + ', ' + common._language + ' *')) {
					$('.m-language').removeClass('is-show');
				}
			} else if (_target === '.btn-menu' && $(_target).hasClass('is-active')) {
				e.stopPropagation();

				if (!$(e.target).is('.about-list, .about-list *,' + _target + ', ' + _target + ' *')) {
					$('.btn-menu').removeClass('is-active');
					$('.menu-wrap').removeClass('is-show');
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

				if (!$(e.target).is(common._btnLightbox + ', ' + common._btnLightbox + ' *,' + _target + ', ' + _target + ' *') && $(common._lBody).hasClass('show-lightbox')) {
					$(common._lBody).addClass('close-lightbox').on('webkitAnimationEnd oAnimationend oAnimationEnd msAnimationEnd animationend', function(){
						$(common._lBody).removeClass('show-lightbox close-lightbox').off('webkitAnimationEnd oAnimationend oAnimationEnd msAnimationEnd animationend');
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

	// 設定 data-index
	page.prototype.photoOwl = function(num) {
		$(common._photoList).trigger('destroy.owl');

		$(common._photoList).each(function(){
			var $this = $(this);

			for (var i = 0; i < $this.find('.img-wrap').length; i++) {
				$this.find('.img-wrap').eq(i).attr('data-index', i);
			}
		});

		projects.owlCarousel(common._photoList);
	}

	// 封裝 slideahow group
	page.prototype.previewOwl = function(num) {
		$(common._previewList).trigger('destroy.owl');

		$(common._previewList).each(function(){
			var $this = $(this),
				num;

			if ( projects.device() === 'PC' ) {
				num = $this.data('wrap-md');
			} else if ( projects.device() === 'Tablet' ) {
				num = $this.data('wrap-sm');
			} else if ( projects.device() === 'Mobile' ) {
				num = $this.data('wrap-xs');
			}

			if ($this.find('.img-wrap').parent().hasClass('list-block')) {
				$this.find('.img-wrap').unwrap();
			}

			for (var i = 0; i < $this.find('.img-wrap').length; i++) {
				$this.find('.img-wrap').eq(i).attr('data-index', i);
			}

			wrap(num);

			function wrap(num) {
				for (var i = 0; i < Math.ceil($this.find('> .img-wrap').length / num); i++) {
					$this.find('> .img-wrap:lt(' + num + ')').wrapAll('<div class="list-block"></div>');
					wrap(num);
				}
			}
		});

		projects.owlCarousel(common._previewList);
	}

	// 自製 scroller
	page.prototype.menuScroller = function() {
		$('.sub-menu').each(function(){
			var $this   = $(this),
				_totalH = 0,
				_startY = 0,
				_isDrag = false;

			for (var i = 0; i < $this.find('> .list:not(.back-list)').length; i++) {
				_totalH += $this.find('> .list:not(.back-list)').eq(i).height();
			}

			if ($this.height() < _totalH) {
				$this.append('<li class="scrollbar-wrap" style="height:' + $this.height() + 'px"><button class="btn-scroll" style="height:' + ($this.height() / _totalH * 100) + '%"></button></li>');

				$this.on('scroll', function(){
					$this.find('.btn-scroll').css({'top': ($this.scrollTop() / _totalH * 100) + '%'});
				});

				$this.on('mousedown', '.btn-scroll', function(e){
					_isDrag = true;
					_startY = e.pageY;

					$(this).parents('.sub-menu-wrap').prev(common._subMenu).addClass('is-hover');
				});

				projects.$b.on('mousemove', function(e){
					if (_isDrag === true) {
						var _top  = parseInt($this.find('.btn-scroll').css('top'), 10),
							_move = ((e.pageY - _startY + _top) / _totalH * 100);

						if (_move <= 0) {
							_move = 0;
						} else if (_move >= 100 - ($this.height() / _totalH * 100)) {
							_move = 100 - ($this.height() / _totalH * 100);
						}

						$this.find('.btn-scroll').css({'top': _move + '%'});
						$this.animate({scrollTop: (e.pageY - _startY + $this.scrollTop())}, 0);
					}
				});

				projects.$b.on('mouseup', function(e){
					_isDrag = false;
					_startY = 0;

					$(common._subMenu).removeClass('is-hover');
				});

				$this.on('click', '.scrollbar-wrap', function(e){
					e.stopPropagation();

					if (!$(e.target).is('.btn-scroll, .btn-scroll *')) {
						var _move   = parseInt($this.find('.btn-scroll').css('top'), 10),
							_height = $this.find('.btn-scroll').height();

						if (e.pageY > $this.find('.btn-scroll').offset().top) {
							if (_move + _height > _totalH -_height) {
								$this.animate({scrollTop: _totalH - _height}, 100);
							} else {
								$this.animate({scrollTop: _move + _height}, 100);
							}
						} else {
							if (_move - _height <= 0) {
								$this.animate({scrollTop: 0}, 100);
							} else {
								$this.animate({scrollTop: $this.scrollTop() - $this.height()}, 100);
							}
						}
					}
				});
			}
		});
	}

	projects.$w.load(function(){
		common.breadcrumb();
		common.footerHeight();
		common.showFooter();

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
			$('.m-form-wrap').removeClass('is-show');
			common.offClick('.m-search-bar');
		});

		$(common._searchClose).on('click', function(){
			$('.m-search-bar').removeClass('is-show');
		});

		$(common._login).on('click', function(){
			$('.login-state').toggleClass('is-show').siblings().removeClass('is-show');
			common.offClick('.login-state');
		});

		$(common._order).on('click', function(){
			$('.m-order').toggleClass('is-show').siblings().removeClass('is-show');
			common.offClick('.m-order');
		});

		$(common._language).on('click', function(){
			$('.m-language').toggleClass('is-show').siblings().removeClass('is-show');
			common.offClick('.m-language');
		});

		$('.btn-menu').on('click', function(){
			$(common._lBody).toggleClass('no-scroll');
			$(this).toggleClass('is-active');
			$(this).next('.menu-wrap').toggleClass('is-show');

			if ( projects.device() !== 'PC' ) {
				$(common._subMenu).removeClass('is-hover');
			} else {
				common.offClick('.btn-menu');
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
			if ($(this).parent().parent().hasClass('sub-menu')) {
				$(this).parent().parent().parent().prev(common._subMenu).removeClass('is-hover');
			} else {
				$(this).parent().parent().prev(common._subMenu).removeClass('is-hover');
			}
		});

		$(common._top).on('click', function(){
			if (projects._ISIPHONE) {
				$(common._lBody).animate({
					scrollTop: 0
				}, common._animateSpeed);
			} else {
				projects.$b.animate({
					scrollTop: 0
				}, common._animateSpeed);
			}

			common.offClick(common._sitemap);
			$('.sitemap-wrap').removeClass('is-show');

			if ($(common._lBody).hasClass('index') && projects.device() === 'PC') {
				$('.pagination .cut-dot .list').removeClass('is-curr').eq(0).addClass('is-curr');
				projects._media._player.playVideo();
			}
		});

		$(common._next).on('click', function(){
			$(this).parents('.jQ-owl-md').trigger('next.owl');
		});

		$(projects._owlClass).on('changed.owl.carousel' , function(e){
			projects.owlArrowHide();
		});

		$(common._previewList + ' .img-wrap').on('click', function(){
			$(this).addClass('is-curr').siblings().removeClass('is-curr');
			$(common._photoList).trigger('to.owl.carousel', $(this).data('index'));
		});

		if ($(common._previewList).length !== 0) {
			$(common._photoList + ' .m-owl-arrow').on('click', function(){
				var _idx = $(common._photoList + ' .owl-item.active .img-wrap').data('index');

				$(common._previewList + ' .is-curr').removeClass('is-curr');
				$(common._previewList + ' .img-wrap[data-index="' + _idx + '"]').addClass('is-curr');

				if ($(this).hasClass('is-next') && $(common._previewList).find('.active .img-wrap.is-curr').index() === -1) {
					$(common._previewList).trigger('next.owl.carousel');
				} else if ($(this).hasClass('is-prev') && $(common._previewList).find('.active .img-wrap.is-curr').index() === -1) {
					$(common._previewList).trigger('prev.owl.carousel');
				}
			});
		}

		$(common._btnLightbox).on('click', function(){
			var _type = $(this).data('type');

			$(common._lBody).addClass('show-lightbox').attr('data-type', _type);
			$('.m-form-wrap').removeClass('is-show');
			common.offClick('.m-lightbox');
		});

		$(common._btnBoxClose).on('click', function(){
			$(common._lBody).addClass('close-lightbox').on('webkitAnimationEnd oAnimationend oAnimationEnd msAnimationEnd animationend', function(){
				$(common._lBody).removeClass('show-lightbox close-lightbox').off('webkitAnimationEnd oAnimationend oAnimationEnd msAnimationEnd animationend');
			});
		});

		$(common._btnAccordion).on('click', function(){
			$(this).parents('.m-accordion').toggleClass('is-open');

			if ( projects.device() === 'PC') {
				$(this).parents('.m-accordion').siblings().removeClass('is-open');
			}
		});

		$(common._checkbox).on('click', function(){
			if($(this).find('input[type="checkbox"]:checked').length !== 0) {
				$(this).addClass('is-checked');
			} else {
				$(this).removeClass('is-checked');
			}
		});

		$(common._radio).on('click', function(){
			if($(this).find('input[type="radio"]:checked').length !== 0) {
				var _name = $(this).find('input[type="radio"]:checked').attr('name');

				$('input[type="radio"][name="' + _name + '"]').parents(common._radio).removeClass('is-checked');
				$(this).addClass('is-checked');
			}
		});

		$(common._breadcrumb).on('change', function(){
			window.location.href = $(this).val();
		});
	});

	projects.$d.ready(function(){
		projects.owlCarousel();

		if ($(common._photoList).length !== 0) {
			common.photoOwl();
		}

		if ($(common._previewList).length !== 0) {
			common.previewOwl();
		}

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

			if (!projects._ISMAC) {
				common.menuScroller();
			}
		}
	});

	projects.$w.on('scroll' , function(){
		if ( projects.device() !== 'Mobile') {
			common.breadcrumb();
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