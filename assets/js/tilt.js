/**
 * 3D Interactive Tilt & Hologram Glare Engine
 * Lightweight, zero-dependency 3D card physics
 */

(function () {
  'use strict';

  class VanillaTiltVanilla {
    constructor(element, settings = {}) {
      if (!(element instanceof Node)) {
        throw new Error("Can't initialize VanillaTilt on " + element);
      }

      this.width = null;
      this.height = null;
      this.clientWidth = null;
      this.clientHeight = null;
      this.left = null;
      this.top = null;

      // Default settings
      this.settings = Object.assign({
        reverse: false,
        max: parseFloat(element.getAttribute('data-tilt-max')) || 12,
        perspective: 1000,
        easing: "cubic-bezier(.03,.98,.52,.99)",
        scale: parseFloat(element.getAttribute('data-tilt-scale')) || 1.02,
        speed: parseFloat(element.getAttribute('data-tilt-speed')) || 400,
        transition: true,
        axis: null,
        reset: true,
        glare: element.hasAttribute('data-tilt-glare'),
        "max-glare": parseFloat(element.getAttribute('data-tilt-max-glare')) || 0.25
      }, settings);

      this.element = element;
      this.elementListener = element;
      this.glare = this.settings.glare;

      if (this.glare) {
        this.prepareGlare();
      }

      this.addEventListeners();
    }

    addEventListeners() {
      this.onMouseEnterBind = this.onMouseEnter.bind(this);
      this.onMouseMoveBind = this.onMouseMove.bind(this);
      this.onMouseLeaveBind = this.onMouseLeave.bind(this);

      this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
      this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
      this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
    }

    removeEventListeners() {
      this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind);
      this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
      this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind);
    }

    onMouseEnter() {
      this.updateElementPosition();
      this.element.style.willChange = "transform";
      this.setTransition();
    }

    onMouseMove(event) {
      if (this.updateCall !== null) {
        cancelAnimationFrame(this.updateCall);
      }

      this.event = event;
      this.updateCall = requestAnimationFrame(this.update.bind(this));
    }

    onMouseLeave() {
      this.setTransition();
      if (this.settings.reset) {
        requestAnimationFrame(this.reset.bind(this));
      }
    }

    reset() {
      this.event = {
        clientX: this.left + this.width / 2,
        clientY: this.top + this.height / 2
      };

      if (this.element && this.element.style) {
        this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }

      this.resetGlare();
    }

    resetGlare() {
      if (this.glare) {
        this.glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)";
        this.glareElement.style.opacity = "0";
      }
    }

    updateElementPosition() {
      const rect = this.element.getBoundingClientRect();
      this.width = this.element.offsetWidth;
      this.height = this.element.offsetHeight;
      this.left = rect.left;
      this.top = rect.top;
    }

    update() {
      const values = this.getValues();

      this.element.style.transform = `perspective(${this.settings.perspective}px) ` +
        `rotateX(${this.settings.axis === "x" ? 0 : values.tiltY}deg) ` +
        `rotateY(${this.settings.axis === "y" ? 0 : values.tiltX}deg) ` +
        `scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})`;

      if (this.glare) {
        this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`;
        this.glareElement.style.opacity = `${values.percentageY * this.settings["max-glare"]}`;
      }

      this.updateCall = null;
    }

    prepareGlare() {
      const glarePrerender = document.createElement("div");
      glarePrerender.classList.add("js-tilt-glare");
      glarePrerender.style.position = "absolute";
      glarePrerender.style.top = "0";
      glarePrerender.style.left = "0";
      glarePrerender.style.width = "100%";
      glarePrerender.style.height = "100%";
      glarePrerender.style.overflow = "hidden";
      glarePrerender.style.pointerEvents = "none";
      glarePrerender.style.borderRadius = "inherit";

      const glareElement = document.createElement("div");
      glareElement.classList.add("js-tilt-glare-inner");
      glareElement.style.position = "absolute";
      glareElement.style.top = "50%";
      glareElement.style.left = "50%";
      glareElement.style.pointerEvents = "none";
      glareElement.style.backgroundImage = `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`;
      glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)";
      glareElement.style.transformOrigin = "0% 0%";
      glareElement.style.opacity = "0";
      glareElement.style.width = `${this.element.offsetWidth * 2}px`;
      glareElement.style.height = `${this.element.offsetWidth * 2}px`;

      glarePrerender.appendChild(glareElement);
      this.element.appendChild(glarePrerender);

      this.glareElementWrapper = glarePrerender;
      this.glareElement = glareElement;
    }

    setTransition() {
      clearTimeout(this.transitionTimeout);
      this.element.style.transition = `${this.settings.speed}ms ${this.settings.easing}`;
      if (this.glare) this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`;

      this.transitionTimeout = setTimeout(() => {
        this.element.style.transition = "";
        if (this.glare) this.glareElement.style.transition = "";
      }, this.settings.speed);
    }

    getValues() {
      let x = (this.event.clientX - this.left) / this.width;
      let y = (this.event.clientY - this.top) / this.height;

      x = Math.min(Math.max(x, 0), 1);
      y = Math.min(Math.max(y, 0), 1);

      const tiltX = (this.settings.reverse ? -1 : 1) * (this.settings.max / 2 - x * this.settings.max).toFixed(2);
      const tiltY = (this.settings.reverse ? 1 : -1) * (this.settings.max / 2 - y * this.settings.max).toFixed(2);
      const angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);

      return {
        tiltX: -tiltX,
        tiltY: tiltY,
        percentageX: x * 100,
        percentageY: y * 100,
        angle: angle
      };
    }
  }

  // Auto-init elements on DOMContentLoaded
  function initTilt() {
    if (window.matchMedia("(hover: none)").matches) return; // Disable on touch devices
    const elements = document.querySelectorAll("[data-tilt]");
    elements.forEach(el => new VanillaTiltVanilla(el));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTilt);
  } else {
    initTilt();
  }
})();

