import {database} from "@/utils/database/setup";
import {Q} from "@nozbe/watermelondb";
import {DownloadModel} from "@/utils/database/models/download-model";
import {EpisodeModel} from "@/utils/database/models/episode-model";

export const getCompletedEpisodes = async (): Promise<DownloadModel[]> => {
    try {
        const episodesCollection = database.get<EpisodeModel>('episodes');
        const downloadsCollection = database.get<DownloadModel>('downloads');

        const downloads = await downloadsCollection.query(
            Q.where('downloaded', Q.eq(true))
        ).fetch();

        const downloadIds = downloads.map(download => download.episodeId);

        const episodes = await episodesCollection.query(
            Q.where('episodeId', Q.oneOf(downloadIds))
        ).fetch();

        const completedEpisodeIds = episodes.filter(episode => {
            console.log(episode.duration, episode.position, episode.title,  Math.floor(episode.duration - episode.position))
            return Math.floor(episode.duration - episode.position) <= 5
        }).map((episode) => episode.episodeId);

        return downloads.filter(download => {
            return completedEpisodeIds.includes(download.episodeId)
        });
    } catch (error) {
        console.error('Error retrieving old episodes and their downloads:', error);
        throw error;
    }
};
