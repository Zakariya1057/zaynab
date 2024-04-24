import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DownloadResumable} from "expo-file-system";

interface DownloadInfo {
    id: string;
    url: string;
    progress: number;
    uri: string | null;
}

const useDownloadManager = () => {
    const [downloads, setDownloads] = useState<DownloadInfo[]>([]);

    const startOrResumeDownload = async (id: string, url: string) => {
        const fileUri = `${FileSystem.documentDirectory}${id}`;
        const downloadResumable = FileSystem.createDownloadResumable(
            url,
            fileUri,
            {},
            progressData => {
                const progress = progressData.totalBytesWritten / progressData.totalBytesExpectedToWrite;
                setDownloads(currentDownloads => currentDownloads.map(download => {
                    if (download.id === id) {
                        return { ...download, progress };
                    }
                    return download;
                }));
            }
        );

        try {
            const results = await downloadResumable.downloadAsync();

            if (!results) {
                throw new Error('Download failed.', results);
            }

            const { uri } = results

            setDownloads(currentDownloads => currentDownloads.map(download => {
                if (download.id === id) {
                    return { ...download, uri };
                }
                return download;
            }));
        } catch (e) {
            console.error('Download failed:', e);
        }

        return downloadResumable;
    };

    const addDownload = (id: string, url: string) => {
        const newDownload: DownloadInfo = { id, url, progress: 0, uri: null };
        setDownloads([...downloads, newDownload]);
    };

    const pauseDownload = async (id: string) => {
        const download = downloads.find(d => d.id === id);
        if (download && download.uri) {
            try {
                const downloadResumable = FileSystem.createDownloadResumable(
                    download.url,
                    download.uri,
                    {},
                    () => {},
                    // You need to handle and store resumeData for real pause/resume functionality
                );
                await downloadResumable.pauseAsync();
                await AsyncStorage.setItem(`pausedDownload-${id}`, JSON.stringify(downloadResumable.savable()));
            } catch (e) {
                console.error('Error pausing download:', e);
            }
        }
    };

    return { downloads, addDownload, startOrResumeDownload, pauseDownload };
};

export default useDownloadManager;
