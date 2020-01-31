import './app-banner.js';
import './dog-card.js';
import { getDogCollection } from './dogApi.js';

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
    dogCard.data = dogData;
    const dogsWrapper = document.querySelector('#dogsWrapper');
    dogsWrapper.appendChild(dogCard)
  });
}

window.addEventListener('load', async () => {
  registerSW();
  const dogCollection = await getDogCollection(5);
  renderDogs(dogCollection);
})
