module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      // Reanimated 4 ships its worklets transform via react-native-worklets.
      // Must be the LAST plugin in the list.
      "react-native-worklets/plugin",
    ],
  };
};
