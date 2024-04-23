import { Q } from '@nozbe/watermelondb';
import {EpisodeModel} from "@/utils/database/models/episode-model";
import {database} from "@/utils/database/setup";

export const getEpisodes = async (): Promise<EpisodeModel[]> => {
    try {
        const episodesCollection = database.get('episodes');
        // Sort episodes by 'updated_at' in descending order
        const sortedEpisodes = episodesCollection.query(
            Q.sortBy('updated_at', Q.desc)
        );
        console.log( await sortedEpisodes.fetch())
        return await sortedEpisodes.fetch() as EpisodeModel[];
    } catch (error) {
        console.error('Error retrieving episodes:', error);
        throw error;
    }
};
