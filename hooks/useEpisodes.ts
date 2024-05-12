import {useState, useEffect, useCallback} from 'react';
import {getEpisodes} from "@/utils/database/episode/get-episodes";
import {EpisodeModel} from "@/utils/database/models/episode-model";

/**
 * Custom hook to fetch episodes with loading, error handling, and retry capabilities.
 * @returns An object containing episodes, loading state, error state, and a retry function.
 */
export const useEpisodes = (podcastId?: string|undefined) => {
    const [episodes, setEpisodes] = useState<EpisodeModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEpisodes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedEpisodes = await getEpisodes(podcastId);
            setEpisodes(fetchedEpisodes);
        } catch (error) {
            console.error('Failed to fetch episodes:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEpisodes();
    }, [fetchEpisodes]);

    const retry = async () => {
        await fetchEpisodes();
    };

    return {
        episodes,
        loading,
        error,
        retry
    };
};
