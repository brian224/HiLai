(function (window, document, jQuery, undefined) {
	'use strict';

	var spaceObj = new index();

	function index() {
		// this._lBody       = '.l-body';
		this._previewList = '.preview-list';
		this._btnLightbox = '.jq-lightbox';
		this._btnBoxClose = '.jq-box-close';
	}

	index.prototype.previewOwl = function(num) {
		$(spaceObj._previewList).trigger('destroy.owl');

		if ($(spaceObj._previewList + ' .list').parent().hasClass('list-block')) {
			$(spaceObj._previewList + ' .list').unwrap();
		}

		wrap(num);

		function wrap(num) {
			for (var i = 0; i < Math.ceil($(spaceObj._previewList).find('> .img-wrap').length / num); i++) {
				$(spaceObj._previewList).find('> .img-wrap:lt(' + num + ')').wrapAll('<div class="list-block"></div>');
				wrap(num);
			}
		}

		projects.owlCarousel(spaceObj._previewList);
	}

	projects.$w.load(function(){
		// $(spaceObj._btnLightbox).on('click', function(){
		// 	$(spaceObj._lBody).addClass('show-lightbox');
		// 	common.offClick('.m-lightbox');
		// });

		// $(spaceObj._btnBoxClose).on('click', function(){
		// 	$(spaceObj._lBody).addClass('close-lightbox').on('webkitAnimationEnd oAnimationend oAnimationEnd msAnimationEnd animationend', function(){
		// 		$(spaceObj._lBody).removeClass('show-lightbox close-lightbox').off('webkitAnimationEnd oAnimationend oAnimationEnd msAnimationEnd animationend');
		// 	});
		// });
	});

	projects.$d.ready(function(){
		if ( projects.device() !== 'Mobile' ) {
			spaceObj.previewOwl(6);
		} else {
			spaceObj.previewOwl(3);
		}
	});

	projects.$w.on('scroll' , function(){
	});

	projects.$w.resize(function(){
	});

	if ( ! window.spaceObj ) {
		window.spaceObj = spaceObj;
	}
}(window, document, $));