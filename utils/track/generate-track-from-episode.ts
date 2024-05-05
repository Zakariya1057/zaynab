import { Track } from "react-native-track-player";
import {Episode} from "@/interfaces/episode";
import {Podcast} from "@/interfaces/podcast";
import {EpisodeModel} from "@/utils/database/models/episode-model";

export const generateTrackFromEpisode = (episode: Episode|EpisodeModel, podcast: Podcast): Track => {
    return ({
        id: episode.id,
        url: episode.url,
        title: `${episode.number}. ${episode.description}`,
        description: `${podcast.id}|${episode.id}`,
        artist: podcast.name,
        artwork: episode.remoteImage ?? podcast.remoteImage,
    })
}
