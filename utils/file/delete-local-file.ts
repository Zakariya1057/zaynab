import * as FileSystem from 'expo-file-system';
import { DownloadModel } from "@/utils/database/models/download-model";
import { showToast } from "@/utils/toast/show-toast"; // Ensure the correct path to showToast function

export const deleteLocalFile = async (download: DownloadModel) => {
    try {
        if (download.uri) {
            const fileInfo = await FileSystem.getInfoAsync(download.uri);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(download.uri);
                console.log(`File at ${download.uri} has been successfully deleted.`);
                showToast('success', 'File Deleted', `The file for episode was successfully deleted.`);
            }
        }
    } catch (error) {
        console.error('Error deleting local file:', error);
        showToast('error', 'Deletion Failed', `Failed to delete local file for episode ${download.episodeId}: ${error.message}`);
        throw error;
    }
}
