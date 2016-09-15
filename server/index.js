// https://registry.npmjs.org/-/_view/byKeyword?startkey=[%22mysam-plugin%22]&endkey=[%22mysam-plugin%22,{}]&group_level=3

const fetch = require('node-fetch');
const hooks = require('feathers-hooks');
const debug = require('debug')('mysam-plugin-manager:server/index.js');

const searchUrl = 'https://registry.npmjs.org/-/_view/byKeyword?startkey=[%22mysam-plugin%22]&endkey=[%22mysam-plugin%22,{}]&group_level=3';

module.exports = exports = function() {
  const app = this;
  const svc = app.service('plugins');

  const installed = svc.list._v.map(plugin => plugin.name);

  svc.before({
    get(hook) {
      if (hook.id === 'available') {
        return fetch(searchUrl)
          .then(response => response.json())
          .then(result => result.rows.map(row => ({ name: row.key[row.key.length-2], description: row.key[row.key.length-1] })))
          .then(packages => packages.filter(pkg => installed.indexOf(pkg.name) === -1))
          .then((plugins) => { hook.result = plugins });
      }
    }
  });
}


