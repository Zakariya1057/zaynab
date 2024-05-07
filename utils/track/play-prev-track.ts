import TrackPlayer from "react-native-track-player";
import {replaceFailedTrack} from "@/utils/track/replace-failed-track";

export const playPrevTrack = async (audioFailedToLoad: boolean) => {
    const currentPosition = await TrackPlayer.getActiveTrackIndex();
    let newPosition = currentPosition ? currentPosition - 1 : 0;

    if (audioFailedToLoad) {
        await replaceFailedTrack(newPosition)
        return
    }

    await TrackPlayer.skipToPrevious();

    await TrackPlayer.pause()
}