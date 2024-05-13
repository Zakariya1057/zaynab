import { SettingKey } from "@/interfaces/setting-key";
import {setSetting as setDbSetting} from "@/utils/database/setting/set-setting";
import {getAllSettings} from "@/utils/database/setting/get-all-settings";

type SettingsCache = Record<SettingKey, boolean>;

let cache: SettingsCache = {};

export const initializeSettingsCache = async (): Promise<void> => {
    const settings = await getAllSettings()

    settings.forEach((setting) => {
        const {key, value} = setting;
        cache[key] = value;
    })
};

export const getSetting = (key: SettingKey): boolean => {
    return cache[key] ?? true;
};

export const updateSetting = (key: SettingKey, value: boolean): void => {
    cache[key] = value;
    setDbSetting(key, value);
};

// Function to clear the cache, useful in scenarios like user logout
export const clearSettingsCache = (): void => {
    cache = {};
};
