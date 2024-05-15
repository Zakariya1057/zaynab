import { database } from "@/utils/database/setup";
import { Q } from "@nozbe/watermelondb";

export const deleteDownloadByEpisodeId = async (episodeId: string): Promise<void> => {
    try {
        const downloadsCollection = database.get('downloads');
        const downloadsToDelete = await downloadsCollection.query(
            Q.where('episodeId', episodeId)
        ).fetch();

        // Assuming there could be multiple records with the same episodeId, delete all
        await database.write(async () => {
            await Promise.all(downloadsToDelete.map(download => download.destroyPermanently()));
        }, 'deleteDownloadByEpisodeId');

        console.log(`Downloads with episodeId ${episodeId} have been successfully deleted.`);
    } catch (error) {
        console.error('Error deleting downloads:', error);
        throw error;
    }
}
