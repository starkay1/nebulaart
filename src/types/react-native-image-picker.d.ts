declare module 'react-native-image-picker' {
  export type MediaType = 'photo' | 'video' | 'mixed';

  export interface ImagePickerAsset {
    uri: string;
    fileName?: string;
    type?: string;
    fileSize?: number;
    width?: number;
    height?: number;
  }

  export interface ImagePickerResponse {
    didCancel?: boolean;
    errorMessage?: string;
    assets?: ImagePickerAsset[];
  }

  export interface ImagePickerOptions {
    mediaType?: MediaType;
    includeBase64?: boolean;
    maxHeight?: number;
    maxWidth?: number;
    quality?: number;
  }

  export function launchImageLibrary(
    options: ImagePickerOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;
}
