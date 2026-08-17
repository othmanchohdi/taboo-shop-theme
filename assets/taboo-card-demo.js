/**
 * Taboo card demo: countdown timer, buzzer (WebAudio + vibration + red overlay),
 * card cycling. Scoped as a custom element so it's section-instance-safe even if
 * the section is added to a page more than once.
 */
if (!customElements.get('taboo-card-demo')) {
  class TabooCardDemo extends HTMLElement {
    connectedCallback() {
      this.totalSeconds = parseInt(this.dataset.timerSeconds, 10) || 60;
      this.secondsLeft = this.totalSeconds;
      this.running = false;
      this.intervalId = null;

      this.cardInner = this.querySelector('[data-card-inner]');
      this.cardFaces = Array.from(this.querySelectorAll('[data-card-face]'));
      this.activeIndex = this.cardFaces.findIndex((el) => el.classList.contains('is-active'));
      if (this.activeIndex < 0) this.activeIndex = 0;

      this.timerDisplay = this.querySelector('[data-timer-display]');
      this.timerToggleBtns = this.querySelectorAll('[data-timer-toggle]');
      this.buzzBtns = this.querySelectorAll('[data-buzz]');
      this.nextBtns = this.querySelectorAll('[data-next-card], [data-next-card-mobile]');
      this.openPackBtns = this.querySelectorAll('[data-open-pack]');
      this.overlay = this.querySelector('[data-buzz-overlay]');

      this.timerToggleBtns.forEach((btn) => btn.addEventListener('click', () => this.toggleTimer()));
      this.buzzBtns.forEach((btn) => btn.addEventListener('click', () => this.buzz()));
      this.nextBtns.forEach((btn) => btn.addEventListener('click', () => this.nextCard()));
      this.openPackBtns.forEach((btn) => btn.addEventListener('click', (e) => {
        const url = e.currentTarget.dataset.url;
        if (url) window.location.href = url;
      }));

      this.renderTimer();
    }

    disconnectedCallback() {
      this.clearTimer();
    }

    toggleTimer() {
      if (this.running) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    }

    startTimer() {
      if (this.secondsLeft <= 0) this.secondsLeft = this.totalSeconds;
      this.running = true;
      this.setToggleLabel('Pause');
      this.clearTimer();
      this.intervalId = window.setInterval(() => {
        this.secondsLeft -= 1;
        if (this.secondsLeft <= 0) {
          this.secondsLeft = 0;
          this.renderTimer();
          this.pauseTimer();
          this.buzz();
          return;
        }
        this.renderTimer();
      }, 1000);
    }

    pauseTimer() {
      this.running = false;
      this.setToggleLabel(this.secondsLeft === this.totalSeconds ? 'Start' : 'Resume');
      this.clearTimer();
    }

    clearTimer() {
      if (this.intervalId) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }

    setToggleLabel(label) {
      this.timerToggleBtns.forEach((btn) => { btn.textContent = label; });
    }

    renderTimer() {
      if (!this.timerDisplay) return;
      this.timerDisplay.textContent = this.secondsLeft;
      this.timerDisplay.classList.toggle('is-low', this.secondsLeft <= 10);
    }

    nextCard() {
      if (!this.cardFaces.length) return;
      this.cardFaces[this.activeIndex].classList.remove('is-active');
      this.activeIndex = (this.activeIndex + 1) % this.cardFaces.length;
      const nextFace = this.cardFaces[this.activeIndex];
      // restart the CSS deal-in animation
      nextFace.style.animation = 'none';
      // eslint-disable-next-line no-unused-expressions
      nextFace.offsetHeight;
      nextFace.style.animation = '';
      nextFace.classList.add('is-active');

      this.secondsLeft = this.totalSeconds;
      this.pauseTimer();
      this.renderTimer();
    }

    buzz() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(150, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.45);
          gain.gain.setValueAtTime(0.16, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.46);
        }
      } catch (e) {
        // WebAudio unavailable — fail silently, visual buzz still fires
      }

      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([90, 50, 140]);
      }

      if (this.overlay) {
        this.overlay.classList.add('is-active');
        window.setTimeout(() => {
          this.overlay.classList.remove('is-active');
        }, 620);
      }
    }
  }

  customElements.define('taboo-card-demo', TabooCardDemo);
}
