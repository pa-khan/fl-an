"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Select {
	constructor(element, settings = {
		closeSelects: true
	}) {
		this.element = element;
		this.settings = settings;
		this.title = element.querySelector('.select__title');
		this.parse = this.element.querySelector('.select__parse');
		this.options = this.parse.querySelectorAll('option');
		this.placeholder = this.element.getAttribute('data-placeholder');
		this.field = this.element.querySelector('.field');
		this.items = [];
		this.options = Array.from(this.options);
		let selectedOption = this.options.find(item => {
			if (item.getAttribute('selected')) {
				return item;
			}
		});
		this.placeholder = selectedOption ? selectedOption.innerText : this.placeholder ? this.placeholder : this.options[0].innerText;
		this.title.innerText = this.placeholder;
		
		this.onClick();
		this.createList();
		this.createItems();

		if (!selectedOption) {
			selectedOption = this.options[0];
			selectedOption.setAttribute('selected', 'selected');
			this.items[0].classList.add(Select.classSelected);
		}

		if (this.field) {
			this.onKeyUpField();
		}

		if (this.element.classList.contains('--toggle-block')) {
			let tabsWrap  = this.element.closest('.tabs');

			let classToggle = this.element.getAttribute('data-toggle-class') ? this.element.getAttribute('data-toggle-class') : '--show';

			this.options.forEach((option)=>{
				option.el = document.querySelector(option.getAttribute('value'));

				if (option.getAttribute('selected') == 'selected') {
					this.optionNav = option.el;
					this.optionNav.classList.add(classToggle);
				}
			});
			
			this.parse.addEventListener('change', (event)=>{
				this.optionNav.classList.remove(classToggle);

				this.optionNav = this.parse.querySelector('option[selected]').el;
				this.optionNav.classList.add(classToggle);

				let link = this.optionNav.querySelector(tabsWrap.tabs.settings.navItem);
				tabsWrap.tabs.setCurrent(link);
			});
		}
	}

	createList() {
		this.list = document.createElement('div');
		this.list.className = 'select__list';
		this.element.querySelector('.select__drop').append(this.list);
	}

	createItems() {
		this.options.forEach(item => {
			let divItem = document.createElement('div');
			divItem.className = 'select__item';
			divItem.innerText = item.innerText;
			divItem.option = item;

			if (item.getAttribute('selected')) {
				divItem.classList.add(Select.classSelected);
			}

			this.list.append(divItem);
			this.items.push(divItem);
			divItem.addEventListener('click', () => {
				this.onClickItem(divItem);
			});
		});
	}

	onClickItem(item) {
		this.options.forEach(option => {
			option.removeAttribute('selected');
		});
		this.items.forEach(item => {
			item.classList.remove(Select.classSelected);
		});
		item.option.setAttribute('selected', 'selected');
		item.classList.add(Select.classSelected);
		this.title.innerText = item.innerText;
		let event = new Event('change');
		this.parse.dispatchEvent(event);
	}

	onClick() {
		this.element.addEventListener('click', event => {
			if (this.settings.closeSelects == true) {
				let selects = document.querySelectorAll('.select');

				if (selects) {
					selects.forEach(select => {
						if (select == this.element) {
							return false;
						}

						select.classList.remove(Select.classOpen);
					});
				}
			}

			if (event.target.closest('.field')) {
				return false;
			}

			this.element.classList.toggle(Select.classOpen);
		});
	}

	onKeyUpField() {
		this.field.area.addEventListener('input', () => {
			this.items.forEach(item => {
				if (item.innerText.toLowerCase().indexOf(this.field.area.value.toLowerCase()) < 0) {
					item.classList.add(Select.classHidden);
				} else {
					item.classList.remove(Select.classHidden);
				}
			});
		});
	}

}

_defineProperty(Select, "classOpen", '--open');

_defineProperty(Select, "classSelected", '--selected');

_defineProperty(Select, "classHidden", '--hidden');

_defineProperty(Select, "classError", '--error');