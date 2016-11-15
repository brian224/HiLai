(function (window, document, jQuery, undefined) {
	'use strict';

	var indexObj = new index();

	function index() {
		this._mCut          = '.m-cut';
		this._pagination    = '.pagination';
		this._video         = '.jq-video';
		this._slideDown     = '.jq-slide-down';
		this._slideCut      = '.jq-slide-cut';
		this._showBooking   = '.jq-show-booking';
		this._hideBooking   = '.jq-hide-booking';
		this._searchStore   = '.jq-search-store';
		this._clearSearch   = '.jq-clear-search';
		this._sectionIndex  = 0;
		this._sectionScroll = true;
		this._once          = true;
		this._mCutHeight    = projects.$w.height();
		this._isYouTube;
	}

	index.prototype.checkCutLength = function() {
		if ($(indexObj._mCut).length > 1) {
			var _str = '',
				_idx = (projects._browsers.chrome) ? Math.round(projects.$b.scrollTop() / ($(indexObj._mCut).height())) : Math.round(projects.$hb.scrollTop() / ($(indexObj._mCut).height()));

			for (var i = 0; i < $(indexObj._mCut).length; i++) {
				_str += '<li class="list"><button class="btn-dot jq-slide-cut"></button></li>';
			}
			$(indexObj._pagination).find('.cut-dot').html(_str).find('> *').eq(_idx).addClass('is-curr');
		}
	}

	index.prototype.slideCut = function(n) {
		if (projects._ISIPHONE) {
			$(common._lBody).animate({'scrollTop': $(indexObj._mCut).height() * n}, common._animateSpeed);
		} else {
			projects.$hb.animate({'scrollTop': $(indexObj._mCut).eq(n).offset().top}, common._animateSpeed);
		}

		$(indexObj._pagination).find('.cut-dot .list').removeClass('is-curr').eq(n).addClass('is-curr');

		if (indexObj._isYouTube && n !== 0 && typeof projects._media._player.pauseVideo !== 'undefined') {
			projects._media._player.pauseVideo();
		} else if (indexObj._isYouTube && n === 0 && typeof projects._media._player.playVideo !== 'undefined') {
			projects._media._player.playVideo();
		}
	}

	index.prototype.mousewheel = function() {
		projects.mousewheel(projects.$hb, function(e){
			if (!$(e.target).is('.sub-menu, .sub-menu *, .search-result-list, .search-result-list *')) {
				e.preventDefault();
				e.stopPropagation();

				if (indexObj._sectionScroll) {
					indexObj._sectionScroll = false;
					indexObj._sectionIndex = $(indexObj._pagination).find('.cut-dot .list.is-curr').index();

					if ( e.deltaY < 0 ) {
						indexObj._sectionIndex ++;
					} else {
						indexObj._sectionIndex --;
					}

					if ( indexObj._sectionIndex >= ( $(indexObj._mCut).length - 1 ) ) {
						indexObj._sectionIndex = ( $(indexObj._mCut).length - 1 );
					} else if ( indexObj._sectionIndex <= 0 ) {
						indexObj._sectionIndex = 0;
					}

					if (projects._ISMAC) {
						var _speed = 1400;
					} else {
						var _speed = common._animateSpeed;
					}

					indexObj.slideCut(indexObj._sectionIndex);

					setTimeout(function(){
						indexObj._sectionScroll = true;
					}, _speed + 100);
				}
			}
		});
	}

	index.prototype.historyOwl = function(event) {
		$('.history-list').trigger('destroy.owl');

		if (event === 'wrap') {
			wrap();
		} else {
			unwrap();
		}

		projects.owlCarousel('.history-list');

		function wrap() {
			for (var i = 0; i < Math.ceil($('.history-list').find('> .list').length / 3); i++) {
				$('.history-list').find('> .list:lt(3)').wrapAll('<div class="list-block"></div>');
				wrap();
			}
		}

		function unwrap() {
			if ($('.history-list .list').parent().hasClass('list-block')) {
				$('.history-list .list').unwrap();
			}
		}
	}

	projects.$w.load(function(){
		if (projects._browsers.msie) {
			setTimeout(function(){
				indexObj.checkCutLength();
			}, 500);
		} else {
			indexObj.checkCutLength();
		}

		$(indexObj._slideDown).on('click', function(){
			indexObj.slideCut(1);
		});

		$(indexObj._showBooking).on('click', function(){
			$('.main-cut .booking').addClass('is-show');
			$(indexObj._slideDown).addClass('b-hide-tm');
			$(indexObj._pagination).addClass('b-hide-tm');
		});

		$(indexObj._hideBooking).on('click', function(){
			$('.main-cut .booking').removeClass('is-show');
			$(indexObj._slideDown).removeClass('b-hide-tm');
			$(indexObj._pagination).removeClass('b-hide-tm');
		});

		$(indexObj._searchStore).on('click', function(){
			$(indexObj._clearSearch + ', .search-result-list').addClass('is-show');

			if ( projects.device() === 'Mobile' ) {
				$(indexObj._pagination).addClass('b-hide-tm');
			}
		});

		$(indexObj._clearSearch).on('click', function(){
			$(this).removeClass('is-show');
			$('.search-result-list').removeClass('is-show');

			if ( projects.device() === 'Mobile' ) {
				$(indexObj._pagination).removeClass('b-hide-tm');
			}
		});

		$(indexObj._pagination).on('click', indexObj._slideCut, function(){
			indexObj.slideCut($(this).parent('.list').index());
		});
	});

	projects.$d.ready(function(){
		if ( projects.device() === 'PC' ) {
			indexObj.mousewheel();
		} else if ( projects.device() === 'Mobile' ) {
			indexObj.historyOwl('wrap');

			if (/Android/i.test(navigator.userAgent)) {
				$(indexObj._mCut + ', .m-media').height(indexObj._mCutHeight);
			}
		}
		projects.mediaGet();

		if ($(indexObj._video).data('media').match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i) !== null) {
			projects.mediaAppend($(indexObj._video).data('media'));
			indexObj._isYouTube = true;
		} else {
			$(indexObj._video).html('<video width="100%" height="100%" autoplay muted><source src="' + $(indexObj._video).data('media') + '" type="video/mp4"><source src="' + $(indexObj._video).data('media') + '" type="video/webm"><source src="' + $(indexObj._video).data('media') + '" type="video/ogg"></video>');
			indexObj._isYouTube = false;
		}
	});

	projects.$w.on('scroll' , function(){
		if ( projects.device() === 'PC') {
			indexObj.mousewheel();
		}
	});

	projects.$b.on('touchmove', function(e) {
		var _scrollTop;

		if (projects._ISIPHONE) {
			_scrollTop = $(common._lBody).scrollTop();
		} else {
			_scrollTop = projects.$w.scrollTop();
		}

		$(indexObj._pagination).find('.cut-dot .list').removeClass('is-curr').eq(Math.floor(_scrollTop / projects.$w.height())).addClass('is-curr');
	});

	projects.$w.resize(function(){
		if (projects.$w.width() >= 740) {
			indexObj.historyOwl('unwrap');
		} else {
			indexObj.historyOwl('wrap');
		}
	});

	if ( ! window.indexObj ) {
		window.indexObj = indexObj;
	}
}(window, document, $));