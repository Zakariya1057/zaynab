import {database} from "@/utils/database/setup";
import {EpisodeModel} from "@/utils/database/models/episode-model";

/**
 * Retrieves all episodes
 * @returns {Promise<EpisodeModel[]>} A promise that resolves with the all episodes.
 */
export const getEpisodes = async (): Promise<EpisodeModel[]> => {
    try {
        const episodesCollection = database.get('episodes');
        return await episodesCollection.query().fetch() as [EpisodeModel]
    } catch (error) {
        console.error('Error retrieving episodes:', error);
        throw error;
    }
};
