import { Alert } from 'react-native';
import { DownloadModel } from "@/utils/database/models/download-model";
import {deleteLocalFile} from "@/utils/file/delete-local-file";
import {deleteDownloadRecord} from "@/utils/download/delete-download-record";
import {DownloadResumable} from "expo-file-system";

export const cancelDownload = async (download: DownloadModel, onCancel = () => {} ) => {
    Alert.alert(
        "Confirm Cancellation", // Title of the alert
        "Are you sure you want to cancel this download?", // Message of the alert
        [
            {
                text: "Cancel",
                onPress: () =>  console.log('Delete Cancelled'),
                style: "cancel"
            },
            {
                text: "Yes",
                onPress: async () => {
                    await deleteLocalFile(download)
                    await deleteDownloadRecord(download)
                    onCancel()
                }
            }
        ],
        { cancelable: false }
    );
};
