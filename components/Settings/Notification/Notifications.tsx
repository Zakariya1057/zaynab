import SettingsSection from "@/components/Settings/Section";
import SettingsToggle from "@/components/Settings/Toggle";
import useSetting from "@/hooks/useSetting";
import { SettingKey } from "@/interfaces/setting-key";
import { clearReminders } from "@/utils/reminder/clear-reminders";
import { scheduleReminder } from "@/utils/reminder/schedule-reminder";
import {getAllowDownload} from "@/utils/cache/download-status-cache";

export default function NotificationSettings() {
    const [reminder, setReminder] = useSetting(SettingKey.FinishEpisodeReminder);
    const [downloadCompletedToaster, setDownloadCompletedToaster] = useSetting(SettingKey.ShowDownloadCompletedToaster);

    const updateReminder = async (value: boolean) => {
        setReminder(value);

        if (value) {
            await scheduleReminder();
        } else {
            await clearReminders();
        }
    };

    return (
        <SettingsSection title="Notifications">
            <SettingsToggle
                label="Episode Completion Reminder"
                value={reminder}
                onValueChange={updateReminder}
                description="Enable to receive a reminder one week after to finish your last episode or explore new talks."
            />
            {
                getAllowDownload() && (
                    <SettingsToggle
                        label="Download Completion Notification"
                        value={downloadCompletedToaster}
                        onValueChange={setDownloadCompletedToaster}
                        description="Show a notification when a download is completed."
                    />
                )
            }
        </SettingsSection>
    );
}
