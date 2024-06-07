import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import {
    Text,
    YStack,
    XStack,
    Stack,
    View,
    useTheme
} from 'tamagui';
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import { useEpisodes } from "@/hooks/useEpisodes";
import ContinueListening from "@/components/ContinueListening/ContinueListening";
import { PodcastElement } from "@/components/Podcast/PodcastElement";
import { Podcasts } from "@/utils/data/podcasts";
import { FlashList } from '@shopify/flash-list';

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

    const combinedData = useMemo(() => {
        const data = [];
        if (episodes.length > 0) {
            data.push("Keep Listening", 1); // Assuming 1 is a placeholder for ContinueListening component
        }
        data.push("Trending Podcasts", ...Object.values(Podcasts)); // Assuming Podcasts is an array
        return data;
    }, [episodes]);

    const stickyHeaderIndices = useMemo(() => {
        return combinedData.map((item, index) => typeof item === 'string' ? index : null).filter(index => index !== null);
    }, [combinedData]);

    const renderItem = ({ item, index }) => {
        if (typeof item === 'string') {
            return (
                <YStack width="100%">
                    <XStack
                        justifyContent="space-between"
                        alignItems="center"
                        backgroundColor={'$background'}
                        py={'$3'}
                        pl={'$3'}
                    >
                        <Text fontSize={'$6'} fontWeight="bold">{item}</Text>
                    </XStack>
                </YStack>
            );
        } else if (item === 1) {
            // Render a horizontal list for "Keep Listening"
            return <View my={'$4'}><ContinueListening /></View>;
        } else {
            // Render a single item for "Trending Podcasts"
            return (
                <View px={'$3'} mt={'$4'}>
                    <PodcastElement podcast={item} />
                </View>
            );
        }
    };

    return (
        <Stack f={1}>
            <FlashList
                data={combinedData}
                renderItem={renderItem}
                keyExtractor={(item, index) => (typeof item === 'string' ? item : item.id || index.toString())}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={purple} />
                }
                estimatedItemSize={80}
                stickyHeaderIndices={stickyHeaderIndices}
            />
            <CompactAudioPlayer edges={[]} />
        </Stack>
    );
}