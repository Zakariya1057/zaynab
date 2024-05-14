import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {DELETE_OLD_EPISODES_TASK} from "@/utils/task/task-names";
import {getOldEpisodes} from "@/utils/database/download/get-old-episodes";
import {deleteDownloadsAndRefreshTracks} from "@/utils/download/delete-downloads-and-refresh-tracks";

export const createDeleteNonPlayedEpisodeTask = () => {
    TaskManager.defineTask(DELETE_OLD_EPISODES_TASK, async () => {
        try {
            const downloads = await getOldEpisodes(30)
            await deleteDownloadsAndRefreshTracks(downloads)
            return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (err) {
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }
    });

}