import {database} from "@/utils/database/setup";
import {Q} from "@nozbe/watermelondb";
import {DownloadModel} from "@/utils/database/models/download-model";

/**
 * Fetches and returns the total size of all downloads that are not yet completed.
 * @returns Promise<number> - The total size of all downloads in progress.
 */
export const getTotalDownloadSize = async (): Promise<number> => {
    try {
        const downloadsCollection = database.get<DownloadModel>('downloads');
        const downloads = await downloadsCollection.query().fetch();

        return downloads.reduce((total, download) => total + download.totalBytesWritten, 0);
    } catch (error) {
        console.error('Error retrieving total download size:', error);
        throw error;
    }
}
