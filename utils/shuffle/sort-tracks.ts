import TrackPlayer from 'react-native-track-player';
import { getEpisodeNumberFromTitle } from "@/utils/episode/get-episode-number-from-title";

// Function to sort tracks by episode number while keeping the currently playing track unchanged
export const sortTracks = async (): Promise<void> => {
    try {
        // Get the ID and index of the currently playing track and the current queue
        const queue = await TrackPlayer.getQueue();
        const activeTrack = await TrackPlayer.getActiveTrack();
        const index = await TrackPlayer.getActiveTrackIndex()

        // console.log(activeTrack);
        // console.log(index)
        // console.log(queue.map((a) => a.title + "\n" ))

        const newIndex = getEpisodeNumberFromTitle(activeTrack?.title)-1
        //
        // const activeTitle = activeTrack?.title;
        //
        const { position } = await TrackPlayer.getProgress()
        // const activeTrackIndex = queue.findIndex(track => track.id === activeTrack?.id);
        //
        // // Filter out the currently playing track and sort the rest of the queue based on episode numbers
        const sortedQueue = queue
            .sort((a, b) => {
                const numberA = getEpisodeNumberFromTitle(a.title);
                const numberB = getEpisodeNumberFromTitle(b.title);
                return numberA - numberB;
            });
        //
        // // Reset and re-add the sorted queue

        await TrackPlayer.reset();
        await TrackPlayer.add(sortedQueue);
        //
        // console.log(newIndex)
        await TrackPlayer.skip(newIndex);

        console.log('Tracks sorted successfully, with the currently active track preserved.');
    } catch (error) {
        console.error("Error sorting tracks: ", error);
    }
};
