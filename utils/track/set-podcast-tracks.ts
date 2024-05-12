import TrackPlayer, {State} from "react-native-track-player";
import {playingCurrentPodcast} from "@/utils/track/playing-current-podcast";
import {getTracksWithDownloads} from "@/utils/track/get-tracks-with-downloads";
import {fetchLastListenedEpisodeByPodcastId} from "@/utils/database/episode/fetch-last-listened-episode-by-podcast-id";
import {fetchShuffleStatus} from "@/utils/shuffle/fetch-shuffle-status";
import {shuffleArray} from "@/utils/shuffle/shuffle-array";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {EpisodeModel} from "@/utils/database/models/episode-model";

export const setPodcastTracks = async (podcastId: string, savedLastEpisode?: EpisodeModel|undefined) => {
    const podcast = getPodcastById(podcastId);

    const {state} = await TrackPlayer.getPlaybackState();
    const playingPodcast = await playingCurrentPodcast(podcast.id);

    if (playingPodcast) {
        if (state !== State.Playing) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
        return;
    }

    const tracks = await getTracksWithDownloads(podcast);
    const lastEpisode = savedLastEpisode ? savedLastEpisode :  fetchLastListenedEpisodeByPodcastId(podcast.id);

    const shuffleOn = await fetchShuffleStatus();
    if (shuffleOn) {
        shuffleArray(tracks);
    }

    await TrackPlayer.pause()

    await TrackPlayer.setQueue(tracks);

    if (lastEpisode) {
        const queue = await TrackPlayer.getQueue()
        const index = queue.findIndex((track) => track.description === lastEpisode.description)
        await TrackPlayer.skip(index)
    }
}