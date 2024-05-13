import SettingsSection from "@/components/Settings/Section";
import SettingsToggle from "@/components/Settings/Toggle";
import useSetting from "@/hooks/useSetting";
import {SettingKey} from "@/interfaces/setting-key";
import {clearReminders} from "@/utils/reminder/clear-reminders";
import {scheduleReminder} from "@/utils/reminder/schedule-reminder";

export default function NotificationSettings() {
    const [reminder, setReminder] = useSetting(SettingKey.FinishEpisodeReminder, false);

    const updateReminder = async (value: boolean) => {
        setReminder(value)

        if (value) {
            await scheduleReminder()
        } else {
            await clearReminders()
        }
    }

    return (
        <SettingsSection title="Notifications">
            <SettingsToggle
                label="Finish Episode Reminder"
                value={reminder}
                onValueChange={updateReminder}
                description="Enable to receive a reminder in one week to finish your last episode or explore new talks."
            />
        </SettingsSection>
    )
}
