import TrackPlayer from "react-native-track-player";
import {getDownloadById} from "@/utils/database/download/get-download-by-id";
import {showToast} from "@/utils/toast/show-toast";
import useDownloadManager from "@/hooks/useDownloadManager";

export const downloadEpisode = async () => {
    const { downloadAudio } = useDownloadManager();

    const track = await TrackPlayer.getActiveTrack()

    if (track && track.url) {
        const [podcastId, episodeId] = (track.description?.split('|') ?? [])

        const {downloaded} = await getDownloadById(episodeId) ?? {}

        if (downloaded) {
            showToast('success', 'Episode Download Complete', 'The episode is now ready for offline playback.');
        } else {
            showToast('info', 'Episode Download Started', 'Your episode is now downloading.');
        }

        await downloadAudio({
            ...track,
            podcastId,
            episodeId,
        })
    }
}