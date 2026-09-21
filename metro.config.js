const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// lucide-react-native distribuye sus módulos como .mjs; Metro no los resuelve sin esto.
config.resolver.sourceExts.push('mjs');

module.exports = config;
