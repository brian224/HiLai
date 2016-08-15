(function (window, document, jQuery, undefined) {
	'use strict';

	var common = new index();

	function index() {
	}

	projects.$w.load(function(){
		$('.datepicker').DatePicker();
		
		$('.btn-menu').on('click', function(){
			$(this).toggleClass('is-active');
			$(this).next('.m-menu').toggleClass('is-show');
		});
	});

	projects.$d.ready(function(){
	});
}(window, document, $));