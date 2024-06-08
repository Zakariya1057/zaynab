import React, {useState, useEffect, useRef} from 'react';
import {
    Stack,
    Input,
    Text,
    YStack, View
} from 'tamagui';
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import { Podcasts } from "@/utils/data/podcasts";
import { PodcastElement } from "@/components/Podcast/PodcastElement";
import LottieView from "lottie-react-native";
import { FlashList } from "@shopify/flash-list";

export default function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPodcasts, setFilteredPodcasts] = useState(Object.values(Podcasts));

    const animation = useRef(null);

    // Handle input change to filter podcasts
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = Object.values(Podcasts).filter(podcast =>
            podcast.name.toLowerCase().includes(lowerCaseQuery) ||
            podcast.description.toLowerCase().includes(lowerCaseQuery) ||
            podcast.subTitle.toLowerCase().includes(lowerCaseQuery) ||
            Object.values(podcast.episodes).find(episode => episode.description.toLowerCase().includes(lowerCaseQuery))
        );

        const sorted = filtered.sort((a, b) => {
            const aNameMatches = a.name.toLowerCase().includes(lowerCaseQuery);
            const bNameMatches = b.name.toLowerCase().includes(lowerCaseQuery);

            if (aNameMatches && !bNameMatches) {
                return -1;
            }
            if (!aNameMatches && bNameMatches) {
                return 1;
            }
            return 0;
        });

        setFilteredPodcasts(sorted);
    }, [searchQuery]);

    const renderItem = ({ item }) => {
        return <View mt={'$4'}><PodcastElement podcast={item} showPlayIcon={false} /></View>;
    };

    return (
        <Stack f={1}>
            <Stack f={1} px={'$3'} pt={'$2'}>
                <Input
                    width={'100%'}
                    placeholder={'Search podcasts'}
                    backgroundColor={'$white'}
                    borderWidth={2}
                    borderColor={'$gray4'}
                    borderRadius={10}
                    mb={'$4'}
                    mt={'$2'}
                    fontSize={'$5'}
                    onChangeText={text => setSearchQuery(text)}
                    clearButtonMode={'always'}
                />

                {filteredPodcasts.length > 0 ? (
                    <FlashList
                        data={filteredPodcasts}
                        estimatedItemSize={100}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <YStack ai='center' jc='center' f={1}>
                        <Text
                            fontSize="$5"
                            color="$gray"
                            mt="$4"
                            ta="center"
                            lineHeight={'$3'}
                        >
                            Sorry, no podcasts found. { '\n' }
                            Try searching for something else.
                        </Text>

                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ aspectRatio: 1, height: 200 }}
                            source={require('@/assets/animation/no-data-found.json')}
                        />
                    </YStack>
                )}
            </Stack>
            <CompactAudioPlayer />
        </Stack>
    );
}
