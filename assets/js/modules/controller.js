import { View } from './view';
import { Model } from './model';

// eslint-disable-next-line import/prefer-default-export
export const Controller = {
  addEventListeners() {
    const buttonChangeBackground = document.getElementById('button-change-background');
    buttonChangeBackground.addEventListener('click', () => Model.getLinkToImage());

    const buttonFahrenheit = document.querySelector('.button-fahrenheit');
    const buttonCelsius = document.querySelector('.button-celsius');

    buttonFahrenheit.addEventListener('click', () => {
      buttonFahrenheit.classList.add('active');
      buttonCelsius.classList.remove('active');
      localStorage.setItem('temperatureUnits', 'fahrenheit');
      View.changeTemperatureUnits();
    });
    buttonCelsius.addEventListener('click', () => {
      buttonFahrenheit.classList.remove('active');
      buttonCelsius.classList.add('active');
      localStorage.setItem('temperatureUnits', 'celsius');
      View.changeTemperatureUnits();
    });

    const buttonSearchCity = document.querySelector('#search-city');
    buttonSearchCity.addEventListener('click', (e) => {
      e.preventDefault();
      const city = document.querySelector('#data-search-city').value;
      Model.getCoordsByCity(city);
    });

    const select = document.querySelector('select#change-language');
    select.addEventListener('change', () => {
      localStorage.setItem('language', select.value);
      Model.lang = select.value;
      Model.changeElementsLanguage();
    });

    const voiceSearch = document.querySelector('.voice-search');
    voiceSearch.addEventListener('click', () => {
      document.querySelector('#data-search-city').value = 'Please, Saying the city...';
      Model.getCityFromVoice(); 
    });
  },
};
