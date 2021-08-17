"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Popup {
  constructor() {
    Popup.block = this.block = document.createElement('div');
    this.block.className = 'popup';
    Popup.bg = this.bg = document.createElement('div');
    this.bg.className = 'popup__bg popup-close';
    Popup.inner = this.inner = document.createElement('div');
    this.inner.className = 'popup__inner';
    // Popup.list = this.list = document.createElement('div');
    // this.list.className = 'popup__list';
    this.block.append(this.bg);
    this.block.append(this.inner);
    // this.inner.append(this.list);
    document.body.append(this.block);
    Popup.items = this.items = [];
    this.initShowBtns();
    this.initCloseBtns();
    Popup.block.addEventListener('click', event => {
      if (!event.target.closest('.popup__item')) {
        Popup.close();
      }
    });
  }

  initShowBtns() {
    document.addEventListener('DOMContentLoaded', () => {

      this.showBtns = document.querySelectorAll('.popup-show, [data-popup]');
      
      if (this.showBtns) {
        this.showBtns.forEach(btn => {
          btn.addEventListener('click', event => {
            event.preventDefault();
            let btnSrc = btn.getAttribute('data-src'),
                btnHref = btn.getAttribute('href'),
                element = btnSrc ? btnSrc : btnHref;


            if (!element) {
              throw new Error('Not found attribute "data-src" or "href"');
              return false;
            } else {
              if (element.indexOf('.jpg') > -1 || element.indexOf('.jpeg') > -1 || element.indexOf('.png') > -1) {
                let img = document.createElement('img');
                img.src = element;
                Popup.element = this.element = img;
              } else {
                Popup.element = this.element = document.querySelector(element);
              }
            }

            if (this.element) {
              this.element.classList.add(Popup.classItem);
              Popup.show(this.element);
            } else {
              throw new Error('Popup not found');
              return false;
            }
          });
        });
      }
    });
  }

  initCloseBtns() {
    document.addEventListener('DOMContentLoaded', () => {
      this.closeBtns = document.querySelectorAll('.popup-close, [data-popup-close]');

      if (this.closeBtns) {
        this.closeBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            Popup.close();
          });
        });
      }
    });
  }

  static show(element) {

  	Popup.element = element;

  	Popup.element.classList.add(Popup.classItem);
  	Popup.element.classList.add(Popup.classShow);
    this.block.classList.add(Popup.classShow);
    document.body.classList.add(Popup.classBodyShow);
    this.inner.prepend(Popup.element);

    
  }

  static close() {
    Popup.element.classList.remove(Popup.classItem);
    this.block.classList.remove(Popup.classShow);
    document.body.classList.remove(Popup.classBodyShow);

    if (Popup.element.tagName.toLowerCase() == 'img') {
      setTimeout(() => {
        Popup.element.remove();
      }, 300);
    } else {
      document.body.append(Popup.element);
    }
  }

}

_defineProperty(Popup, "classShow", '--show');

_defineProperty(Popup, "classItem", 'popup__item');

_defineProperty(Popup, "classBodyShow", 'popup-show');

_defineProperty(Popup, "block", null);

_defineProperty(Popup, "bg", null);

_defineProperty(Popup, "inner", null);

_defineProperty(Popup, "list", null);

_defineProperty(Popup, "element", null);

new Popup();