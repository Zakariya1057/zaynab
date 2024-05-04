import { DownloadModel } from "@/utils/database/models/download-model";
import { deleteDownloadByEpisodeId } from "@/utils/database/download/delete-download-by-episode-id";
import { showToast } from "@/utils/toast/show-toast"; // Ensure the correct path to showToast function

export const deleteDownloadRecord = async (download: DownloadModel) => {
    try {
        await deleteDownloadByEpisodeId(download.episodeId);
        console.log(`Download record for episodeId ${download.episodeId} has been successfully deleted from the database.`);
        showToast('success', 'Download Deleted', `All data for episode has been successfully removed.`);
    } catch (error) {
        console.error('Error deleting download record:', error);
        showToast('error', 'Deletion Failed', `Failed to delete download record for episode ${download.episodeId}: ${error.message}`);
        throw error;
    }
}
