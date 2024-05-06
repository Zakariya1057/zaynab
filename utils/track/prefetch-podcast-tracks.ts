import TrackPlayer, {getActiveTrack} from "react-native-track-player";
import {setPodcastTracks} from "@/utils/track/set-podcast-tracks";

export const prefetchPodcastTracks = async (podcastId: string) => {
    const activeTrack = await TrackPlayer.getActiveTrack()

    if (!activeTrack) {
        // const podcast = getPodcastById(podcastId)
        // const tracks = await getTracksWithDownloads(podcast);

        // get the most recent listened to podcast
        await setPodcastTracks(podcastId)
        await TrackPlayer.pause()
    }
}