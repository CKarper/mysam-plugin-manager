import React from 'react';
import ReactDOM from 'react-dom';

const tplAvailable = (packages) => (
  <div className="mysam-plug-mgr animated fadeIn">
    The following plugin{packages.length > 0 ? 's are' : ' is'} available:
    <ul>
      {packages.map(pkg => <li key={pkg.name}>{pkg.name}</li>)}
    </ul>
  </div>
);

function getAvailablePlugins(app) {
  app.action('getAvailablePlugins', (el, classification) => {
    ReactDOM.render((
      <div className="mysam-plug-mgr animated fadeIn">
        <span className="searching">Searching for plugins...</span>
      </div>
    ), el);

    function findAvailablePlugins() {
      return fetch('/plugins/available')
        .then(response => response.json());
    }

    findAvailablePlugins()
      .then((plugins) => ReactDOM.render(tplAvailable(plugins), el));

    return function() {
      ReactDOM.unmountComponentAtNode(el);
    }
  });

  app.learn('getAvailablePlugins', {
    description: 'List available plugins for mySam',
    form(classification = {}) {
      return <div><input type="submit" /></div>;
    }
  });
}

const tplInstalled = (plugins) => (
  <div className="mysam-plug-mgr animated fadeIn">
    I have the following plugins installed:
    <ul>
      {plugins.map(plugin => (
        <li key={`${plugin.name}@${plugin.version}`}>
          <span className="plugin-name">{plugin.name}</span>
          <span className="plugin-version">v{plugin.version}</span>
        </li>
      ))}
    </ul>
  </div>
);

function getInstalledPlugins(app) {
  app.action('getInstalledPlugins', (el, classification) => {
    ReactDOM.render((
      <div className="mysam-plug-mgr animated fadeIn">
        <span className="searching">Collecting installed plugins...</span>
      </div>
    ), el);

    function findInstalledPlugins() {
      return fetch('/plugins')
        .then(response => response.json());
    }

    findInstalledPlugins()
      .then((plugins) => ReactDOM.render(tplInstalled(plugins), el));

    return function() {
      ReactDOM.unmountComponentAtNode(el);
    }
  });

  app.learn('getInstalledPlugins', {
    description: 'List installed plugins for mySam',
    form(classification = {}) {
      return <div><input type="submit" /></div>;
    }
  });
}

// Need this context from function, arrow function won't work.
export default function() {
  getAvailablePlugins(this);
  getInstalledPlugins(this);
}
