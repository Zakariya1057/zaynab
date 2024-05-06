import TrackPlayer, { Track } from 'react-native-track-player';
import { getDownloadById } from "@/utils/database/download/get-download-by-id";
import {showToast} from "@/utils/toast/show-toast";
import {fetchShuffleStatus} from "@/utils/shuffle/fetch-shuffle-status";
import {shuffleArray} from "@/utils/shuffle/shuffle-array";
import {shuffleTracks} from "@/utils/shuffle/shuffle-tracks";

// Function to update track URLs from remote to local upon download completion
export const updateTrackUrlOnDownloadComplete = async () => {
    console.log('Starting track URL update post-download completion');
    const tracks = await TrackPlayer.getQueue();
    const activeTrack = await TrackPlayer.getActiveTrack();
    const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();

    const shuffleOn = await fetchShuffleStatus()

    let updatesNeeded: { index: number, newTrack: Track }[] = [];

    for (let index = 0; index < tracks.length; index++) {
        const track = tracks[index];
        const [_, episodeId] = track?.description?.split('|') ?? [];

        if (track.url.startsWith('http')) {
            console.log(`Checking download status for track ${index}: ${track.title}`);
            const download = await getDownloadById(episodeId);

            if (download && download.downloaded) {
                console.log(`Replacing remote URL with local URL for track ${index}: ${download.uri}`);
                const newTrack: Track = {
                    ...track,
                    url: download.uri
                };

                updatesNeeded.push({ index, newTrack });
            }
        }
    }

    // Apply the URL updates
    let activeTrackUpdated = false;
    for (const update of updatesNeeded) {
        console.log(`Updating track at index ${update.index}`);
        if (update.index === activeTrackIndex) {
            await TrackPlayer.pause()
            activeTrackUpdated = true;
        }

        await TrackPlayer.remove(update.index);
        await TrackPlayer.add(update.newTrack, update.index);
    }

    if (shuffleOn) {
        await shuffleTracks()
        await TrackPlayer.pause()
    }

    if (updatesNeeded.length > 0) {
        console.log('URL update completed. Tracks now point to local files.');
        // Optionally, skip back to the active track if it was one of the updated tracks
        if (activeTrackUpdated && activeTrackIndex) {
            showToast('info', 'Enhanced Playback', 'Switching to downloaded audio for smoother performance.');
            console.log(`Skipping back to the active track at index ${activeTrackIndex}`);

            const queueTracks = await TrackPlayer.getQueue();
            const index = queueTracks.findIndex((track) => track.id === activeTrack?.id);

            await TrackPlayer.skip(index);
        }
    }
};
