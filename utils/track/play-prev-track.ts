import TrackPlayer from "react-native-track-player";
import {getTrackHistoryAtIndex} from "@/utils/track/get-track-history-at-index";
import {replaceFailedTrack} from "@/utils/track/replace-failed-track";

export const playPrevTrack = async (audioFailedToLoad: boolean) => {
    const currentPosition = await TrackPlayer.getActiveTrackIndex();
    let newPosition = currentPosition ? currentPosition - 1 : 0;

    if (audioFailedToLoad) {
        await replaceFailedTrack(newPosition)
        return
    }

    const history = await getTrackHistoryAtIndex(newPosition);
    await TrackPlayer.skipToPrevious();

    await TrackPlayer.pause()
    if (history) {
        // await TrackPlayer.seekTo(history.position);
    }
}