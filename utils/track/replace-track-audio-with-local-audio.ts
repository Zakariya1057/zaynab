import TrackPlayer, {Track} from "react-native-track-player";
import {Episode} from "@/interfaces/episode";

export const replaceTrackAudioWithLocalAudio = async (track: Track, episode: Episode, downloadsById: Record<string, string>) => {
    if (track && track.url === episode.url) {
        const localUrl = downloadsById[episode.id]

        if (localUrl && localUrl !== track.url) {
            await TrackPlayer.load({
                ...track,
                url: downloadsById[episode.id]
            })

            // await TrackPlayer.seekTo(recordedEpisode?.position ?? 0)
        }

        return
    }
}