async function getDogBreeds(number) {
  const data = await fetch('https://dog.ceo/api/breeds/list/all')
  const parsedData = await data.json()
  const breeds = Object.keys(parsedData.message).slice(0, number);
  return breeds
}

async function getDogPicOfBreed(breed) {
  const data = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
  const parsedData = await data.json()
  return parsedData.message
}

export async function getDogCollection(number) {
  const dogBreeds = await getDogBreeds(number);
  const dogPictures = await Promise.all(dogBreeds.map(getDogPicOfBreed))

  const dogCollection = {};
  dogBreeds.forEach((breed, i) => {
    dogCollection[breed] = {
      breed,
      picture: dogPictures[i]
    }
  })

  return dogCollection;
}
