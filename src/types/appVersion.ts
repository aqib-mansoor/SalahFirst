export interface ReleaseFeatureItem {
  tag: string; // e.g. "NEW", "IMPROVED", "FIX"
  description: string;
}

export interface AppVersionInfo {
  latestVersion: string;
  latestVersionCode: number;
  minSupportedVersionCode: number;
  forceUpdate?: boolean;
  title?: string;
  releaseNotes?: string;
  highlights?: (string | ReleaseFeatureItem)[];
  playStoreUrl?: string;
  webUrl?: string;
}


