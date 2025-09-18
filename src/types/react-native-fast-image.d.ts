declare module 'react-native-fast-image' {
  import { Component } from 'react';
  import { ImageStyle, ImageProps } from 'react-native';

  export interface FastImageSource {
    uri: string;
    priority?: 'low' | 'normal' | 'high';
    cache?: 'immutable' | 'web' | 'cacheOnly';
  }

  export interface FastImageProps extends Omit<ImageProps, 'source'> {
    source: FastImageSource | number;
    style?: ImageStyle | ImageStyle[];
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
    onLoad?: () => void;
    onError?: () => void;
  }

  export default class FastImage extends Component<ImageProps> {
    static resizeMode: {
      contain: 'contain';
      cover: 'cover';
      stretch: 'stretch';
      center: 'center';
    };
    static priority: {
      low: 'low';
      normal: 'normal';
      high: 'high';
    };
    static cacheControl: {
      immutable: 'immutable';
      web: 'web';
      cacheOnly: 'cacheOnly';
    };
  }
}
