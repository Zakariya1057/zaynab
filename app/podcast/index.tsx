import React from 'react';
import {ScrollView, Text, XStack, YStack, Card, Image, Separator, Stack, Button} from 'tamagui';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Airplay, Bookmark, ChevronLeft, Search, Share} from "@tamagui/lucide-icons";
import {Podcast} from "../(tabs)";
import {TouchableOpacity} from "react-native";
import {router} from "expo-router";

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

    return (
        <SafeAreaView style={{ flex: 1}}>
            <YStack f={1} width={'100%'}>

                {/* Header with back button and search icon */}
                <XStack justifyContent="space-between" alignItems="center">
                    <TouchableOpacity onPress={() => router.back() }>
                        <ChevronLeft size="$3"/>
                    </TouchableOpacity>
                    <Search size="$2"/>
                </XStack>

                <Stack px={'$4'}>
                    <YStack py="$2" alignItems={'center'} gap={'$3'}>

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
                                Salaam with Mufit Menk
                            </Text>
                            <Text fontWeight="600" fontSize={16}>
                                Mufti Menk
                            </Text>
                        </Stack>
                        <Text fontSize={16} textAlign={'center'}>
                            Mufti Menk welcomes comedians, actors, directors, writers, authors...
                        </Text>
                        <Text fontSize={15}>
                            2.5m listeners • 32 Episodes
                        </Text>
                    </YStack>

                    <XStack gap={'$4'} my={'$5'}>
                        <Button alignSelf="center" icon={Bookmark} scaleIcon={1.5} />
                        <Button f={1}fontSize={'$5'} >Follow</Button>
                        <Button alignSelf="center" icon={Share} scaleIcon={1.5} />
                    </XStack>

                    <Stack>
                        <Text fontSize={20} fontWeight="bold">
                            Trending Podcasts
                        </Text>

                        <ScrollView mt={'$3'} space={'$3'} showsHorizontalScrollIndicator={false} >
                            {/* List of Podcast Episodes */}
                            {podcastData.map((podcast, index) => (
                                <Podcast key={index} episode={true} {...podcast} />
                            ))}
                        </ScrollView>
                    </Stack>
                </Stack>


            </YStack>
        </SafeAreaView>
    );
};

export default App;
