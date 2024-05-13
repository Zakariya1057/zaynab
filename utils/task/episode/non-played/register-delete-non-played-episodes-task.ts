import * as BackgroundFetch from 'expo-background-fetch';
import {DELETE_OLD_EPISODES_TASK} from "@/utils/task/task-names";

export const registerDeleteNonPlayedEpisodesTask = async () => {
    try {
        await BackgroundFetch.registerTaskAsync(DELETE_OLD_EPISODES_TASK, {
            minimumInterval: 60 * 60 * 24, // 24 hours
            stopOnTerminate: false, // Android-only: keep running after app terminates
            startOnBoot: true, // Android-only: start after the device has been restarted
        });
        console.log('Task registered');
    } catch (err) {
        console.log('Task Register failed:', err);
    }
}
