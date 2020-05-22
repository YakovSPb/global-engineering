///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Polyfills
//
///////////////////////////////////////////////////////////////////////////////////////////////////

// Polyfill for creating CustomEvents on IE9/10/11

// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

try {
	var ce = new window.CustomEvent('test');
	ce.preventDefault();
	if (ce.defaultPrevented !== true) {
		// IE has problems with .preventDefault() on custom events
		// http://stackoverflow.com/questions/23349191
		throw new Error('Could not prevent default');
	}
} catch(e) {
	var CustomEvent = function(event, params) {
		var evt, origPrevent;
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};

		evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		origPrevent = evt.preventDefault;
		evt.preventDefault = function () {
			origPrevent.call(this);
			try {
				Object.defineProperty(this, 'defaultPrevented', {
					get: function () {
						return true;
					}
				});
			} catch(e) {
				this.defaultPrevented = true;
			}
		};
		return evt;
	};

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent; // expose definition to window
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Функции общего назначения
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function splitByDots() { // Разбиение длинных строк на предложения
	$('.module__message p, .js__split').each(function () { // Переносы в сообщениях

		var p = $(this); // Абзац, с которым работаем
		var content = p.html() + ' '; // Содержимое абзаца
		var linesReal = 0; // Кол-во строк в блочном режиме
		var blocksAmount=0; // Количество блоков в абзаце
		var setBlocks = p.find('span.js__split-block').length; // Количество предустановленных блоков (разметка на блоки уже выполнялась)

		if (setBlocks==0) { // Расстановка блоков
			var newContent = content.replace(/.+?[\.\!\?]+\s/g, function(str){
				blocksAmount++;
				return '<span class="js__split-block">' + str + '</span>';
			});
			p.html(newContent);
		} else {
			blocksAmount = setBlocks;
		}

		p.find('span.js__split-block').css('display','block'); // Установка переносов

		linesReal = Math.round(p.height() / parseInt(p.css('line-height')));
		if (linesReal>blocksAmount) {
			p.find('span.js__split-block').css('display','inline'); // Сброс переносов
		}
	});
}

function openPhotoSwipe(target, index) {

	var template = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">'+
    					'<div class="pswp__bg"></div>'+
						'<div class="pswp__scroll-wrap">'+
							'<div class="pswp__container">'+
								'<div class="pswp__item"></div>'+
								'<div class="pswp__item"></div>'+
								'<div class="pswp__item"></div>'+
							'</div>'+
							'<div class="pswp__ui pswp__ui--hidden">'+
								'<div class="pswp__top-bar">'+
									'<div class="pswp__counter"></div>'+
									'<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>'+
									'<button class="pswp__button pswp__button--share" title="Share"></button>'+
									'<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>'+
									'<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>'+
									'<div class="pswp__preloader">'+
										'<div class="pswp__preloader__icn">'+
										'<div class="pswp__preloader__cut">'+
											'<div class="pswp__preloader__donut"></div>'+
										'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">'+
									'<div class="pswp__share-tooltip"></div>'+
								'</div>'+
								'<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>'+
								'<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>'+
								'<div class="pswp__caption">'+
									'<div class="pswp__caption__center"></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';

	$('body:not(.photoswipe-init)').addClass('photoswipe-init').append(template);

	var $pswp = $('.pswp')[0];
	var items = [];

	$(target).each(function() {
		var item = {
			src: $(this).attr('href'),
			title: $(this).data('title'),
			h: $(this).data('height'),
			w: $(this).data('width')
		};
		items.push(item);
	});

	// console.log(items);

	var options = {
		index: index,
		bgOpacity: 0.85,

	};

	var photoSwipe = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
	photoSwipe.init();
}

function MP_init(objects, enable_gallery, is_image, mainClasses) { // Инициализация Magnific Popup
	var set = $(objects);
	if(!mainClasses){
		mainClasses = '';
	}
	set.magnificPopup({
		type: 'image',
		image: {
			// titleSrc: 'data-title'
		},
		mainClass: mainClasses + ' ' + mfpCataloguePadding,
		fixedContentPos: true,
		removalDelay: 300,
		tLoading: '<div class="preloader_box"><svg class="icon form-spinner"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#spinner"></use></svg></div>',
		closeMarkup: is_image?'<button title="%title%" type="button" class="gallery-close"></button>':'<button title="%title%" type="button" class="mfp-close"></button>',
		closeOnBgClick: true,
		closeBtnInside: is_image?false:true,
		gallery: {
			enabled: enable_gallery,
			preload: [0, 2],
			arrowMarkup: '<button title="%title%" type="button" class="gallery-arrow gallery-arrow--%dir%"></button>'
		},
		overflowY: 'scroll',
		// disableOn: function() {
		// 	if($('.main-content').hasClass('w-' + resizeConfig[4])) {
		// 		return false;
		// 	}
		// 	return true;
		// },
		callbacks: {
			open: function(){
				if(is_image){
					$(this.contentContainer).find('.mfp-close').hide();
				}
				if(this.content.find('.mfp-title').text() == ''){
					this.content.find('.mfp-bottom-bar').hide();
				}
			},
			imageLoadComplete: function () {
				var self = this;
				setTimeout(function () {
					self.wrap.addClass('mfp-image-loaded');
				}, 16);
			},
			buildControls: set.size() == 1 || enable_gallery == false ? function () {} : function () {
				this.container.append(this.arrowLeft.add(this.arrowRight));
			},
			close: function () {
				this.wrap.removeClass('mfp-image-loaded');
			},
			beforeClose: function () {
				$('.gallery-arrow').remove();
				$('.gallery-close').remove();
			},
// 			change: function() {
// 				console.log($('.gallery-arrow').closest('.mfp-container').find('.mfp-figure').height());

// 				$('.gallery-arrow').each(function(){
// 					// $(this).height() = $(this).closest('.mfp-container').find('.mfp-content').height();
// 					setTimeout(function(){
// 						// console.log($(this).height());
// 						console.log($(this).closest('.mfp-container').find('.mfp-figure').height());
// 					},1000);

// ;				});
// 			}
		},
	});
}

function mpMethodsModify(){ // Перегрузка методов Magnific Popup (фиксит баг с календарем во всплывающем окне, добавляет смещение для фиксированных элементов, у которых есть класс js__fixed-element)

	var $fixedElements = $('.js__fixed-element');

	if($fixedElements.length){
		$.magnificPopup.instance.open = function(data) {

			var self = this;

			$.magnificPopup.proto.open.call(this,data);

			$fixedElements.each(function(){
				if($(this).css('position') == 'fixed' && !$('body').hasClass('device-mobile')){
					$(this).css('left', -self.scrollbarSize + 'px');
				}
			});
		};

		$.magnificPopup.instance.close = function() {

			var self = this;

			$.magnificPopup.proto.close.call(this);

			$fixedElements.each(function(){
				if($(this).css('position') == 'fixed'){
					var selfElement = $(this);
					setTimeout(function(){
						selfElement.css('left', '');
					}, self.st.removalDelay);
				}
			});

			if($('.datepicker-container:not(.datepicker-hide)').length){
				$('.js__datepicker').each(function(){
					var $datepicker = $(this);
					$datepicker.datepicker('hide');
				});
			}

		};
	}

}

function greedyMenu(config) { // Меню с фичей "Еще" // 1.0

	config = config || {};

	var levelClassNames = config.levelClassNames || ['menu','submenu'];
		levelClassNames.push('greedy_hidden');

	var debug = config.debug || false;

	var $ul = $('.js__menu-more');
	var $hiddenUl = $('.js__menu-more--hidden');
	var $btn = $('.js__menu-more--switcher');

	var numOfItems = 0;
	var totalSpace = 0;
	var breakWidths = [];

	var btnWidth = $btn.removeClass('hidden').outerWidth();
	$btn.addClass('hidden')

	// Get initial state
	$ul.children().not($btn).outerWidth(function(i, w) {
		totalSpace += w;
		numOfItems += 1;
		breakWidths.push(totalSpace);
	});

	window.greedyMenuInited = false;
	window.greedyListenerActivated = window.greedyListenerActivated || false;

	var loop = 0; // Защита от вечного цикла

	if (debug) {
		console.log('greedyMenu');
		console.log('totalSpace = '  + totalSpace);
		console.log('numOfItems = '  + numOfItems);
		console.log('breakWidths = ' + breakWidths);
	}

	var availableSpace=0, numOfVisibleItems=0, requiredSpace=0;

	function check() {

		if (debug) {
			console.log('===');
			console.log('Check iteration');
		}

		loop++;
		if (loop>20) {
			if (debug) {
				console.log('Loop detected...');
			}
			return;
		}

		// Get instant state
		availableSpace = $ul.width();
		if (requiredSpace!==0 && numOfVisibleItems>=0 && numOfVisibleItems!==numOfItems) {
			availableSpace -= btnWidth;
			if (debug) {
				console.log('Reducing availableSpace to btnWidth ('+btnWidth+'px)');
			}
		}
		numOfVisibleItems = $ul.children().not($btn).length;
		requiredSpace = breakWidths[numOfVisibleItems - 1];

		if (debug) {
			console.log('availableSpace='+availableSpace);
			console.log('numOfVisibleItems='+numOfVisibleItems);
			console.log('requiredSpace='+requiredSpace);
		}

		// There is not enought space
		if (requiredSpace > availableSpace) {
			$ul.children().not($btn).last().prependTo($hiddenUl).addClass('just-moved');
			numOfVisibleItems -= 1;
			if (debug) {
				console.log('(-) Shrinking...');
			}
			check();
		}

		// There is more than enough space
		else if (availableSpace > breakWidths[numOfVisibleItems]) {
			$hiddenUl.children().first().insertBefore($btn).addClass('just-moved');
			numOfVisibleItems += 1;
			if (debug) {
				console.log('(+) Eхpanding...');
			}
			check();
		}

		// К этому моменту меню отрегулировано

		// Update the button accordingly
		$btn.attr("count", numOfItems - numOfVisibleItems);
		if (numOfVisibleItems === numOfItems) {
			$btn.addClass('hidden');
		} else {
			$btn.removeClass('hidden');
		}

		// +1 ко всем уровням в скрытом меню
		$hiddenUl.find('.just-moved').each(function() {
			var $justMovedEl = $(this);
			for (var x=levelClassNames.length-2;x>=0;x--) {
				var oldSetOfClasses = makeSetOfClasses(levelClassNames,x,0);
				var newSetOfClasses = makeSetOfClasses(levelClassNames,x,1);
				$.each(oldSetOfClasses, function(index,oldClass) {
					var $set = $justMovedEl.find('.'+oldClass);
					if ($justMovedEl.hasClass(oldClass)) {
						$set = $set.add($justMovedEl);
					}
					$set.not('.just-adjusted').removeClass(oldSetOfClasses[index]).addClass(newSetOfClasses[index]).addClass('were-processed');
				})
				$justMovedEl.find('.were-processed').addClass('just-adjusted').removeClass('were-processed');
				if ($justMovedEl.hasClass('were-processed')) {
					$justMovedEl.addClass('just-adjusted').removeClass('were-processed');
				}
			}
			$justMovedEl.removeClass('just-adjusted');
			$justMovedEl.find('.just-adjusted').removeClass('just-adjusted');
			$justMovedEl.removeClass('just-moved');
		})

		// -1 ко всем уровням в видимом меню
		$ul.not($btn).find('.just-moved').each(function() {
			var $justMovedEl = $(this);
			for (var x=1;x<=levelClassNames.length-1;x++) {
				var oldSetOfClasses = makeSetOfClasses(levelClassNames,x,0);
				var newSetOfClasses = makeSetOfClasses(levelClassNames,x,-1);
				$.each(oldSetOfClasses, function(index,oldClass) {
					var $set = $justMovedEl.find('.'+oldClass);
					if ($justMovedEl.hasClass(oldClass)) {
						$set = $set.add($justMovedEl);
					}
					$set.not('.just-adjusted').removeClass(oldSetOfClasses[index]).addClass(newSetOfClasses[index]).addClass('were-processed');
				})
				$justMovedEl.find('.were-processed').addClass('just-adjusted').removeClass('were-processed');
				if ($justMovedEl.hasClass('were-processed')) {
					$justMovedEl.addClass('just-adjusted').removeClass('were-processed');
				}
			}
			$justMovedEl.removeClass('just-adjusted');
			$justMovedEl.find('.just-adjusted').removeClass('just-adjusted');
			$justMovedEl.removeClass('just-moved');
		})

		$ul.find('.greedy_hidden').hide();
		$ul.css('overflow','visible');

		loop--;
	}

	function makeSetOfClasses(names,x,shift) {
		return [names[x+shift],  names[x+shift]+'__item',  names[x+shift]+'__item--wrap',  names[x+shift]+'__link'];
	}

	// Проверка и назначение слушателя имеет смысл только тогда, когда брейкпоинты определены
	if (breakWidths[0]!=0) {

		// Флаг инициализации
		window.greedyMenuInited = true;

		// Слушатель
		$(window).resize(function() {
			if (debug) {
				console.log('Resize event occured');
			}
			check();
		});

		// Начало проверки (дальше она рекурсивно перезапустится сама)
		check();
	}
	else {

		// При каждом ресайзе, если меню не инициализировано, пытаемся инициализоваться
		if (window.greedyListenerActivated==false) {
			$(window).resize(function() {
				if (window.greedyMenuInited==false) {
					greedyMenu(config);
				}
			});
		}
	}

	// Флаг активации слушателя на событие ресайза
	window.greedyListenerActivated = true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Всплываюшие окна
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function message(config) { // Сформировать html сообщения
	var emptyText = '';
	if (config.html.length) {
		if (config.html.match(/\<[a-z]+/i) == null) {
			config.html = '<p>' + config.html + '</p>'; // Если сообщение не содержит тегов, оборачиваем в абзац
		}
	}
	else {
		emptyText = 'empty-text';
	}
	config.classname = typeof config.classname=='undefined' ? '' : config.classname;

	return '\
		<div class="module module--message '+ config.classname +'"> \
			<div class="module__message clear '+ config.type +'"> \
				<div class="message__title-w"> \
					<svg class="icon message__icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#' + config.type + '"></use></svg>\
					<div class="message__title">' + config.title + '</div> \
				</div> \
				<div class="message__text ' + (config.compress ? ' compress' : '') + ' '+ emptyText +'" ' + (config.justify ? 'style="text-align:justify;"' : '') + '> \
					' + config.html + ' \
				</div> \
			</div> \
		</div> \
	';
}

function messageSmall(config) { // Сформировать html сообщения
	config.classname = typeof config.classname=='undefined' ? '' : config.classname;
	return '\
		<div class="module module--message '+ config.classname +'"> \
			<div class="module__message-small '+ config.type +'"> \
				<svg class="icon message__icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#'+ config.type +'"></use></svg> \
				<div class="message__text">' + config.title + '</div> \
			</div> \
		</div> \
	';
}

function messageSmallInverted(config) { // Сформировать html сообщения
	config.classname = typeof config.classname=='undefined' ? '' : config.classname;
	return '\
		<div class="module module--message '+ config.classname +'"> \
			<div class="module__message-small invert '+ config.type +'"> \
				<svg class="icon message__icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#'+ config.type +'"></use></svg> \
				<div class="message__text">' + config.title + '</div> \
			</div> \
		</div> \
	';
}

function popup(_config) { // Low level: открыть всплывающее окно с произвольным html внутри
	var config = {
			title: (_config.title !== undefined) ? '<div class="popup__title">' + _config.title + '</div>' : '',
			html: (_config.html !== undefined) ? '<div class="popup__content">' + _config.html + '</div>' : '',
			classes: (_config.classes !== undefined) ? _config.classes : '',
			closeButton: (_config.closeButton !== undefined) ? _config.closeButton : true,
			closeBg: (_config.closeBg !== undefined) ? _config.closeBg : true,
			closeEsc: (_config.closeEsc !== undefined) ? _config.closeEsc : true,
			closeBtnInside: (_config.closeBtnInside !== undefined) ? _config.closeBtnInside : true,
			buttons: (_config.buttons !== undefined) ? _config.buttons : false,
			openCallback: (_config.open !== undefined) ? _config.open : false,
			changeCallback: (_config.change !== undefined) ? _config.change : false,
			closeCallback: (_config.close !== undefined) ? _config.close : false,
			isGallery: (_config.isGallery !== undefined) ? _config.isGallery : false,
			closeMarkupOutside: (_config.closeMarkupOutside !== undefined) ? _config.closeMarkupOutside : false,
		},
		buttons = '';

	if(config.buttons){
		buttons = '<div class="popup-buttons">';

		config.buttons.forEach(function(item){
			var color = (item.color) ? 'color:' + item.color + ';' : '',
				bgColor = (item.bgColor) ? 'background-color:' + item.bgColor + ';' : '',
				type = 'popup-buttons__item--' + item.type;

			buttons += '<a href="#" style="' + color + bgColor + '" class="popup-buttons__item ' + type + '">' + item.text + '</a>';
		});

		buttons += '</div>';
	}

	$.magnificPopup.open({
		items: {
			src: '<div class="popup-wrapper"><div class="content main-content popup ' + config.classes + '">' + config.title + config.html + buttons +'</div></div>',
			type: 'inline'
		},
		removalDelay: 300,
		overflowY: 'scroll',
		closeMarkup: config.closeMarkupOutside ? '<button title="Закрыть (Esc)" type="button" class="gallery-close"></button>' : '<button title="Закрыть (Esc)" type="button" class="mfp-close"></button>',
		closeOnBgClick: config.closeBg,
		showCloseBtn: config.closeButton,
		enableEscapeKey: config.closeEsc,
		closeBtnInside: config.closeBtnInside,
		gallery: {
			enabled: config.isGallery,
			preload: [0, 2],
			arrowMarkup: '<button title="%title%" type="button" class="gallery-arrow gallery-arrow--%dir%"></button>',
		},

		callbacks: {
			open: function () {
				if(config.buttons){
					config.buttons.forEach(function(item, index){
						$('.popup-buttons__item').eq(index).on('click', function(e){
							e.preventDefault();
							if (typeof item.callback == 'function') {
								item.callback();
							}
						})
					});
				}

				var modalResizeContent = new ResizeContent('.popup.main-content', resizeConfig);
				modalResizeContent.setBreakpoint();
				$(window).on('resize', function(){
					modalResizeContent.setBreakpoint();
				});

				if(config.openCallback && (typeof config.openCallback == 'function')){
					config.openCallback();
				}
			},
			close: function () {
                if (config.closeCallback && (typeof config.closeCallback == 'function')) {
                    config.closeCallback();
                }
			},
			change: function() {
				if (config.changeCallback && (typeof config.changeCallback == 'function')) {
					config.changeCallback();
				}
			}
		}
	});
}

function popupMessage(configMessage, configPopup) { // открыть всплывающее окно с сообщением внутри
	configPopup.classes = (configPopup.classes !== undefined) ? configPopup.classes + ' clear' : 'clear';
	configPopup.html = message(configMessage);
	configPopup.open = function(){
		splitByDots();
	};
	popup(configPopup);
}

function closePopup() { // Закрыть окно
	$.magnificPopup.close();
}

function growlMessage(title, message, type) { // Оповещение Growl
	switch(type) {
		case 'error':
			$.growl.error({title: title, message: message });
			break;
		case 'success':
			$.growl.notice({title: title, message: message });
			break;
		case 'alert':
			$.growl.warning({title: title, message: message });
			break;
		default:
			$.growl({title: title, message: message });
	}
};

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Работа с Cookie
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function getCookie(name) { // Получить значение cookie
	var start = document.cookie.indexOf(name + '=');
	var len = start + name.length + 1;
	if ((!start) && (name != document.cookie.substring(0, name.length))) {
		return null;
	}
	if (start == -1)
		return null;
	var end = document.cookie.indexOf(';', len);
	if (end == -1)
		end = document.cookie.length;
	return unescape(document.cookie.substring(len, end));
}

function setCookie(name, value, expires, path, domain, secure) { // Установить cookie
	var today = new Date();
	today.setTime(today.getTime());
	if (expires) {
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date(today.getTime() + (expires));
	document.cookie = name + '=' + escape(value) + ((expires) ? ';expires=' + expires_date.toGMTString() : '') + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ((secure) ? ';secure' : '');
}

function deleteCookie(name, path, domain) { // Удалить cookie
	if (getCookie(name)) {
		document.cookie = name + '=' + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Форматирование чисел
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function intValue(value) {
	if (isNaN(value)) {
		return 0;
	}
	else {
		return parseInt(value);
	}
}

function floatFormattedString(value) {
	value = String(value).replace(/,/,'.');
	if (isNaN(value)) {
		return "0.00";
	}
	else {
		return Number(value).toFixed(2);
	}
}

function floatFormattedStringAutoFractional(value) {
	value = String(value).replace(/,/,'.');
	if (isNaN(value)) {
		return "0";
	}
	else {
		if (value.search(/\./)!=-1) { // Есть дробная часть
			return Number(value).toFixed(2);
		}
		else {
			return value;
		}
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Яндекс-карта
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function ymapOnePointFixed(mapElement,mapData,officeData) { // Одна точка (заданные координаты)

	/*
		1. Определяем с помощью инструмента (https://constructor.maps.yandex.ru/location-tool/) позицию точки
		2. Вставляем карту
		3. Позиционируем (в консоль пишутся координаты центра карты)
		4. Фиксируем координаты центра карты в вывове функции, комментим вывод в консоль

		// Пример вызова (неадаптивный режим, стандартная иконка)
		ymapOnePointFixed(
			'#map', {
				center: [59.933952158779135, 30.43019923175174], // Центр карты
				zoom: 16,
				adaptive: false,
			}, {
				position: [59.93447598540856,30.43674952645865], // Положение офиса
				hintContent: '',
				balloonContent: '',
				balloonOpened: false,
				icon: {},
			}
		);

		// Пример вызова (адаптивный режим, своя иконка)
		ymapOnePointFixed(
			'#map', {
				center: [], // Центр карты наследуется от офиса
				zoom: 16,
				adaptive: true,
			}, {
				position: [59.93447598540856,30.43674952645865], // Положение офиса
				hintContent: '',
				balloonContent: '',
				balloonOpened: false,
				icon: {},
			}
		);

		// Стандартная иконка, перекрашенная в colorMain (https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage/)
		icon: {
			preset: 'islands#circleDotIcon', // circleDotIcon, dotIcon
			iconColor: colorMain,
		}

		// Стандартная иконка предустановленного цвета
		icon: {
			preset: 'islands#blueCircleDotIcon',
		}

		// Своя иконка
		icon: {
			iconLayout: 'default#image',
			iconImageHref: '/img/marker.png',
			iconImageSize: [100,100],
			iconImageOffset: [-50,-100], // Точка привязки внизу посередине
		}
	*/

	var map, placemark;

	if (mapData.adaptive) { // В адаптивном режиме офис становится по центру (но с учетом невидимых отступов, так что визуально это не обязательно будет центр карты)
		mapData.center = officeData.position;
	}

	$.getScript('https://api-maps.yandex.ru/2.1/?lang='+yandexMaps.locale+'&apikey='+yandexMaps.apiKey).done(function() {
		ymaps.ready(function() {
			map = new ymaps.Map($(mapElement)[0], {
				center: mapData.center,
				zoom: mapData.zoom,
				controls: []
			});
			map.controls.add('typeSelector');
			map.controls.add('zoomControl');
			map.behaviors.disable(['scrollZoom']);
			placemark = new ymaps.Placemark(officeData.position, {
				hintContent: officeData.hintContent,
				balloonContent: officeData.balloonContent
			}, officeData.icon);
			map.geoObjects.add(placemark);
			if (officeData.balloonOpened) {
				placemark.balloon.open();
			}
			// map.events.add('actionend', function(e) { // Вывод в консоль координат центра карты -- закомментить на продакшене
				// console.log(map.getCenter());
			// });
			if (mapData.adaptive) {
				window.adaptiveMap = {
					map: map,
					placemark: officeData.position,
					zoom: mapData.zoom,
					leftMargin: undefined,
					rightMargin: undefined
				};
				adaptivePlacemarkPosition();
			}
			// Компенсация высоты кастомной иконки
			if (officeData.icon.iconImageSize!=undefined) {
				map.margin.addArea({
					top: 0,
					left: 0,
					width: '100%',
					height: officeData.icon.iconImageSize[1]+'px'
				});
				map.setCenter(officeData.position, mapData.zoom, {useMapMargin: true});
			}
		})
	})
}

function ymapOnePointResolved(mapElement,mapData,officeData) { // Одна точка (вычисление позиции через геокодер)

	/*
		// Пример вызова
		ymapOnePointResolve(
			'#map', {
				zoom: 16
			}, {
				address : 'Санкт-Петербург, Невский пр., д.1',
				hintContent: '',
				balloonContent: '',
				balloonOpened: false,
				icon: { // Стандартная иконка
					preset: 'islands#redCircleDotIcon',
					iconColor: colorMain,
				},
				icon: { // Своя иконка
					iconLayout: 'default#image',
					iconImageHref: '/img/marker.png',
					iconImageSize: [87,58],
					iconImageOffset: [-42,-58]
				}
			}
		);
	*/

	var map, placemark, iconParams;

	mapElement = $(mapElement);
	iconParams = officeData.icon;

	$.getScript('https://api-maps.yandex.ru/2.1/?lang='+yandexMaps.locale+'&apikey='+yandexMaps.apiKey).done(function() {
		ymaps.ready(function() {
			ymaps.geocode(officeData.address, { results: 1 }).then(
				function (res) {
					var geoObject = res.geoObjects.get(0),
						coords = geoObject.geometry.getCoordinates();
					map = new ymaps.Map(
						mapElement[0], {
							center: coords,
							zoom: mapData.zoom,
							controls: []
						}
					);
					placemark = new ymaps.Placemark(coords, {
						hintContent: officeData.hintContent,
						balloonContent: officeData.balloonContent
					}, iconParams);
					map.geoObjects.add(placemark);
					map.controls.add('typeSelector');
					map.controls.add('zoomControl');
					map.behaviors.disable(['rightMouseButtonMagnifier', 'scrollZoom']);
					if (officeData.balloonOpened) {
						placemark.balloon.open();
					}
				}
			);
		})
	})
}

function ymapSeveralPoints(mapElement,raw,options) { // Несколько точек (кластеризация)

	/*
		mapElement - блок на странице, куда вставляется карта (селектор jQuery) // #map или там .js__map-nest
		raw        - массив объектов, свойство geo которых будет подвергаться геокодированию (или будут браться координаты из свойства gps)
		options    - объект параметров (стиль иконки + что-то в зависимости от проекта)
	*/

	/*
	options = {
		icon: { // Своя иконка
			iconLayout: 'default#image', // Свое изображение иконки
			iconImageHref: '/img/marker.png', // Файл маркера
			iconImageSize: [28, 34], // Размеры иконки
			iconImageOffset: [-15, -34] // Смещение левого верхнего угла иконки относительно её "ножки" (точки привязки)
		}
		icon: { // Стандартная иконка некоего цвета -- https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage/
			preset: 'islands#darkBlueCircleDotIcon',
		}
		icon: { // Иконка основного цвета сайта (по умолчанию)
			preset: 'islands#circleDotIcon',
			iconColor: colorMain,
		}
	}
	*/

	var $mapElement = $(mapElement+':first'); // Блок на странице, куда вставляется карта
	var POI = []; // POI, успешно прошедшие геокодирование
	var clusterer; // Кластеризатор

	if (typeof options != 'object') { // Нет параметров
		options = {};
	}

	if (typeof options.icon != 'object') { // Не задан стиль иконки
		options.icon = {
			preset: 'islands#circleDotIcon',
			iconColor: colorMain,
		}
	};

	$.getScript('https://api-maps.yandex.ru/2.1/?lang='+yandexMaps.locale+'&apikey='+yandexMaps.apiKey).done(function() {
	// $.getScript('https://api-maps.yandex.ru/2.1/?lang='+yandexMaps.locale).done(function() {
		ymaps.ready(function() {
			$.cachedScript('/libs/pie-chart-clusterer.min.js').done(function() {

				if (count(raw)) {

					ymaps.modules.require(['PieChartClusterer'], function (PieChartClusterer) {

						clusterer = new PieChartClusterer({
							groupByCoordinates: false,
							openBalloonOnClick: true,
							clusterDisableClickZoom: false
						});

						for (x in raw) {
							(function (x) {
								if (count(raw[x]['gps'])) { // Есть координаты
									POI[x] = { // Геокодирование не требуется
										key: x,
										gps: raw[x]['gps'],
										data: raw[x]
									}
								}
								else {
									ymaps.geocode(raw[x].geo, { results: 1 }).then(
										function (res) {

											// Получаем координаты
											var dot = res.geoObjects.get(0);

											// Если не получилось -- показ сообщения об ошибке, т.к. метки добавляются на карту только поле геокодирования ВСЕХ точек
											if (dot==null) {
												if ($mapElement.text()=='') {
													$mapElement.height('auto').html(messageSmall({
														'type': 'error',
														'classname': 'module--mb-none',
														'title': __.msg001
													}));
												}
											}

											// Пополняем массив POI
											POI[x] = {
												key: x,
												gps: dot.geometry.getCoordinates(),
												data: raw[x]
											};

											// Кэш координат
											$.post('/include/modules/attachable/filials/ajax/cache_coordinates.php', {'id':x,'coords':POI[x].gps,'context':pageContext});

											// Все POI успешно геокодированы
											if (count(raw) == count(POI)) {
												setPlacemarks();
											}
										}
									);
								}
							})(x);
						}

						// Случай, когда геокодирования вообще не требовалось, т.к. все POI были кэшированы
						if (count(raw) == count(POI)) {
							setPlacemarks();
						}
					});
				}
				else {
					setPlacemarks(); // Нет точек, центр СПб
				}

				// Классический кластеризатор
				/*
				clusterer = new ymaps.Clusterer({
					preset: 'islands#darkBlueClusterIcons',
					groupByCoordinates: false,
					openBalloonOnClick: true,
					clusterDisableClickZoom: false
				});
				*/
			})
		});

	});

	function setPlacemarks() {

		// Нет ни одной точки -- показываем центр СПб и выходим
		if (count(POI)==0) {
			map = new ymaps.Map($mapElement[0], {
				center: [59.947769926648824,30.35661676501897],
				zoom: 9,
				controls: []
			});
			map.behaviors.disable(['scrollZoom']);
			return;
		}

		// Формируем объект метки и добавляем его в кластеризатор
		for (x in POI) {

			// Внешний вид и базовое поведение
			placemark = new ymaps.Placemark(
				[POI[x].gps[0], POI[x].gps[1]],
				{
					hintContent: POI[x].data.hint,
					balloonContentHeader: POI[x].data.name,
					balloonContentBody: POI[x].data.text,
					// balloonContentFooter: 'Подвал',
				},
				options.icon // Объект параметров иконки
			);

			// Нестандартный (не балун) обработчик клика по метке
			// (function(x) {
				// placemark.events.add('click', function (e) {
					// if (true) {
						// e.preventDefault();
						// openBranchCardAsPopup(x);
						// return false;
					// }
					// else {
						// return function(x) {
							// return false;
						// }
					// }
				// });
			// })(x);

			// Добавляем метку в кластеризатор
			clusterer.add(placemark);
			// map.geoObjects.add(placemark); // Или сразу на карту
		}

		// Получение фокуса текущим объектом (если объекты в "каше")
		// clusterer.events.add(['mouseenter', 'mouseleave'], function (e) {
			// var target = e.get('target'); // Геообъект (источник события)
			// var eType	= e.get('type'); // Тип события
			// var zIndex = Number(eType === 'mouseenter') * 1000; // 1000 или 0 в зависимости от типа события
			// target.options.set('zIndex', zIndex);
		// });

		// Вывод карты (масштаб выбирается автоматически) // Зазор по 50px со всех сторон
		var params = ymaps.util.bounds.getCenterAndZoom(
			clusterer.getBounds(),
			[$mapElement.width()-50*2, $mapElement.height()-50*2]
		);
		params.controls = [];
		if (params.zoom>18) { // Слишком крупно, нет таких тайлов
			params.zoom = 15;
		}

		// Карта
		map = new ymaps.Map(
			$mapElement[0],
			params
		);

		// Отступы на карте
		var mapPadding = [ // px
			50, 50, 50, 50
		];
		map.margin.addArea({ // Верх
			top: 0,
			left: 0,
			width: '100%',
			height: mapPadding[0] + 'px'
		});
		map.margin.addArea({ // Справа
			top: 0,
			right: 0,
			width: mapPadding[1] + 'px',
			height: '100%'
		});
		map.margin.addArea({ // Снизу
			bottom: 0,
			left: 0,
			width: '100%',
			height: mapPadding[2] + 'px'
		});
		map.margin.addArea({ // Слева
			top: 0,
			left: 0,
			width: mapPadding[3] + 'px',
			height: '100%'
		});
		if (typeof options.icon.iconImageSize == 'object') { // Компенсация высоты кастомной иконки
			map.margin.addArea({
				top: 0,
				left: 0,
				width: '100%',
				height: mapPadding[0] + options.icon.iconImageSize[1]+'px'
			});
		}
		map.setCenter(map.getCenter(), map.getZoom(), {useMapMargin: true});

		// Элементы управления (https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/)

		// Возможные значения ключей:
		// "fullscreenControl" - кнопка разворачивания карты на весь экран control.FullscreenControl;
		// "geolocationControl" - кнопка определения местоположения пользователя control.GeolocationControl;
		// "routeEditor" - кнопка включения и отключения поведения "редактор маршрута" control.RouteEditor;
		// "rulerControl" - кнопка включения и отключения поведения "линейка" control.RulerControl;
		// "searchControl" - панель поиска control.SearchControl;
		// "trafficControl" - панель пробок control.TrafficControl;
		// "typeSelector" - панель переключения типа карты control.TypeSelector;
		// "zoomControl" - ползунок масштаба control.ZoomControl;

		map.controls.add('typeSelector');
		map.controls.add('fullscreenControl');
		map.controls.add('zoomControl');

		// Поведения (https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/)

		// Список поведений карты, включенных сразу при создании карты.
		// По умолчанию - "drag", "dblClickZoom", "rightMouseButtonMagnifier" для настольных браузеров, "drag", "dblClickZoom" и "multiTouch" - для мобильных.
		// Возможные значения ключей:
		// "default" - короткий синоним для включения/отключения поведений карты по умолчанию;
		// "drag" - перемещение карты при нажатой левой кнопке мыши либо одиночным касанием behavior.Drag;
		// "scrollZoom" - изменение масштаба колесом мыши behavior.ScrollZoom;
		// "dblClickZoom" - масштабирование карты двойным щелчком кнопки мыши behavior.DblClickZoom;
		// "multiTouch" - масштабирование карты двойным касанием (например, пальцами на сенсорном экране) behavior.MultiTouch;
		// "rightMouseButtonMagnifier" - увеличение области, выделенной правой кнопкой мыши (только для настольных браузеров), behavior.RightMouseButtonMagnifier;
		// "leftMouseButtonMagnifier" - увеличение области, выделенной левой кнопкой мыши либо одиночным касанием, behavior.LeftMouseButtonMagnifier;
		// "ruler" - измерение расстояния behavior.Ruler;
		// "routeEditor" - редактор маршрутов behavior.RouteEditor;

		map.behaviors.disable(['scrollZoom']);

		// map.behaviors.disable(['drag', 'rightMouseButtonMagnifier', 'scrollZoom']);
		// map.behaviors.enable('ruler');

		// Добавляем кластеризатор на карту
		map.geoObjects.add(clusterer);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Примитивы и утилиты
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function valid_json(data) { // Проверка, JSON ли это и объект ли на выходе
	var result;
	try {
		result = window.JSON.parse(data);
	} catch (e) {
		return false;
	}
	return typeof result == 'object';
}

/*
function count(mixed_var, mode) { // Подсчет количества элементов массива (или свойств объекта)
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// input by: _argos
	var key,
	cnt = 0;
	if (mode == 'COUNT_RECURSIVE')
		mode = 1;
	if (mode != 1)
		mode = 0;
	for (key in mixed_var) {
		cnt++;
		if (mode == 1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor === Object)) {
			cnt += count(mixed_var[key], 1);
		}
	}
	return cnt;
}
*/

function count(array) { // Подсчет количества элементов массива (или свойств объекта)
	return Object.keys(array).length;
}

function trim(str, charlist) { // Удаление начальный и конечных пробелов
	// +	 original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +	 improved by: mdsjack (http://www.mdsjack.bo.it)
	// +	 improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
	// +		input by: Erkekjetter
	// +	 improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
	var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
	return str.replace(re, '');
}

function dump(arr, level) { // Вывод отладочной информации
	var print_red_text = '',
	level_padding = '';
	if (!level)
		level = 0;
	for (var j = 0; j < level + 1; j++)
		level_padding += "	";
	if (typeof(arr) == 'object') {
		for (var item in arr) {
			var value = arr[item];
			if (typeof(value) == 'object') {
				print_red_text += level_padding + "'" + item + "' :\n";
				print_red_text += print_r(value, level + 1);
			} else {
				print_red_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else {
		print_red_text = "===>" + arr + "<===(" + typeof(arr) + ")";
	}
	return print_red_text;
}

function getScrollbarSize() { // Расчет ширины скроллбара
	// thx David
	var scrollDiv = document.createElement("div");
	var scrollbarSize = 0;
	scrollDiv.id = "mfp-sbm";
	scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
	document.body.appendChild(scrollDiv);
	scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);
	return scrollbarSize;
}

function disableRightClick(element) { // Запрет вызова контекстного меню
	if (element==undefined) {
		element = $('body').get(0);
	}
	function preventer(event) {
		event.preventDefault();
		event.stopPropagation();
		event.cancelBubble = true;
	}
	if (element.addEventListener) {
		element.addEventListener('contextmenu', preventer, false);
	} else if (document.attachEvent) {
		element.attachEvent('oncontextmenu', preventer);
	}
}

function disableSelection(element) { // Запрет выделения

	var preventSelection = false;

	if (element==undefined) {
		element = $('body').get(0);
	}

	function addHandler(element, event, handler) {
		if (element.attachEvent)
			element.attachEvent('on' + event, handler);
		else
			if (element.addEventListener)
				element.addEventListener(event, handler, false);
	}

	function removeSelection() {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection && document.selection.clear)
			document.selection.clear();
	}

	function killCtrlA(event) {
		var event = event || window.event;
		var sender = event.target || event.srcElement;
		if (sender.tagName.match(/INPUT|TEXTAREA/i)) {
			return;
		}
		var key = event.keyCode || event.which;
		if (event.ctrlKey && key == 'A'.charCodeAt(0)) { // 'A'.charCodeAt(0) можно заменить на 65
			removeSelection();
			if (event.preventDefault) {
				event.preventDefault();
			}
			else {
				event.returnValue = false;
			}
		}
	}

	// не даем выделять текст мышкой
	addHandler(element, 'mousemove', function () {
		if (preventSelection)
			removeSelection();
	});
	addHandler(element, 'mousedown', function (event) {
		var event = event || window.event;
		var sender = event.target || event.srcElement;
		preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
	});

	// борем dblclick
	// если вешать функцию не на событие dblclick, можно избежать
	// временное выделение текста в некоторых браузерах
	addHandler(element, 'mouseup', function () {
		if (preventSelection)
			removeSelection();
		preventSelection = false;
	});

	// борем ctrl+A
	// скорей всего это и не надо, к тому же есть подозрение
	// что в случае все же такой необходимости функцию нужно
	// вешать один раз и на document, а не на элемент
	addHandler(element, 'keydown', killCtrlA);
	addHandler(element, 'keyup', killCtrlA);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Формы
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function setRequiredFields($form,params) { // Установка визуального признака обязательности для массива полей
	// params = {
	// 	'r_fio': true,
	// 	'r_text': false,
	// }
	var $star;
	for (var key in params) {
		$star = $form.find('.form__'+key+' .form__required');
		if (params[key]) {
			$star.show();
		}
		else {
			$star.hide();
		}
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Расширения jQuery
//
///////////////////////////////////////////////////////////////////////////////////////////////////

$.fn.digitsOnly = function () { // Ввод только цифр в поле ввода
	this.on("keypress keydown", function (e) {
		var code = e.keyCode || e.which;
		var key_codes = [35, 36, 37, 39, 44, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8, 9, 13, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
		if (!($.inArray(code, key_codes) >= 0)) {
			e.preventDefault();
		}
	});
}

$.fn.smartAlign = function (align, cell_width) { // Форматирование колонки цены в таблице
	var max_width = 0,
		width = 0,
		shift = 0,
		value;
	if (cell_width == undefined) {
		cell_width = this.actual('innerWidth');
	}
	this.each(function () {
		$(this).css({
			'text-align': align,
			'padding-left': 0,
			'padding-right': 0
		});
		if ($(this).find('.js__smart-align_w').size() == 0) {
			$(this).wrapInner('<span class="js__smart-align_w"></span>');
		}
		value = $(this).find('.js__smart-align_w').css({
			'padding-left': 0,
			'padding-right': 0
		});
		width = value.actual('width');
		if (width > max_width) {
			max_width = width;
		}
	})
	shift = (cell_width - max_width) / 2;
	this.each(function () {
		$(this).find('.js__smart-align_w').css('padding-' + align + '', shift);
	})
	return $(this);
};

$.fn.actual = function () { // Расчет реального размера скрытых блоков
	if (arguments.length && typeof arguments[0] == 'string') {
		var dim = arguments[0];
		if (this.is(':visible')) {
			return this[dim]();
		}
		var block_style = $(this).getStyleObject();
		var clone = $(this).clone().css(block_style).css({
				position: 'absolute',
				top: '-9999px',
				visibility: 'hidden'
			}).appendTo('body');
		var s = clone[dim]();
		clone.remove();
		return s;
	}
	return undefined;
}

$.fn.getStyleObject = function () { // Совокупность вычисленных стилей объекта
	var dom = this.get(0);
	if (dom == undefined) {
		return {};
	}
	var style;
	var returns = {};
	if (window.getComputedStyle) {
		var camelize = function (a, b) {
			return b.toUpperCase();
		};
		style = window.getComputedStyle(dom, null);
		for (var i = 0, l = style.length; i < l; i++) {
			var prop = style[i];
			var camel = prop.replace(/\-([a-z])/, camelize);
			var val = style.getPropertyValue(prop);
			returns[camel] = val;
		};
		return returns;
	};
	if (style = dom.currentStyle) {
		for (var prop in style) {
			returns[prop] = style[prop];
		};
		return returns;
	};
	if (style = dom.style) {
		for (var prop in style) {
			if (typeof style[prop] != 'function') {
				returns[prop] = style[prop];
			}
		}
		return returns;
	}
	return returns;
}

$.cachedScript = function (url, options) { // Загрузка скрипта с кэшированием

	// Allow user to set any option except for dataType, cache, and url
	options = $.extend(options || {}, {
			dataType: 'script',
			cache: true,
			url: url
		});

	// Use $.ajax() since it is more flexible than $.getScript
	// Return the jqXHR object so we can chain callbacks
	return jQuery.ajax(options);
};

$.fn.stringExploder = function (rowClass) { // Разбиение текста на строки-блоки (как браузер)

	this.each(function () {

		function normalize(str) {
			var out = str;
			out = out.replace(/[\n\r\t]/g, ' ');
			out = out.replace(/[ ]+/g, ' ');
			out = out.replace(/[\-]+/g, '-');
			return out;
		}

		var
			block = $(this),
			text = trim(normalize(block.text())),
			words = text.split(' '),
			atoms = [],
			rows = [],
			currentRow = '',
			measure,
			lineHeight,
			currentLineHeight,
			word,
			suffix,
			prefix;

		// Разбиваем текст на атомы
		$.each(words, function (w_index, w_value) {
			var currentAtoms = w_value.split(/-|–/);
			var hyphened = currentAtoms.length > 1;
			if (hyphened) {
				$.each(currentAtoms, function (a_index, a_value) {
					atoms.push({
						value: a_value,
						hyphened: true,
						last: a_index + 1 == currentAtoms.length
					});
				})
			} else {
				atoms.push({
					value: w_value,
					hyphened: false
				});
			}
		});

		// Заменяем текст на типовую строку, измеряем ее высоту
		block.html('<div id="stringExploder__measure" class="' + rowClass + '">!</div>');
		measure = $('#stringExploder__measure');
		lineHeight = measure.height();
		measure.empty();

		// Формируем из атомов готовые строки
		do {
			word = atoms.shift();
			if (word.hyphened == false) {
				prefix = suffix = ' ';
			} else {
				prefix = '';
				suffix = word.last ? '' : '-';
			}
			measure.append(prefix + word.value + suffix);
			currentLineHeight = measure.height();
			if (currentLineHeight == lineHeight) {
				currentRow += prefix + word.value + suffix;
			} else {
				atoms.unshift(word);
				rows.push(trim(normalize(currentRow)));
				currentRow = '';
				measure.empty();
			}
		} while (atoms.length);

		// Последняя строка может остаться вне цикла
		if (currentRow.length) {
			rows.push(currentRow);
		}

		// Выводим строки в родительский блок
		block.empty();
		$.each(rows, function (index, value) {
			block.append('<div class="' + rowClass + '">' + value + '</div>');
		});

	})

	return $(this);
}

$.fn.serializeObject = function () { // Сериализация объекта
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
