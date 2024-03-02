import React from 'react';
import {YStack, XStack, Text, Image, Slider, Button, Stack, ScrollView} from 'tamagui';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChevronLeft, FastForward, Play, Rewind, Search} from "@tamagui/lucide-icons";
import {Podcast} from "../(tabs)";
import Placeholder from '../../assets/images/img.png'
import {TouchableOpacity} from "react-native";
import {router, Stack as RouterStack} from "expo-router";

const PlayerScreen = () => {
    // Placeholder for the state management
    const currentTime = "23:23";
    const totalTime = "1:20:53";
    const isPlaying = false;

    // Placeholder functions for controlling playback
    const onPlayPausePress = () => {
    };
    const onSkipBackPress = () => {
    };
    const onSkipForwardPress = () => {
    };
    const onSliderChange = (value) => {
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <RouterStack.Screen options={{ headerShown: true }}/>

            <YStack f={1} ai="center" justifyContent={'center'} space="$4">
                <Image
                    position={'absolute'}
                    resizeMode={'cover'}
                    src={Placeholder}
                />

                <Stack f={1}/>

                <YStack gap="$4" width='90%' backgroundColor={'#5f7285'} p={'$4'} borderRadius={'$4'}>
                    <Text fontSize="$6" fontWeight="bold" numberOfLines={3}>Episode 613 - Islamic Reminders For Tomorrow</Text>
                    <Text fontSize="$4">by Mufti Menk</Text>

                    <Slider defaultValue={[50]} max={100} step={1}>
                        <Slider.Track>
                            <Slider.TrackActive backgroundColor={'red'}/>
                        </Slider.Track>
                        <Slider.Thumb index={0} circular elevate borderWidth={0} size={'$1'} backgroundColor={'white'} />
                    </Slider>

                    <XStack ai="center" jc="space-between" mt="$2">
                        <Text>{currentTime}</Text>
                        <Slider value={50} onValueChange={onSliderChange}/>
                        <Text>{totalTime}</Text>
                    </XStack>

                    <XStack ai="center" jc="space-between" mt="$2">
                        <Button backgroundColor={'transparent'} scale={2} onPress={onSkipBackPress} icon={Rewind}/>
                        <Button backgroundColor={'transparent'} scale={2.5} onPress={onPlayPausePress} icon={Play} circular />
                        <Button backgroundColor={'transparent'} scale={2} onPress={onSkipForwardPress} icon={FastForward}/>
                    </XStack>
                </YStack>


                <YStack mt="$4" width={'100%'} py={'$5'} backgroundColor={'$background'}>
                    <YStack width={'90%'} alignSelf={'center'}>
                        <Text fontSize={20} fontWeight="bold">
                            Up Next
                        </Text>

                        <ScrollView mt={'$3'} space={'$3'} showsHorizontalScrollIndicator={false}>
                            <Podcast episode={true} title={'Controversy - Marriage App - New Quran and TikTok Refutations'} speaker={'Nouman Ali Khan'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                        </ScrollView>
                    </YStack>
                </YStack>
            </YStack>
        </SafeAreaView>
    );
};

export default PlayerScreen;
