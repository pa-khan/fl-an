var html = document.querySelector('html'),
		body = document.querySelector('body'),
		wrap = document.querySelector('.wrap');

document.addEventListener('DOMContentLoaded', ()=>{
	// Section Scroll
	new Sscroll();

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

			location.marker = new google.maps.Marker({
				position: { lat: location.marker.lat, lng: location.marker.lng },
				map: location.gmap,
				icon: {
					url: 'uploads/gmap-pin.png'
				}
			});

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

		location.toggle.addEventListener('click', ()=>{
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
		});

		location.items.forEach((item)=>{
			item.addEventListener('click', (event)=>{
				item.classList.add(location.class.selected);
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
		imgs: document.querySelector('.object__list'),
		title: document.querySelector('.object__title'),
		text: document.querySelector('.object__text')
	}
	

	// catalog
	let catalogs = document.querySelectorAll('.catalog'),
			catalogSlidesPerView = 3;

	if (catalogs) {
		catalogs.forEach((catalog)=>{
			catalog.wrap    = catalog.querySelector('.catalog__wrap'),
			catalog.items   = catalog.querySelectorAll('.catalog__item'),
			catalog.navPrev = catalog.querySelector('.catalog__nav-item.--prev'),
			catalog.navNext = catalog.querySelector('.catalog__nav-item.--next');
			
			// catalog.items = Array.from(catalog.items);

			catalog.slider = new Swiper(catalog.wrap, {
				slidesPerView: catalogSlidesPerView,
				spaceBetween: 24,
				navigation: {
					nextEl: catalog.navPrev,
					prevEl: catalog.navNext,
				}, 
			});

			console.log(catalog.items, catalog.items.length);
			if (catalogSlidesPerView == catalog.items.length) {
				catalog.navPrev.classList.add('--hidden');
				catalog.navNext.classList.add('--hidden');
			}

			catalog.items.forEach((item)=>{
				let cPopup = {
					title: document.querySelector('.c-popup__title').innerHTML,
					text:  document.querySelector('.c-popup__text').innerHTML,
					imgs:  document.querySelectorAll('.c-popup__imgs img')
				};

				if (item.classList.contains('--has-popup')) {
					item.addEventListener('click', ()=>{
						modalObj.title.innerHTML = cPopup.title;

						Popup.show(modalObj.block);	
					});
				}
			});
		});
	}
});