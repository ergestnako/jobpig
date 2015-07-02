'use strict';

var Adaptor = require('./adaptor');
var nconf = require('nconf');
var request = require('request');

class GunIO extends Adaptor {
  list(done) {
    let jobs;
    this.nightmare
    .goto('https://gun.io/accounts/signin/')
    .type('#id_identification', nconf.get('gunio:username'))
    .type('#id_password', nconf.get('gunio:password'))
    .click('input[value="Sign in"]')
    .wait()
    .evaluate(function () {
      var t = function(el, binding) {
        return el.querySelector('[data-bind="text: ' + binding + '"]').innerText;
      }
      return Array.prototype.slice
        .call(document.querySelectorAll('#contractjobs_container .row.bs-docs'))
        .map(function (el) {
          var id = el.querySelector('[data-bind="attr: { class: \'jobbody\' + id }"]').className.replace('jobbody', '');
          return {
            id: id,
            source: 'gunio',
            title: t(el, 'title'),
            company: t(el, 'company_name'),
            url: 'https://gun.io/dash3/gig/' + id,
            description: t(el, 'blurb'),
            location: t(el, 'city') + ',' + t(el, 'state'),
            budget: el.querySelector('h2.variable span').innerText,
            tags: Array.prototype.slice
              .call(el.querySelector('[data-bind="html: tagify(tags)"]').querySelectorAll('a'))
              .map(function (tag) {
                return tag.innerText.replace(/\,/g,'');
              })
          }
        })
    }, function (_jobs) {
      jobs = _jobs;
    })
    .run(function (err, nightmare) {
        Adaptor.prototype.list(done, err, jobs);
    });
  }
  expand(job, done){
    //https://gun.io/api2/contractbody/1005/
    request(`https://gun.io/api2/contractbody/${job.id}/`, function(err, response, html){
      done(err, JSON.parse(html).description);
    })
  }
}

module.exports = GunIO;
