import { Platform } from "react-native";
import * as Application from "expo-application";
import {
    getAllowDownloadFromLocal,
    getAllowDownloadFromRemote,
    setAllowDownload
} from "@/utils/cache/download-status-cache";
import {checkDownloadsExist} from "@/utils/database/download/check-downloads-exist";

export const handleDownloadPermission = async (setShowDownloadTab: (value: boolean) => void): Promise<void> => {
    if (Platform.OS === 'ios') {
        const platform = Platform.OS;
        const version = Application.nativeApplicationVersion ?? '0';

        console.log(`Platform: ${platform}, Version: ${version}`);

        try {
            const localShowDownload = await getAllowDownloadFromLocal(platform, version);
            if (localShowDownload) {
                console.log(`Local setting allows download: ${localShowDownload}`);
                await setAllowDownload(platform, version, localShowDownload);
                setShowDownloadTab(localShowDownload);
            } else {
                const downloadsExist = await checkDownloadsExist();
                console.log(`Downloads Found: ${downloadsExist}`);
                if (downloadsExist) {
                    console.log('Downloads found locally, enabling download tab.');
                    await setAllowDownload(platform, version, true);
                    setShowDownloadTab(true);
                }
            }

            const remoteAllowDownload = await getAllowDownloadFromRemote(platform, version);
            console.log(`Remote setting allows download: ${remoteAllowDownload}`);
            if (remoteAllowDownload) {
                await setAllowDownload(platform, version, remoteAllowDownload);
                setShowDownloadTab(remoteAllowDownload);
            }
        } catch (error) {
            console.error('Error handling download permissions:', error);
        }
    }
}
