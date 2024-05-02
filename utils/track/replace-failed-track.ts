import TrackPlayer from "react-native-track-player";

export const replaceFailedTrack = async (newTrackPosition: number) => {
    const tracks = await TrackPlayer.getQueue()
    const activeTrack = await TrackPlayer.getActiveTrack()
    const newTracks = tracks.filter( (track) => track.id !== activeTrack?.id )
    await TrackPlayer.setQueue(newTracks)
    await TrackPlayer.skip(newTrackPosition)
    await TrackPlayer.play()
}