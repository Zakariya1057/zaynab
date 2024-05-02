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

const useDownloadManager = () => {
    const downloadResumableRef = useRef<DownloadResumable | null>(null);
    const { addDownload, removeDownload, isDownloading } = useDownloads();
    const { addToQueue, removeFromQueue, isInQueue, queueEmpty, getNextItem } = useQueue()

    const intervalRef = useRef(null);

    const downloadAudios =  async (episodes: Partial<DownloadModel>[]): Promise<void> => {
        for (const episode of episodes) {
            await upsertDownload({...episode});
        }

        for (const episode of episodes) {
            await downloadAudio(episode)
        }
    }

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
            await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
        }

        await insertDownload({...episode, uri: fileUri});
        await startOrResumeDownload(episode.episodeId, episode.url);
    };

    const pause = async () => {
        try {
            await downloadResumableRef.current?.pauseAsync();
            console.log('Paused download operation, saving for future retrieval');
        } catch (e) {
            console.error(e);
        }
    }

    const resume = async () => {
        try {
            await downloadResumableRef.current?.resumeAsync();
            console.log('Resume download operation, saving for future retrieval');
        } catch (e) {
            console.error(e)
        }
    }

    const updateProgress = debounce(async (id: string, progressData: DownloadProgressData) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = progressData;
        const progress = totalBytesWritten / totalBytesExpectedToWrite;
        console.log(`Download progress for ${id}: ${progress * 100}%`, totalBytesWritten, totalBytesExpectedToWrite);

        await upsertDownload({ episodeId: id, totalBytesWritten, totalBytesExpectedToWrite, downloaded: progress === 1 });
        // saveDownloadable(id)
    }, 100)

    // const updateProgress = useCallback(async (id: string, progressData: DownloadProgressData): void => {
    //     const {totalBytesWritten, totalBytesExpectedToWrite} = progressData;
    //     const progress = totalBytesWritten / totalBytesExpectedToWrite;
    //     console.log(`Download progress for ${id}: ${progress * 100}%`, totalBytesWritten, totalBytesExpectedToWrite);
    //
    //     await upsertDownload({episodeId: id, totalBytesWritten, totalBytesExpectedToWrite, downloaded: progress === 1});
    //     // saveDownloadable(id)
    // }, []);

    const saveDownloadable = async (id: string): Promise<void> => {
        const downloadResumable = downloadResumableRef.current;
        if (!downloadResumable) {
            return; // If there's no download resumable, there's nothing to save or resume
        }

        // First, fetch the current state of the download to check if it has completed
        const existingDownload = await getDownloadById(id);
        if (existingDownload && existingDownload.downloaded) {
            console.log(`Download for ${id} is already completed. No need to pause or resume.`);
            clearInterval(intervalRef.current);
            return; // Exit if download is already marked as completed
        }

        // Proceed to pause the download
        await pause();

        // Save the download state to AsyncStorage
        const savableState = await downloadResumable.savable();
        if (savableState.resumeData) {
            console.log(`Storing Progress To: pausedDownload-${id}`);
            await AsyncStorage.setItem(`pausedDownload-${id}`, JSON.stringify(savableState));
        }

        await resume();
    };


    const startOrResumeDownload = async (id: string, url: string): Promise<void> => {
        const fileUri = `${FileSystem.documentDirectory}${id}.mp3`;
        // const pausedDownloadState = await AsyncStorage.getItem(`pausedDownload-${id}`);

        let downloadResumable

        try {
            // let downloadSnapshot = JSON.parse(pausedDownloadState ?? '{}')

            console.log(fileUri)

            // if (pausedDownloadState && 'resumeData' in downloadSnapshot) {
            //     downloadResumable = new FileSystem.DownloadResumable(
            //         downloadSnapshot.url,
            //         downloadSnapshot.fileUri,
            //         downloadSnapshot.options,
            //         progressData => updateProgress(id, progressData),
            //         downloadSnapshot.resumeData
            //     );
            //
            //     downloadResumableRef.current = downloadResumable;
            //
            //     const result = await downloadResumable.resumeAsync();
            //
            //     await downloadCompleted(id, result)
            //
            //     return
            // } else {
                downloadResumable = FileSystem.createDownloadResumable(
                    url,
                    fileUri,
                    { cache: true, sessionType: FileSystemSessionType.BACKGROUND },
                    progressData => updateProgress(id, progressData)
                );

                downloadResumableRef.current = downloadResumable;
            // }

            const result = await downloadResumable.downloadAsync();
            await downloadCompleted(id, result)
        } catch (error) {
            console.error('Download failed:', error);

            Toast.show({
                type: 'error', // Indicates that this toast is for an error message
                text1: 'Download Failed', // A clear, concise title for the error
                text2: 'Restarting download',
                position: 'bottom', // Position at the bottom so it does not block other UI elements
                visibilityTime: 4000, // Duration in milliseconds the toast should be visible
                autoHide: true, // The toast will disappear after the visibilityTime
                topOffset: 30, // Spacing from the top, when position is 'top'
                bottomOffset: 40, // Spacing from the bottom, useful when position is 'bottom'
            });

            await startOrResumeDownload(id, url)
        }
    };

    const downloadCompleted = async (id: string, result: FileSystemDownloadResult | undefined) => {
        if (result) {
            console.log('Download completed:', result.uri);
            await upsertDownload({episodeId: id, downloaded: true, uri: result.uri });
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

            removeFromQueue(id)

            const nextDownload = getNextItem()
            if (nextDownload) {
                downloadAudio(nextDownload)
            }
            // clearInterval(intervalRef.current);
        }
    }

    return {downloadAudio, downloadAudios};
};

export default useDownloadManager;
