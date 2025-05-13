const { getDefaultConfig } = require('expo/metro-config');

// Create the default Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Disable unstable_enablePackageExports to fix the ws/net module issue
defaultConfig.resolver.unstable_enablePackageExports = false;

// Expand resolver.sourceExts to include more file extensions
defaultConfig.resolver.sourceExts = [
  ...defaultConfig.resolver.sourceExts,
  'jsx', 'js', 'ts', 'tsx', 'json', 'mjs', 'cjs'
];

// Add the additional 'resolver' property for Node.js core modules
defaultConfig.resolver.extraNodeModules = {
  // Key Node.js modules for React Native
  'stream': require.resolve('stream-browserify'),
  'crypto': require.resolve('crypto-browserify'),
  'path': require.resolve('path-browserify'),
  'fs': false,
  'http': require.resolve('@tradle/react-native-http'),
  'https': require.resolve('https-browserify'),
  'os': require.resolve('os-browserify/browser.js'),
  'events': require.resolve('events-browserify'),
  'zlib': require.resolve('browserify-zlib'),
  'vm': require.resolve('vm-browserify'),
  'constants': require.resolve('constants-browserify'),
  'web-streams-polyfill': require.resolve('web-streams-polyfill'),
  'web-streams-polyfill/ponyfill': require.resolve('web-streams-polyfill/ponyfill'),
  'web-streams-polyfill/ponyfill/es6': require.resolve('web-streams-polyfill/ponyfill/es6'),
  'net': false,
  'tls': false,
  'child_process': false,
  'dgram': false
};

// Enable symlinks to fix issues with transitive dependencies
defaultConfig.resolver.enablePackageExports = false;
defaultConfig.resolver.disableHierarchicalLookup = true;
defaultConfig.resolver.nodeModulesPaths = [require('path').resolve(__dirname, 'node_modules')];

// Blocklist to prevent problematic packages
defaultConfig.resolver.blockList = [/\.git\/.*/];

// Additional configuration to help with native modules
defaultConfig.watchFolders = [__dirname];
defaultConfig.transformer.assetRegistryPath = 'react-native/Libraries/Image/AssetRegistry';

// Tell Metro to resolve these packages from the node_modules folder
defaultConfig.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add specific handling for nanoid
defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  'nanoid': require.resolve('nanoid'),
  'nanoid/non-secure': require.resolve('nanoid/non-secure')
};

// Explicitly resolve react-native-maps
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'jsx', 'ts', 'tsx', 'json', 'cjs', 'mjs'];
defaultConfig.resolver.assetExts = [...defaultConfig.resolver.assetExts, 'json'];
defaultConfig.resolver.blacklistRE = /\.git\/.*/;

module.exports = defaultConfig;
