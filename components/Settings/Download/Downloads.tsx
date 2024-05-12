import React from 'react';
import SettingsSection from "@/components/Settings/Section";
import SettingsToggle from "@/components/Settings/Toggle";
import useSetting from "@/hooks/useSetting";
import {SettingKey} from "@/interfaces/setting-key";

const DownloadSettings: React.FC = () => {
    const [deleteAfterListening, setDeleteAfterListening] = useSetting(SettingKey.DeleteAfterListening, false);
    const [resumeDownloadsOnBoot, setResumeDownloadsOnBoot] = useSetting(SettingKey.ResumeDownloadsOnBoot, false);
    const [deleteOldEpisodes, setDeleteOldEpisodes] = useSetting(SettingKey.DeleteOldEpisodes, false);

    return (
        <SettingsSection title="Download Management">
            <SettingsToggle
                label="Delete episodes after listening"
                value={deleteAfterListening}
                onValueChange={setDeleteAfterListening}
                description="Automatically remove episodes from your device after you've finished listening to conserve space."
            />
            <SettingsToggle
                label="Resume downloads on app startup"
                value={resumeDownloadsOnBoot}
                onValueChange={setResumeDownloadsOnBoot}
                description="Automatically resume pending downloads when the app starts to ensure all episodes are up to date."
            />
            <SettingsToggle
                label="Auto-delete unplayed episodes"
                value={deleteOldEpisodes}
                onValueChange={setDeleteOldEpisodes}
                description="Automatically delete episodes that haven't been played in over a month to manage storage efficiently."
            />
        </SettingsSection>
    );
};

export default DownloadSettings;
