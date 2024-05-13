import * as BackgroundFetch from 'expo-background-fetch';
import {DELETE_EPISODES_AFTER_FINISHING} from "@/utils/task/task-names";

export const removeDeleteFinishedEpisodesTask = async () => {
    try {
        await BackgroundFetch.unregisterTaskAsync(DELETE_EPISODES_AFTER_FINISHING);
        console.log('Task unregistered successfully');
    } catch (err) {
        console.log('Failed to unregister task:', err);
    }
}
