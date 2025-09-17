module.exports = {
  expo: {
    web: {
      publicUrl: '/',
      staticFileExts: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
      bundlerOptions: {
        assetExts: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
        alias: {
          'react-native-svg': 'react-native-svg-web',
        },
      },
    },
  },
};
