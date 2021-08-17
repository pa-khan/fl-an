var html = document.querySelector('html'),
		body = document.querySelector('body'),
		wrap = document.querySelector('.wrap');


document.addEventListener('DOMContentLoaded', ()=>{
	let nav = document.querySelector('.header__left'),
			navClassShow = '--show',
			navToggles = document.querySelectorAll('.toggle-nav');

	navToggles.forEach((btn)=>{
		btn.addEventListener('click', ()=>{
			nav.classList.toggle(navClassShow);
		});
	});

	nav.addEventListener('click', (event)=>{
		if (event.target.closest('.nav__item')) {
			nav.classList.remove(navClassShow);
		}
	});

	
	// Section Scroll
	new Sscroll();
	docLoad = true;

	

	// Fields
	let fields = document.querySelectorAll('.field');
	 
	if (fields) {
		fields.forEach((field)=>{
			new Field(field);
		});
	}


	// Checks
	let checks = document.querySelectorAll('.check');
	 
	if (checks) {
		checks.forEach((check)=>{
			new Check(check);
		});
	}


	// Tabs
	var tabs = document.querySelectorAll('.tabs');

	if (tabs) {
		tabs.forEach((tab)=>{
			new Tabs(tab);
		});
	}

	
	// Selects
	var selects = document.querySelectorAll('.select');
	if (selects) {
			selects.forEach(select => {
			new Select(select);
		});

		document.addEventListener('click', (event)=>{
			let openSelects = document.querySelectorAll('.select.--open');
			if (!event.target.closest('.select') && openSelects) {
				openSelects.forEach((select)=> {
					select.classList.remove(Select.classOpen);
				});
			}
		})
	}


	// intro-video-btn
	let introBtn = document.querySelector('.intro__video'),
			modalVideo = document.querySelector('#modal-video');

	introBtn.addEventListener('click', ()=>{
		Popup.show(modalVideo);
	});

	



	// Location
	let location = {
		map: document.querySelector('.location__map'),
		toggle: document.querySelector('.location__toggle'),
		filter: document.querySelector('.location__filter'),
		class: {
			show: '--show',
			selected: '--selected'
		}
	};

	if (location.map) {
		location.items = location.filter.querySelectorAll('.filter__item');
		location.items = Array.from(location.items);

		var script = document.createElement('script');
		script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDFlhVZHx_hZG67ZDi5BBb-O0aqR8ofwUs&callback=initMap';
		script.async = true;

		function gmapOnmobile() {
			if (document.body.offsetWidth < 768) {
				location.gmap.setOptions({
					zoomControl: true,
					zoom: 14,
				});
			} else if (document.body.offsetWidth < 1500) {
				location.gmap.setOptions({
					zoomControl: false,
					zoom: 14,
				});
			} else {
				location.gmap.setOptions({
					zoomControl: false,
					zoom: 15,
				});
			}
		}

		window.initMap = function() {
			location.map.lat = Number.parseFloat(location.map.getAttribute('data-lng'));
			location.map.lng = Number.parseFloat(location.map.getAttribute('data-lnt'));

			location.marker = {};
			location.marker.lat = Number.parseFloat(location.map.getAttribute('data-lng-marker'));
			location.marker.lng = Number.parseFloat(location.map.getAttribute('data-lnt-marker'));

			location.gmap = new google.maps.Map(location.map, {
				center: { lat: location.map.lat, lng: location.map.lng },
				zoom: 15,
				mapId: '59f73d8943c40b2b',
				cursor: 'default',
				draggable: false,
				disableDefaultUI: true,
			});

			window.addEventListener('resize', ()=>{
				gmapOnmobile();
			});

			location.marker = new google.maps.Marker({
				position: { lat: location.marker.lat, lng: location.marker.lng },
				map: location.gmap,
				icon: {
					url: 'uploads/gmap-pin.png'
				}
			});

			gmapOnmobile();
			location.items.forEach((item)=>{
				item.icon   = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(item.querySelector('.filter__icon').innerHTML);
				item.points = item.querySelectorAll('.filter__point');

				item.points.forEach((point)=>{

					point.name = point.getAttribute('data-point-name');
					point.lat = Number.parseFloat(point.getAttribute('data-point-lat'));
					point.lng = Number.parseFloat(point.getAttribute('data-point-lng'));

					point.marker = new google.maps.Marker({
						position: { lat: point.lat, lng: point.lng },
						// label: point.name,
						clickable: false,
						map: location.gmap,
						icon: {
							url: item.icon,
						}
					});
				});
			});

		};
	
		document.head.appendChild(script);

		location.toggleTitle = location.toggle.querySelector('.button__text');
		location.toggleBoolean = false;
		location.toggle.textDefault = location.toggle.getAttribute('data-text-default');
		location.toggle.textOpen = location.toggle.getAttribute('data-text-open');

		location.toggleTitle.innerText = location.toggle.textDefault;

		function locationToggleButton() {
			location.toggleBoolean = !location.toggleBoolean;

			if (location.toggleBoolean) {
				location.toggle.classList.add(location.class.show);
				location.filter.classList.add(location.class.show);
				location.toggleTitle.innerText = location.toggle.textOpen;
			} else {
				location.toggle.classList.remove(location.class.show);
				location.filter.classList.remove(location.class.show);
				location.toggleTitle.innerText = location.toggle.textDefault;
			}
		}

		location.toggle.addEventListener('click', ()=>{
			locationToggleButton();
		});

		location.items.forEach((item)=>{
			item.addEventListener('click', (event)=>{
				item.classList.add(location.class.selected);
				locationToggleButton();
				if (event.target.closest('.filter__item.--all')) {
					location.items.forEach((item)=>{
						item.points.forEach((point)=>{
							point.marker.setVisible(true);
						});

						return false;
					});
				} else {
					location.items.forEach((item)=>{
						if (event.target.closest('.filter__item') == item) {
							item.points.forEach((point)=>{
								point.marker.setVisible(true);
							});
						} else {
							item.classList.remove(location.class.selected);
							item.points.forEach((point)=>{
								point.marker.setVisible(false);
							});
						}
					});
				}
			});
		});
	}

	var modalObj = {
		block: document.querySelector('.object'),
		title: document.querySelector('.object__title'),
		text: document.querySelector('.object__text')
	}
	

	// catalog
	let catalogs = document.querySelectorAll('.catalog__inner'),
			catalogSlidesPerView = 3;

	if (catalogs) {
		catalogs.forEach((catalog)=>{
			catalog.wrap    = catalog.querySelector('.catalog__wrap'),
			catalog.items   = catalog.querySelectorAll('.catalog__item'),
			catalog.navPrev = catalog.querySelector('.catalog__controls-item.--prev'),
			catalog.navNext = catalog.querySelector('.catalog__controls-item.--next');
			
			// catalog.items = Array.from(catalog.items);

			catalog.slider = new Swiper(catalog.wrap, {
				slidesPerView: 'auto',
				spaceBetween: 20,
				loop: true,
				allowTouchMove: true,
				navigation: {
					nextEl: catalog.navNext,
					prevEl: catalog.navPrev,
				},
				breakpoints: {
					768: {
						spaceBetween: 24,
						slidesPerView: catalogSlidesPerView,
						loop: catalog.items.length > 3 ? true : false,
						allowTouchMove: catalog.items.length > 3 ? true : false,
					}
				}
			});

			if (catalog.items.length <= catalogSlidesPerView) {
				catalog.navPrev.classList.add('--hidden');
				catalog.navNext.classList.add('--hidden');
			}

			catalog.items.forEach((item)=>{
				if (item.classList.contains('--has-popup')) {
					let cPopup = {
						title: item.querySelector('.c-popup__title').innerHTML,
						text:  item.querySelector('.c-popup__text').innerHTML,
						imgs:  item.querySelectorAll('.c-popup__imgs-item')
					};

					item.addEventListener('click', ()=>{
						Popup.show(modalObj.block);
						
						let oldImgs = document.querySelector('.object__imgs');

						if (oldImgs) {
							oldImgs.remove();
						}

						modalObj.title.innerHTML = modalObj.text.innerHTML = '';
						if (cPopup.title) {
							modalObj.title.innerHTML = cPopup.title;
						}

						if (cPopup.title) {
							modalObj.text.innerHTML = cPopup.text;
						}

						if (cPopup.imgs) {
							let imgs      = document.createElement('div'),
									imgsInner = document.createElement('div'),
									imgsWrap  = document.createElement('div'),
									imgsList  = document.createElement('div'),
									imgsNav   = document.createElement('div'),
									imgsNavPrev  = document.createElement('div'),
									imgsNavNext  = document.createElement('div');

							imgs.className = 'object__imgs imgs';
							imgsInner.className = 'imgs__inner';
							imgsWrap.className = 'imgs__wrap swiper-container';
							imgsList.className = 'imgs__list swiper-wrapper';
							imgsNav.className = 'imgs__nav';
							imgsNavPrev.className = 'imgs__nav-item button arrow --prev';
							imgsNavNext.className = 'imgs__nav-item button arrow --next';

							imgs.append(imgsInner);
							imgsInner.append(imgsWrap);
							imgsWrap.prepend(imgsList);

							imgs.append(imgsNav);

							imgsNavPrev.innerHTML = '<svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.0311 0.468876C10.9615 0.399031 10.8787 0.343617 10.7876 0.305807C10.6965 0.267997 10.5988 0.248535 10.5001 0.248535C10.4015 0.248535 10.3038 0.267997 10.2127 0.305807C10.1216 0.343617 10.0388 0.399031 9.96912 0.468876L0.969123 9.46888C0.899278 9.53854 0.843864 9.62131 0.806054 9.71243C0.768245 9.80354 0.748782 9.90122 0.748782 9.99988C0.748782 10.0985 0.768245 10.1962 0.806054 10.2873C0.843864 10.3784 0.899278 10.4612 0.969123 10.5309L9.96912 19.5309C10.11 19.6717 10.301 19.7508 10.5001 19.7508C10.6993 19.7508 10.8903 19.6717 11.0311 19.5309C11.172 19.39 11.2511 19.199 11.2511 18.9999C11.2511 18.8007 11.172 18.6097 11.0311 18.4689L2.56062 9.99988L11.0311 1.53088C11.101 1.46121 11.1564 1.37844 11.1942 1.28733C11.232 1.19621 11.2515 1.09853 11.2515 0.999876C11.2515 0.901225 11.232 0.803543 11.1942 0.712426C11.1564 0.621308 11.101 0.538544 11.0311 0.468876Z" fill="#1A1A1A"/></svg>';
							imgsNavNext.innerHTML = '<svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.968998 0.468876C1.03867 0.399031 1.12143 0.343617 1.21255 0.305807C1.30366 0.267997 1.40135 0.248535 1.5 0.248535C1.59865 0.248535 1.69633 0.267997 1.78745 0.305807C1.87857 0.343617 1.96133 0.399031 2.031 0.468876L11.031 9.46888C11.1008 9.53854 11.1563 9.62131 11.1941 9.71243C11.2319 9.80354 11.2513 9.90122 11.2513 9.99988C11.2513 10.0985 11.2319 10.1962 11.1941 10.2873C11.1563 10.3784 11.1008 10.4612 11.031 10.5309L2.031 19.5309C1.89017 19.6717 1.69916 19.7508 1.5 19.7508C1.30083 19.7508 1.10983 19.6717 0.968998 19.5309C0.828168 19.39 0.74905 19.199 0.74905 18.9999C0.74905 18.8007 0.828168 18.6097 0.968998 18.4689L9.4395 9.99988L0.968998 1.53088C0.899153 1.46121 0.843738 1.37844 0.805928 1.28733C0.768119 1.19621 0.748657 1.09853 0.748657 0.999876C0.748657 0.901225 0.768119 0.803543 0.805928 0.712426C0.843738 0.621308 0.899153 0.538544 0.968998 0.468876Z" fill="#1A1A1A"/></svg>';

							imgsNav.append(imgsNavPrev);
							imgsNav.append(imgsNavNext);

							modalObj.block.prepend(imgs);

							cPopup.imgs.forEach((img)=>{
								img = Object.assign(img);

								let divItem = document.createElement('div');
								divItem.className = 'imgs__item swiper-slide';

								divItem.append(img);
								imgsList.append(divItem);
							});

							if (cPopup.imgs.length > 1) {
								new Swiper(imgsWrap, {
									loop: catalog.items.length > 1 ? true : false,
									allowTouchMove: catalog.items.length > 1 ? true : false,
									navigation: {
										nextEl: imgsNavNext,
										prevEl: imgsNavPrev,
									}, 
								})
							} else {
								imgsNavPrev.classList.add('--hidden');
								imgsNavNext.classList.add('--hidden');
							}

						}

						
					});
				}
			});
		});
	}


	// gallery
	let galleries = document.querySelectorAll('.gallery__slider');

	if (galleries) {
		galleries.forEach((gallery)=>{
			let wrap    = gallery.querySelector('.gallery__wrap'),
					dots    = gallery.querySelector('.gallery__dots'),
					navPrev = gallery.querySelector('.gallery__nav-item.button.arrow.--prev'),
					navNext = gallery.querySelector('.gallery__nav-item.button.arrow.--next');

			new Swiper(wrap, {
				loop: true,
				navigation: {
					nextEl: navNext,
					prevEl: navPrev,
				},
				pagination: {
					el: dots,
					clickable: true,
					type: 'bullets',
				},
			});
		});
	}



	let calc = {
		item: {},
		items: document.querySelectorAll('.calc__item'),
		value: {
			percent: document.getElementById('calc-percent-value'),
			pay: document.getElementById('calc-pay-value'),	
		},
		changeForPrice() {
			calc.item.price.range.noUiSlider.on('update', ()=>{
				let payValue   = Number(calc.item.pay.value),
						priceValue = Number(calc.item.price.value);
				if (payValue >= priceValue) {
					calc.item.pay.range.noUiSlider.set([priceValue - calc.item.pay.data.step]);
				}
			});
		},
		changeForPay() {
			calc.item.pay.range.noUiSlider.on('update', ()=>{
				let payValue   = Number(calc.item.pay.value),
						priceValue = Number(calc.item.price.value);
				if (payValue >= priceValue) {
					calc.item.price.range.noUiSlider.set([priceValue + calc.item.price.data.step]);
				}
			});
		},
		updatePercent() {
			calc.item.percent.range.noUiSlider.on('update', (event)=>{
				calc.value.percent.innerHTML = event[0];
			});
		},

		calculate() {
			let sum = calc.item.price.value - calc.item.pay.value;
			let percentYear = sum / 100 * calc.item.percent.value;
			let perMonth = sum / (calc.item.deadline.value * 12);
			calc.value.pay.innerText = Math.ceil(perMonth + (percentYear / 12)).toLocaleString();
		}
		
	};

	if (calc.items) {
		calc.items.forEach((item)=>{

			item.area  = item.querySelector('.field__area');
			item.range = item.querySelector('.calc__range');

			item.area.setAttribute('readonly', 'readonly')
			
			item.data = {
				name: item.getAttribute('data-name'),
				step: Number(item.range.getAttribute('data-step')),
				min: Number(item.range.getAttribute('data-min')),
				max: Number(item.range.getAttribute('data-max')),
				current: Number(item.range.getAttribute('data-current')),
				float: item.range.getAttribute('data-float') == 'true' ? true : false,
				function: item.range.getAttribute('data-function') ? item.range.getAttribute('data-function') : null
			}

			calc.item[item.data.name] = item;

			noUiSlider.create(item.range, {
				start: item.data.current,
				connect: [true, false],
				step: item.data.step,
				range: {
					min: item.data.min,
					max: item.data.max
				}
			});

			item.range.noUiSlider.on('update', (event)=>{
				item.value = Number(event[0]);
				let value = item.data.float ? Number.parseFloat(event[0]) : Number.parseInt(event[0]);
				item.area.value = value.toLocaleString();
			});


			if (item.data.function) {
				setTimeout(()=>{
					eval(item.data.function + '()');
				}, 1000)
			}

			setTimeout(()=>{
				item.range.noUiSlider.on('update', (event)=>{
					calc.calculate()
				});
			}, 1000);
		});
	}

	let forms = document.querySelectorAll('.form');
			modalThanks = document.querySelector('#modal-thanks');

	if (forms) {
		forms.forEach((form)=>{
			form.requiredFields = form.querySelectorAll('.--required');
			form.button = form.querySelector('button');

			if (form.button) {
				form.button.addEventListener('click', (event)=>{
					event.preventDefault();

					let errors = 0;


					form.requiredFields.forEach((field)=>{
						if (field.classList.contains('--phone') && field.area.value.length < 18) {
							field.classList.add('--error');
							errors++;
						}
					});

					if (errors == 0) {
						let fields = form.querySelectorAll('.field'); 
						fields.forEach((field)=>{
							field.classList.remove('--filled');
							field.area.value = '';

						});
						Popup.show(modalThanks);
					}
				});
			}
		});
	}


	let counts = document.querySelectorAll('.counts__list');

	if (counts) {
		counts.forEach((count)=>{
			count.items = count.querySelectorAll('.counts__item');
			count.classList.add('--w' + count.items.length);
		});
	}

	
	let pbButtons = document.querySelectorAll('.show-pb-widget');

	if (pbButtons) {
		pbButtons.forEach((pbButton)=>{
			pbButton.addEventListener('click', ()=>{
				pb_front_widget.show({version: 2 });
			});
		});
	}



	
});