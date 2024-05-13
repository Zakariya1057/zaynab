import {deleteLocalFile} from "@/utils/file/delete-local-file";
import {deleteDownloadRecord} from "@/utils/download/delete-download-record";
import {refreshTrackUrlsAfterDeletion} from "@/utils/track/refresh-track-urls-after-deletion";
import {DownloadModel} from "@/utils/database/models/download-model";

export const deleteDownloadsAndRefreshTracks = async (downloads: DownloadModel[]) => {
    for (const download of downloads) {
        await deleteLocalFile(download);  // Deletes the local file associated with the download.
        await deleteDownloadRecord(download);  // Removes the record from the database.
        await refreshTrackUrlsAfterDeletion();  // Refreshes track URLs to reflect the deletions.
    }
}