declare module 'react-native-share' {
  export interface ShareOptions {
    title?: string;
    message?: string;
    url?: string;
    subject?: string;
    filename?: string;
    type?: string;
    failOnCancel?: boolean;
    showAppsToView?: boolean;
    excludedActivityTypes?: string[];
  }

  export interface ShareResponse {
    success: boolean;
    message?: string;
    activityType?: string;
  }

  export default class Share {
    static open(options: ShareOptions): Promise<ShareResponse>;
  }
}
