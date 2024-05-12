import {Tabs} from 'expo-router'
import {
    Home,
    Search,
    Download, Bookmark, Settings
} from "@tamagui/lucide-icons";
import {getSetting} from "@/utils/cache/setting-cache";
import {SettingKey} from "@/interfaces/setting-key";
import {useRestartDownloadsOnBoot} from "@/hooks/useRestartDownloadOnBoot";

export default function TabLayout() {
    if (getSetting(SettingKey.ResumeDownloadsOnBoot)) {
        useRestartDownloadsOnBoot();
    }

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
                    tabBarIcon: ({ color }) => <Bookmark color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <Search color={color} />,
                }}
            />
            <Tabs.Screen
                name="downloads"
                options={{
                    title: 'Downloads',
                    tabBarIcon: ({ color }) => <Download color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Settings color={color} />,
                }}
            />

        </Tabs>
    )
}
