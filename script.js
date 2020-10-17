import { getDogCollection } from './dogApi.js';

// We don't import anything from these, we just need to run the code in there
import './dog-card.js';
import './app-banner.js';

async function registerSW() {
  if (navigator.serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.register('./myCoolServiceWorker.js')
      console.log('SW registration succesful!', registration)
    } catch (error) {
      console.log('SW registraion failed!', error)
    }
  }
}

function renderDogs(dogCollection) {
  Object.values(dogCollection).forEach(dogData => {
    // Create a new instance of dog-card
    const dogCard = document.createElement('dog-card')

    // This executes set breed() method on this dog-card instance
    dogCard.breed = dogData.breed;
    // This executes set img() method on this dog-card instance
    dogCard.img = dogData.picture;

    const dogsWrapper = document.querySelector('#dogsWrapper');
    dogsWrapper.appendChild(dogCard)
  });
}

// All this block is executed when the window emits the load event
window.addEventListener('load', async () => {
  registerSW();

  // Returns dog data from dog api https://dog.ceo/dog-api/
  const dogCollection = await getDogCollection(30);

  // Creates dog-cards with dog data and appends them to the DOM
  renderDogs(dogCollection);
})
