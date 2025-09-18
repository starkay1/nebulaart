import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { Alert } from 'react-native';

export interface SelectedImage {
  uri: string;
  fileName: string;
  type: string;
  fileSize: number;
}

export const pickImage = (): Promise<SelectedImage | null> => {
  return new Promise((resolve) => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        resolve(null);
        return;
      }

      if (response.errorMessage) {
        Alert.alert('错误', response.errorMessage);
        resolve(null);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri && asset.fileName && asset.type && asset.fileSize) {
          resolve({
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type,
            fileSize: asset.fileSize,
          });
        } else {
          Alert.alert('错误', '图片信息不完整');
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

export const validateImageSize = (fileSize: number): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return fileSize <= maxSize;
};

export const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
