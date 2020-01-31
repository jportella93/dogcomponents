import { getDogCollection } from './dogApi.js';

function renderDogs(dogCollection) {
  Object.values(dogCollection).forEach(dogData => {
    const dogCard = document.createElement('h2')
    dogCard.textContent = dogData.breed
    const dogsWrapper = document.querySelector('#dogsWrapper');
    dogsWrapper.appendChild(dogCard)
  });
}

window.addEventListener('load', async () => {
  const dogCollection = await getDogCollection(5);
  renderDogs(dogCollection);
})
