import { database } from "@/utils/database/setup";
import {Q} from "@nozbe/watermelondb";
import {DownloadModel} from "@/utils/database/models/download-model";

export const getDownloadById = async (episodeId: string): Promise<DownloadModel | null> => {
    try {
        const downloadsCollection = database.get('downloads');
        const downloads = await downloadsCollection.query(
            Q.where('episodeId', episodeId)
        ).fetch();

        if (downloads.length > 0) {
            return downloads[0] as DownloadModel; // Assuming episodeId is unique and only one record should be returned
        } else {
            console.log('No download found with ID:', episodeId);
            return null;
        }
    } catch (error) {
        console.error('Error retrieving download:', error);
        throw error;
    }
};
