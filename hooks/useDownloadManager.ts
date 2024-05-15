import * as FileSystem from 'expo-file-system';
import {
    DownloadProgressData,
    FileSystemDownloadResult,
    FileSystemSessionType
} from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { upsertDownload } from "@/utils/database/download/upsert-download";
import { getDownloadById } from "@/utils/database/download/get-download-by-id";
import { insertDownload } from "@/utils/database/download/insert-download";
import { DownloadModel } from "@/utils/database/models/download-model";
import { useDownloads } from "@/contexts/download-context";
import { debounce } from "@/utils/debounce/debounce";
import { showToast } from "@/utils/toast/show-toast";
import { getDownloadInProgress } from "@/utils/database/download/get-download-in-progress";
import { updateTrackUrlOnDownloadComplete } from "@/utils/track/update-track-url-on-download-complete";
import { getFileExtension } from "@/utils/url/get-file-extension";
import { getSetting } from "@/utils/cache/setting-cache";
import { SettingKey } from "@/interfaces/setting-key";

const useDownloadManager = () => {
    const { addDownload, removeDownload, isDownloading, setDownloadResumable } = useDownloads();

    const debouncedUpdateProgress = debounce(async (id: string, totalBytesWritten: number, totalBytesExpectedToWrite: number) => {
        const progress = totalBytesWritten / totalBytesExpectedToWrite;
        console.log(`Download progress for ${id}: ${progress * 100}%`, totalBytesWritten, totalBytesExpectedToWrite);

        await upsertDownload({
            episodeId: id,
            totalBytesWritten,
            totalBytesExpectedToWrite,
            downloaded: progress === 1,
            error: null
        }, true);
    }, 1000);

    const downloadAudios = async (episodes: Partial<DownloadModel>[], upsert: boolean = true): Promise<void> => {
        if (episodes.length === 0) {
            return;
        }

        for (const episode of episodes) {
            if (upsert && !episode.downloaded) {
                await upsertDownload({ ...episode });
            }
        }

        await startNextDownload();
    };

    const downloadAudio = async (episode: Partial<DownloadModel>): Promise<void> => {
        if (isDownloading(episode.episodeId)) {
            console.log('Download already in progress for this episode');
            return; // Prevents starting a new download if it's already in progress
        }

        addDownload(episode.episodeId);

        const existingDownload = await getDownloadById(episode.episodeId);
        if (existingDownload) {
            if (existingDownload.downloaded) {
                console.log('Episode already downloaded');
                return;
            } else {
                console.log('Resuming incomplete download');
                await startOrResumeDownload(episode.episodeId, episode.url);
            }
        } else {
            console.log('Starting new download:', episode);
            await initializeNewDownload(episode);
        }
    };

    const initializeNewDownload = async (episode: Partial<DownloadModel>): Promise<void> => {
        const extension = getFileExtension(episode.url);

        const directoryUri = FileSystem.documentDirectory; // Base directory URI
        const fileUri = `${directoryUri}${episode.episodeId}.${extension}`; // Full file URI

        if (!directoryUri) {
            throw new Error('No such directory');
        }

        // Check if the directory exists, create if not
        const dirInfo = await FileSystem.getInfoAsync(directoryUri);
        if (!dirInfo.exists) {
            console.log('Directory does not exist, creating now...');
            await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
        }

        await insertDownload({ ...episode, uri: fileUri });
        await startOrResumeDownload(episode.episodeId, episode.url);
    };

    const updateProgress = (id: string, progressData: DownloadProgressData) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = progressData;
        debouncedUpdateProgress(id, totalBytesWritten, totalBytesExpectedToWrite);
    };

    const startOrResumeDownload = async (id: string, url: string): Promise<void> => {
        const extension = getFileExtension(url);
        const fileUri = `${FileSystem.documentDirectory}${id}.${extension}`;
        // const pausedDownloadState = await AsyncStorage.getItem(`pausedDownload-${id}`);

        let downloadResumable;

        try {
            // let downloadSnapshot = JSON.parse(pausedDownloadState ?? '{}');

            console.log(url, fileUri);

            downloadResumable = FileSystem.createDownloadResumable(
                url,
                fileUri,
                { cache: true, sessionType: FileSystemSessionType.BACKGROUND },
                progressData => updateProgress(id, progressData)
            );

            setDownloadResumable(id, downloadResumable);

            const result = await downloadResumable.downloadAsync();

            await downloadCompleted(id, result);
        } catch (error) {
            console.error('Download failed:', error);

            // Maybe wait a little try again 3 times then mark as failed to download and proceed to next item in the list

            showToast('error', 'Download Failed', 'Failed to download episode!');

            await upsertDownload({ episodeId: id, error: error.message });

            removeDownload(id);
        }
    };

    const downloadCompleted = async (id: string, result: FileSystemDownloadResult | undefined) => {
        if (result) {
            console.log('Download completed:', result.uri);
            await upsertDownload({ episodeId: id, downloaded: true, uri: result.uri });
            await AsyncStorage.removeItem(`pausedDownload-${id}`);

            await updateTrackUrlOnDownloadComplete(id);

            if (getSetting(SettingKey.ShowDownloadCompletedToaster)) {
                showToast('success', 'Download Successful', 'The episode has been downloaded successfully.');
            }
        } else {
            console.log('Download aborted for:', id);
        }

        removeDownload(id);

        await startNextDownload();
    };

    const startNextDownload = async () => {
        const downloadsInProgress = await getDownloadInProgress();
        const nextDownload = downloadsInProgress[0];

        if (nextDownload) {
            await downloadAudio(nextDownload);
        }
    };

    return { downloadAudio, downloadAudios, startNextDownload };
};

export default useDownloadManager;
