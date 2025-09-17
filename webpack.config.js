const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add static file serving for images
  config.devServer = {
    ...config.devServer,
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
    ],
  };

  // Ensure react-native-svg works on web by aliasing to react-native-svg-web
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native-svg': 'react-native-svg-web',
  };

  return config;
};
