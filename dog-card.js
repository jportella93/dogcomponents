class DogCard extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM
    this.attachShadow({mode: 'open'});

    // Get default content from template in our index.html
    const template = document.querySelector('#dog-card-content')

    // Append template content to our shadow DOM root.
    // Clone the template because we want to use it several times
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    // Add component style
    const style = document.createElement('style');
    style.innerHTML = `
      div {
        width: 300px;
        margin: 20px 10px 60px;
        display: inline-block;
        padding: 5px 20px 20px;
        background: white;

        /* box shadow from https://www.cssmatic.com/box-shadow */
        box-shadow: 2px 10px 20px 2px rgba(0,0,0,0.20);
      }
      div, img {
        border-radius: 4px;
      }
      img {
        max-width: 280px;
      }
      h2 {
        color: silver;
      }
    `
    this.shadowRoot.appendChild(style)
  }

  // Executed when we modify the property breed of an instance of this component
  set breed(passedBreed) {
    const title = this.shadowRoot.querySelector('h2');
    const capitalizedBreed = passedBreed.charAt(0).toUpperCase() + passedBreed.slice(1)
    title.textContent = capitalizedBreed;
  }

  // Executed when we modify the property img of an instance of this component
  set img(passedImg) {
    const img = this.shadowRoot.querySelector('img');
    img.src = passedImg;
  }
}

customElements.define('dog-card', DogCard);
