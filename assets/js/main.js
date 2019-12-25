// jshint esversion: 8
import { Controller } from './modules/controller';
import { Model } from './modules/model';

// eslint-disable-next-line import/no-extraneous-dependencies
require('babel-core/register');
// eslint-disable-next-line import/no-extraneous-dependencies
require('babel-polyfill');

window.addEventListener('DOMContentLoaded', () => {
  if (document.body.scrollHeight < window.innerHeight) {
    document.body.style.height = '792px';
  }

  Model.createHtmlElements();
  Controller.addEventListeners();
  Model.getCoordsByCity();
});
