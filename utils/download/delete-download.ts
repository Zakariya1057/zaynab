import { Alert } from 'react-native';
import { DownloadModel } from "@/utils/database/models/download-model";
import {deleteLocalFile} from "@/utils/file/delete-local-file";
import {deleteDownloadRecord} from "@/utils/download/delete-download-record";
import {refreshTrackUrlsAfterDeletion} from "@/utils/track/refresh-track-urls-after-deletion";

export const deleteDownload = (download: DownloadModel, startNextDownload: () => void) => {
    Alert.alert(
        "Confirm Deletion", // Title of the alert
        "Are you sure you want to delete this download?", // Message of the alert
        [
            {
                text: "Cancel",
                onPress: () => console.log("Deletion cancelled"),
                style: "cancel"
            },
            {
                text: "Yes",
                onPress: async () => {
                    await deleteLocalFile(download); // Delete the local file if user confirms
                    await deleteDownloadRecord(download); // Delete the database record
                    await refreshTrackUrlsAfterDeletion()
                    startNextDownload()
                }
            }
        ],
        { cancelable: false }
    );
};
