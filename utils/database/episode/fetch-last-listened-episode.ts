import { database } from "@/utils/database/setup";
import { EpisodeModel } from "@/utils/database/models/episode-model";
import { Q } from "@nozbe/watermelondb";

export const fetchLastListenedEpisode = async (): Promise<EpisodeModel | null> => {
    try {
        const episodesCollection = database.get('episodes');
        const episodes = await episodesCollection.query(
            Q.sortBy('episodeUpdatedAt', Q.desc)  // Assuming 'lastListenedAt' is the field that tracks the last listen time
        ).fetch();

        if (episodes.length > 0) {
            return episodes[0] as EpisodeModel;
        } else {
            console.log('No Last Episode Found');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving the last listened episode:', error);
        throw error;
    }
};
