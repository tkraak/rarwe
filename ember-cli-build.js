'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { join } = require('path');
const { WatchedDir } = require('broccoli-source');
const compilePostCSS = require('broccoli-postcss-single');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    // other settings
  });

  const tailwindBase = join(__dirname, 'app', 'tailwind');
  const plugins = [require('tailwindcss')(join(tailwindBase, 'config.js'))];

  if (EmberApp.env() === 'production') {
    plugins.push({
      module: require('@fullhuman/postcss-purgecss'),
      options: {
        content: [
          join(__dirname, 'app', 'index.html'),
          join(__dirname, 'app', '**', '*.js'),
          join(__dirname, 'app', '**', '*.hbs')
        ],
        defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
        whitelistPatterns: [/^_/]
      }
    });
  }

  const tailwindNode = compilePostCSS(
    new WatchedDir(tailwindBase),
    'index.css',
    'assets/tailwind.css',
    { cacheInclude: [/.*\.(css|js)$/], plugins }
  );

  return app.toTree([tailwindNode]);
};
