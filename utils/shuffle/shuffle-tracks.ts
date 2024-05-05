import TrackPlayer, { Track } from 'react-native-track-player';
import { shuffleArray } from "@/utils/shuffle/shuffle-array";

// Function to shuffle tracks while keeping the currently playing track unchanged
export const shuffleTracks = async (): Promise<void> => {
    try {
        const activeTrack = await TrackPlayer.getActiveTrack();
        const currentQueue = await TrackPlayer.getQueue();

        // Remove the currently playing track from the queue if it exists
        const filteredQueue = currentQueue.filter((track) => track.description !== activeTrack?.description);

        // Shuffle the remaining tracks
        shuffleArray(filteredQueue);

        // Construct the new queue starting with the active track if it exists
        const newQueue: Track[] = activeTrack ? [activeTrack, ...filteredQueue] : filteredQueue;

        // Reset and re-add the shuffled queue
        await TrackPlayer.reset();
        await TrackPlayer.add(newQueue);

        console.log('Tracks shuffled successfully, with the current track unchanged.');
    } catch (error) {
        console.log("Error shuffling tracks: ", error);
    }
};
