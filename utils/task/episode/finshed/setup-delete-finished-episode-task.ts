import {createDeleteFinishedEpisodeTask} from "@/utils/task/episode/finshed/create-delete-finished-episode-task";
import {registerDeleteFinishedEpisodesTask} from "@/utils/task/episode/finshed/register-delete-finished-episodes-task";

export const setupDeleteFinishedEpisodeTask = async () => {
    createDeleteFinishedEpisodeTask()
    await registerDeleteFinishedEpisodesTask()
}