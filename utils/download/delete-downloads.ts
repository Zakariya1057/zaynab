import { Alert } from 'react-native';
import { DownloadModel } from "@/utils/database/models/download-model";
import { deleteLocalFile } from "@/utils/file/delete-local-file";
import { deleteDownloadRecord } from "@/utils/download/delete-download-record";
import { refreshTrackUrlsAfterDeletion } from "@/utils/track/refresh-track-urls-after-deletion";

/**
 * Prompts the user for confirmation and deletes selected downloads if confirmed.
 * @param {DownloadModel[]} downloads - Array of downloads to be deleted.
 * @param onConfirm
 */
export const deleteDownloads = (downloads: DownloadModel[], onConfirm: () => {}) => {
    // Calculate the number of downloads to delete.
    const count = downloads.length;

    // Confirmation dialog to ensure user intent before deleting downloads.
    Alert.alert(
        `Confirm Deletion`,  // Dialog title.
        `Are you sure you want to delete ${count} downloads? Deleting will remove offline access and may affect streaming, but items can be re-downloaded at any time.`,  // Confirmation message explaining the consequences.
        [
            {
                text: "Cancel",  // Option allowing the user to cancel the operation.
                onPress: () => console.log("User canceled the deletion."),  // Action on cancellation.
                style: "cancel"  // Marks this button as the cancellation action.
            },
            {
                text: "Delete",  // Option to confirm the deletion.
                onPress: async () => {  // Asynchronous handler for the confirmation action.
                    // Loop over each download and perform deletion operations.
                    for (const download of downloads) {
                        await deleteLocalFile(download);  // Deletes the local file associated with the download.
                        await deleteDownloadRecord(download);  // Removes the record from the database.
                        await refreshTrackUrlsAfterDeletion();  // Refreshes track URLs to reflect the deletions.
                    }

                    onConfirm();  // Initiates the next download after deletions are complete.
                }
            }
        ],
        { cancelable: true }  // Allows dismissal of the dialog by tapping outside.
    );
};
