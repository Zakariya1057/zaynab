import {useRef} from 'react';
import * as FileSystem from 'expo-file-system';
import {
    DownloadProgressData,
    DownloadResumable,
    FileSystemDownloadResult,
    FileSystemSessionType
} from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {upsertDownload} from "@/utils/database/download/upsert-download";
import {getDownloadById} from "@/utils/database/download/get-download-by-id";
import {insertDownload} from "@/utils/database/download/insert-download";
import {DownloadModel} from "@/utils/database/models/download-model";
import {useDownloads} from "@/contexts/download-context";
import Toast from "react-native-toast-message";
import {useQueue} from "@/contexts/queue-context";
import {debounce} from "@/utils/debounce/debounce";
import {showToast} from "@/utils/toast/show-toast";
import {getDownloadInProgress} from "@/utils/database/download/get-download-in-progress";

const useDownloadManager = () => {
    const {addDownload, removeDownload, isDownloading, setDownloadResumable, isDeleted} = useDownloads();
    const {addToQueue, removeFromQueue, isInQueue, queueEmpty, getNextItem} = useQueue()

    const downloadAudios = async (episodes: Partial<DownloadModel>[]): Promise<void> => {
        if (episodes.length === 0) {
            return
        }

        for (const episode of episodes) {
            addToQueue(episode.episodeId, episode);
            await upsertDownload({...episode});
        }

        await startNextDownload()
    };

    const downloadAudio = async (episode: Partial<DownloadModel>): Promise<void> => {
        if (isDownloading(episode.episodeId)) {
            console.log('Download already in progress for this episode');
            return; // Prevents starting a new download if it's already in progress
        }

        if (isInQueue(episode.episodeId)) {
            console.log('Download already waiting in Queue')
            return
        } else {
            addToQueue(episode.episodeId, episode)

            if (!queueEmpty()) {
                console.log('Already downloading item in the queue.')
                await upsertDownload({...episode});
                return
            }
        }

        addDownload(episode.episodeId);

        const existingDownload = await getDownloadById(episode.episodeId);
        if (existingDownload) {
            if (existingDownload.downloaded) {
                console.log('Episode already downloaded');
                return;
            } else {
                console.log('Resuming incomplete download');
                await startOrResumeDownload(existingDownload.episodeId, existingDownload.url);
            }
        } else {
            console.log('Starting new download:', episode);
            await initializeNewDownload(episode);
        }
    };

    const initializeNewDownload = async (episode: Partial<DownloadModel>): Promise<void> => {
        const directoryUri = FileSystem.documentDirectory; // Base directory URI
        const fileUri = `${directoryUri}${episode.episodeId}.mp3`; // Full file URI

        if (!directoryUri) {
            throw new Error('No such directory');
        }

        // Check if the directory exists, create if not
        const dirInfo = await FileSystem.getInfoAsync(directoryUri);
        if (!dirInfo.exists) {
            console.log('Directory does not exist, creating now...');
            await FileSystem.makeDirectoryAsync(directoryUri, {intermediates: true});
        }

        await insertDownload({...episode, uri: fileUri});
        await startOrResumeDownload(episode.episodeId, episode.url);
    };

    const updateProgress = debounce(async (id: string, progressData: DownloadProgressData) => {
        const {totalBytesWritten, totalBytesExpectedToWrite} = progressData;
        const progress = totalBytesWritten / totalBytesExpectedToWrite;
        console.log(`Download progress for ${id}: ${progress * 100}%`, totalBytesWritten, totalBytesExpectedToWrite);

        await upsertDownload({
            episodeId: id,
            totalBytesWritten,
            totalBytesExpectedToWrite,
            downloaded: progress === 1,
            error: null
        }, true);
    }, 100)

    const startOrResumeDownload = async (id: string, url: string): Promise<void> => {
        const fileUri = `${FileSystem.documentDirectory}${id}.mp3`;
        // const pausedDownloadState = await AsyncStorage.getItem(`pausedDownload-${id}`);

        let downloadResumable

        try {
            // let downloadSnapshot = JSON.parse(pausedDownloadState ?? '{}')

            console.log(fileUri)

            downloadResumable = FileSystem.createDownloadResumable(
                url,
                fileUri,
                {cache: true, sessionType: FileSystemSessionType.BACKGROUND},
                progressData => updateProgress(id, progressData)
            );

            setDownloadResumable(id, downloadResumable)

            // removeFromQueue(id)

            const result = await downloadResumable.downloadAsync();
            await downloadCompleted(id, result)
        } catch (error: Error) {
            console.error('Download failed:', error);

            // Maybe wait a little try again 3 times then mark as failed to download and proceed to next item in the list

            showToast('error', 'Download Failed', 'Failed to download episode!')

            await upsertDownload({episodeId: id, error: error.message});

            removeDownload(id)
            removeFromQueue(id)

            // await startOrResumeDownload(id, url)
        }
    };

    const downloadCompleted = async (id: string, result: FileSystemDownloadResult | undefined) => {
        if (result) {
            console.log('Download completed:', result.uri);
            await upsertDownload({episodeId: id, downloaded: true, uri: result.uri});
            await AsyncStorage.removeItem(`pausedDownload-${id}`);

            Toast.show({
                type: 'success', // Indicates that this toast is for an error message
                text1: 'Episode Download Complete!', // A clear, concise title for the error
                position: 'bottom', // Position at the bottom so it does not block other UI elements
                visibilityTime: 4000, // Duration in milliseconds the toast should be visible
                autoHide: true, // The toast will disappear after the visibilityTime
                topOffset: 30, // Spacing from the top, when position is 'top'
                bottomOffset: 40, // Spacing from the bottom, useful when position is 'bottom'
            });
        } else {
            console.log('Download aborted for:', id)
        }

        removeFromQueue(id)
        removeDownload(id)

        await startNextDownload()
    }

    const startNextDownload = async () => {
        const downloadsInProgress = await getDownloadInProgress();
        const nextDownload = downloadsInProgress[0]

        if (nextDownload) {
            await downloadAudio(nextDownload)
        }
    }

    return {downloadAudio, downloadAudios};
};

export default useDownloadManager;
