import { database } from "@/utils/database/setup";
import { Q } from "@nozbe/watermelondb";
import { DownloadModel } from "@/utils/database/models/download-model";

export const getDownloadInProgress = async (): Promise<DownloadModel[]> => {
    try {
        const downloadsCollection = database.get<DownloadModel>('downloads');
        return await downloadsCollection.query(
            Q.where('totalBytesWritten', Q.notEq('totalBytesExpectedToWrite')),
            Q.where('downloaded', false),
            Q.sortBy('downloadUpdatedAt', Q.desc)
        ).fetch();
    } catch (error) {
        console.error('Error retrieving downloads:', error);
        throw error;
    }
}
