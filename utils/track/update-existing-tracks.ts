import {Episode} from "@/interfaces/episode";
import TrackPlayer, {Progress, Track} from "react-native-track-player";
import {EpisodeModel} from "@/utils/database/models/episode-model";

export const updateExistingTracks = async (existingTracks: Track[], episode: Episode, recordedEpisode: EpisodeModel | null, downloadsById: Record<string, string>, completed: boolean): Promise<boolean> => {
    const existingTrackIndex = existingTracks.findIndex((t) => t.id === episode.id);

    if (existingTrackIndex > -1) {
        console.log('Setting From Existing Tracks');

        const newSeekPosition = recordedEpisode?.position ?? 0
        await TrackPlayer.skip(existingTrackIndex, completed ? newSeekPosition - 5 : newSeekPosition);

        const downloadedEpisode = downloadsById[episode.id];
        const newTrack = existingTracks[existingTrackIndex];

        if (newTrack && downloadedEpisode && newTrack.url !== downloadedEpisode) {
            await TrackPlayer.load({
                ...newTrack,
                url: downloadedEpisode
            });
        }

        console.log('Set From Existing Tracks');
        return true;
    }

    return false;
}
