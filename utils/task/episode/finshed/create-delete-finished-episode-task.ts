import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {deleteEpisodesAfterListening} from "@/utils/episode/delete-episodes-after-listening";
import {DELETE_EPISODES_AFTER_FINISHING} from "@/utils/task/task-names";

export const createDeleteFinishedEpisodeTask = () => {
    TaskManager.defineTask(DELETE_EPISODES_AFTER_FINISHING, async () => {
        try {
            await deleteEpisodesAfterListening()
            return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (err) {
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }
    });

}