import TrackPlayer, {Track} from "react-native-track-player";

export const updateExistingTracks = async (existingTracks: Track[], episodeId: string): Promise<boolean> => {
    const existingTrackIndex = existingTracks.findIndex((t) => t.id === episodeId);

    if (existingTrackIndex > -1) {
        console.log('Setting From Existing Tracks');

        await TrackPlayer.skip(existingTrackIndex);

        await TrackPlayer.pause()

        console.log('Set From Existing Tracks');
        return true;
    }

    return false;
}
