import React, {useEffect, useState} from 'react';
import {H4, Image, Paragraph, YStack} from 'tamagui';
import TrackPlayer, {
    Event,
    State,
    usePlaybackState,
    useProgress,
    useTrackPlayerEvents
} from 'react-native-track-player';
import MediaPlayerControls from '../../MediaPlayerControls/MediaPlayerControls';
import MediaProgressSlider from '../../MediaPlayerControls/MediaProgressSlider';
import MediaImage from '../../MediaPlayerControls/MediaImage';
import PlaceholderImage from '../../../../assets/images/img_9.png';
import AboutEpisodeSheet from "../../../Sheet/AboutEpisodeSheet";
import {Theme} from "../../../../constants";

export default function EpisodePlayer() {
    const {position, duration} = useProgress(1000); // Updates every 1000 ms
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false)
    const [buffering, setBuffering] = useState<boolean>(false);

    useEffect(() => {
        async function setupPlayer() {
            try {
                await TrackPlayer.setupPlayer();
                await TrackPlayer.reset()
            } catch {
            }

            const track = await TrackPlayer.getActiveTrack()
            const { state } = await TrackPlayer.getPlaybackState()

            if (!track || track.url !== "https://drive.google.com/uc?id=1c-6KKjWAJASGFOIfpbozJmub4C7FMx2w&export=download") {
                await TrackPlayer.setQueue([{
                    id: 'trackId',
                    url: 'https://drive.google.com/uc?id=1c-6KKjWAJASGFOIfpbozJmub4C7FMx2w&export=download',
                    title: 'Tearful Moments Of The Prophet’s Life',
                    artist: 'Yahya Ibrahim'
                }]);
            }

            if (state === State.Playing) {
                setIsPlaying(true)
            }
        }

        setupPlayer();
    }, []);

    useTrackPlayerEvents([Event.PlaybackState], (event) => {
        // Handle the loading state directly
        setLoading(event.state === State.Loading);

        // Handle the playing and buffering states
        if (event.state === State.Buffering) {
            setBuffering(true);
        } else {
            setBuffering(false);

            if (event.state === State.Paused) {
                setIsPlaying(false)
            } else if (event.state === State.Playing) {
                setIsPlaying(true)
            }
        }

        // Simplify ready state handling
        if (event.state === State.Ready) {
            setLoading(false);
        }
    });


    const togglePlayPause = async () => {
        if (Math.ceil(position) === Math.ceil(duration)) {
            await TrackPlayer.seekTo(0)
        }

        if (!isPlaying) {
            TrackPlayer.play();
        } else {
            TrackPlayer.pause();
        }
    };

    return (
        <YStack f={1} p={Theme.spacing.large} pt={Theme.spacing.normal} space="$4">
            <YStack position="absolute" t={0} b={0} r={0} l={0}>
                <Image src={PlaceholderImage} width="100%" aspectRatio={1} position="absolute" top={0} bottom={0}
                       right={0} left={0} resizeMode={'cover'}/>
                <YStack position="absolute" t={0} b={0} r={0} l={0} opacity={0.85}
                        backgroundColor="$background"></YStack>
            </YStack>

            <MediaImage/>

            <YStack mt="$2" space="$1">
                <H4 textAlign="center" color={'$color'}>
                    Imam Abu Hanifah [702-772 CE]
                </H4>
                <Paragraph textAlign="center" color={'$color'}>
                    Heroes Of Islam
                </Paragraph>
            </YStack>

            <MediaProgressSlider
                currentTime={position}
                endTime={duration}
                minimumTrackColor={Theme.colors.vividPurple}
                maximumTrackColor={'white'}
                loading={loading}
                onValueChange={(value) => TrackPlayer.seekTo(value)}
            />

            <MediaPlayerControls
                variant="large"
                togglePlayPause={togglePlayPause}
                isPlaying={isPlaying}
            />

            <AboutEpisodeSheet
                about={'The life of the Muslim Ummah is solely dependent on the ink of its scholars and the blood of its Martyrs." - Shaykh Abdullah Azzam (May the Mercy of Allah be with him) Indeed history is written in the colours, black - the ink of its scholars, red - the blood of the martyrs. Maktabah Sound Studio is proud to introduce "Heroes of Islam" a series of lectures exploring the lives of some of the greatest men in the history of Islam'}
            />
        </YStack>
    );
}
