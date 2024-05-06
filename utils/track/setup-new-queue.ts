import TrackPlayer, {Track} from "react-native-track-player";
import {Episode} from "@/interfaces/episode";
import {Podcast} from "@/interfaces/podcast";
import {EpisodeModel} from "@/utils/database/models/episode-model";
import {fetchShuffleStatus} from "@/utils/shuffle/fetch-shuffle-status";
import {shuffleArray} from "@/utils/shuffle/shuffle-array";

export const setupNewQueue = async (podcast: Podcast, episode: Episode, downloadsById: Record<string, string>, recordedEpisode: EpisodeModel | null, completed: boolean): Promise<void> => {
    const tracks = Object.values(podcast.episodes).map((ep): Track => ({
        id: ep.id,
        url: downloadsById[ep.id] || ep.stream,
        title: `${ep.number}. ${ep.description}`,
        description: `${podcast.id}|${ep.id}`,
        artist: podcast.name,
        artwork: ep.remoteImage ?? podcast.remoteImage,
    }));

    await TrackPlayer.setQueue([tracks.find(t => t.id === episode.id)!]);

    const newQueue = tracks.filter(t => t.id !== episode.id)

    const shuffleOn = await fetchShuffleStatus()
    if (shuffleOn) {
        shuffleArray(newQueue)
    }

    await TrackPlayer.add(newQueue);
    await TrackPlayer.move(0, episode.number - 1);
}