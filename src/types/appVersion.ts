export interface AppVersionInfo {
  latestVersion: string;
  latestVersionCode: number;
  minSupportedVersionCode: number;
  forceUpdate?: boolean;
  title?: string;
  releaseNotes?: string;
  playStoreUrl?: string;
  webUrl?: string;
}

