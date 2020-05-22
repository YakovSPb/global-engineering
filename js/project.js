// Слайдеры
function catalogSliderInit(slider) { // Слайдер галлереи на главной странице
	if (window.innerWidth < 435) {
		if (slider.hasClass('slick-initialized')) {
			setTimeout(function () {
				slider.slick('unslick');

			}, 100);
		}
	} else {
		if (slider.hasClass('slick-initialized')) return

		slider.on('init', function () {

			$(window).trigger('resize');

		});
		slider.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			dots: false,
			arrows: true,
			appendArrows: slider.parents('.tabs__item'),
			prevArrow: '<button type="button" aria-label="Предыдущий слайд" class="catalog-slider__arrow catalog-slider__arrow--prev"><svg class="icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#arrow-slider"></use></svg></button>',
			nextArrow: '<button type="button" aria-label="Следующий слайд" class="catalog-slider__arrow catalog-slider__arrow--next"><svg class="icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#arrow-slider"></use></svg></button>',
			infinite: false,
			responsive: [{
					breakpoint: 1280,
					settings: {
						slidesToShow: 3,
					}
				},
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 4,
					}
				},
				{
					breakpoint: 800,
					settings: {
						slidesToShow: 3,
					}
				},
				{
					breakpoint: 640,
					settings: {
						slidesToShow: 2,
					}
				}
			]
		}).on('setPosition', function (slick) {
			var $slider = $(slick.target),
				top = $slider.find('.minicard__image-link').outerHeight();

			$slider.parents('.tabs__item').find('.catalog-slider__arrow').css('top', top / 2 - 4);

			$slider.find('.slick-slide').css('margin-left', '');

			var deltaWidth = $slider.find('.slick-active').outerWidth() * $slider.find('.slick-active').length - $slider.width();

			if (deltaWidth) {
				var activeCount = $slider.find('.slick-active').length;
				for (var i = 0; i < deltaWidth; i++) {
					$slider.find('.slick-active').eq(activeCount - i - 1).css('margin-left', -1);
				}
			}

			if (catalog.bLazy) {
				catalog.bLazy.load($slider.find('.js__catalogue-image'));
			}

			var maxHeight = 0;

			$slider.find('.catalog-slider__item').each(function () {
				if (!$('body').hasClass('internet_explorer') && !$('body').hasClass('edge')) {
					$(this).css('height', '');
				}
				maxHeight = ($(this).height() > maxHeight) ? $(this).height() : maxHeight;
			});

			$slider.find('.catalog-slider__item').height(maxHeight);
			$slider.height(maxHeight);
			$('#homepageCatalogTabs .tabs__item').height(maxHeight);
		});
	}
}

/*
function heroSliderInit(){ // Слайдер на главной (слайд, на слайдах заменить класс js__blazy на js__blazy-slider)
	$('.js__hero-slider').slick({
		arrows: false,
		dots: true,
		dotsClass: 'hero-slider__dots',
		autoplay: true,
		autoplaySpeed: sliderDelay ? sliderDelay*1000 : 10000,
	}).on('setPosition', function(){
		new Blazy({
			selector: '.js__blazy-slider',
			successClass: 'is-loaded',
			loadInvisible: true
		});
	});
}
*/

// function heroSliderInit() { // Слайдер на главной (фейд)
// 	$('.js__hero-slider').slick({
// 		arrows: false,
// 		dots: false,
// 		dotsClass: 'hero-slider__dots',
// 		autoplay: true,
// 		fade: true,
// 		autoplaySpeed: sliderDelay ? sliderDelay * 1000 : 10000,
// 	});
// }

function mobileMenu() { // Мобильное меню
	$(document).on('click', '.js__menu_toggle', function (e) { // Показать/скрыть мобильное меню
		e.preventDefault();
		if ($('body').hasClass('menu__is-show')) {
			mobileMenuHide();
			$('.mobile-menu__item').each(function () {
				$(this).removeClass('mobile-menu__item_hide').css({
					marginTop: '0' + 'px'
				});
			});
		} else {
			mobileMenuShow();
		}
	});

	$(document).on('click', '.js__mobile-menu__next-link', function (e) { // Показать/скрыть подкатегории в мобильном меню
		e.preventDefault();
		var $this = $(this),
			$currentItem = $(this).parents('.mobile-menu__item'),
			$menu = $(this).parents('.mobile-nav');

		if ($currentItem.hasClass('is-active')) {
			$currentItem.removeClass('is-active');
		} else {
			$menu.find('.mobile-menu__item').each(function () {
				$(this).removeClass('is-active');
			});
			$currentItem.addClass('is-active');
		}
	});
}

function mobileMenuShow() { // Показ мобильного меню
	$('body').addClass('menu__is-show');
	// document.documentElement.style.overflowY = 'hidden';
	document.documentElement.style.marginRight = getScrollbarSize() + 'px';
	$('.mobile-nav-vi').slideDown();
}

function mobileMenuHide() { // Скрытие мобильного меню
	$('body').removeClass('menu__is-show');
	$('.mobile-menu').removeClass('mobile-menu__submenu-show');
	$('.mobile-menu__item.is-active').css({
		transform: ''
	}).removeClass('is-active');
	document.documentElement.style.marginRight = '';
	document.documentElement.style.overflowY = '';
	$('.mobile-nav-vi').slideUp();
}

function adaptivePlacemarkPosition() { // Установка положения метки-со-смещенным-центром

	if (window.adaptiveMap == undefined) {
		return;
	}

	var width = $(window).width();

	function killMargins() {
		if (typeof window.adaptiveMap.leftMargin == 'object') {
			window.adaptiveMap.leftMargin.remove();
		}
		if (typeof window.adaptiveMap.rightMargin == 'object') {
			window.adaptiveMap.rightMargin.remove();
		}
		// if (typeof window.adaptiveMap.topMargin=='object') {
		// window.adaptiveMap.topMargin.remove();
		// }
		// if (typeof window.adaptiveMap.bottomMargin=='object') {
		// window.adaptiveMap.bottomMargin.remove();
		// }
	}

	if (width >= 1280) { // Очень широкий экран
		killMargins();
		window.adaptiveMap.leftMargin = window.adaptiveMap.map.margin.addArea({
			top: 0,
			left: 0,
			width: '50%',
			height: '100%'
		});
		window.adaptiveMap.rightMargin = window.adaptiveMap.map.margin.addArea({
			top: 0,
			right: 0,
			width: (width - 1280) / 2,
			height: '100%'
		});
	}

	if (width < 1280 && width >= 600) { // Узкий экран -- ютимся
		killMargins();
		window.adaptiveMap.leftMargin = window.adaptiveMap.map.margin.addArea({
			top: 0,
			left: 0,
			width: '50%',
			height: '100%'
		});
	}

	if (width < 600) { // Экстремально узкий экран (телефон)
		killMargins();
	}

	window.adaptiveMap.map.setCenter(window.adaptiveMap.placemark, window.adaptiveMap.zoom, {
		useMapMargin: true
	});
}

$(function () {

	// disableRightClick();
	// disableSelection();
	// disableDrugging();

	new Blazy({
		selector: '.js__blazy',
		successClass: 'is-loaded',
		loadInvisible: true
	});

	// Пример установки/сброса визуальных флагов обязательности полей формы
	/*
	$('.js__pm-demo').on('change', function(e){
		var $form = $(this).closest('form');
		var obj;
		if($(this).val() == 4) {
			obj = {'r_text': false};
		} else {
			obj = {'r_text': true};
		}
		setRequiredFields($form, obj);
	});
	*/

	// Меню
	// greedyMenu({
	// 	levelClassNames: ['menu', 'submenu'],
	// 	debug: false
	// });

	// Мобильное меню
	mobileMenu();

	// mpMethodsModify();

	// Слайдеры
	catalogSliderInit($('.tabs__item.active .js__catalog-slider'));
	// heroSliderInit();

	$('.js__tabs').on('click', function (e) {
		setTimeout(function () {
			catalogSliderInit($('.tabs__item.active .js__catalog-slider'));
			$('.tabs__item.active .js__catalog-slider').slick('setPosition');
			$('.tabs__item.active .catalog-slider__arrow').css('top', $('.tabs__item.active .minicard__image-link').outerHeight() / 2 - 4);
		}, 10);
	});
	$('.js__tabs_select').on('change', function (e) {
		setTimeout(function () {
			catalogSliderInit($('.tabs__item.active .js__catalog-slider'));
			$('.tabs__item.active .js__catalog-slider').slick('setPosition');
			$('.tabs__item.active .catalog-slider__arrow').css('top', $('.tabs__item.active .minicard__image-link').outerHeight() / 2 - 4);
		}, 10);
	})

	$('.js__aside-menu-toggle').on('click', function (e) {
		e.preventDefault();
		var $toggle = $(this),
			$stealthy = $toggle.parents('.aside-menu').find('.aside-menu__item.stealthy'),
			textActive = $toggle.data('active-text'),
			textNormal = $toggle.data('normal-text');

		if ($toggle.hasClass('is-active')) {
			$toggle.removeClass('is-active');
			$stealthy.slideUp('fast');
			$toggle.text(textNormal);
		} else {
			$toggle.addClass('is-active');
			$stealthy.slideDown('fast');
			$toggle.text(textActive);
		}
	});

	$(document).on('click', '.js__search_toggle', function (e) { // Показать/скрыть форму поиска
		$('body').toggleClass('search__is-show');
		$('.search__input').focus();
	});

	$(document).on('click', '.js__auth_toggle', function (e) { // Показать/скрыть ссылки авторизации
		$('body').toggleClass('auth__is-show');
	});

	$(document).on('click', function (e) {
		var $target = $(e.target);
		if ($target.closest('.search').length == 0 && $('body').hasClass('search__is-show') && $target.closest('.js__search_toggle').length == 0) {
			$('body').removeClass('search__is-show');
		}
		if ($target.closest('.auth').length == 0 && $('body').hasClass('auth__is-show') && $target.closest('.js__auth_toggle').length == 0) {
			$('body').removeClass('auth__is-show');
		}
		if ($target.closest('.js__menu_toggle').length == 0 && $('body').hasClass('menu__is-show') && $target.closest('.mobile-nav').length == 0) {
			mobileMenuHide();
		}
	});

	$(".js__quantity").each(function(){

		var quantityInput = $(this).find('.js__quantity-input');
		var quantityVal = parseInt(quantityInput.val());
		var multiplicity = parseInt(quantityInput.data('multiplicity'));

		$(this).find(".js__increase").off('click').on("click", function(e) {
			e.preventDefault();
			quantityVal = parseInt($(this).closest(".js__quantity").find(".js__quantity-input").val());
			quantityVal = quantityVal + multiplicity;
			$(this).closest(".js__quantity").find(".js__quantity-input").val(quantityVal);
			changeAmount($(quantityInput));
		})

		$(this).find(".js__decrease").off('click').on("click", function(e) {
			e.preventDefault();
			quantityVal = parseInt($(this).closest(".js__quantity").find(".js__quantity-input").val());
			quantityVal <= multiplicity ? quantityVal=multiplicity: quantityVal = quantityVal - multiplicity;
			$(this).closest(".js__quantity").find(".js__quantity-input").val(quantityVal);
			changeAmount($(quantityInput));
		})

		quantityInput.on('change', function(){
			quantityVal = parseInt($(this).val());
			if (quantityVal <= 0 || isNaN(quantityVal)) {
				$(this).val(multiplicity);
			} else {
				quantityVal = quantityVal % multiplicity !== 0 ? (Math.floor(quantityVal / multiplicity) + 1) * multiplicity : quantityVal ;
				$(this).val(quantityVal);
			}
		})
	});

	// Ресайз
	$(window).on('resize', function () {

		setTimeout(function () {
			catalogSliderInit($('.tabs__item.active .js__catalog-slider'));
			$('.tabs__item.active .catalog-slider__arrow').css('top', $('.tabs__item.active .minicard__image-link').outerHeight() / 2 - 4);
		}, 10);

		if ($(window).width() > 1023) {
			if ($('body').hasClass('menu__is-show')) { // Закрыть мобильное меню при большом экране
				mobileMenuHide();
			}
		}

		adaptivePlacemarkPosition(); // Перепозиционирование метки-со-смещенным-центром на Яндекс-карте
	});

})

// Custom JavaScript
document.addEventListener("DOMContentLoaded", function() {

//Init slider on main page
$('.promo_slider').slick({
	slidesToShow: 1,
	infinite: true,
	arrows: false,
	dots: true,
});

//Init clients slider
$('.clients_slider').slick({
	slidesToShow: 6,
	slidesToScroll: 6,
	infinite: true,
	arrows: false,
	responsive: [
	{
		breakpoint: 1379,
		settings: {
			slidesToShow: 1
		}
	}
	]
});

});



