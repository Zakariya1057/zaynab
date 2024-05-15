import {Image, Text, useTheme, XStack, YStack} from 'tamagui';
import MediaPlayerControls from '../../MediaPlayerControls/MediaPlayerControls';
import {Edge, SafeAreaView} from "react-native-safe-area-context";
import TrackPlayer, {
    State,
    useActiveTrack,
    usePlaybackState,
    useProgress
} from "react-native-track-player";
import {TouchableOpacity} from "react-native";
import {router} from "expo-router";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {getEpisodeById} from "@/utils/data/getEpisodeById";

export default function EpisodePlayer({ edges = [] }: { edges?: Edge[] }) {
    const {position, duration} = useProgress(1000);
    const { state } = usePlaybackState();
    const track = useActiveTrack()

    const isLoading = (state === State.Loading || state === State.Buffering)

    const theme = useTheme()
    const background = theme.background.get()

    const togglePlayPause = async () => {
        if (Math.ceil(position) === Math.ceil(duration)) {
            // await TrackPlayer.seekTo(0)
        }

        if (state !== State.Playing) {
            TrackPlayer.play();
        } else {
            TrackPlayer.pause();
        }
    };

    const [ podcastId, episodeId ] = (track?.description?.split('|') ?? [])

    if (!podcastId || !episodeId) return null

    const openEpisode = () => router.push({ pathname: "/notification.click/", params: { podcastId, episodeId } })

    const podcast = getPodcastById(podcastId)
    const episode = getEpisodeById(podcast, episodeId)

    const player = (
        <TouchableOpacity onPress={openEpisode} activeOpacity={0.9}>
            <YStack backgroundColor={background} alignItems="center">
                <YStack height={4} width="100%" borderRadius={10} backgroundColor="rgba(0, 0, 0, 0.3)">
                    <YStack height={'100%'} backgroundColor="$color.purple" borderTopRightRadius={10} borderBottomRightRadius={10} width={`${(position / duration) * 100}%`} />
                </YStack>

                <XStack flexDirection="row" paddingHorizontal={'$3'} alignItems="center" height={65}>
                    <Image src={episode.image ?? podcast.image} width={45} height={40} borderRadius={5} resizeMode="cover" />
                    <YStack marginLeft={12} justifyContent="space-between" f={1} gap={'$1.5'} mr={'$4'}>
                        <Text fontSize={15} fontWeight="600" numberOfLines={1}>
                            { track?.title }
                        </Text>
                        <Text fontSize={14} numberOfLines={1}>
                            { track?.artist }
                        </Text>
                    </YStack>
                    <MediaPlayerControls
                        variant="small"
                        togglePlayPause={togglePlayPause}
                        isPlaying={state === State.Playing}
                        loading={isLoading}
                        episodeId={track?.description?.split('|')[1]}
                    />
                </XStack>
            </YStack>
        </TouchableOpacity>
    )

    return edges.length === 0 ? player : <SafeAreaView style={{ backgroundColor: background }} edges={edges}>{player}</SafeAreaView>
}
