import {getDownloadInProgress} from "@/utils/database/download/get-download-in-progress";
import {convertModelToObject} from "@/utils/database/model/convert-model-to-object";
import {DownloadModel} from "@/utils/database/models/download-model";
import {showToast} from "@/utils/toast/show-toast"; // Import the showToast function

export const useRestartDownloadsOnBoot = async (downloadAudios: (episodes: Partial<DownloadModel>[], upsert?: boolean) => Promise<void>) => {
    try {
        const downloadsInProgress = await getDownloadInProgress();
        console.log('Restarting downloading.....');

        const downloads = downloadsInProgress.map<DownloadModel>(
            (download) => convertModelToObject(download)
        );

        if (downloads.length > 0) {
            showToast('info', 'Resuming Downloads', 'Carrying on downloading where you left off...');

            await downloadAudios(downloads, false);
        } else {
            console.log('No downloads found to resume.')
        }
    } catch (error) {
        console.error('Failed to restart downloads on boot:', error);
    }
};
