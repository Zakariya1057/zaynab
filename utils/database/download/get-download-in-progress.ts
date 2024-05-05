import { database } from "@/utils/database/setup";
import { Q } from "@nozbe/watermelondb";
import { DownloadModel } from "@/utils/database/models/download-model";

export const getDownloadInProgress = async (): Promise<DownloadModel[]> => {
    try {
        const downloadsCollection = database.get<DownloadModel>('downloads');
        const downloads = await downloadsCollection.query(
            Q.where('totalBytesWritten', Q.notEq('totalBytesExpectedToWrite')),
            Q.where('downloaded', false),
            Q.sortBy('downloadUpdatedAt', Q.desc),
        ).fetch();

        // Sort by the ratio of totalBytesWritten to totalBytesExpectedToWrite
        const sortedDownloads = downloads.sort((a, b) => {
            const ratioA = a.totalBytesWritten / a.totalBytesExpectedToWrite;
            const ratioB = b.totalBytesWritten / b.totalBytesExpectedToWrite;
            return ratioB - ratioA; // For descending order
        });

        return sortedDownloads;
    } catch (error) {
        console.error('Error retrieving downloads:', error);
        throw error;
    }
}
