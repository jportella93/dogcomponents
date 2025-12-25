import { getDogCollection } from './dogApi.js';

// We don't import anything from these, we just need to run the code in there
import './dog-card.js';
import './app-banner.js';

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const swUrl = new URL('./myCoolServiceWorker.js', import.meta.url);
      const registration = await navigator.serviceWorker.register(swUrl, { scope: './' });
      console.log('SW registration successful!', registration)
    } catch (error) {
      console.log('SW registration failed!', error)
    }
  }
}

function setStatus(message, { withRetry = false } = {}) {
  const status = document.querySelector('#status');
  if (!status) return;
  status.innerHTML = '';
  if (message) {
    const p = document.createElement('p');
    p.textContent = message;
    status.appendChild(p);
  }
  if (withRetry) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Retry';
    button.addEventListener('click', () => window.location.reload());
    status.appendChild(button);
  }
}

function renderDogs(dogCollection) {
  const dogsWrapper = document.querySelector('#dogsWrapper');
  if (!dogsWrapper) return;
  dogsWrapper.innerHTML = '';

  Object.values(dogCollection).forEach(dogData => {
    // Create a new instance of dog-card
    const dogCard = document.createElement('dog-card')

    // This executes set breed() method on this dog-card instance
    dogCard.breed = dogData.breed;
    // This executes set img() method on this dog-card instance
    dogCard.img = dogData.picture;

    dogsWrapper.appendChild(dogCard)
  });
}

// All this block is executed when the window emits the load event
window.addEventListener('load', async () => {
  registerSW();

  setStatus('Loading dogs…');
  try {
    // Returns dog data from dog api https://dog.ceo/dog-api/
    const dogCollection = await getDogCollection(30);
    // Creates dog-cards with dog data and appends them to the DOM
    renderDogs(dogCollection);
    setStatus('');
  } catch (e) {
    console.error(e);
    setStatus('Could not load dogs (API error or offline).', { withRetry: true });
  }
})
