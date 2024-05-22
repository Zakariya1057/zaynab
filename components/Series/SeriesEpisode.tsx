import {YStack, Text, Separator, XStack, useTheme} from 'tamagui';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Ionicons} from "@expo/vector-icons";

export default function SeriesEpisode({title, description, openEpisode, active, percentage, downloaded}: SeriesEpisodeProps) {
    const theme = useTheme();
    const purple = theme.purple.get()
    const color = theme.color.get()

    return (
        <>
            <XStack
                onPress={openEpisode}
                borderBottomWidth={1}
                paddingHorizontal="$4"
                paddingTop="$3"
                paddingBottom={'$2'}
            >
                <YStack f={1}>
                    <XStack mb={'$1.5'} alignItems="flex-end">
                        <Text fontSize={17} fontWeight="bold" color={active ? '$color.purple' : '$color'}>
                            {title}
                        </Text>
                        {downloaded ? (
                            <YStack pl={'$2'} h={'100%'}>
                                <Ionicons name="cloud-done" size={25} color={color} strokeWidth={1.7}/>
                            </YStack>
                        ) : <></>}
                    </XStack>
                    <Text fontSize={15} color={active ? '$color.purple2' : '$charcoal'}>{description}</Text>
                </YStack>

                {
                    percentage ?
                        <YStack justifyContent={'center'} ml={'$5'}>
                            <AnimatedCircularProgress
                                size={50}
                                width={3}
                                fill={Math.round(percentage * 100)}
                                tintColor={purple}
                                backgroundColor={'rgba(111,67,241,0.47)'}
                                rotation={0}
                            >
                                {
                                    () => (
                                        <Text>
                                            {Math.round(percentage * 100)}%
                                        </Text>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </YStack>
                        : <></>
                }

            </XStack>

            <Separator alignSelf="stretch" vertical={false}/>
        </>

    )
        ;
}

interface SeriesEpisodeProps {
    title: string;
    description: string;
    active: boolean;
    downloaded: boolean;
    percentage: number | null;
    openEpisode: () => void;
}
