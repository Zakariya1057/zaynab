import TrackPlayer from "react-native-track-player";
import {getTrackHistoryAtIndex} from "@/utils/track/get-track-history-at-index";
import {replaceFailedTrack} from "@/utils/track/replace-failed-track";

export const playNextTrack = async (audioFailedToLoad: boolean) => {
    const currentPosition = await TrackPlayer.getActiveTrackIndex() ?? 0;

    if (audioFailedToLoad) {
        await replaceFailedTrack(currentPosition)
        return
    }

    const newPosition = await getTrackHistoryAtIndex(currentPosition + 1);

    await TrackPlayer.skipToNext();
    if (newPosition) {
        // await TrackPlayer.seekTo(newPosition.position);
    }
}