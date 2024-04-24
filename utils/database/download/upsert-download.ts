import {Q} from '@nozbe/watermelondb';
import {DownloadModel} from "@/utils/database/models/download-model";
import {database} from "@/utils/database/setup";
import {getCurrentUnixTime} from "@/utils/date/get-current-unix-time";

export const upsertDownload = async (downloadData: Partial<DownloadModel>) => {
    await database.write(async () => {
        const downloadsCollection = database.get('downloads');
        const existingDownloads = await downloadsCollection.query(
            Q.where('episodeId', downloadData.episodeId) // Assuming you link downloads to episodes via episodeId
        ).fetch();

        const time = getCurrentUnixTime();

        if (existingDownloads.length > 0) {
            // Download exists, update it
            await existingDownloads[0].update((download) => {
                // Only update fields that are explicitly provided
                if (typeof downloadData.totalBytesWritten !== 'undefined') {
                    download.totalBytesWritten = downloadData.totalBytesWritten;
                }
                if (typeof downloadData.totalBytesExpectedToWrite !== 'undefined') {
                    download.totalBytesExpectedToWrite = downloadData.totalBytesExpectedToWrite;
                }
                if (typeof downloadData.downloaded !== 'undefined') {
                    download.downloaded = downloadData.downloaded;
                }
                // Use a different field to track the time of update to avoid overwriting downloadCompletedAt unintentionally
                if (downloadData.downloaded) {
                    download.downloadCompletedAt = time; // Only set this when the download is marked as completed
                }

                download.downloadUpdatedAt = time
            });
        } else {
            // Download does not exist, create a new one
            await downloadsCollection.create((newDownload) => {
                newDownload.episodeId = downloadData.episodeId;
                newDownload.podcastId = downloadData.podcastId
                newDownload.totalBytesWritten = downloadData.totalBytesWritten || 0;
                newDownload.totalBytesExpectedToWrite = downloadData.totalBytesExpectedToWrite || 0;
                newDownload.downloaded = downloadData.downloaded || false;
                newDownload.downloadStartedAt = time; // Use provided start time or current time
                newDownload.downloadStartedAt = time; // Use provided start time or current time
                newDownload.downloadCompletedAt = downloadData.downloaded ? time : null; // Set completed time if already downloaded
            });
        }
    });
}
