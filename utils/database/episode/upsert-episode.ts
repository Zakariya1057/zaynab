import { Q } from '@nozbe/watermelondb';
import { EpisodeModel } from "@/utils/database/models/episode-model";
import { database } from "@/utils/database/setup";
import { getCurrentUnixTime } from "@/utils/date/get-current-unix-time";

export const upsertEpisode = async (episodeData: Partial<EpisodeModel>) => {
    await database.write(async () => {
        const episodesCollection = database.get('episodes');
        const existingEpisodes = await episodesCollection.query(
            Q.where('episodeId', episodeData.episodeId)
        ).fetch();

        // console.log(episodeData)
        const time = getCurrentUnixTime();

        if (existingEpisodes.length > 0) {
            // Episode exists, update it
            await existingEpisodes[0].update((episode) => {
                // Iterate over each entry in episodeData and only update if value is not undefined
                Object.entries(episodeData).forEach(([key, value]) => {
                    if (value !== undefined) {
                        episode[key] = value;
                    }
                });
                episode.episodeUpdatedAt = time;
            });
        } else {
            // Episode does not exist, create a new one
            await episodesCollection.create((newEpisode) => {
                Object.keys(newEpisode._raw).forEach(key => {
                    // Only set the values if they exist in episodeData to avoid undefined values
                    if (key in episodeData && episodeData[key] !== undefined) {
                        newEpisode[key] = episodeData[key];
                    }
                });
                newEpisode.episodeCreatedAt = time;
                newEpisode.episodeUpdatedAt = time;
            });
        }
    });
}
