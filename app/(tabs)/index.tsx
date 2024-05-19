import React, { useCallback, useState } from "react";
import { RefreshControl, SectionList } from "react-native";
import {
    Text,
    YStack,
    XStack,
    Stack,
    useTheme,
    View
} from 'tamagui';
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import { useEpisodes } from "@/hooks/useEpisodes";
import ContinueListening from "@/components/ContinueListening/ContinueListening";
import { PodcastElement } from "@/components/Podcast/PodcastElement";
import RecentPodcasts from "@/components/RecentPocasts/RecentPodcasts";
import { Podcasts } from "@/utils/data/podcasts";

export default function App() {
    const { episodes, retry } = useEpisodes();
    const [refreshing, setRefreshing] = useState(false);

    const theme = useTheme();
    const purple = theme.purple.get();

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await retry();
        setRefreshing(false);
    }, [retry]);

    const sections = [
        ...episodes.length > 0 ? [{
            title: "Keep Listening",
            data: [1]
        }] : [], // Only add this section if there are episodes
        // {
        //     title: "Recently Viewed",
        //     data: [1] // Placeholder data for section
        // },
        {
            title: "Trending Podcasts",
            data: Object.values(Podcasts) // Assuming Podcasts is an array
        },
    ];

    const renderItem = ({ section, item }) => {
        if (section.title === "Keep Listening") {
            // Render a horizontal list for this section
            return <ContinueListening />;
        } else if (section.title === "Recently Viewed") {
            // Render RecentPodcasts component for this section
            return <RecentPodcasts />;
        } else {
            // Render a single item for other sections
            return (
                <View px={'$3'} mb={'$3'}>
                    <PodcastElement podcast={item} />
                </View>
            );
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
                        <XStack justifyContent="space-between" alignItems="center" backgroundColor={'$background'}
                                py={'$3'} pl={'$3'} mb={'$2'}>
                            <Text fontSize={'$6'} fontWeight="bold">{title}</Text>
                        </XStack>
                    </YStack>
                )}
                contentContainerStyle={{ rowGap: 10 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={purple}/>
                }
            />
            <CompactAudioPlayer edges={[]} />
        </Stack>
    );
}
