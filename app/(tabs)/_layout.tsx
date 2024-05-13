import {Tabs} from 'expo-router'
import {
    Home,
    Search,
    Download, Bookmark, Settings
} from "@tamagui/lucide-icons";
import {executeActionsBasedOnSettings} from "@/utils/actions/execute-actions-based-on-settings";
import {useEffect} from "react";
import {getSetting, initializeSettingsCache} from "@/utils/cache/setting-cache";
import {SettingKey} from "@/interfaces/setting-key";
import {useRestartDownloadsOnBoot} from "@/hooks/useRestartDownloadOnBoot";
import useDownloadManager from "@/hooks/useDownloadManager";
import {setupNotifications} from "@/utils/notification/setup-notifications";
import {getCompletedEpisodes} from "@/utils/database/download/get-completed-episodes";
import {prefetchLastPodcastTracks} from "@/utils/track/prefetch-last-podcast-tracks";

export default function TabLayout() {
    const {downloadAudios} = useDownloadManager();

    setupNotifications()

    useEffect(() => {
        const setup = async () => {
            await initializeSettingsCache()
            executeActionsBasedOnSettings()

            if (getSetting(SettingKey.ResumeDownloadsOnBoot)) {
                await useRestartDownloadsOnBoot(downloadAudios);
            }

            await prefetchLastPodcastTracks()
        }

        setup()
    }, []);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#5e2cf3',
                tabBarLabelStyle: {
                    fontSize: 12,
                },
                tabBarIconStyle: {
                    marginTop: 5
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color}) => <Home color={color}/>,
                    headerTitle: 'Zaynab'
                }}
            />
            <Tabs.Screen
                name="bookmarks"
                options={{
                    href: null,
                    title: 'Bookmarks',
                    tabBarIcon: ({color}) => <Bookmark color={color}/>,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({color}) => <Search color={color}/>,
                }}
            />
            <Tabs.Screen
                name="downloads"
                options={{
                    title: 'Downloads',
                    tabBarIcon: ({color}) => <Download color={color}/>,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({color}) => <Settings color={color}/>,
                }}
            />

        </Tabs>
    )
}
