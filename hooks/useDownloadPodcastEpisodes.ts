import { useCallback } from 'react';
import Toast from "react-native-toast-message";
import { Podcast } from "@/interfaces/podcast";
import useDownloadManager from "@/hooks/useDownloadManager";
import {showToast} from "@/utils/toast/show-toast";
import {getDownloadsByPodcastId} from "@/utils/database/download/get-downloads-by-podcast-id";

export const useDownloadPodcastEpisodes = () => {
    const { downloadAudios } = useDownloadManager();

    const downloadEpisodes = useCallback(async (podcast: Podcast) => {
        const episodes = Object.values(podcast.episodes);
        const totalEpisodes = episodes.length;

        const downloadedIds = (await getDownloadsByPodcastId(podcast.id)).map(download => download.episodeId);
        const episodesToDownload = episodes.filter(episode => !downloadedIds.includes(episode.id));

        if (episodesToDownload.length > 0) {
            showToast('info', 'Downloading Episodes', `Downloading ${episodesToDownload.length} new episodes in background...`);
            await downloadAudios(
                episodesToDownload.map(episode => ({
                    url: episode.url,
                    episodeId: episode.id,
                    podcastId: podcast.id,
                    title: `${episode.number}. ${episode.description}`
                }))
            );
        } else {
            showToast('info', 'All Episodes Downloaded', 'All episodes in this series have already been downloaded.');
        }
    }, [downloadAudios]);

    return downloadEpisodes;
};
