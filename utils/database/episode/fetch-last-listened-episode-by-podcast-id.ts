import { database } from "@/utils/database/setup";
import { EpisodeModel } from "@/utils/database/models/episode-model";
import { Q } from "@nozbe/watermelondb";

/**
 * Retrieves the episode last listened to by the user for a given podcast ID.
 * @param {string} podcastId The ID of the podcast to retrieve the last listened episode for.
 * @returns {Promise<EpisodeModel | null>} A promise that resolves with the episode last listened to if found, or null if not found.
 */
export const fetchLastListenedEpisodeByPodcastId = async (podcastId: string): Promise<EpisodeModel | null> => {
    try {
        const episodesCollection = database.get('episodes');
        const episodes = await episodesCollection.query(
            Q.where('podcastId', podcastId),
            Q.sortBy('episodeUpdatedAt', Q.desc)  // Assuming 'lastListenedAt' is the field that tracks the last listen time
        ).fetch();

        if (episodes.length > 0) {
            return episodes[0] as EpisodeModel; // Assuming the first record is the most recently listened to
        } else {
            console.log('No listened episodes found for podcast ID:', podcastId);
            return null;
        }
    } catch (error) {
        console.error('Error retrieving the last listened episode:', error);
        throw error;
    }
};
