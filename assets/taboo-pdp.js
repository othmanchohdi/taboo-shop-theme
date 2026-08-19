/**
 * Taboo PDP interactivity: thumbnail gallery, variant selection syncing price,
 * quantity stepper, AJAX add-to-cart with a temporary "Added ✓" state,
 * and keeping the sticky mobile buy bar in sync with the form above it.
 * The add-to-cart button label shows the running total ("Add to cart · $19.99")
 * and updates live when quantity or variant changes, per the design spec.
 */
if (!customElements.get('taboo-pdp')) {
  class TabooPDP extends HTMLElement {
    connectedCallback() {
      this.form = this.querySelector('[data-pdp-form]');
      this.qtyValue = this.querySelector('[data-qty-value]');
      this.qtyInput = this.querySelector('[data-qty-input]');
      this.qtyUpBtns = this.querySelectorAll('[data-qty-up]');
      this.qtyDownBtns = this.querySelectorAll('[data-qty-down]');
      this.variantRadios = this.querySelectorAll('[data-variant-radio]');
      this.priceEl = this.querySelector('[data-price]');
      this.stickyPriceEl = this.querySelector('[data-sticky-price]');
      this.addBtn = this.querySelector('[data-add-btn]');
      this.addLabel = this.querySelector('[data-add-label]');
      this.stickyAddBtn = this.querySelector('[data-sticky-add]');
      this.thumbs = this.querySelectorAll('[data-thumb]');
      this.galleryImage = this.querySelector('[data-gallery-image]');

      this.quantity = 1;
      // Price in cents from data attribute; updated on variant change.
      this.currentPriceCents = this.addBtn
        ? parseInt(this.addBtn.dataset.priceCents || '0', 10)
        : 0;

      this.qtyUpBtns.forEach((btn) => btn.addEventListener('click', () => this.setQuantity(this.quantity + 1)));
      this.qtyDownBtns.forEach((btn) => btn.addEventListener('click', () => this.setQuantity(this.quantity - 1)));

      this.variantRadios.forEach((radio) => {
        radio.addEventListener('change', () => this.onVariantChange(radio));
      });

      this.thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => this.onThumbClick(thumb));
      });

      if (this.form) {
        this.form.addEventListener('submit', (e) => this.onSubmit(e));
      }

      if (this.stickyAddBtn && this.form) {
        this.stickyAddBtn.addEventListener('click', () => {
          if (typeof this.form.requestSubmit === 'function') {
            this.form.requestSubmit();
          } else {
            this.form.submit();
          }
        });
      }
    }

    formatMoney(cents) {
      return '$' + (cents / 100).toFixed(2);
    }

    addBtnLabel() {
      return 'Add to cart · ' + this.formatMoney(this.currentPriceCents * this.quantity);
    }

    setQuantity(value) {
      this.quantity = Math.max(1, value);
      if (this.qtyValue) this.qtyValue.textContent = this.quantity;
      if (this.qtyInput) this.qtyInput.value = this.quantity;
      if (this.addLabel && !this.addBtn.classList.contains('is-added')) {
        this.addLabel.textContent = this.addBtnLabel();
      }
    }

    onVariantChange(radio) {
      const price = radio.dataset.price;
      const priceCents = parseInt(radio.dataset.priceCents || '0', 10);

      if (price) {
        if (this.priceEl) this.priceEl.textContent = price;
        if (this.stickyPriceEl) this.stickyPriceEl.textContent = price;
      }
      if (priceCents) {
        this.currentPriceCents = priceCents;
        if (this.addLabel && !this.addBtn.classList.contains('is-added')) {
          this.addLabel.textContent = this.addBtnLabel();
        }
      }

      this.variantRadios.forEach((r) => {
        const label = r.closest('label');
        if (label) label.classList.toggle('is-selected', r === radio);
      });
    }

    onThumbClick(thumb) {
      const fullSrc = thumb.dataset.fullSrc;
      if (fullSrc && this.galleryImage) {
        this.galleryImage.src = fullSrc;
      }
      this.thumbs.forEach((t) => t.classList.toggle('is-active', t === thumb));
    }

    async onSubmit(event) {
      event.preventDefault();
      if (!this.form || !this.addBtn) return;

      const formData = new FormData(this.form);
      const originalLabel = this.addBtnLabel();

      this.addBtn.disabled = true;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Add to cart failed');
        }

        await response.json();

        if (this.addLabel) this.addLabel.textContent = 'Added ✓';
        this.addBtn.classList.add('is-added');
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(20);

        document.dispatchEvent(new CustomEvent('taboo:cart-updated'));

        window.setTimeout(() => {
          if (this.addLabel) this.addLabel.textContent = originalLabel;
          this.addBtn.classList.remove('is-added');
          this.addBtn.disabled = false;
        }, 1500);
      } catch (err) {
        this.addBtn.disabled = false;
        // Fall back to a full page submit if the AJAX call fails for any reason
        this.form.submit();
      }
    }
  }

  customElements.define('taboo-pdp', TabooPDP);
}
