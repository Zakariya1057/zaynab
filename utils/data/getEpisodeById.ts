import { Podcast } from "@/interfaces/podcast";

// Assuming that `Podcasts` is still being imported in case it needs to be used elsewhere
import { Podcasts } from "@/utils/data/podcasts";
import {Episode} from "@/interfaces/episode";

// This function now takes a Podcast object and an episodeId string
export const getEpisodeById = (podcast: Podcast, episodeId: string): Episode => {
    const episode = podcast.episodes[episodeId];
    if (!episode) {
        throw new Error(`Episode with ID ${episodeId} not found in podcast ${podcast.name}.`);
    }
    return episode;
}
