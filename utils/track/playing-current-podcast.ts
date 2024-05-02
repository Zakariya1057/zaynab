import TrackPlayer from "react-native-track-player";

export const playingCurrentPodcast = async (podcastId: string): Promise<boolean> => {
    const track = await TrackPlayer.getActiveTrack()
    const [trackPodcastId] = (track?.description?.split('|') ?? [])
    return trackPodcastId === podcastId
}