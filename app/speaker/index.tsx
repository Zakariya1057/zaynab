import React from 'react';
import {ScrollView, Text, XStack, YStack, Card, Image, Separator, Stack, Button, View} from 'tamagui';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Airplay, Bookmark, ChevronLeft, Search, Share} from "@tamagui/lucide-icons";
import {Podcast} from "../(tabs)";
import {TouchableOpacity} from "react-native";
import {router} from "expo-router";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";

const App = () => {
    const podcastData = [
        {
            title: 'Controversy - Marriage App - New Quran and TikTok Refutations',
            speaker: 'Nouman Ali Khan',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        },
        {
            title: 'This book is NOT a new Quran',
            speaker: 'Zakir Naik',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        },
        {
            title: 'Reviving Your Heart',
            speaker: 'Hamza Yusuf',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        },
        {
            title: 'Life of the Prophet',
            speaker: 'Yasir Qadhi',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        },
        {
            title: 'The Middle Path',
            speaker: 'Omar Suleiman',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        },
        {
            title: 'Struggling with Sin',
            speaker: 'Suhaib Webb',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        },
        {
            title: 'Understanding Islam',
            speaker: 'Bilal Philips',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        },
        {
            title: 'Islam and Modernity',
            speaker: 'Tariq Ramadan',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        },
        {
            title: 'The Path to Wisdom',
            speaker: 'Ahmad Deedat',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        },
        {
            title: 'Finding Peace',
            speaker: 'Abdul Nasir Jangda',
            image: 'https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg',
        }
    ];

    const openEpisode = () => router.push('/episode/')

    return (
        <Stack style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} >
                <YStack f={1} width={'100%'} py={'$5'}>
                    <Stack px={'$4'}>
                        <YStack alignItems={'center'} gap={'$3'}>

                            <Image
                                src={'https://i.ytimg.com/vi/5MjMUEi2pn8/maxresdefault.jpg'}
                                height={150}
                                aspectRatio={1}
                                borderRadius={'$3'}
                                overflow={'hidden'}
                                resizeMode="cover"
                            />

                            <Stack alignItems={'center'}>
                                <Text fontWeight="800" fontSize={24}>
                                    Mufti Menk
                                </Text>
                            </Stack>
                            <Text fontSize={16} textAlign={'center'}>
                                Mufti Ismail Menk is celebrated for his insightful talks on Islamic teachings, personal development, and social harmony. His ability to address contemporary challenges with traditional wisdom has made his lectures highly successful and widely followed across social media platforms.
                            </Text>
                        </YStack>

                        <Stack>
                            <View mt={'$5'} space={'$4'}>
                                {/* List of Podcast Episodes */}
                                {podcastData.map((podcast, index) => (
                                    <Podcast key={index} episode={true} {...podcast} />
                                ))}
                            </View>
                        </Stack>
                    </Stack>
                </YStack>
            </ScrollView>
            <TouchableOpacity onPress={openEpisode} activeOpacity={0.9}>
                <CompactAudioPlayer />
            </TouchableOpacity>
        </Stack>
    );
};

export default App;
