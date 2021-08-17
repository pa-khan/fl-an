class Sscroll {
	// static classHeightNormal = '';
	static classCurrent = '--current';
	static classHeightAuto = '--h-auto';

	constructor(settings = {
		wrap: '.sections',
		section: '.section',
		nav: '.nav',
		navLinks: '.scrollTo',
		attrBody: 'data-header-class',
		class: {
			wrap: 'sscroll',
			section: 'sscroll__section',
			sectionInner: 'sscroll__section-inner',
			sectionInnerAdd: 'section__inner',
			overflowDisable: 'sscroll-overflow-disable'
		}
	}) {
		this.settings  = settings;
		this.wrap      = document.querySelector(this.settings.wrap);
		this.navLinks  = document.querySelectorAll(this.settings.navLinks);
		this.prevScrollTop = 0;
		this.timeStamp = 0;

		if (this.wrap) {
			this.wrap.classList.add(this.settings.class.wrap);
		} else {
			throw new Error('Not found wrapper');
		}

		this.sections = document.querySelectorAll(this.settings.section);
		if (!this.sections) {
			throw new Error('Not found section(s)');	
		}
		this.sections.forEach((section)=>{
			section.classList.add(this.settings.class.section);
		});

		document.querySelector('html').classList.add(this.settings.class.overflowDisable);
		document.body.classList.add(this.settings.class.overflowDisable);


		this.sections = Array.from(this.sections);


		this.nav = this.settings.nav ? document.querySelector(this.settings.nav) : null;

		this.changeHeight();
		document.addEventListener('scroll', ()=>{
			this.changeHeight();
		});
		window.addEventListener('resize', ()=>{
			this.changeHeight();
			this.setScrollSectionDefault();
		});

		this.currentSection = this.checkCurrentSection() ? this.checkCurrentSection() : this.sections[0];
		this.addCurrent(this.currentSection);
		this.setHeaderClasses();

		if (this.nav) {
			this.nav.current = this.nav.querySelector('a[href*="' + this.currentSection.id + '"]');
			
			if (this.nav.current) {
				this.nav.current.classList.add(Sscroll.classCurrent);
			}	
		}

		if (this.navLinks) {
			this.navLinks.forEach((link)=>{
				link.attrHref = link.getAttribute('href');
				link.el   = document.querySelector(link.attrHref);

				if (!link.el) {
					return false;
				}

				link.addEventListener('click', (event)=>{
					event.preventDefault();

					if (!event.target.closest(Sscroll.classCurrent)) {
						this.moveSection(link.el);

						link.classList.add(Sscroll.classCurrent);
						this.navLinks.forEach((l)=>{
							if (link == l) {
								return false;
							}

							l.classList.remove(Sscroll.classCurrent);
						});
					}
				})
				
			});
		}

		this.wrappingSection();
		this.wheelOnSection();
		
	}

	checkCurrentSection() {
		let hash    = window.location.hash,
				section = hash ? document.querySelector(hash) : null;

		if (section) {
			return section;
		} else {
			return false;
		}

	}


	eventMove(event, skip) {

		if (event.type == 'touchmove') {
			if (event.target.closest('.noUi-target') || event.target.closest('.tabs__nav')) {
				return false;
			}
			if ((event.target.closest('.swiper-container')) && (this.moveStartX > this.moveEndX + 10 || this.moveStartX < this.moveEndX - 10)) {
				return false;
			}
		}
		if (event.target.closest('.wheel-false')) {
			return false;
		}

		if (event.ctrlKey) {
			return false;
		}
		
		if (event.timeStamp - 500 < this.timeStamp) {
			this.timeStamp = event.timeStamp;
			return false;
		} else {
			this.timeStamp = event.timeStamp;
		}

		let section = event.target.closest('.' + this.settings.class.sectionInner);
		
		if (!section) {
			return false;
		}


		let scrollPosition = Math.ceil(section.scrollTop + section.offsetHeight);


		if (section.clientHeight < section.scrollHeight) {
			console.log(scrollPosition, section.scrollHeight);
			if (!skip) {
				if (section.scrollTop == 0) {
					if (scrollPosition != this.prevScrollTop) {
						this.prevScrollTop = scrollPosition;
						return false;
					} else {
						this.movePrev();	
					}
				} else if (scrollPosition == section.scrollHeight) {
					if (scrollPosition != this.prevScrollTop) {
						this.prevScrollTop = scrollPosition;
						return false;
					} else {
						this.moveNext();	
					}
				}
			} else {
				if (section.scrollTop == 0) {
					this.movePrev();	
				} else if (scrollPosition == section.scrollHeight) {
					this.moveNext();
				}
			}
			
				
			
		} else {
			if (event.type == 'touchmove') {
				if (this.moveStartY < this.moveEndY) {
					this.movePrev();	
				} else {
					this.moveNext();
				}
			} else {
				if (event.deltaY > 0) {
					this.moveNext();
				} else {
					this.movePrev();
				}
				this.prevScrollTop = scrollPosition;
			}
			
			
		}

		this.setNavItemCurrent();
	}
	wheelOnSection() {
		document.addEventListener('wheel', (event)=> {
			event.preventDefault();

			this.event = 'wheel';

			this.eventMove(event);
		});

		document.addEventListener('touchstart', (event)=> {
			event.preventDefault();

			this.event = 'touch';

			this.moveStartY = event.touches[0].pageY;
			this.moveStartX = event.touches[0].pageX;
		});

		document.addEventListener('touchmove', (event)=> {
			event.preventDefault();

			this.moveEndY = event.touches[0].pageY;
			this.moveEndX = event.touches[0].pageX;

			this.eventMove(event);
		});

		
	}

	scrollToSection(section) {
		section.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
	}

	addHash(delay) {
		if (this.currentSection.id) {
			setTimeout(()=>{
				window.location.hash = this.currentSection.id;
			}, delay);
		}
		
	}
	changeHeight() {
		this.sections.forEach((section)=>{
			if (section.classList.contains(Sscroll.classHeightAuto)) {
				return false; 
			}

			section.style.height = window.innerHeight + 'px';
		});
	}

	removeCurrent(section) {
		section.classList.remove(Sscroll.classCurrent);
	}

	addCurrent(section) {
		section.classList.add(Sscroll.classCurrent);
	}

	moveSection(direction) {
		// this.movePosition = null;
		let position = null;

		if (direction  == 'next') {
			position = this.currentSection.nextSibling;
		} else if (direction == 'prev') {
			position = this.currentSection.previousSibling;
		}  else if (typeof direction == 'object') {
			position = direction;
		}


		if (position) {
			this.removeCurrent(this.currentSection);
			this.removeHeaderClasses();
			this.currentSection = position;
			this.addCurrent(this.currentSection);
			this.setHeaderClasses();
			if (this.event == 'wheel') {
				this.scrollToSection(this.currentSection);
				this.addHash(500);
			} else {
				this.addHash(0);
			}
		}
	}
	moveNext() {
		this.moveSection('next');
		
	}
	movePrev() {
		this.moveSection('prev');
	}
	setNavItemCurrent() {
		if (this.nav.current) {
			this.nav.current.classList.remove(Sscroll.classCurrent);
		}

		this.nav.current = this.nav.querySelector('a[href*="' + this.currentSection.id + '"]');

		if (this.nav.current) {
			this.nav.current.classList.add(Sscroll.classCurrent);
		}
	}
	setHeaderClasses() {
		let sectionHeaderClasses = this.currentSection.getAttribute(this.settings.attrBody);
		
		if (sectionHeaderClasses) {
			sectionHeaderClasses = sectionHeaderClasses.split(' ');
			sectionHeaderClasses.forEach((sectionHeaderClass)=>{
				document.querySelector('.header').classList.add(sectionHeaderClass);
			});
		}
	}

	removeHeaderClasses() {
		let sectionHeaderClasses = this.currentSection.getAttribute(this.settings.attrBody);
		
		if (sectionHeaderClasses) {
			sectionHeaderClasses = sectionHeaderClasses.split(' ');
			sectionHeaderClasses.forEach((sectionHeaderClass)=>{
				document.querySelector('.header').classList.remove(sectionHeaderClass);
			});
		}
	}
	wrappingSection() {
		this.sections.forEach((section)=>{
			let div = document.createElement('div');
			div.className = this.settings.class.sectionInner;
			div.classList.add(this.settings.class.sectionInnerAdd);

			div.innerHTML = section.innerHTML;
			section.innerHTML = '';

			section.append(div);
		});
	}
	
	setScrollSectionDefault() {
		html.scrollTop = body.scrollTop = this.currentSection.offsetTop;
	}
}