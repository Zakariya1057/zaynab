import SettingsSection from "@/components/Settings/Section";
import SettingsToggle from "@/components/Settings/Toggle";
import React, {useState} from "react";
import useSetting from "@/hooks/useSetting";
import {SettingKey} from "@/interfaces/setting-key";

export default function NotificationSettings() {
    const [reminder, setReminder] = useSetting(SettingKey.FinishEpisodeReminder, false);

    return (
        <SettingsSection title="Notifications">
            <SettingsToggle
                label="Finish Episode Reminder"
                value={reminder}
                onValueChange={setReminder}
            />
        </SettingsSection>
    )
}
