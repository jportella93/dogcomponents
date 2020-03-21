class DogCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    const template = document.querySelector('#dog-card-content')
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    const style = document.createElement('style');
    style.innerHTML = `
    div {
      border: 2px solid lightgray;
      width: 300px;
      margin: 20px auto 60px;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 2px 14px 25px 3px rgba(0,0,0,0.28);
    }
    img {
      max-width: 300px;
    }
    `
    this.shadowRoot.appendChild(style)
  }

  set breed(passedBreed) {
    const title = this.shadowRoot.querySelector('h2');
    title.textContent = passedBreed;
  }

  set img(passedImg) {
    const img = this.shadowRoot.querySelector('img');
    img.src = passedImg;
  }
}

customElements.define('dog-card', DogCard);
