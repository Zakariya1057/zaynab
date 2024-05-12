import { database } from "@/utils/database/setup";
import {SettingsModel} from "@/utils/database/models/setting-model";

export const getAllSettings = async (): Promise<SettingsModel[]> => {
    try {
        const settingsCollection = database.get<SettingsModel>('settings');
        return await settingsCollection.query().fetch();
    } catch (error) {
        console.error('Error retrieving all settings:', error);
        throw error;
    }
};
