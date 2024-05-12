import {database} from "@/utils/database/setup";
import {Q} from "@nozbe/watermelondb";
import {DownloadModel} from "@/utils/database/models/download-model";

export const getAllDownloads = async (): Promise<DownloadModel[]> => {
    try {
        const downloadsCollection = database.get<DownloadModel>('downloads');
        return await downloadsCollection.query().fetch();
    } catch (error) {
        console.error('Error retrieving total download size:', error);
        throw error;
    }
}
