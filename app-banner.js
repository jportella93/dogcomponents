class Banner extends HTMLElement {
  constructor() {
    super();
    // Create shadow DOM
    this.attachShadow({mode: 'open'});

    // Create default title
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
      // Window method to scroll smoothly to the top
      window.scrollTo({top: 0, behavior: 'smooth'})
    })
    this.shadowRoot.appendChild(button)
  }

  // This gets executed when the component is added to the document
  connectedCallback() {
    // This is how we get <app-banner icon="something"></app-banner>
    const icon = this.getAttribute('icon')
    if (icon) {
      this.renderIcon(icon)
    }

    // This is how we get <app-banner scrollsToTheTop></app-banner>
    const scrollsToTheTop = this.getAttribute('scrollsToTheTop') !== null;
    if (scrollsToTheTop) {
      this.renderScrollButton()
    }
  }
}

customElements.define('app-banner', Banner);
