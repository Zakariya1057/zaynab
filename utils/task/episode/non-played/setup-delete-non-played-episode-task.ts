import {createDeleteNonPlayedEpisodeTask} from "@/utils/task/episode/non-played/create-delete-non-played-episode-task";
import {registerDeleteNonPlayedEpisodesTask} from "@/utils/task/episode/non-played/register-delete-non-played-episodes-task";

export const setupDeleteNonPlayedEpisodeTask = async () => {
    createDeleteNonPlayedEpisodeTask()
    await registerDeleteNonPlayedEpisodesTask()
}