class AppBanner extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    const template = document.querySelector('template#app-banner')
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  getArrowUp() {
    const arrowUp = document.createElement('button')
    arrowUp.textContent = 'Go up 👆';
    return arrowUp;
  }

  connectedCallback() {
    const scrollsToTop = this.getAttribute('position') === 'bottom';
    if (scrollsToTop) {
      const arrowUp = this.getArrowUp();
      arrowUp.addEventListener('click', () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      })
      this.shadowRoot.appendChild(arrowUp)
    }
  }
}

customElements.define('app-banner', AppBanner)
