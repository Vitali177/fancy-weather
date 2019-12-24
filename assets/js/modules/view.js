/* global mapboxgl */
// eslint-disable-next-line import/no-cycle
import { Model } from './model';
import { config } from '../data/config';

// eslint-disable-next-line import/prefer-default-export
export const View = {
  changeTemperatureUnits() {
    const units = localStorage.getItem('temperatureUnits') || 'celsius'; // default
    const button = document.querySelector(`.button-${units}`);
    button.classList.add('active'); // change bg button
    const values = Model.getTemperatureValues();

    [document.querySelector('.weather__three-days__first p.day-temperature').innerHTML,
      document.querySelector('.weather__three-days__second p.day-temperature').innerHTML,
      document.querySelector('.weather__three-days__third p.day-temperature').innerHTML,
      document.querySelector('li.feels-like').innerHTML,
      document.querySelector('.weather__today p.temperature').innerHTML] = values;
  },

  changeIcons() {
    const data = Model.dataWeather;

    document.querySelector('li.summary').innerText = `${data.currently.summary}`;
    document.querySelector('li.wind').innerText = `Wind: ${Math.round(data.currently.windSpeed, 1)}m/s`;
    document.querySelector('li.humidity').innerText = `Humidity: ${Math.round(data.currently.humidity * 100)}%`;

    const imageWeatherToday = document.querySelector('.weather__today img');
    imageWeatherToday.src = `assets/data/weather/${data.currently.icon}.png`;

    const imageNextFirstDay = document.querySelector('.weather__three-days__first img');
    const imageNextSecondDay = document.querySelector('.weather__three-days__second img');
    const imageNextThirdDay = document.querySelector('.weather__three-days__third img');

    imageNextFirstDay.src = `assets/data/weather/${data.daily.data[0].icon}.png`;
    imageNextSecondDay.src = `assets/data/weather/${data.daily.data[1].icon}.png`;
    imageNextThirdDay.src = `assets/data/weather/${data.daily.data[2].icon}.png`;

    this.changeTemperatureUnits('celsius'); // default
    Model.changeElementsLanguage();
  },

  changeInfoCityCountry() {
    const info = Model.userLocation.results[0].formatted.split(',');
    const country = info[info.length - 1];
    const city = info[0];
    document.querySelector('.info h1').innerHTML = `${city}, ${country}`;
  },

  displayCoords() {
    const lang = localStorage.getItem('language') || 'en';
    const { coords } = Model.userLocation;

    document.querySelector('.latitude').innerHTML = `${config.coords.lat[lang]}: <span>${coords[0][0]}&ordm;${coords[0][1]}'</span>`;
    document.querySelector('.longitude').innerHTML = `${config.coords.lon[lang]}: <span>${coords[1][0]}&ordm;${coords[1][1]}'</span>`;
  },

  showBackgroundImage(url) {
    document.body.style.background = `url(" ${url} ") 0 0 no-repeat no-repeat`;
    document.body.style.backgroundSize = 'cover';
  },

  showDaysWeek() {
    const dateNow = new Date();

    document.querySelector('.day-week-first').innerText = config.days[dateNow.getDay() > 6 ? (dateNow.getDay()) % 7 : dateNow.getDay()][Model.lang];
    document.querySelector('.day-week-second').innerText = config.days[dateNow.getDay() + 1 > 6 ? (dateNow.getDay() + 1) % 7 : dateNow.getDay() + 1][Model.lang];
    document.querySelector('.day-week-third').innerText = config.days[dateNow.getDay() + 2 > 6 ? (dateNow.getDay() + 2) % 7 : dateNow.getDay() + 2][Model.lang];
  },

  changeTime() {
    function update() {
      const dateNow = new Date();

      const options = {
        timeZone: Model.dataWeather.timezone, weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      };
      document.querySelector('.info h3').innerHTML = `${dateNow.toLocaleString([Model.lang], options)}`;
    }
    update();
    setInterval(update, 60000); // every minute
  },

  showMap() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoidml0YWxpMTc3IiwiYSI6ImNrM2UxOWh2NjFiMzAzY3FobmdpMmdxMmsifQ.zHaP4A3pkVxalWbz_jHwtA';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
    });

    const size = 50;
    // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
    // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // get rendering context for the map canvas when layer is added to the map
      onAdd() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      // called once before every frame where the icon will be used
      render() {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const { context } = this;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 200, 200,${1 - t})`;
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      },
    };

    function showGeolocationOnMap() {
      const coords = Model.userLocation.loc.split(',');

      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [coords[1], coords[0]],
              },
            }],
          },
        },
        layout: {
          'icon-image': 'pulsing-dot',
        },
      });
    }

    map.on('load', () => {
      showGeolocationOnMap();
    });
  },
};
