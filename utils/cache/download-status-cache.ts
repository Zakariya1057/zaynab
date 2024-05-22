import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

let allowDownload = false

const getAsyncStorageKey = (platform: string, version: string): string => {
    return `allowDownload_${platform}_${version}`;
};

export const getAllowDownload = (): boolean => {
    return Platform.OS === "ios" ? allowDownload : true
};

export const setAllowDownload = async (platform: string, version: string, value: boolean): Promise<void> => {
    const key = getAsyncStorageKey(platform, version);
    await AsyncStorage.setItem(key, value.toString());
    allowDownload = value
};

export const getAllowDownloadFromLocal = async (platform: string, version: string): Promise<boolean|null> => {
    const key = getAsyncStorageKey(platform, version);
    const storedValue = await AsyncStorage.getItem(key);
    return storedValue ? storedValue === 'true' : null
}

/**
 * Fetches the download permission from a remote endpoint with specified platform and version,
 * and updates the local state accordingly.
 *
 * @param {string} platform The platform for which to check the feature toggle (e.g., "iOS", "Android").
 * @param {string} version The version of the platform (e.g., "14.5", "11").
 */
export const getAllowDownloadFromRemote = async (platform: string, version: string): Promise<boolean|null> => {
    const url = new URL('https://pnyivikl8k.execute-api.eu-west-2.amazonaws.com/dev/check-feature-toggle');
    // Add query parameters to the URL
    url.searchParams.append('platform', platform);
    url.searchParams.append('version', version);

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log('Download permission updated to:', data.allowDownload, 'for', platform, version);

        return data.allowDownload
    } catch (error) {
        console.error('Failed to update download permission for', platform, version, ':', error);
    }

    return null
};
