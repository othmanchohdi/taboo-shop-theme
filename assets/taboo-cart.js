/**
 * Taboo cart page: quantity +/-, remove, and upsell add-to-cart all go through
 * Shopify's cart AJAX endpoints so the page updates in place. Falls back to a
 * full reload if any call fails, so the cart is never left in a stale state.
 */
if (!customElements.get('taboo-cart')) {
  class TabooCart extends HTMLElement {
    connectedCallback() {
      this.addEventListener('click', (e) => this.onClick(e));
    }

    onClick(event) {
      const upsellBtn = event.target.closest('[data-upsell-add]');
      if (upsellBtn) {
        this.addUpsell(upsellBtn);
        return;
      }

      const line = event.target.closest('[data-line]');
      if (!line) return;

      const key = line.dataset.lineKey;

      if (event.target.closest('[data-remove]')) {
        this.updateLine(key, 0, line);
        return;
      }
      if (event.target.closest('[data-qty-up]')) {
        const qtyEl = line.querySelector('[data-qty-value]');
        const next = parseInt(qtyEl.textContent, 10) + 1;
        this.updateLine(key, next, line);
        return;
      }
      if (event.target.closest('[data-qty-down]')) {
        const qtyEl = line.querySelector('[data-qty-value]');
        const next = Math.max(0, parseInt(qtyEl.textContent, 10) - 1);
        this.updateLine(key, next, line);
      }
    }

    async updateLine(key, quantity, line) {
      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ id: key, quantity }),
        });
        if (!response.ok) throw new Error('Cart update failed');
        const cart = await response.json();
        this.syncFromCart(cart, key, quantity, line);
      } catch (err) {
        window.location.reload();
      }
    }

    syncFromCart(cart, key, quantity, line) {
      if (quantity === 0) {
        line.remove();
      } else {
        const item = cart.items.find((i) => i.key === key);
        if (item) {
          const qtyEl = line.querySelector('[data-qty-value]');
          const totalEl = line.querySelector('[data-line-total]');
          if (qtyEl) qtyEl.textContent = item.quantity;
          if (totalEl) totalEl.textContent = this.formatMoney(item.final_line_price);
        }
      }

      const itemCountEl = this.querySelector('[data-item-count]');
      const subtotalEl = this.querySelector('[data-subtotal]');
      const totalEl = this.querySelector('[data-total]');
      const shippingEl = this.querySelector('[data-shipping]');
      const shipCard = this.querySelector('[data-ship-card]');
      const shipFill = this.querySelector('[data-ship-fill]');
      const shipNote = this.querySelector('[data-ship-note]');

      if (itemCountEl) itemCountEl.textContent = `${cart.item_count} items`;
      if (subtotalEl) subtotalEl.textContent = this.formatMoney(cart.total_price);
      if (totalEl) totalEl.textContent = this.formatMoney(cart.total_price);

      const thresholdCents = parseInt(this.dataset.thresholdCents, 10) || 3500;
      const freeShipping = cart.total_price >= thresholdCents;

      if (shippingEl) shippingEl.textContent = freeShipping ? 'Free' : shippingEl.textContent;
      if (shipCard) shipCard.hidden = freeShipping;
      if (shipFill) {
        const pct = Math.min(100, Math.round((cart.total_price / thresholdCents) * 100));
        shipFill.style.width = `${pct}%`;
      }
      if (shipNote && !freeShipping) {
        const remaining = thresholdCents - cart.total_price;
        shipNote.textContent = `${this.formatMoney(remaining)} away from free shipping`;
      }

      if (cart.item_count === 0) {
        window.location.reload();
      }
    }

    async addUpsell(btn) {
      const variantId = btn.dataset.variantId;
      if (!variantId) return;
      btn.disabled = true;
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 }),
        });
        if (!response.ok) throw new Error('Add failed');
        window.location.reload();
      } catch (err) {
        btn.disabled = false;
        window.location.reload();
      }
    }

    formatMoney(cents) {
      return `$${(cents / 100).toFixed(2)}`;
    }
  }

  customElements.define('taboo-cart', TabooCart);
}
