// Imports required modules from 'react-native' and local utility functions.
import { Alert } from 'react-native';
import { DownloadModel } from "@/utils/database/models/download-model";
import { deleteLocalFile } from "@/utils/file/delete-local-file";
import { deleteDownloadRecord } from "@/utils/download/delete-download-record";
import { refreshTrackUrlsAfterDeletion } from "@/utils/track/refresh-track-urls-after-deletion";

// Defines a function to manage the deletion of a download.
export const deleteDownload = (download: DownloadModel, startNextDownload: () => void) => {
    // Initiates a confirmation alert dialog to ensure user intent.
    Alert.alert(
        "Confirm Deletion",  // Title of the dialog box.
        "Are you sure you want to remove this download? Deleting will disable offline playback and may slow streaming, but you can re-download anytime.",  // Prompt message asking for user confirmation.
        [
            {
                text: "Cancel",  // Option to cancel the operation.
                onPress: () => console.log("Deletion process aborted by user."),  // Logs cancellation.
                style: "cancel"  // Designates this as a cancellation button.
            },
            {
                text: "Yes",  // Confirmation option.
                onPress: async () => {  // Handles the confirmation asynchronously.
                    await deleteLocalFile(download);  // Deletes the associated local file.
                    await deleteDownloadRecord(download);  // Removes the corresponding database record.
                    await refreshTrackUrlsAfterDeletion();  // Updates track URLs post-deletion.
                    startNextDownload();  // Proceeds to start the next download.
                }
            }
        ],
        { cancelable: true }  // Prevents the alert from being dismissible by tapping outside.
    );
};
