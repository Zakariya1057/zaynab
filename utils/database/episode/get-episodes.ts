import { Q } from '@nozbe/watermelondb';
import {EpisodeModel} from "@/utils/database/models/episode-model";
import {database} from "@/utils/database/setup";

export const getEpisodes = async (podcastId?: string|undefined): Promise<EpisodeModel[]> => {
    try {
        const episodesCollection = database.get('episodes');

        // Build query conditions based on the presence of podcastId
        const queryConditions = [];
        if (podcastId) {
            queryConditions.push(Q.where('podcastId', podcastId));
        }
        queryConditions.push(Q.sortBy('episodeUpdatedAt', Q.desc));

        const sortedEpisodes = episodesCollection.query(...queryConditions);

        return await sortedEpisodes.fetch() as EpisodeModel[];
    } catch (error) {
        console.error('Error retrieving episodes:', error);
        throw error;
    }
};
