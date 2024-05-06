import {DownloadModel} from "@/utils/database/models/download-model";
import {database} from "@/utils/database/setup";
import {getCurrentUnixTime} from "@/utils/date/get-current-unix-time";

export const insertDownload = async (downloadData: Partial<DownloadModel>) => {
    await database.write(async () => {
        const downloadsCollection = database.get('downloads');
        const time = getCurrentUnixTime();

        // Download does not exist, create a new one
        await downloadsCollection.create((newDownload) => {
            newDownload.episodeId = downloadData.episodeId;
            newDownload.podcastId = downloadData.podcastId;
            newDownload.url = downloadData.url;
            newDownload.title = downloadData.title;
            newDownload.totalBytesWritten = downloadData.totalBytesWritten;
            newDownload.totalBytesExpectedToWrite = downloadData.totalBytesExpectedToWrite;
            newDownload.downloaded = downloadData.downloaded;
            newDownload.downloadStartedAt = time;
            newDownload.downloadCompletedAt = time;
        });
    });
}
