import React from 'react';
import {YStack, Text, Image, H3, H4, Paragraph} from 'tamagui';
import { useAudio } from '../../../../contexts/AudioContext';
import MediaPlayerControls from '../../MediaPlayerControls/MediaPlayerControls';
import MediaProgressSlider from '../../MediaPlayerControls/MediaProgressSlider';
import MediaImage from '../../MediaPlayerControls/MediaImage';
import PlaceholderImage from '../../../../assets/images/img_9.png'
import AboutEpisodeSheet from "../../../Sheet/AboutEpisodeSheet";
import {Platform} from "react-native";
import {Theme} from "../../../../constants";

export default function EpisodePlayer() {
    const {
        currentTime,
        endTime,
        sliderValue,
        isPlaying,
        togglePlayPause,
        handleSliderChangeStart,
        handleSliderValueChange,
        handleSliderChangeComplete,
        changeAudio,
    } = useAudio();

    const loadNewAudio = () => {
        const newAudioUrl = 'https://ia803402.us.archive.org/12/items/TearfulMomentsOfTheProphetsLife-YahyaIbrahim-Lezing/TearfulMomentsOfTheProphetsLifeYahyaIbrahim1.mp3'
        changeAudio(newAudioUrl);
    };

    return (
        <YStack f={1} p={Theme.spacing.large} pt={Theme.spacing.normal} space="$4">
            <YStack position="absolute" t={0} b={0} r={0} l={0}>
                <Image src={PlaceholderImage} width="100%" aspectRatio={1} position="absolute" top={0} bottom={0} right={0} left={0} resizeMode={'cover'}/>
                <YStack position="absolute" t={0} b={0} r={0} l={0} opacity={0.85} backgroundColor="$background"></YStack>
            </YStack>

            <MediaImage />

            <YStack mt="$2" space="$1">
                <H4 textAlign="center" color={'$color'}>
                    Imam Abu Hanifah [702-772 CE]
                </H4>
                <Paragraph textAlign="center" color={'$color'}>
                    Heroes Of Islam
                </Paragraph>
            </YStack>

            <MediaProgressSlider
                currentTime={currentTime}
                endTime={endTime}
                minimumTrackColor={Theme.colors.vividPurple}
                maximumTrackColor={'white'}
                value={sliderValue}
                onSlidingStart={handleSliderChangeStart}
                onValueChange={handleSliderValueChange}
                onSlidingComplete={handleSliderChangeComplete}
                showTime={true}
            />

            <MediaPlayerControls
                variant="large"
                togglePlayPause={togglePlayPause}
                isPlaying={isPlaying}
            />

            <AboutEpisodeSheet
                about={'The life of the Muslim Ummah is solely dependent on the ink of it\'s scholars and the blood of it\'s Martyrs." - Shaykh Abdullah Azzam (May the Mercy of Allah be with him) Indeed history is written in the colours, black - the ink of its scholars, red - the blood of the martyrs. Maktabah Sound Studio is proud to introduce "Heroes of Islam" a series of lectures exploring the lives of some of the greatest men in the history of Islam these being'}
            />
        </YStack>
    );
}
