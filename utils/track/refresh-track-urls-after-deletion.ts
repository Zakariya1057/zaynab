import TrackPlayer, {State, Track, TrackType, usePlaybackState} from 'react-native-track-player';
import {getDownloadById} from "@/utils/database/download/get-download-by-id";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {getEpisodeById} from "@/utils/data/getEpisodeById";
import {showToast} from "@/utils/toast/show-toast";
import {setAutoPlay} from "@/utils/track/auto-play";

// Function to handle track updates when a download has been deleted
export const refreshTrackUrlsAfterDeletion = async () => {
    console.log('Starting track update due to download deletion');
    const tracks = await TrackPlayer.getQueue();
    const { state } = await TrackPlayer.getPlaybackState()
    const activeTrack = await TrackPlayer.getActiveTrack();
    const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();

    const { description } = activeTrack ?? {}

    setAutoPlay(state === State.Playing)

    if (!description) {
        console.log('Active track does not have a description. Exiting...');
        return;
    }

    const [podcastId] = description.split('|');
    if (!podcastId) {
        console.log('No podcast ID found in the active track description.');
        return;
    }

    const podcast = getPodcastById(podcastId);

    let updatesNeeded: { index: number, newTrack: Track }[] = [];

    for (let index = 0; index < tracks.length; index++) {
        const track = tracks[index];
        const [_, episodeId] = track?.description?.split('|') ?? [];

        if (!track.url.startsWith('http')) {
            console.log(`Checking download status for track ${index}: ${track.title}`);
            const download = await getDownloadById(episodeId);

            if (!download) {
                const episode = getEpisodeById(podcast, episodeId);
                if (episode) {
                    console.log(`Updating URL for track ${index}: ${episode.stream}`);
                    const newTrack: Track = {
                        ...track,
                        url: episode.stream,
                        type: TrackType.HLS
                    };

                    updatesNeeded.push({ index, newTrack });
                }
            }
        }
    }

    // Perform the updates
    let activeTrackUpdated = false;
    for (const update of updatesNeeded) {
        console.log(`Updating track at index ${update.index}`);
        await TrackPlayer.remove(update.index);
        await TrackPlayer.add(update.newTrack, update.index);

        if (update.newTrack.description === description) {
            activeTrackUpdated = true;
        }
    }

    if (updatesNeeded.length > 0) {
        console.log('Updates completed. Tracks have new URLs.');
        // Optionally, skip back to the active track if it was one of the updated tracks
        if (activeTrackUpdated) {
            console.log(`Skipping back to the active track at index ${activeTrackIndex}`);
            showToast('info', 'Audio Update', 'Local file deleted. Switching to online streaming.');
            await TrackPlayer.skip(activeTrackIndex);
        }
    }
};
