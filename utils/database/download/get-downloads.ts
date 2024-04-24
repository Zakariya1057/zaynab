import { Q } from '@nozbe/watermelondb';
import {database} from "@/utils/database/setup";
import {DownloadModel} from "@/utils/database/models/download-model";

export const getDownloads = async (): Promise<DownloadModel[]> => {
    try {
        const downloadsCollection = database.get('downloads');
        const sortedDownlods = downloadsCollection.query(
            Q.sortBy('downloadStartedAt', Q.desc)
        );
        return await sortedDownlods.fetch() as DownloadModel[];
    } catch (error) {
        console.error('Error retrieving downloads:', error);
        throw error;
    }
};
