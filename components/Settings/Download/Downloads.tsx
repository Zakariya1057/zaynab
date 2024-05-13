import React from 'react';
import SettingsSection from "@/components/Settings/Section";
import SettingsToggle from "@/components/Settings/Toggle";
import useSetting from "@/hooks/useSetting";
import {SettingKey} from "@/interfaces/setting-key";
import {setupDeleteFinishedEpisodeTask} from "@/utils/task/episode/finshed/setup-delete-finished-episode-task";
import {removeDeleteFinishedEpisodesTask} from "@/utils/task/episode/finshed/remove-delete-finished-episodes-task";
import {setupDeleteNonPlayedEpisodeTask} from "@/utils/task/episode/non-played/setup-delete-non-played-episode-task";
import {removeNonPlayedEpisodesTask} from "@/utils/task/episode/non-played/remove-non-played-episodes-task";

const DownloadSettings: React.FC = () => {
    const [deleteAfterListening, setDeleteAfterListening] = useSetting(SettingKey.DeleteAfterListening);
    const [resumeDownloadsOnBoot, setResumeDownloadsOnBoot] = useSetting(SettingKey.ResumeDownloadsOnBoot);
    const [deleteOldEpisodes, setDeleteOldEpisodes] = useSetting(SettingKey.DeleteOldEpisodes);

    const updateDeleteEpisodesAfterListening = async (value: boolean) => {
        setDeleteAfterListening(value)

        if (value) {
            await setupDeleteFinishedEpisodeTask()
        } else {
            await removeDeleteFinishedEpisodesTask()
        }
    }

    const updateRemoveNonPlayedEpisodes = async (value: boolean) => {
        setDeleteOldEpisodes(value)

        if (value) {
            await setupDeleteNonPlayedEpisodeTask()
        } else {
            await removeNonPlayedEpisodesTask()
        }
    }

    return (
        <SettingsSection title="Download Management">
            <SettingsToggle
                label="Delete episodes after listening"
                value={deleteAfterListening}
                onValueChange={updateDeleteEpisodesAfterListening}
                description="Automatically remove episodes from your device after you've finished listening to conserve space."
            />
            <SettingsToggle
                label="Resume downloads on app startup"
                value={resumeDownloadsOnBoot}
                onValueChange={setResumeDownloadsOnBoot}
                description="Automatically resume incomplete downloads when the app starts."
            />
            <SettingsToggle
                label="Auto-delete unplayed episodes"
                value={deleteOldEpisodes}
                onValueChange={updateRemoveNonPlayedEpisodes}
                description="Automatically delete episodes that haven't been played in over a month to manage storage efficiently."
            />
        </SettingsSection>
    );
};

export default DownloadSettings;
