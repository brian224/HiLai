(function (window, document, jQuery, undefined) {
	'use strict';

	var indexObj = new index();

	function index() {
		this._mCut          = '.m-cut';
		this._pagination    = '.pagination';
		this._slideDown     = '.jq-slide-down';
		this._slideCut      = '.jq-slide-cut';
		this._next          = '.jq-next';
		this._showBooking   = '.jq-show-booking';
		this._hideBooking   = '.jq-hide-booking';
		this._animateSpeed  = 400;
		this._sectionIndex  = 0;
		this._sectionScroll = true;
		this._map;
		this._marker;
	}

	index.prototype.checkCutLength = function() {
		if ($(indexObj._mCut).length > 1) {
			var _str = '',
				_idx = Math.round(projects.$b.scrollTop() / ($(indexObj._mCut).height()));

			for (var i = 0; i < $(indexObj._mCut).length; i++) {
				_str += '<li class="list"><button class="btn-dot jq-slide-cut"></button></li>';
			}
			$(indexObj._pagination).find('.cut-dot').html(_str).find('> *').eq(_idx).addClass('is-curr');
		}
	}

	index.prototype.slideCut = function(n) {
		projects.$hb.animate({'scrollTop': projects.$w.height() * n}, common._animateSpeed);
		$(indexObj._pagination).find('.cut-dot .list').removeClass('is-curr').eq(n).addClass('is-curr');
	}

	index.prototype.mousewheel = function() {
		projects.mousewheel(projects.$hb, function(e){
			if (!$(e.target).is('.sub-menu, .sub-menu *')) {
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

					indexObj.slideCut(indexObj._sectionIndex);

					setTimeout(function(){
						indexObj._sectionScroll = true;
					}, common._animateSpeed);
				}
			}
		});
	}

	index.prototype.initMap = function() {
		var geocoder = new google.maps.Geocoder();
		indexObj.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 15,
			center: {lat: 25.040509, lng: 121.548349}
		});

		indexObj.marker = new google.maps.Marker({
			map: indexObj.map,
			draggable: false,
			position: {lat: 25.040509, lng: 121.548349}
		});
	}

	projects.$w.load(function(){
		indexObj.checkCutLength();
		indexObj.initMap();

		$(indexObj._slideDown).on('click', function(){
			indexObj.slideCut(1);
		});

		$(indexObj._next).on('click', function(){
			$(this).parents('.jQ-owl-dt').trigger('next.owl');
		});

		$(indexObj._showBooking).on('click', function(){
			$('.booking').addClass('is-show');
			$(indexObj._slideDown).addClass('b-hide-xs');
			$(indexObj._pagination).addClass('b-hide-xs');
		});

		$(indexObj._hideBooking).on('click', function(){
			$('.booking').removeClass('is-show');
			$(indexObj._slideDown).removeClass('b-hide-xs');
			$(indexObj._pagination).removeClass('b-hide-xs');
		});

		$(indexObj._slideCut, indexObj._pagination).on('click', function(){
			indexObj.slideCut($(this).parent('.list').index());
		});
	});

	projects.$d.ready(function(){
		if ( projects.device() === 'PC' ) {
			indexObj.mousewheel();
		}
	});

	projects.$w.on('scroll' , function(){
		if ( projects.device() === 'PC') {
			indexObj.mousewheel();
		}
	});

	if ( ! window.indexObj ) {
		window.indexObj = indexObj;
	}
}(window, document, $));