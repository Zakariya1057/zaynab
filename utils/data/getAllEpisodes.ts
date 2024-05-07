import { Podcasts } from "@/utils/data/podcasts";
import {Episode} from "@/interfaces/episode";
import {Podcast} from "@/interfaces/podcast";

export const getAllEpisodes = (): Record<string, Episode> => {
    return Object.values(Podcasts).reduce((acc: Record<string, Episode>, podcast: Podcast) => {
        Object.values(podcast.episodes).forEach(episode => {
            acc[episode.id] = episode;
        });
        return acc;
    }, {});
};