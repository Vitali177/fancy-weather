/* global describe, it expect */

import { config } from '../assets/js/data/config';
import { markup } from '../assets/js/data/markup';
import { Model } from '../assets/js/modules/model';

describe('Check config object for translate', () => {
  it('Config should be an object', () => {
    expect(config).toBeInstanceOf(Object);
  });

  it('Config shouldn\'t be empty', () => {
    expect(config.length).not.toEqual(0);
  });

  it('Config should be with keys: days, coords, feels, wind, humidity', () => {
    expect(Object.keys(config)).toEqual(['days', 'coords', 'feels', 'wind', 'humidity']);
  });

  it('Check translation matching \'feels like\'', () => {
    expect(Object.values(config)[2]).toEqual({ ru: 'Ощущается, как', be: 'Адчуваецца як', en: 'Feels like' });
  });
});

describe('Check markup for application', () => {
  it('Markup should be a string', () => {
    expect(typeof (markup)).toEqual('string');
  });

  it('Markup shouldn\'t be empty string', () => {
    expect(markup.length).not.toEqual(0);
  });
});

describe('Check function getTemperatureValues of Model', () => {
  it('Function should be defined', () => {
    expect(Model.getTemperatureValues).toBeDefined();
  });
});
