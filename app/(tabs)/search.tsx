import React, {useState, useEffect, useRef} from 'react';
import {
    Stack,
    Input,
    Text,
    YStack
} from 'tamagui';
import { FlatList } from "react-native";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import { Podcasts } from "@/utils/data/podcasts";
import { PodcastElement } from "@/components/Podcast/PodcastElement";
import LottieView from "lottie-react-native";

export default function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPodcasts, setFilteredPodcasts] = useState(Object.values(Podcasts));

    const animation = useRef(null);

    // Handle input change to filter podcasts
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = Object.values(Podcasts).filter(podcast =>
            podcast.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredPodcasts(filtered);
    }, [searchQuery]); // This will re-run the filter whenever searchQuery changes

    const renderItem = ({ item }) => {
        return <PodcastElement podcast={item} showPlayIcon={false} />;
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
                    <FlatList
                        data={filteredPodcasts}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ rowGap: 20 }}
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
