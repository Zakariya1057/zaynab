import { database } from "@/utils/database/setup";
import { Q } from "@nozbe/watermelondb";
import { SettingsModel } from "@/utils/database/models/setting-model";
import {SettingKey} from "@/interfaces/setting-key";

/**
 * Sets the value of a setting. If the setting does not exist, it creates a new entry.
 * @param {string} key The key of the setting to set.
 * @param {boolean} value The value to set for the setting.
 * @returns {Promise<void>} A promise that resolves when the setting has been set.
 */
export const setSetting = async (key: SettingKey, value: boolean): Promise<void> => {
    const settingsCollection = database.get<SettingsModel>('settings');
    await database.write(async () => {
        const existingSettings = await settingsCollection.query(
            Q.where('key', key)
        ).fetch();

        if (existingSettings.length > 0) {
            const setting = existingSettings[0];
            await setting.update(settingRecord => {
                settingRecord.value = value;
            });
        } else {
            await settingsCollection.create(settingRecord => {
                settingRecord.key = key;
                settingRecord.value = value;
            });
        }
    }).catch(error => {
        console.error('Error setting value:', error);
        throw error;
    });
};
