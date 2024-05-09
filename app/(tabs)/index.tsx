import {
    Text,
    YStack,
    XStack,
    Stack,
    useTheme
} from 'tamagui';
import {RefreshControl, SectionList} from "react-native";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import React, {useCallback, useState} from "react";
import {Podcasts} from "@/utils/data/podcasts";
import {useEpisodes} from "@/hooks/useEpisodes";
import ContinueListening from "@/components/ContinueListening/ContinueListening";
import {PodcastElement} from "@/components/Podcast/PodcastElement";

export default function App() {
    const {episodes, retry} = useEpisodes()
    const [refreshing, setRefreshing] = useState(false);

    const theme = useTheme();
    const purple = theme.purple.get()

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await retry()
        setRefreshing(false)
    }, [])

    const sections = [
        ...episodes.length > 0 ? [{
            title: "Continue Listening",
            data: [1]
        }] : [], // Only add this section if there are episodes
        {
            title: "Popular Podcasts",
            data: Object.values(Podcasts) // Assuming Podcasts is an array
        }
    ];

    const renderItem = ({ section, item }) => {
        if (section.title === "Continue Listening") {
            // Render a horizontal list for this section
            return <ContinueListening />
        } else {
            // Render a single item for other sections
            return <PodcastElement podcast={item} />;
        }
    };

    return (
        <Stack f={1}>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <YStack width="100%">
                        <XStack justifyContent="space-between" alignItems="center" py={'$3'}>
                            <Text fontSize={'$7'} fontWeight="bold">{title}</Text>
                        </XStack>
                    </YStack>
                )}
                contentContainerStyle={{ paddingHorizontal: 10, rowGap: 10 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={purple}/>
                }
            />
            <CompactAudioPlayer edges={[]} />
        </Stack>
    )
}
