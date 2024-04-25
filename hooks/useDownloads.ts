import { useState, useEffect, useCallback } from 'react';
import { DownloadModel } from "@/utils/database/models/download-model";
import {getDownloadsByPodcastId} from "@/utils/database/download/get-downloads-by-podcast-id";

/**
 * Custom hook to fetch downloads by podcast ID with loading, error handling, and retry capabilities.
 * @param podcastId - The ID of the podcast to fetch downloads for.
 * @returns An object containing downloads, loading state, error state, and a retry function.
 */
export const useDownloads = (podcastId: string) => {
    const [downloads, setDownloads] = useState<DownloadModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchDownloads = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedDownloads = await getDownloadsByPodcastId(podcastId);
            setDownloads(fetchedDownloads);
        } catch (error) {
            console.error('Failed to fetch downloads:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [podcastId]);

    useEffect(() => {
        fetchDownloads();
    }, [fetchDownloads]);

    const retry = async () => {
        await fetchDownloads();
    };

    return {
        downloads,
        loading,
        error,
        retry
    };
};
