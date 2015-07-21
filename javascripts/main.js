$(document).ready(function(){
  // 套用側邊欄選單 JS Plugin - jQuery.mmenu
  $("nav.drawer").mmenu({
    slidingSubmenus: false
  });
  $(".rwd-hamburger-menu").click(function() {
     $("nav.drawer").trigger("open.mm");
  });

  // 套用自定樣式下拉選單 JS Plugin - fs.selecter
  selectUI();

  //首頁 Login Box 下拉選單 Mouse Enter/Leave 追加展開收合功能
  $('.login > .selecter > .selecter-selected').mouseenter(function(){
    $(this).trigger("click");
  });
  $('.login > .selecter').mouseleave(function(){
    $(this).trigger("click");
  });

  // 套用頁籤切換 JS Plugin - jQuery UI Tabs
  $(".ui-tabs").tabs();

  // 套用輪播 JS Plugin - Owl Carousel 2(beta)
  var heroImageSlider = $(".hero-image-slider");
  heroImageSlider.owlCarousel({
    items: 1,
    nav: false,
    loop: true,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn'
  });
  var promoCarousel = $(".promo-carousel .carousel-wrap");
  promoCarousel.owlCarousel({
    items: 2,
    margin: 20,
    loop: true,
    nav: true,
    dots: false,
    slideBy: 2,
    responsive:{
      0:{
          items:1
      },
      740:{
          items:2
      }
    }
  });
  
  // 套用 Lightbox JS Plugin - fancybox 2
  $(".fancybox").fancybox();
  $("#autoPopupWindow").trigger('click');

  // 收合 重要公告(RWD)
  $('.announcement a.slide-trigger').click(function(){
    $(this).toggleClass('active');
    $('.announcement > ul').slideToggle(200);
  });

  // 收合 Search Bar(RWD)
  $('header ul.rwd-btn li.search a').click(function(){
    $(this).toggleClass('active');
    $('.rwd-search-bar').toggle();
  });

  // 收合 下拉選單
  $('.dropdown-trigger').mouseenter(function(){
    $(this).addClass('active');
  });
  $('.dropdown-trigger').mouseleave(function(){
    $(this).removeClass('active');
  });
  $('.dropdown-trigger').click(function(){
    $(this).toggleClass('active');
  });

  // 關閉 Cookie 啟用通知 Bar
  $('.notification-cookie .btn-close').click(function(){
    $('.notification-cookie .wrapper').animate({
      left: "-=9999"
    }, 300, function(){
      $('.notification-cookie').animate({
        height: "0"
      }, 300, function(){
        $(this).hide();
      });
    });
  });
});