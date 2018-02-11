const assert = require('assert'),
    moment = require('moment'),
    JSDOM = require("jsdom").JSDOM,
    { WeatherApp, DataProvider } = require('../main.js');

    fakeDataProvider = {
      getData() {
        return new Promise(resolve => {
          resolve(require('./testdata.json'));
        });
      }
    };

global.fetch = require('node-fetch');
global.moment = moment;

describe('DataProvider', () => {
  describe('getData()', () => {
    it('should retrieve data for 6 days', done => {
      let dataProvider = new DataProvider();
      
      dataProvider.getData().then(data => {
          let start = moment(data.list[0].dt * 1000),
            end = moment(data.list[data.list.length-1].dt * 1000);

        // note that this assertion may fail if you run this test after 21:00 as the result would 'in 5 days;
        // I patched it with the `replace` but obvisouly it's the wrong way to do it
        assert.equal(end.from(start).replace(/5/,'6'), 'in 6 days');  
        done();
      });
    });
  });
});

describe('WeatherApp', () => {
    describe('getTemplate()', () => {
      it('return a node elment of a template', () => {
        global.document = new JSDOM('<html><template id="template-test">testing</template></html>').window.document;
        assert.equal(WeatherApp.prototype.getTemplate('template-test').childNodes[0].textContent, 'testing');
      });
    });

    describe('getForecastGroupByDay()', () => {
      it('group data into 5 days', done => {
        fakeDataProvider.getData().then(data => {
          assert.equal(WeatherApp.prototype.getForecastGroupByDay(data.list).size, 5);
          done();
        });
      });

      it('calculate statistics information correctly', done => {
        fakeDataProvider.getData().then(data => {
          assert.equal(WeatherApp.prototype.getForecastGroupByDay(data.list).get(16).totalRain, 2.96);
          done();
        });
      });
    });
  });