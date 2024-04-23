import { database } from "@/utils/database/setup";
import { EpisodeModel } from "@/utils/database/models/episode-model";
import {Q} from "@nozbe/watermelondb";
import {where} from "@nozbe/watermelondb/QueryDescription";

/**
 * Retrieves an episode by its episode ID.
 * @param {string} episodeId The ID of the episode to retrieve.
 * @returns {Promise<EpisodeModel | null>} A promise that resolves with the episode if found, or null if not found.
 */
export const getEpisodeById = async (episodeId: string): Promise<EpisodeModel | null> => {
    try {
        const episodesCollection = database.get('episodes');
        const episodes = await episodesCollection.query(
            Q.where('episodeId', episodeId)
        ).fetch();

        if (episodes.length > 0) {
            return episodes[0] as EpisodeModel; // Assuming episodeId is unique and only one record should be returned
        } else {
            console.log('No episode found with ID:', episodeId);
            return null;
        }
    } catch (error) {
        console.error('Error retrieving episode:', error);
        throw error;
    }
};
