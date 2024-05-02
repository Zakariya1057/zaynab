import { useCallback } from 'react';
import Toast from "react-native-toast-message";
import { Podcast } from "@/interfaces/podcast";
import useDownloadManager from "@/hooks/useDownloadManager";

// This is now a custom hook named useDownloadPodcastEpisodes
export const useDownloadPodcastEpisodes = () => {
    const { downloadAudios } = useDownloadManager();

    // useCallback to ensure the function is memoized
    const downloadEpisodes = useCallback(async (podcast: Podcast) => {
        const episodes = Object.values(podcast.episodes);

        Toast.show({
            type: 'info',
            text1: 'Downloading Episodes',
            text2: 'Attempting to download all episodes in this series.',
            position: 'bottom',
            visibilityTime: 4000,
            autoHide: true,
            bottomOffset: 40,
        });

        await downloadAudios(
            episodes.map(episode => ({
                url: episode.url,
                episodeId: episode.id,
                podcastId: podcast.id,
            }))
        );
    }, [downloadAudios]); // dependency on downloadAudios which is likely stable across renders

    return downloadEpisodes;
};

