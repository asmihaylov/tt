class Slider {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.wrapper = this.container.querySelector('.slider-wrapper');
        this.prevBtn = this.container.querySelector('.nav-button__prev');
        this.nextBtn = this.container.querySelector('.nav-button__next');
        this.position = 0;
        this.step = 100;

        this.init();
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.slide('prev'));
        this.nextBtn.addEventListener('click', () => this.slide('next'));
        this.updateNavigation();
        window.addEventListener('resize', this.updateNavigation);
    }

    updateNavigation() {
        const maxScroll = this.wrapper.scrollWidth - this.container.clientWidth;
        this.prevBtn.classList.toggle('hidden', this.position <= 0);
        this.nextBtn.classList.toggle('hidden', this.position >= maxScroll);
    }

    slide(direction) {
        const maxScroll = this.wrapper.scrollWidth - this.container.clientWidth;

        if (direction === 'next') {
            this.position = Math.min(this.position + this.step, maxScroll);
        } else {
            this.position = Math.max(this.position - this.step, 0);
        }

        this.wrapper.style.transform = `translateX(-${this.position}px)`;
        this.updateNavigation();
    }
}
