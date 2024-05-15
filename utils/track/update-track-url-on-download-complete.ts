import TrackPlayer, {Track, TrackType} from 'react-native-track-player';
import { getDownloadById } from "@/utils/database/download/get-download-by-id";
import {showToast} from "@/utils/toast/show-toast";

// Function to update track URLs from remote to local upon download completion
export const updateTrackUrlOnDownloadComplete = async (id: string) => {
    console.log('Starting track URL update post-download completion');
    const tracks = await TrackPlayer.getQueue();
    const activeTrack = await TrackPlayer.getActiveTrack();
    const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();

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
                    url: download.uri,
                    type: TrackType.Default
                };

                updatesNeeded.push({ index, newTrack });
            }
        }
    }

    console.log(updatesNeeded)

    // Apply the URL updates
    let activeTrackUpdated = false;
    for (const update of updatesNeeded) {
        console.log(`Updating track at index ${update.index}`);

        await TrackPlayer.remove(update.index);
        await TrackPlayer.add(update.newTrack, update.index);

        if (update.newTrack.description === activeTrack?.description) {
            await TrackPlayer.pause()
            activeTrackUpdated = true;
        }
    }

    if (updatesNeeded.length > 0) {
        console.log('URL update completed. Tracks now point to local files.');
        // Optionally, skip back to the active track if it was one of the updated tracks
        if (activeTrackUpdated) {
            showToast('info', 'Enhanced Playback', 'Switching to downloaded audio for smoother performance.');
            console.log(`Skipping back to the active track at index ${activeTrackIndex}`);

            const queueTracks = await TrackPlayer.getQueue();
            const index = queueTracks.findIndex((track) => track.description === activeTrack?.description);

            await TrackPlayer.skip(index);
        }
    }
};
