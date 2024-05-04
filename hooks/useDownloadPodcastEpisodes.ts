import { useCallback } from 'react';
import Toast from "react-native-toast-message";
import { Podcast } from "@/interfaces/podcast";
import useDownloadManager from "@/hooks/useDownloadManager";
import {showToast} from "@/utils/toast/show-toast";

export const useDownloadPodcastEpisodes = () => {
    const { downloadAudios } = useDownloadManager();

    const downloadEpisodes = useCallback(async (podcast: Podcast) => {
        const episodes = Object.values(podcast.episodes);
        const totalEpisodes = episodes.length;

        showToast('info', 'Downloading Episodes', `Downloading ${totalEpisodes} episodes in background...`);

        await downloadAudios(
            episodes.map(episode => ({
                url: episode.url,
                episodeId: episode.id,
                podcastId: podcast.id,
            }))
        );
    }, [downloadAudios]);

    return downloadEpisodes;
};
