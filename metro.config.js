const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add wav files to asset extensions for audio bundling
config.resolver.assetExts.push('wav');

// Provide a web-specific mock for react-native-get-random-values
// (it uses import.meta which doesn't work in Metro web bundle)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-get-random-values') {
    return {
      filePath: path.resolve(__dirname, 'src/utils/polyfills/get-random-values.web.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
