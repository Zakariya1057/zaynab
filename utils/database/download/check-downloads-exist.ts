import { database } from "@/utils/database/setup";
import { Q } from "@nozbe/watermelondb";
import { DownloadModel } from "@/utils/database/models/download-model";

/**
 * Checks if there are any download records in the database.
 * @returns Promise<boolean> - True if there are download records, false otherwise.
 */
export const checkDownloadsExist = async (): Promise<boolean> => {
    try {
        const downloadsCollection = database.get<DownloadModel>('downloads');
        const downloads = await downloadsCollection.query().fetch();

        return downloads.length > 0;  // Returns true if any download records exist, false otherwise
    } catch (error) {
        console.error('Error checking downloads:', error);
        throw error;
    }
}
