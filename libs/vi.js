// Панель для слабовидящих

/**
 * Default value
 */
var VI = {
	enabled: false,
	fontsize: 'normal',
	color: 'white',
	fontfamily: 'arial',
	letterspacing: 'normal',
	lineheight: 'normal',
	colorimage: 'color'
};

/**
 * Применение стилей
 * @param {*} property 
 */
function applyUserStyles(property) {
	// Классы на html
	$('html#VI').removeClass();
	$.each(['fontsize', 'color', 'fontfamily', 'letterspacing', 'lineheight', 'colorimage'], function (index, key) {
		$('html#VI').addClass(key + '-' + VI[key]);
	});
	// Сохраняем cookie
	if (property != undefined) {
		setCookie(property, VI[property], null, '/');
	}
}

/**
 * Получить значение cookie
 */
function getCookie(name) {
	var start = document.cookie.indexOf(name + '=');
	var len = start + name.length + 1;
	if ((!start) && (name != document.cookie.substring(0, name.length))) {
		return null;
	}
	if (start == -1) return null;
	var end = document.cookie.indexOf(';', len);
	if (end == -1) end = document.cookie.length;
	return unescape(document.cookie.substring(len, end));
}

/**
 * Установить cookie
 */
function setCookie(name, value, expires, path, domain, secure) {
	var today = new Date();
	today.setTime(today.getTime());
	if (expires) {
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date(today.getTime() + (expires));
	document.cookie = name + '=' + escape(value) + ((expires) ? ';expires=' + expires_date.toGMTString() : '') + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ((secure) ? ';secure' : '');
}

/**
 * Оборачиваем все изображения
 */
function wrapImg() {
	var bodyVI = document.getElementById('VI');
	if (bodyVI !== null) {
		$.each(['img',
			'.is-picture'
		], function (index, value) {
			$(value).each(function () {
				var altText = $(this).attr('data-alt') !== undefined ? $(this).attr('data-alt') : '';
				if ($(this).css('float') !== 'none') {
					var width = $(this).css('width');
					var height = $(this).css('height');
					var position;
					if ($(this).css('float') === 'right') {
						position = '--left: auto; --right: 0';
					}
					if ($(this).css('float') === 'left') {
						position = '--right: auto; --left: 0';
					}
					$(this).wrap('<div class="vi-img-wrap vi-img-wrap__no-border" style="--width: ' + width + '; --height: ' + height + '; ' + position + '" data-text="' + altText + '"></div>');
				} else {
					$(this).wrap('<div class="vi-img-wrap" data-text="' + altText + '"></div>');
				}
				$('<div class="vi-img-content"><span>' + altText + '</span></div>').insertAfter($(this));
			});
		});

		$('.vi-img-content').dotdotdot({
			tolerance: 1,
			height: 'watch',
			watch: true
		});
	}

}

$(function () {
	//Обнуление инлайн стилей
	// $('*').not('.module.gallery .img').not('img').attr('style', '');
	//Открытие/скрытие доп. настроек
	$('.vi__toggle').on('click', function (e) {
		$(this).toggleClass('active');
		$('.header').toggleClass('active');
		$('.vi-panel__bottom').slideToggle(500, 'linear');
	});
	// Считывание значений
	$.each(['fontsize', 'color', 'fontfamily', 'letterspacing', 'lineheight', 'colorimage'], function (index, key) {
		var cookieValue = getCookie(key);
		if (cookieValue) {
			VI[key] = cookieValue;
		}
		$('.vi__' + key).removeClass('active');
		$('.vi__' + key + '[data-value=' + VI[key] + ']').addClass('active');
		$('.vi__' + key).click(function (e) {
			$(this).addClass('active').siblings('.vi__' + key).removeClass('active');
			VI[key] = $(this).data('value');
			VI.enabled = VI.fontsize != 'normal' || VI.color != 'white' || VI.letterspacing != 'normal' || VI.fontfamily != 'arial' || VI.colorimage != 'color';
			applyUserStyles(key);
		});
	});
	// Стиль при загрузке страницы (дефолтный или из cookie)
	applyUserStyles();
	wrapImg();
});

$('.js__panel-toggle').on('click', function (e) {
	e.preventDefault();
	$('.vi-panel__wrap').slideToggle();
	$('.header').removeClass('active');
});