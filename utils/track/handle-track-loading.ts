import TrackPlayer, {Track} from "react-native-track-player";
import {Episode} from "@/interfaces/episode";
import {EpisodeModel} from "@/utils/database/models/episode-model";  // Assume the correct path

export const handleTrackLoading = async (track: Track | undefined, downloadsById: Record<string, string>, episode: Episode, recordedEpisode: EpisodeModel | null): Promise<boolean> => {
    if (track && track.url === downloadsById[episode.id]) {
        console.log('Returning');
        return true;
    }

    if (track && track.url === episode.url) {
        const localUrl = downloadsById[episode.id];
        if (localUrl && localUrl !== track.url) {
            await TrackPlayer.load({
                ...track,
                url: localUrl
            });

            // await TrackPlayer.seekTo(recordedEpisode?.position ?? 0);
        }
        return true;
    }
    return false;
}
