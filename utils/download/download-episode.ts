import TrackPlayer from "react-native-track-player";
import {getDownloadById} from "@/utils/database/download/get-download-by-id";
import Toast from "react-native-toast-message";

export const downloadEpisode = async () => {
    const track = await TrackPlayer.getActiveTrack()

    if (track && track.url) {
        const [ podcastId, episodeId ] = (track.description?.split('|') ?? [])

        const { downloaded } = await getDownloadById(episodeId) ?? {}

        if (downloaded) {
            Toast.show({
                type: 'success', // Indicates a successful outcome
                text1: 'Episode Download Complete', // More precise text
                text2: 'The episode is now ready for offline playback.', // Additional detail can be helpful
                position: 'bottom', // Keeps it out of the way of primary interactions
                visibilityTime: 4000, // Long enough to read comfortably
                autoHide: true, // Disappears after the set time
                bottomOffset: 40, // Spacing from the bottom
            });
        } else {
            Toast.show({
                type: 'info', // Change type if 'info' is available, to differentiate from complete success
                text1: 'Episode Download Started', // Clear indication of action initiation
                text2: 'Your episode is now downloading.', // Provides a bit more context
                position: 'bottom', // Consistent positioning
                visibilityTime: 4000, // Matching visibility duration
                autoHide: true, // Ensures it doesn't stay around too long
                bottomOffset: 40, // Consistent placement
            });
        }

        await downloadAudio({
            ...track,
            podcastId,
            episodeId,
        })
    }
}