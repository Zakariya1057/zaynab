import {Tabs} from 'expo-router'
import {
    Home,
    Search,
    Download, Bookmark,
} from "@tamagui/lucide-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'red',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color}) => <Home color={color}/>,
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
                name="bookmarks"
                options={{
                    title: 'Bookmarks',
                    tabBarIcon: ({ color }) => <Bookmark color={color} />,
                }}
            />
            <Tabs.Screen
                name="downloads"
                options={{
                    title: 'Downloads',
                    tabBarIcon: ({ color }) => <Download color={color} />,
                }}
            />
        </Tabs>
    )
}
