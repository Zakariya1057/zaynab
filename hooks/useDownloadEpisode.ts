import { useCallback } from 'react';
import TrackPlayer, { Track } from "react-native-track-player";
import { getDownloadById } from "@/utils/database/download/get-download-by-id";
import { showToast } from "@/utils/toast/show-toast";
import useDownloadManager from "@/hooks/useDownloadManager";
import { DownloadModel } from "@/utils/database/models/download-model";
import {getEpisodeById} from "@/utils/database/episode/get-episode-by-id";

const useDownloadEpisode = () => {
    const { downloadAudio } = useDownloadManager();

    return useCallback(async (download: DownloadModel | null = null) => {
        try {
            let podcastId: string | undefined, episodeId: string | undefined, track: Track | undefined;

            if (download) {
                podcastId = download.podcastId;
                episodeId = download.episodeId;
            } else {
                track = await TrackPlayer.getActiveTrack();
                if (track && track.description) {
                    [podcastId, episodeId] = track.description.split('|');
                    const episode = await getEpisodeById(episodeId)

                    if (episode) {
                        track.url = episode.url
                    }
                }
            }

            if (!episodeId) {
                showToast('error', 'Download Error', 'No episode info available.');
                return;
            }

            const downloadInfo = download || await getDownloadById(episodeId);

            if (downloadInfo && downloadInfo.downloaded) {
                showToast('success', 'Episode Downloaded', 'This episode is ready for offline playback.');
                return;
            }

            showToast('info', 'Downloading Episode', 'Download started. Ready for offline playback soon.');
            await downloadAudio({
                podcastId,
                episodeId,
                ...(download || track)
            });
        } catch (error) {
            showToast('error', 'Download Error', `An error occurred while downloading: ${error.message}`);
            console.error('Download Episode Error:', error);
        }
    }, [downloadAudio]);
};

export default useDownloadEpisode;
