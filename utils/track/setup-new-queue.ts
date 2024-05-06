import TrackPlayer, {Track, TrackType} from "react-native-track-player";
import {Episode} from "@/interfaces/episode";
import {Podcast} from "@/interfaces/podcast";
import {fetchShuffleStatus} from "@/utils/shuffle/fetch-shuffle-status";
import {shuffleArray} from "@/utils/shuffle/shuffle-array";
import {getFileExtension} from "@/utils/url/get-file-extension";

export const setupNewQueue = async (podcast: Podcast, episode: Episode, downloadsById: Record<string, string>): Promise<void> => {
    const tracks = Object.values(podcast.episodes).map((ep): Track => {
        const { id } = ep

        const url = downloadsById[ep.id] || ep.stream
        const fileExtension = getFileExtension(url)
        const type = fileExtension === 'mp3' ? TrackType.Default : TrackType.HLS

        return {
            id,
            url,
            type,
            title: `${ep.number}. ${ep.description}`,
            description: `${podcast.id}|${ep.id}`,
            artist: podcast.name,
            artwork: ep.remoteImage ?? podcast.remoteImage,
        }
    });

    await TrackPlayer.pause()

    await TrackPlayer.setQueue([tracks.find(t => t.id === episode.id)!]);

    const newQueue = tracks.filter(t => t.id !== episode.id)

    const shuffleOn = await fetchShuffleStatus()
    if (shuffleOn) {
        shuffleArray(newQueue)
    }

    await TrackPlayer.add(newQueue);
    await TrackPlayer.move(0, episode.number - 1);
}