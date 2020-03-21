class Banner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    const title = document.createElement('h1');
    title.textContent = 'Dogcomponents'
    this.shadowRoot.appendChild(title)
  }

  renderIcon(icon) {
    this.shadowRoot.querySelector('h1').textContent += ` ${icon}`;
  }

  renderScrollButton() {
    const button = document.createElement('button');
    button.textContent = 'UP!'
    button.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: 'smooth'})
    })
    this.shadowRoot.appendChild(button)
  }

  connectedCallback() {
    const icon = this.getAttribute('icon')
    if (icon) {
      this.renderIcon(icon)
    }

    const scrollsToTheTop = this.getAttribute('scrollsToTheTop');
    if (scrollsToTheTop) {
      this.renderScrollButton()
    }
  }
}

customElements.define('app-banner', Banner);
