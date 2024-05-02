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
                Object.entries(downloadData).forEach(([key, value]) => {
                    if (value !== undefined) {
                        download[key] = value;
                    }
                });
                if (downloadData.downloaded) {
                    download.totalBytesWritten = download.totalBytesExpectedToWrite
                    download.downloadCompletedAt = time; // Set completion time if the download is marked as completed
                }

                download.downloadUpdatedAt = time; // Always update the 'updatedAt' field
                download.downloadStartedAt = download.downloadStartedAt ?? time;
            });
        } else {
            // Download does not exist, create a new one
            await downloadsCollection.create((newDownload) => {
                Object.keys(newDownload._raw).forEach(key => {
                    if (key in downloadData && downloadData[key] !== undefined) {
                        newDownload[key] = downloadData[key];
                    }
                });
                newDownload.downloadStartedAt = downloadData.downloadStartedAt || time;
                newDownload.downloadUpdatedAt = time;
                newDownload.downloadCompletedAt = downloadData.downloaded ? time : null;
            });
        }
    });
}
