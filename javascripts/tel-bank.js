$(document).ready(function(){
  var $quest = $('.quest');

  $quest.on('click', function(){
    $(this).parent().toggleClass('open').siblings().removeClass('open');
  });
});