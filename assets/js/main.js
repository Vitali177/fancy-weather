// jshint esversion: 8
import { Controller } from './modules/controller';
import { Model } from './modules/model';

// eslint-disable-next-line import/no-extraneous-dependencies
require('babel-core/register');
// eslint-disable-next-line import/no-extraneous-dependencies
require('babel-polyfill');

window.addEventListener('DOMContentLoaded', () => {
  // const scrollHeight = Math.max(
  //   document.body.scrollHeight, document.documentElement.scrollHeight,
  //   document.body.offsetHeight, document.documentElement.offsetHeight,
  //   document.body.clientHeight, document.documentElement.clientHeight,
  // );
  // document.body.style.height = `${document.body.scrollHeight}px`;
  document.body.style.backgroundColor = `red`;
  Model.createHtmlElements();
  Controller.addEventListeners();
  Model.getCoordsByCity();
});
