import TrackPlayer from "react-native-track-player";
import {setPodcastTracks} from "@/utils/track/set-podcast-tracks";
import {fetchLastListenedEpisode} from "@/utils/database/episode/fetch-last-listened-episode";

export const prefetchLastPodcastTracks = async () => {
    const activeTrack = await TrackPlayer.getActiveTrack()

    if (!activeTrack) {
        const lastPlayedEpisode = await fetchLastListenedEpisode()

        if (!lastPlayedEpisode) {
            return
        }

        await setPodcastTracks(lastPlayedEpisode.podcastId, lastPlayedEpisode)
    }
}