import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {deleteEpisodesAfterListening} from "@/utils/episode/delete-episodes-after-listening";
import {DELETE_EPISODES_AFTER_FINISHING} from "@/utils/task/task-names";
import * as Notifications from 'expo-notifications';

export const createDeleteFinishedEpisodeTask = () => {
    TaskManager.defineTask(DELETE_EPISODES_AFTER_FINISHING, async () => {
        try {
            await deleteEpisodesAfterListening()

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "createDeleteFinishedEpisodeTask",
                    body: "Deleting Episodes After Finish",
                    data: { screen: 'Home' },  // Direct users to the main screen for immediate engagement
                },
                trigger: {
                    seconds: 1
                },
            });

            return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (err) {
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }
    });

}