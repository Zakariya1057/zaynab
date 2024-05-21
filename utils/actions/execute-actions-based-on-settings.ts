import {getSetting} from "@/utils/cache/setting-cache";
import {SettingKey} from "@/interfaces/setting-key";
import {scheduleReminder} from "@/utils/reminder/schedule-reminder";
import {setupDeleteNonPlayedEpisodeTask} from "@/utils/task/episode/non-played/setup-delete-non-played-episode-task";
import {setupDeleteFinishedEpisodeTask} from "@/utils/task/episode/finshed/setup-delete-finished-episode-task";

const actionsMap: Record<SettingKey, () => void> = {
    [SettingKey.FinishEpisodeReminder]: scheduleReminder,
    [SettingKey.DeleteOldEpisodes]: setupDeleteNonPlayedEpisodeTask,
    [SettingKey.DeleteAfterListening]: setupDeleteFinishedEpisodeTask,
};

export const executeActionsBasedOnSettings = () => {
    for (const [key, action] of Object.entries(actionsMap)) {
        // console.log(key,getSetting(key) )

        if (getSetting(key)) {
            // console.log(`Executing action for setting: ${key}`);
            action();
        }
    }
}