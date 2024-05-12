import { database } from "@/utils/database/setup";
import { Q } from "@nozbe/watermelondb";
import {SettingsModel} from "@/utils/database/models/setting-model";
import {SettingKey} from "@/interfaces/setting-key";

/**
 * Retrieves a setting value by its key.
 * @returns {Promise<boolean | null>} A promise that resolves with the setting value if found, or null if not found.
 * @param key
 */
export const getSetting = async (key: SettingKey): Promise<boolean> => {
    console.log('Getting DB Settings')
    try {
        const settingsCollection = database.get<SettingsModel>('settings');

        const settings = await settingsCollection.query(
            Q.where('key', key)
        ).fetch();

        if (settings.length > 0) {
            return settings[0].value;  // Assuming key is unique and only one record should be returned
        } else {
            console.log('No setting found with key:', key);
            return false;
        }
    } catch (error) {
        console.error('Error retrieving setting:', error);
        throw error;
    }
};
