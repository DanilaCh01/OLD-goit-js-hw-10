import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const infoContainer = document.querySelector('.country-info');

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const value = event.target.value.trim();
  if (value === '') {
    clearHTML();
    return;
  }
  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        clearHTML();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length === 1) {
        renderCountry(data);
      } else {
        renderListOfCountries(data);
      }
    })
    .catch(error => {
      clearHTML();
      if ((error.message = '404')) {
        Notify.failure('Oops, there is no country with that name');
      } else {
        Notify.failure('Error: ', error.message);
      }
    });
}

function clearHTML() {
  infoContainer.innerHTML = '';
  list.innerHTML = '';
}

function renderCountry(data) {
  const {
    name: { official },
    capital,
    population,
    flags: { svg },
    languages,
  } = data[0];

  const countryMarkup = `<div class="country-info-wrap">
    <div class="country-name-wrap">
      <img src="${svg}" alt="Flag of ${official}">
      <h2 class="country-name">${official}</h2>
    </div>
    <ul>
      <li><span>Capital: </span>${capital.join('')}</li>
      <li><span>Population: </span>${population}</li>
      <li><span>Languages: </span>${Object.values(languages).join(', ')}</li>
    </ul>
    </div>`;

  clearHTML();
  infoContainer.innerHTML = countryMarkup;
}

function renderListOfCountries(countries) {
  const countryListMarkup = countries.map(country => {
    const {
      name: { official },
      flags: { svg },
    } = country;

    return `<li class="country-item">
      <img src="${svg}" alt="Flag of ${official}">
      <p clas="country-item-name">${official}</p>
    </li>`;
  });

  clearHTML();
  list.innerHTML = countryListMarkup.join('');
}
