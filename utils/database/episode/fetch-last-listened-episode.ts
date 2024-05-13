import { database } from "@/utils/database/setup";
import { EpisodeModel } from "@/utils/database/models/episode-model";
import { Q } from "@nozbe/watermelondb";

export const fetchLastListenedEpisode = async (): Promise<EpisodeModel | null> => {
    try {
        const episodesCollection = database.get('episodes');
        const episodes = await episodesCollection.query(
            Q.sortBy('episodeUpdatedAt', Q.desc)
        ).fetch();

        if (episodes.length > 0) {
            return episodes[0] as EpisodeModel;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error retrieving the last listened episode:', error);
        throw error;
    }
};
