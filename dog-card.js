class DogCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'})
    const template = document.querySelector('template#dog-card')
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  set data(data) {
    this.shadowRoot.innerHTML = `
    <style>
      img {
        width: 300px;
      }
      div {
        width: 300px;
        margin: 60px auto;
      }
      h2 {
        text-align: left;
        color: peru;
      }
    </style>

    <div>
      <h2>${data.breed}</h2>
      <img src="${data.picture}" alt="${data.breed}" />
    </div>`
  }

}

customElements.define('dog-card', DogCard)
