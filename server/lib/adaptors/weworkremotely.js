'use strict';

let Adaptor = require('./index').Adaptor;
let _ = require('lodash');

module.exports = class WeWorkRemotely extends Adaptor {
  refresh() {
    return this.fetchFeed('https://weworkremotely.com/jobs.rss').then(results=>{
      let feed = results.rss.channel["0"].item;
      let jobs = _.map(feed.slice(0,100), item=> {
        return {
          key: item.guid[0],
          source: 'weworkremotely',
          title: item.title[0],
          company: /^(.*?)\:/gi.exec(item.title[0])[1],
          url: item.link[0],
          description: item.description[0],
          location: 'Remote',
          money: null,
          remote: true,
          tags: []
        }
      });
      return Promise.resolve({jobs, feed});
    })
  }
}