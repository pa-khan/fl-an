class Tabs {
	constructor(element, settings = {
		nav: '.tabs__nav',
		navItem: '.tabs__nav-item',
		items: '.tabs__item',
		attrNavItem: 'href',
		class: {
			current: '--current',
			first: '--first'
		}
	}) {
		this.element  = element;
		this.settings = settings;
		this.navs     = this.element.querySelectorAll(this.settings.nav);
		this.navItems = this.element.querySelectorAll(this.settings.navItem);

		this.element.tabs = this;
		
		this.init();
	}

	init() {
		this.navs[0].classList.add(this.settings.class.first);
		this.navItems.forEach((link)=>{
			link.el = document.querySelector(link.getAttribute(this.settings.attrNavItem));

			if (link.classList.contains(this.settings.class.current) && link.closest(this.settings.nav + '.' + this.settings.class.first)) {
				this.navItemCurrent = link;
			}

			link.addEventListener('click', (event)=>{
				event.preventDefault();

				this.setCurrent(link);
			});
		});

		if (!this.navItemCurrent) {
			this.navItemCurrent  = this.navItems[0];
		}

		this.listItemCurrent = this.navItemCurrent.el;

		this.addClasses();
	}

	addClasses() {
		this.navItemCurrent.classList.add(this.settings.class.current);
		this.listItemCurrent.classList.add(this.settings.class.current);
	}

	removeClasses() {
		this.navItemCurrent.classList.remove(this.settings.class.current);
		this.listItemCurrent.classList.remove(this.settings.class.current);
	}

	setCurrent(link) {
		if (!link.classList.contains(this.settings.class.current)) {
			this.removeClasses();	
		
			this.navItemCurrent  = link;
			this.listItemCurrent = this.navItemCurrent.el;

			this.addClasses();
		}
	}
}