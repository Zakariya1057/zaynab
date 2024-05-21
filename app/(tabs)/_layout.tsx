import { Tabs } from 'expo-router';
import { Home, Search, Download, Bookmark, Settings } from "@tamagui/lucide-icons";
import { executeActionsBasedOnSettings } from "@/utils/actions/execute-actions-based-on-settings";
import React, { useEffect, useState } from "react";
import { getSetting, initializeSettingsCache } from "@/utils/cache/setting-cache";
import { SettingKey } from "@/interfaces/setting-key";
import { useRestartDownloadsOnBoot } from "@/hooks/useRestartDownloadOnBoot";
import useDownloadManager from "@/hooks/useDownloadManager";
import { setupNotifications } from "@/utils/notification/setup-notifications";
import { prefetchLastPodcastTracks } from "@/utils/track/prefetch-last-podcast-tracks";
import {handleDownloadPermission} from "@/utils/download/handle-download-permission";

export default function TabLayout() {
    const { downloadAudios } = useDownloadManager();
    const [showDownloadTab, setShowDownloadTab] = useState(false);

    setupNotifications();

    useEffect(() => {
        const setup = async () => {
            await initializeSettingsCache();

            handleDownloadPermission(setShowDownloadTab)

            executeActionsBasedOnSettings();

            if (getSetting(SettingKey.ResumeDownloadsOnBoot)) {
                await useRestartDownloadsOnBoot(downloadAudios);
            }

            await prefetchLastPodcastTracks();
        };

        setup();
    }, []);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#5e2cf3',
                tabBarLabelStyle: {
                    fontSize: 12,
                },
                tabBarIconStyle: {
                    marginTop: 5,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home color={color} />,
                    headerTitle: 'Zaynab',
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
            {showDownloadTab ? (
                <Tabs.Screen
                    name="downloads"
                    options={{
                        title: 'Downloads',
                        tabBarIcon: ({ color }) => <Download color={color} />,
                    }}
                />
            ) : (
                <Tabs.Screen
                    name="downloads"
                    options={{
                        href: null,
                    }}
                />
            )}
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Settings color={color} />,
                }}
            />
        </Tabs>
    );
}
