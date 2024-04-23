import { Q } from '@nozbe/watermelondb';
import { EpisodeModel } from "@/utils/database/models/episode-model";
import { database } from "@/utils/database/setup";

export const upsertEpisode = async (episodeData: Partial<EpisodeModel>) => {
    await database.write(async () => {
        const episodesCollection = database.get('episodes');
        const existingEpisodes = await episodesCollection.query(
            Q.where('episodeId', episodeData.episodeId)
        ).fetch();

        if (existingEpisodes.length > 0) {
            // Episode exists, update it
            await existingEpisodes[0].update((episode) => {
                episode.artist = episodeData.artist;
                episode.description = episodeData.description;
                episode.title = episodeData.title;
                episode.url = episodeData.url;
                episode.duration = episodeData.duration;
                episode.position = episodeData.position;
                episode.complete = episodeData.complete;
                episode.podcastId = episodeData.podcastId;
                episode.episodeId = episodeData.episodeId;
            });
        } else {
            // Episode does not exist, create a new one
            await episodesCollection.create((newEpisode) => {
                newEpisode.artist = episodeData.artist;
                newEpisode.description = episodeData.description;
                newEpisode.title = episodeData.title;
                newEpisode.url = episodeData.url;
                newEpisode.duration = episodeData.duration;
                newEpisode.position = episodeData.position;
                newEpisode.complete = episodeData.complete;
                newEpisode.podcastId = episodeData.podcastId;
                newEpisode.episodeId = episodeData.episodeId;
            });
        }
    });
}
