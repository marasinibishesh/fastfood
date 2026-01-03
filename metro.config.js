const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativeWind } = require("nativewind/metro");

// Step 1: Get base Metro config
const config = getSentryExpoConfig(__dirname);

// Step 2: Wrap with NativeWind
module.exports = withNativeWind(config, {
  input: "./global.css",
});
