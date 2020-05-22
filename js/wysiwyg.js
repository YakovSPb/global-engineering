function removeJustify() { // Удаляет text-align: justify на телефонах внутри wysiwyg
	if (!$('body').hasClass('device-phone')) return;

	var elements = $('.wysiwyg p, .wysiwyg li, .wysiwyg ol, .wysiwyg ul, .wysiwyg h1, .wysiwyg h2, .wysiwyg h3');

	elements.each(function () {
		if ($(this).getStyleObject().textAlign === 'justify') {
			$(this).css('text-align', 'left');
		}
	});
}

function imgResize(content, factor) { // Растягивание картинки на ширину области контента, если становится мало места для текста, обтекающего картинку
	var minWidth = factor * parseInt(content.css('font-size')),
		contentWidth = content.width();

	content.find('.wysiwyg img.ck-image-left, .wysiwyg img.ck-image-right').each(function () {
		var img = $(this),
			imgWidth = img.width(),
			imgHeight = img.height();
		if (imgHeight > img.parents('.wysiwyg').height()) {
			img.addClass('mb-none');
		} else {
			img.removeClass('mb-none');
		}
		if (!img.data('width') && contentWidth - imgWidth < minWidth) {
			img.data('width', imgWidth);
			img.data('height', imgHeight);
			img.css('width', '100%').css('height', 'auto');
			img.addClass('resize');
		}
		if (img.data('width') && contentWidth - img.data('width') > minWidth) {
			img.css('width', img.data('width'));
			img.css('height', img.data('height'));
			img.removeData('width');
			img.removeData('height');
			img.removeClass('resize');
		}
	});

	content.find('.wysiwyg img').each(function () {
		var img = $(this),
			imgWidth = img.width();
		if (imgWidth >= contentWidth) {
			img.addClass('ck-image-height-auto');
		} else {
			img.removeClass('ck-image-height-auto');
		}
	});
}

$(function () {

	/*
	 ***********************************************************************************************
	 **
	 ** Неформализованная область контента
	 **
	 ***********************************************************************************************
	 */

	imgResize($('.main-content'), 12);

	removeJustify();

	// Эмуляция стилей пользовательской таблицы
	$('.content .wysiwyg table:not(.ck-table-user):not(.ck-table-invisible)').addClass('ck-table-custom').each(function () {
		var padding = parseInt($(this).attr('cellpadding')),
			border = parseInt($(this).attr('border')),
			margin = parseInt($(this).attr('cellspacing'));
		if (margin > 0) {
			$(this).css({
				'border-collapse': 'collapse',
				'border-spacing': margin
			})
		}
		$(this).css({
			'border-width': border,
			'border-style': 'solid',
		}).find('td, th').css({
			'padding': padding
		});
	});

	// Таблица не должна выходить за границы зоны контента
	$(".content").find("table").wrap("<div class='table__wrap'></div>");

	// Раскрывающиеся блоки (CK Editor)
	$(".js__spoiler-show").on("click", function (e) {
		e.preventDefault();
		var $block = $(this).closest('.js__ck-spoiler');
		$(this).addClass('ck-hidden');
		$block.find(".js__spoiler-hide").removeClass('ck-hidden');
		$block.find(".js__spoiler-text").slideDown('fast');
	})
	$(".js__spoiler-hide").on("click", function (e) {
		e.preventDefault();
		var $block = $(this).closest('.js__ck-spoiler');
		$block.find(".js__spoiler-text").slideUp('fast');
		$(this).addClass('ck-hidden');
		$block.find(".js__spoiler-show").removeClass('ck-hidden');
	});

	// Magnific Popup (картинки в CK Editor)
	if ($('body').hasClass('device-mobile')) {
		$('.js__lightbox').each(function () {
			var img = new Image();
			img.src = $(this).attr('href');
			$(img).load(function () {
				$('.js__lightbox').attr('data-width', img.naturalWidth);
				$('.js__lightbox').attr('data-height', img.naturalHeight);
			})
			$(this).off('click').on('click', function (e) {
				e.preventDefault();
				openPhotoSwipe('.js__lightbox', 0);
			})

		})
	} else {
		$.each($('.js__lightbox'), function (index, value) { // Каждая картинка инициализируется отдельно
			MP_init(value, false, true);

		});
	}


	// $.each($('.js__lightbox'), function (index, value) { // Каждая картинка инициализируется отдельно
	// 	MP_init(value, false, true);

	// });

	/**
	 * Табы в зоне контента
	 */
	(function () {
		var $wrapper = $('.js__ck-tabs');
		var $header = $('.js__ck-tabs-header');
		var $body = $('.js__ck-tabs-body');
		var $tab = $('.js__ck-tab');
		var $item = $('.js__ck-item');

		$tab.each(function () {
			$(this).on('click', function (e) {
				e.preventDefault();
				var $target = $(this).data('target');
				$(this).closest($header).find($tab).removeClass('active');
				$(this).addClass('active');
				$(this).closest($wrapper).find($item).removeClass('active');
				$(this).closest($wrapper).find('[data-id="' + $target + '"]').addClass('active');
			})
		})
	})();

	/**
	 * Генерация класса сетки
	 */
	(function () {
		$('.js__gg').each(function(){
			var context = $(this);
			var defaultGridValue = context.find('span').text();
			var gridStringTemplate = 'content-grid-'+defaultGridValue;
			var contentWidth = context.closest('.content ').outerWidth();
			resizeConfig.map(function(item, index){
				var value;
				var startValue = resizeConfig[index - 1] || 0;
				if (startValue < contentWidth && contentWidth < item) {
					value = '_w-'+item+'-'+defaultGridValue;
				} else {
					value = '_w-'+item+'-'+(index+1);
				}
				gridStringTemplate += value;
			});
			context.text(gridStringTemplate);
		})
	})();

	/**
	 * Popup галерея
	 */
	(function (){
		var $wrapper = $('.js__ck-gallery');
		var $cardImg = $('.js__ck-gallery-img');

		$wrapper.each(function(){
			$.each([$(this).find($cardImg)], function(index, value){
				MP_init(value, true, true);
			});
		})
	})();

	// /**
	//  * Wysiwyg slider 
	//  */
	// (function (){
	// 	var $slider = $('.js__ck-slider');
	// 		$slider.slick({
	// 			slidesToShow: 3,
	// 			slidesToScroll: 1,
	// 			dots: false,
	// 			arrows: true,
	// 			prevArrow: '<button type="button" aria-label="Предыдущий слайд" class="ck-review__arrow ck-review__arrow_prev"><svg class="icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#arrow-left"></use></svg></button>',
	// 			nextArrow: '<button type="button" aria-label="Следующий слайд" class="ck-review__arrow ck-review__arrow_next"><svg class="icon "><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#arrow-right"></use></svg></button>',
	// 			infinite: false,
	// 			responsive: [{
	// 				breakpoint: 700,
	// 				settings: {
	// 					slidesToShow: 2,
	// 				}
	// 			},
	// 			{
	// 				breakpoint: 420,
	// 				settings: {
	// 					slidesToShow: 1,
	// 				}
	// 			}
	// 		]
	// 		}).on('setPosition', function (slick) {
	// 			var $maxHeight = 0;
				
	// 			$slider.find('.ck-review__card').each(function () {
	// 				if (!$('body').hasClass('internet_explorer') && !$('body').hasClass('edge')) {
	// 					$(this).css('height', '');
	// 				}
	// 				$maxHeight = ($(this).height() > $maxHeight) ? $(this).height() : $maxHeight;
	// 			});
	// 			$slider.find('.ck-review__card').height($maxHeight);
	// 		});
	// })();

	// /**
	//  * ck-review click handler 
	//  */
	// (function (){
	// 	var $item = $('.js__ck-review-card');
	// 	$item.on('mouseover', function(){
	// 		if ($(this).find('.ddd-truncated').length) {
	// 			$(this).addClass('ddd');
	// 		} else {
	// 			$(this).removeClass('ddd');
	// 		}
	// 	})
	// 	$item.off('click').on('click', function(e){
	// 		e.preventDefault();
	// 		if ($(this).find('.ddd-truncated').length) {
	// 			openPopupText($(this));
	// 		}
	// 	})
	// })();

	/*
	 ***********************************************************************************************
	 **
	 ** Ресайз
	 **
	 ***********************************************************************************************
	 */

	$(window).on('resize', function () {
		imgResize($('.main-content'), 12);
	});

});