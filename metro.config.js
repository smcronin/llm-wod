const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add wav files to asset extensions for audio bundling
config.resolver.assetExts.push('wav');

// Web-specific module resolutions for packages using import.meta (unsupported in Metro web bundle)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // react-native-get-random-values uses import.meta
    if (moduleName === 'react-native-get-random-values') {
      return {
        filePath: path.resolve(__dirname, 'src/utils/polyfills/get-random-values.web.js'),
        type: 'sourceFile',
      };
    }
    // zustand ESM uses import.meta.env - force CommonJS version
    if (moduleName === 'zustand') {
      return {
        filePath: path.resolve(__dirname, 'node_modules/zustand/index.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'zustand/middleware') {
      return {
        filePath: path.resolve(__dirname, 'node_modules/zustand/middleware.js'),
        type: 'sourceFile',
      };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
