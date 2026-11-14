const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure Terser / Minifier for production bundle hardening and obfuscation
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer?.minifierConfig,
    ecma: 8,
    keep_classnames: false,
    keep_fnames: false,
    module: true,
    toplevel: true,
    mangle: {
      toplevel: true,
      eval: true,
      keep_classnames: false,
      keep_fnames: false,
    },
    compress: {
      drop_console: true, // Strips console.log / console.info / console.debug in production
      drop_debugger: true,
      dead_code: true,
      passes: 3,
      pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace', 'console.warn'],
    },
    output: {
      comments: false,
      ascii_only: true,
    },
  },
};

module.exports = config;

