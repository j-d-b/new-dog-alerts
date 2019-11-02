require('dotenv').config();

const axios = require('axios');
const { sendNewDogsEmail, sendErrorEmail } = require('./send-email');

const { CHECK_FREQUENCY_MINUTES, PETFINDER_API_KEY, PETFINDER_SECRET_KEY, ZIP_CODE } = process.env;
const checkFrequencyMilliseconds = 1000 * 60 * CHECK_FREQUENCY_MINUTES;

const GET_AUTH_TOKEN = {
  url: 'https://api.petfinder.com/v2/oauth2/token',
  method: 'POST',
  data: {
    grant_type: 'client_credentials',
    client_id: PETFINDER_API_KEY,
    client_secret: PETFINDER_SECRET_KEY
  }
};

axios(GET_AUTH_TOKEN)
  .then(({ data }) => {
    const accessToken = data.access_token;
    
    return axios({
      url: 'https://api.petfinder.com/v2/animals',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      method: 'GET',
      params: {
        type: 'Dog',
        location: ZIP_CODE,
        sort: 'recent',
        age: 'baby',
        limit: 15,
        distance: 150
      }
    })
  })
  .then(({ data }) => {
    const newDogs = data.animals
      .filter(dog => {
        const lastUpdate = Date.parse(dog.status_changed_at);
        const isNewSinceLastCheck = lastUpdate >= Date.now() - checkFrequencyMilliseconds * 20;
        return dog.photos[0] && isNewSinceLastCheck;
      })
      .map(dog => ({
        name: dog.name,
        url: dog.url,
        imageURL: dog.photos[0].large
      }));

    if (newDogs.length) {
      sendNewDogsEmail(newDogs);
    }
  })
  .catch(err => sendErrorEmail(err));
