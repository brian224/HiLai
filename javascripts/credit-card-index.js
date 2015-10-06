$(document).ready(function(){
	var $btnDetailInfo = $('.detail-info'),
		$collapseWrap  = $('.collapse-wrap'),
		$btnClose      = $collapseWrap.find('.btn-close');

	$btnDetailInfo.on('click', function(){
		$collapseWrap.attr('class', 'collapse-wrap open ' + $(this).attr('class').split('detail-info ')[1]);
		// console.log($(this).attr('class').split('detail-info ')[1]);
	});

	$btnClose.on('click', function(){
		$collapseWrap.attr('class', 'collapse-wrap');
	});
});