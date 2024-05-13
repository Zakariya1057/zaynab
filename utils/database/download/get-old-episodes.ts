import {database} from "@/utils/database/setup";
import {Q} from "@nozbe/watermelondb";
import {DownloadModel} from "@/utils/database/models/download-model";
import {EpisodeModel} from "@/utils/database/models/episode-model";

export const getOldEpisodes = async (daysAgo: number): Promise<DownloadModel[]> => {
    try {
        const episodesCollection = database.get<EpisodeModel>('episodes');
        const downloadsCollection = database.get<DownloadModel>('downloads');

        // Calculate the date 'daysAgo' days in the past
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - daysAgo);

        const timeInSeconds =  Math.floor(targetDate.getTime() / 1000);

        // Fetch all downloads
        const downloads = await downloadsCollection.query().fetch();

        // Find all episodes that were last updated more than 'daysAgo' days ago
        const oldEpisodes = await episodesCollection.query(
            Q.where('episodeUpdatedAt', Q.lt(timeInSeconds))
        ).fetch();

        const oldEpisodeIds = oldEpisodes.map(episode => episode.id);

        return downloads.filter(download => {
            return oldEpisodeIds.includes(download.episodeId) || download.downloadCompletedAt < timeInSeconds
        });
    } catch (error) {
        console.error('Error retrieving old episodes and their downloads:', error);
        throw error;
    }
};
