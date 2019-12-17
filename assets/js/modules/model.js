/* global SpeechRecognition */
// eslint-disable-next-line import/no-cycle
import { View } from './view';
import { markup } from '../data/markup';
import { config } from '../data/config';

// eslint-disable-next-line import/prefer-default-export
export const Model = {
  dataWeather: null,
  userLocation: null,
  lang: localStorage.getItem('language') || 'en', // default

  async getCurrentUserLocation() {
    const queryApi = 'https://ipinfo.io/json?';
    const accessKey = 'token=524caa32c6de2e';

    const url = queryApi + accessKey;

    const res = await fetch(url);
    const data = await res.json();

    this.getCoordsByCity(data.city);
  },

  async getLinkToImage() {
    const { dataWeather } = this;
    const { season } = dataWeather;
    const time = dataWeather.timeOfDay;

    const queryApi = 'https://api.unsplash.com/photos/random?orientation=landscape&query=';
    const queries = `${season},${time},${dataWeather.currently.icon}`;
    const accessKey = '&client_id=641521c62215d61ca19f3ff91015771b64ba855a3ed3ce50c7902214c6f55957';

    const url = queryApi + queries + accessKey;

    const res = await fetch(url);
    const data = await res.json();

    View.showBackgroundImage(data.urls.regular);
  },

  async getWeather() {
    const { userLocation } = this;
    const { lang } = this;

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const query = 'https://api.darksky.net/forecast/';
    const secretKey = 'e5b418752262d6f5440bb6d510002282';
    const geo = `/${userLocation.loc}?lang=${lang}`;

    const url = proxyUrl + query + secretKey + geo;

    const res = await fetch(url);
    const data = await res.json();

    this.dataWeather = data;

    this.getDateForLinkToImage();
    this.getLinkToImage();
    View.showDaysWeek();
    View.changeIcons();
    View.changeTime();
  },

  getDateForLinkToImage() {
    const dateNow = new Date();
    const { dataWeather } = this;

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[dateNow.getMonth()];

    if (months.indexOf(month) > 1 && months.indexOf(month) < 5) {
      dataWeather.season = 'spring';
    } else if (months.indexOf(month) > 4 && months.indexOf(month) < 8) {
      dataWeather.season = 'summer';
    } else if (months.indexOf(month) > 7 && months.indexOf(month) < 11) {
      dataWeather.season = 'autumn';
    } else dataWeather.season = 'winter';

    const hour = dateNow.getHours();
    if (hour >= 3 && hour < 9) {
      dataWeather.timeOfDay = 'morning';
    } else if (hour >= 9 && hour < 15) {
      dataWeather.timeOfDay = 'afternoon';
    } else if (hour >= 15 && hour < 21) {
      dataWeather.timeOfDay = 'evening';
    } else dataWeather.timeOfDay = 'night';
  },

  async getCoordsByCity(city) {
    if (!city) { // Пользователь только зашел на страницу, надо определить его местоположение
      this.getCurrentUserLocation();
    } else {
      const { lang } = this;
      document.querySelector(`option.${lang}`).selected = true;

      const queryApi = 'https://api.opencagedata.com/geocode/v1/json?';
      const accessKey = `q=${city}&key=ddc1c7bc04434a968ca2655d83467aee&pretty=1&no_annotations=1&language=${lang}`;
      const url = queryApi + accessKey;

      const res = await fetch(url);
      const data = await res.json();

      this.userLocation = data;
      const { userLocation } = this;

      userLocation.loc = `${data.results[0].geometry.lat},${data.results[0].geometry.lng}`; // change loc

      View.changeInfoCityCountry();
      this.changeDataGeolocation();
      this.getWeather();
      View.showMap();
    }
  },

  getCityFromVoice() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', (e) => {
      if (e.results[0].isFinal) {
        const city = e.results[0][0].transcript;
        document.querySelector('#data-search-city').value = city; // Show in search field
        this.getCoordsByCity(city);
      }
    });
    recognition.start();
  },

  changeElementsLanguage() {
    this.CoordinatesOtherLang();

    const { lang } = this;
    const dateNow = new Date();

    const options = {
      timeZone: this.dataWeather.timezone, weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    };
    const textHeader3 = dateNow.toLocaleString([this.lang], options).split(' ');

    async function getWeatherToTranslateSummary() {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const query = 'https://api.darksky.net/forecast/';
      const secretKey = 'e5b418752262d6f5440bb6d510002282';
      const geo = `/${Model.userLocation.loc}?lang=${lang}`;
      const url = proxyUrl + query + secretKey + geo;

      const res = await fetch(url);
      const data = await res.json();
      document.querySelector('li.summary').innerHTML = `${data.currently.summary}`;
    }
    getWeatherToTranslateSummary();

    async function getWordInOtherLang(word, element) {
      const query = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=';
      const secretKey = `trnsl.1.1.20191130T110548Z.6f4de0dc48c49659.aae3063cbc52820b92300a5990f86052fd1a893b&text=${word}&lang=${lang}`;
      const url = `${query}${secretKey}`;

      const res = await fetch(url);
      const data = await res.json();

      textHeader3[2] = await data.text[0];
      document.querySelector(element).innerHTML = await textHeader3.join(' ');
    }

    let word;
    if (lang === 'be') { // так как toLocaleString не поддерживает бел. язык
      [, , word] = textHeader3;
      getWordInOtherLang(word, 'h3');
    } else {
      document.querySelector('h3').innerHTML = textHeader3.join(' ');
    }

    const strFeels = document.querySelector('li.feels-like').innerHTML.split(':');
    const strWind = document.querySelector('li.wind').innerHTML.split(':');
    const strHumidity = document.querySelector('li.humidity').innerHTML.split(':');

    document.querySelector('li.feels-like').innerHTML = `${config.feels[lang]}: ${strFeels[1]}`;
    document.querySelector('li.wind').innerHTML = `${config.wind[lang]}: ${strWind[1]}`;
    document.querySelector('li.humidity').innerHTML = `${config.humidity[lang]}: ${strHumidity[1]}`;

    View.showDaysWeek();
    View.displayCoords();
  },

  async CoordinatesOtherLang() {
    const { lang } = this;

    const city = document.querySelector('#data-search-city').value || 'Minsk';
    const queryApi = 'https://api.opencagedata.com/geocode/v1/json?';
    const accessKey = `q=${city}&key=ddc1c7bc04434a968ca2655d83467aee&pretty=1&no_annotations=1&language=${lang}`;
    const url = queryApi + accessKey;

    const res = await fetch(url);
    const data = await res.json();

    this.userLocation = data;
    this.userLocation.loc = `${data.results[0].geometry.lat},${data.results[0].geometry.lng}`; // change loc

    this.changeDataGeolocation();
    View.changeInfoCityCountry();
  },

  changeDataGeolocation() {
    const { userLocation } = this;
    const coords = [];
    const location = userLocation.loc.split(',');
    location.forEach((element) => {
      coords.push((element * 1).toFixed(2).split('.'));
    });

    userLocation.coords = coords;
    View.displayCoords();
  },

  getTemperatureValues() {
    const values = [];
    const units = localStorage.getItem('temperatureUnits') || 'celsius'; // default
    const data = this.dataWeather;

    const averageTemp = [(data.daily.data[0].temperatureHigh
      + data.daily.data[0].temperatureLow) / 2,
    (data.daily.data[1].temperatureHigh + data.daily.data[1].temperatureLow) / 2,
    (data.daily.data[2].temperatureHigh + data.daily.data[2].temperatureLow) / 2];

    if (units === 'celsius') {
      values.push(`${Math.round((averageTemp[0] - 32) * 0.55)}&ordm;`);
      values.push(`${Math.round((averageTemp[1] - 32) * 0.55)}&ordm;`);
      values.push(`${Math.round((averageTemp[2] - 32) * 0.55)}&ordm;`);
      values.push(`Feels like: ${Math.round((data.currently.temperature - 32) * 0.55)}&ordm;`);
      values.push(`${Math.round((data.currently.apparentTemperature - 32) * 0.55)}<span>&ordm;</span>`);
    } else {
      values.push(`${Math.round(averageTemp[0])}&ordm;`);
      values.push(`${Math.round(averageTemp[1])}&ordm;`);
      values.push(`${Math.round(averageTemp[2])}&ordm;`);
      values.push(`Feels like: ${Math.round(data.currently.temperature)}&ordm;`);
      values.push(`${Math.round(data.currently.apparentTemperature)}<span>&ordm;</span>`);
    }
    return values;
  },

  createHtmlElements() {
    document.body.innerHTML = markup;
  },
};
