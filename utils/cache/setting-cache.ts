import { SettingKey } from "@/interfaces/setting-key";
import {setSetting as setDbSetting} from "@/utils/database/setting/set-setting";
import {getAllSettings} from "@/utils/database/setting/get-all-settings";

// Define the cache structure
type SettingsCache = Record<SettingKey, boolean>;

// Initialize cache object
let cache: SettingsCache = {};

// Function to initialize the cache with data from the database
export const initializeSettingsCache = async (): Promise<void> => {
    // Assuming you have multiple settings to initialize; iterate over them
    const settings = await getAllSettings()

    settings.forEach((setting) => {
        const {key, value} = setting;
        cache[key] = value;
    })

    console.log(cache)
};

// Function to get a setting from the cache
export const getSetting = (key: SettingKey): boolean | undefined => {
    return cache[key];
};

// Function to update or add a setting to the cache
export const updateSetting = (key: SettingKey, value: boolean): void => {
    cache[key] = value;
    setDbSetting(key, value); // Update database asynchronously
};

// Function to clear the cache, useful in scenarios like user logout
export const clearSettingsCache = (): void => {
    cache = {};
};
