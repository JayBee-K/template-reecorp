var windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
	windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
	let $childUl = $parent.find('> li > ul');
	if ($childUl.length === 0) {
		return;
	}

	if ($callFunction) {
		$parent.find('> li a').each(function () {
			$(this).attr('data-href', $(this).attr('href'))
		});
	}

	if (windowWidth <= 991) {
		let $objParentAttr = {};
		let $objChildrenAttr = {
			'data-bs-parent': '#' + $parent.attr('id')
		}

		if ($firstItem) {
			let $parentID = 'menu-' + Math.random().toString(36).substring(7);
			$parent.attr('id', $parentID);
			$objParentAttr = {
				'data-bs-parent': '#' + $parentID
			}

			$objChildrenAttr = {};
		}

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');
			let $parentListItemAnchor = $parentListItem.children('a');

			let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

			$parentUl.addClass('collapse').attr({
				'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
			});

			$parentListItemAnchor.replaceWith(function () {
				return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
			})

			handleApplyCollapse($parentUl, false);

			$parentUl.on('show.bs.collapse', function () {
				$parent.find('.collapse.show').not($parentUl).collapse('hide');
			});
		});
	} else {
		$parent.removeAttr('id');

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');

			$parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
			$parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

			$parentListItem.children('button').replaceWith(function () {
				return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
			})

			handleApplyCollapse($parentUl);
		});
	}
}

let handleCallMenu = function () {
	const $body = $('body');
	const handleBody = function ($toggle = false) {
		if ($body.hasClass('is-navigation')) {
			$body.removeClass('is-navigation');
			if ($body.hasClass('is-overflow')) {
				$body.removeClass('is-overflow');
			}

			$('#header-navigation ul').collapse('hide');
		} else {
			if ($toggle) {
				$body.addClass('is-navigation is-overflow')
			}
		}
	}

	if (windowWidth <= 991) {
		const $hamburger = $('#hamburger-button');
		if ($hamburger.length) {
			$hamburger.click(function () {
				handleBody(true)
			});
		}

		const $overlay = $('#header-overlay');
		if ($overlay.length) {
			$overlay.click(function () {
				handleBody();
			});
		}
	} else {
		handleBody();
	}
}

const handleStickHeader = function () {
	$(window).scroll(function (e) {
		if ($(document).scrollTop() > $('#header').innerHeight()) {
			$('#header').addClass('is-scroll');
		} else {
			$('#header').removeClass('is-scroll');
		}
	});
}


const handleHeaderNavigationLine = function () {
	const headerNavigation = $('#header-navigation');
	const headerNavigationItem = headerNavigation.children('ul').children('li');
	const headerNavigationLine = headerNavigation.children('#header-navigation_line');

	headerNavigationItem.mouseenter(function () {
		let offsetLeft = $(this)[0].offsetLeft;
		let innerWidth = $(this).innerWidth();

		headerNavigationLine.css({
			left: offsetLeft,
			width: innerWidth
		}).addClass('show');
	}).mouseleave(function () {
		headerNavigationLine.removeClass('show')
	})
}

const handleCopyValue = function () {
	const copyButtons = document.querySelectorAll('.button-copy');
	if (copyButtons) {
		copyButtons.forEach(function (copyButton) {
			copyButton.addEventListener('click', function () {
				const valueToCopy = copyButton.getAttribute('data-value');

				const tempTextArea = document.createElement('textarea');
				tempTextArea.style.cssText = 'position: absolute; left: -99999px';
				tempTextArea.setAttribute("id", "textareaCopy");
				document.body.appendChild(tempTextArea);

				let textareaElm = document.getElementById('textareaCopy');
				textareaElm.value = valueToCopy;
				textareaElm.select();
				textareaElm.setSelectionRange(0, 99999);
				document.execCommand('copy');

				document.body.removeChild(textareaElm);

				if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
					copyButton.setAttribute('title', 'Đã sao chéo');

					const tooltip = bootstrap.Tooltip.getInstance(copyButton);
					tooltip.setContent({'.tooltip-inner': 'Đã sao chéo'})
				}
			});
		})
	}
}

const handleInitFancybox = function () {
	if ($('.initFancybox').length) {
		$('.initFancybox').each(function () {
			let elm = $(this);
			Fancybox.bind(`[data-fancybox=${elm.attr('data-fancybox')}]`, {
				thumbs: {
					autoStart: true,
				},
			});
		});
	}
}
const handleContentDetail = () => {
	if ($('#detailContent').length > 0) {
		if ($('#detailContent img').length > 0) {
			$('#detailContent img').each((index, elm) => {
				$(elm).wrap(`<a style="cursor: zoom-in" href="${$(elm).attr('src')}" data-caption="${$(elm).attr('alt')}" data-fancybox="images-detail"></a>`);
			});

			Fancybox.bind('[data-fancybox]', {
				thumbs: {
					autoStart: true,
				},
			});
		}

		if ($('#detailContent table').length > 0) {
			$('#detailContent table').map(function () {
				$(this).addClass('table table-bordered');
				$(this).wrap('<div class="table-responsive"></div>');
			})
		}
	}
}

const formatPrice = function (price, format = '.') {
	price = price.replace(/[^0-9]/g, '');
	price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, format);
	return price;
}

const handleCounter = function () {
	if ($('#handleCounter').length && $('#handleCounter .handleCounterItem').length) {
		let i = 0;
		$(window).scroll(function () {
			let counterOffsetTop = $('#handleCounter').offset().top - window.innerHeight;
			if (i === 0 && $(window).scrollTop() > counterOffsetTop) {
				$('#handleCounter .handleCounterItem').each(function () {
					let counterItem = $(this),
						counterItemValue = counterItem.attr('data-value'),
						counterItemFormat = counterItem.attr('data-format');
					$({countNum: counterItem.text()}).animate({countNum: counterItemValue}, {
						duration: 2000, easing: 'swing', step: function () {
							counterItem.text(Math.floor(this.countNum));
						}, complete: function () {
							counterItem.html(formatPrice(this.countNum.toString(), counterItemFormat));
						}
					});
				});
				i = 1;
			}
		});
	}
}

const handleScrollTop = function () {
	if ($('#scrollTop').length > 0) {
		const btnScroll = $('#scrollTop');
		$(window).on('scroll', function () {
			if ($(this).scrollTop() == 0) {
				$('html').css('scroll-behavior', 'smooth');
			}
		});
		btnScroll.on('click', function (event) {
			event.preventDefault();
			$('html').css('scroll-behavior', 'unset');
			$('html, body').animate(
				{scrollTop: 0},
				1000
			);
			return false;
		});
	}
}
const handleInitDateRangePicker = function (elmInput) {
	let format = 'DD-MM-YYYY';
	const initDateRangePicker = elmInput.daterangepicker({
		singleDatePicker: true,
		alwaysShowCalendars: true,
		timePicker: false,
		timePicker24Hour: false,
		timePickerSeconds: false,
		parentEl: 'body',
		autoApply: true,
		locale: {
			format: format,
			daysOfWeek: [
				"CN",
				"T2",
				"T3",
				"T4",
				"T5",
				"T6",
				"T7"
			],
			monthNames: [
				"Tháng 1",
				"Tháng 2",
				"Tháng 3",
				"Tháng 4",
				"Tháng 5",
				"Tháng 6",
				"Tháng 7",
				"Tháng 8",
				"Tháng 9",
				"Tháng 10",
				"Tháng 11",
				"Tháng 12"
			],
			applyLabel: 'Áp dụng',
			cancelLabel: 'Đóng',
		}
	});

	if (typeof type != "undefined" && type === 'time') {
		initDateRangePicker.on('show.daterangepicker', function (ev, picker) {
			picker.container.find(".drp-calendar").addClass('px-3');
			picker.container.find(".calendar-table").hide();
		});
	}
}

$(function () {
	handleApplyCollapse($('#header-navigation > ul'), true, true);
	handleCallMenu();
	handleHeaderNavigationLine();
	$(window).resize(function () {
		handleApplyCollapse($('#header-navigation > ul'));
		handleCallMenu();
		handleHeaderNavigationLine();
	});

	handleStickHeader();
	handleCopyValue();
	handleInitFancybox();

	handleContentDetail();

	handleCounter();

	handleScrollTop();

	$('.initDateRangePicker').each(function () {
		let elmInput = $(this);
		handleInitDateRangePicker(elmInput)
	});

	if ($('#slider-hero').length) {
		new Swiper('#slider-hero .swiper', {
			speed: 500,
			slidesPerView: 1,
			loop: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			watchSlidesProgress: true,
			navigation: {
				nextEl: "#slider-hero .slider-navigation .slider-navigation_next",
				prevEl: "#slider-hero .slider-navigation .slider-navigation_prev",
			},
		});
	}

	if ($('#slider-article').length) {
		new Swiper('#slider-article .swiper', {
			speed: 500,
			slidesPerView: 1,
			loop: false,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			watchSlidesProgress: true,
			effect: "cards",
			grabCursor: true,
			navigation: {
				nextEl: "#slider-article .slider-navigation .slider-navigation_next",
				prevEl: "#slider-article .slider-navigation .slider-navigation_prev",
			},
		});
	}

	if ($('#slider-responsibility').length && $('#slider-responsibility_content').length) {
		let sliderResponsibilityContent = new Swiper('#slider-responsibility_content .swiper', {
			speed: 500,
			slidesPerView: 1,
			loop: false,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			watchSlidesProgress: true,
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			grabCursor: true,
		});

		let sliderResponsibility = new Swiper('#slider-responsibility .slider-responsibility .swiper', {
			speed: 500,
			slidesPerView: 1,
			loop: false,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			watchSlidesProgress: true,
			effect: "cards",
			grabCursor: true,
			navigation: {
				nextEl: "#slider-responsibility .slider-navigation .slider-navigation_next",
				prevEl: "#slider-responsibility .slider-navigation .slider-navigation_prev",
			}, pagination: {
				el: "#slider-responsibility .slider-pagination",
				clickable: true,
				renderBullet: function (index, className) {
					return `<span class="${className}">0${index + 1}</span>`;
				},
			}, thumbs: {
				swiper: sliderResponsibilityContent,
			},
		});

		sliderResponsibilityContent.on('slideChange', function (elm) {
			sliderResponsibility.slideTo(elm.realIndex)
		})
	}

	if ($('#slider-articleRelated').length) {
		new Swiper('#slider-articleRelated .swiper', {
			speed: 500,
			spaceBetween: 15,
			slidesPerView: 4,
			loop: false,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			navigation: {
				nextEl: "#slider-articleRelated .slider-navigation .slider-navigation_next",
				prevEl: "#slider-articleRelated .slider-navigation .slider-navigation_prev",
			},
			breakpoints: {
				1359: {
					slidesPerView: 4,
				},
				991: {
					slidesPerView: 3.5,
				},
				768: {
					slidesPerView: 2.5,
				},
				375: {
					slidesPerView: 1.5,
				},
				320: {
					slidesPerView: 1,
				}
			},
		});
	}

	if ($('#slider-project').length) {
		new Swiper('#slider-project .swiper', {
			speed: 500,
			slidesPerView: 1,
			loop: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			watchSlidesProgress: true,
			navigation: {
				nextEl: "#slider-project .slider-navigation .slider-navigation_next",
				prevEl: "#slider-project .slider-navigation .slider-navigation_prev",
			},
		});
	}
	if ($('#slider-activities').length) {
		new Swiper('#slider-activities .swiper', {
			speed: 500,
			slidesPerView: 4,
			spaceBetween: 16,
			loop: false,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			navigation: {
				nextEl: "#slider-activities .slider-navigation .slider-navigation_next",
				prevEl: "#slider-activities .slider-navigation .slider-navigation_prev",
			},
			breakpoints: {
				1359: {
					slidesPerView: 4,
				},
				991: {
					slidesPerView: 3.5,
				},
				768: {
					slidesPerView: 2.5,
				},
				375: {
					slidesPerView: 1.5,
				},
				320: {
					slidesPerView: 1,
				}
			},
		});
	}

	if ($('#slider-gallery').length) {
		let sliderGallery;

		sliderGallery = new Swiper('#slider-gallery .swiper', {
			speed: 500,
			slidesPerView: 2.5,
			spaceBetween: 30,
			loop: 1,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			watchSlidesProgress: true,
			navigation: {
				nextEl: "#slider-gallery .slider-navigation .slider-navigation_next",
				prevEl: "#slider-gallery .slider-navigation .slider-navigation_prev",
			},
		});
		const handleFancyBoxGallery = function (elm, sliderGallery) {
			Fancybox.bind(('[data-fancybox=gallery-image]'), {
				touch: true,
				on: {
					reveal: function (instance, current) {
						let index = elm.find(`[data-fancybox='gallery-image'][href='${current.src}']`).attr('data-index');
						sliderGallery.slideTo(index - 1);
					},
				}
			});
		}

		handleFancyBoxGallery($('#slider-gallery'), sliderGallery);

	}
});