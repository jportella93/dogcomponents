import { getDogCollection } from './dogApi.js';
import './dog-card.js';
import './app-banner.js';

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      console.log(`SW registration failed`);
    }
  }
}

function renderDogs(dogCollection) {
  Object.values(dogCollection).forEach(dogData => {
    const dogCard = document.createElement('dog-card')
    dogCard.breed = dogData.breed;
    dogCard.img = dogData.picture;
    const dogsWrapper = document.querySelector('#dogsWrapper');
    dogsWrapper.appendChild(dogCard)
  });
}

window.addEventListener('load', async () => {
  registerSW();
  const dogCollection = await getDogCollection(5);
  console.log('---->: dogCollection', dogCollection)
  renderDogs(dogCollection);
})
