(function (window, document, jQuery, undefined) {
	'use strict';

	var spaceObj = new index();

	function index() {
		this._lBody       = '.l-body';
		this._previewList = '.preview-list';
		this._btnLightbox = '.jq-lightbox';
		this._btnBoxClose = '.jq-box-close';
	}

	index.prototype.previewOwl = function() {
		wrap();

		function wrap() {
			for (var i = 0; i < Math.ceil($(spaceObj._previewList).find('> .img-wrap').length / 4); i++) {
				$(spaceObj._previewList).find('> .img-wrap:lt(4)').wrapAll('<div class="list-block"></div>');
				wrap();
			}
		}

		projects.owlCarousel(spaceObj._previewList);
	}

	projects.$w.load(function(){
		spaceObj.previewOwl();

		$(spaceObj._btnLightbox).on('click', function(){
			$(spaceObj._lBody).addClass('show-lightbox');
		});

		$(spaceObj._btnBoxClose).on('click', function(){
			$(spaceObj._lBody).removeClass('show-lightbox');
		});
	});

	projects.$d.ready(function(){
	});

	projects.$w.on('scroll' , function(){
	});

	projects.$w.resize(function(){
	});

	if ( ! window.spaceObj ) {
		window.spaceObj = spaceObj;
	}
}(window, document, $));