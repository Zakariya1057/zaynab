import TrackPlayer from "react-native-track-player";
import {replaceFailedTrack} from "@/utils/track/replace-failed-track";

export const playNextTrack = async (audioFailedToLoad: boolean) => {
    const currentPosition = await TrackPlayer.getActiveTrackIndex() ?? 0;

    if (audioFailedToLoad) {
        await replaceFailedTrack(currentPosition)
        return
    }

    await TrackPlayer.skipToNext();

    await TrackPlayer.pause()
}