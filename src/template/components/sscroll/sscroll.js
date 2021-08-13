class Sscroll {
	// static classHeightNormal = '';
	static classCurrent = '--current';
	static classHeightAuto = '--h-auto';

	constructor(settings = {
		wrap: '.sections',
		section: '.section',
		nav: '.nav',
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
		this.prevScrollTop = 0;

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

	wheelOnSection() {
		document.addEventListener('wheel', (event)=> {
			event.preventDefault();

			let section = event.target.closest('.' + this.settings.class.sectionInner);
			
			if (!section) {
				return false;
			}

			let scrollPosition = section.scrollTop + window.pageYOffset;
			if (section.clientHeight < section.scrollHeight) {
				if (scrollPosition >= section.scrollHeight) {
					if (scrollPosition != this.prevScrollTop) {
						this.prevScrollTop = scrollPosition;
						return false;
					} else {
						this.moveNext();	
					}
					
				} else if (section.scrollTop == 0) {
					if (scrollPosition != this.prevScrollTop) {
						this.prevScrollTop = scrollPosition;
						return false;
					} else {
						this.movePrev();	
					}
				}
			} else {
				if (event.deltaY > 0) {
					this.moveNext();
				} else {
					this.movePrev();
				}
			}

			// console.log(event.target.closest('.' + this.settings.class.sectionInner).clientHeight);
			// console.log(event.target.closest('.' + this.settings.class.sectionInner).scrollHeight);


			let id = this.currentSection.id;
			setTimeout(()=>{
				// this.addHash(id);
			}, 500);

			this.setNavItemCurrent();
		});
	}

	scrollToSection(section) {
		section.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
	}

	addHash(id) {
		window.location.hash = id;
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
		let position = null;

		if (direction  == 'next') {
			position = this.currentSection.nextSibling;
		} else if (direction == 'prev') {
			position = this.currentSection.previousSibling;
		}

		if (position) {
			this.removeCurrent(this.currentSection);
			this.removeHeaderClasses();
			this.currentSection = position;
			this.addCurrent(this.currentSection);
			this.setHeaderClasses();
			this.scrollToSection(this.currentSection);
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
			document.querySelector('.header').classList.add(sectionHeaderClasses);
		}
	}

	removeHeaderClasses() {
		let sectionHeaderClasses = this.currentSection.getAttribute(this.settings.attrBody);
		if (sectionHeaderClasses) {
			document.querySelector('.header').classList.remove(sectionHeaderClasses);
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
	
}