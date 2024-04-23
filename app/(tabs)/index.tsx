import {
    Text,
    YStack,
    XStack,
    Image,
    ScrollView,
    Stack,
    H5,
    CardProps, Card,
    H6, useTheme
} from 'tamagui';
import {Bell, Home, PlayCircle} from "@tamagui/lucide-icons";
import {Redirect, router, Stack as RouterStack} from "expo-router";
import {TouchableOpacity} from "react-native";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import React from "react";
import {Podcasts} from "@/utils/data/podcasts";
import {Podcast} from "@/interfaces/podcast";
import CircularProgress from "react-native-circular-progress-indicator";

export default function App() {
    return (
        <Stack f={1}>
            <ScrollView showsVerticalScrollIndicator={false} backgroundColor={'$backgroundStrong'}>
                <YStack flex={1} padding={10} gap={'$5'}>
                    <YStack width="100%" >
                        <XStack justifyContent="space-between" alignItems="center">
                            <Text fontSize={20} fontWeight="bold">
                                Continue Listening
                            </Text>
                        </XStack>
                        <YStack width="100%" marginTop={10}>
                            <HorizontalTabs />
                        </YStack>
                    </YStack>

                    {/*<YStack>*/}
                    {/*    <Text fontSize={20} fontWeight="bold">*/}
                    {/*        Top Speakers*/}
                    {/*    </Text>*/}

                    {/*    <ScrollView horizontal={true} mt={'$3'} space={'$3'} showsHorizontalScrollIndicator={false}>*/}
                    {/*        <Speaker image={'https://i.ytimg.com/vi/5MjMUEi2pn8/maxresdefault.jpg'} firstName={'Mufti'} lastName={'Menk'}/>*/}
                    {/*        <Speaker image={'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201908/Zakir-Naik-PTI.jpeg?VersionId=Vzj5OB46sWoaYW5mSfcpOgS6iWMGbYXI&size=690:388'} firstName={'Zaker'} lastName={'Naik'}/>*/}
                    {/*        <Speaker image={'https://celebrays.com/wp-content/uploads/2023/11/Nouman-Ali-Khan-1-768x1024.webp'} firstName={'Nouman'} lastName={'Ali Khan'}/>*/}
                    {/*        <Speaker image={'https://imamsonline.com/wp-content/uploads/2015/10/hamza-yusuf.jpg'} firstName={'Hamza'} lastName={'Yusuf'}/>*/}
                    {/*        <Speaker image={'https://islamicseminary.us/wp-content/uploads/2023/11/mail-3.png'} firstName={'Yasir'} lastName={'Qadhi'}/>*/}
                    {/*        <Speaker image={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZQkm-nVwTkn1oY_B2opIwSUDO_MOlN92UCg&usqp=CAU'} firstName={'Omar'} lastName={'Suleiman'}/>*/}
                    {/*        <Speaker image={'https://www.islamicity.org/wp-content/plugins/blueprint-timthumb/timthumb.php?src=http://media.islamicity.org/wp-content/uploads/2017/04/Yusuf_Estes.jpg&w=350&h=350'} firstName={'Yusuf'} lastName={'Estes'}/>*/}
                    {/*        <Speaker image={'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Bilal_Philips.jpg/440px-Bilal_Philips.jpg'} firstName={'Bilal'} lastName={'Philips'}/>*/}
                    {/*    </ScrollView>*/}
                    {/*</YStack>*/}

                    <YStack>
                        <Text fontSize={20} fontWeight="600">
                            Popular Podcasts
                        </Text>

                        <ScrollView mt={'$3'} space={'$5'} showsHorizontalScrollIndicator={false}>
                            {
                                Object.values(Podcasts).map( (podcast) => {
                                    return <PodcastElement key={podcast.id} {...podcast} />
                                })
                            }
                        </ScrollView>
                    </YStack>
                </YStack>
            </ScrollView>
            <CompactAudioPlayer edges={[]}/>
        </Stack>
    )
}

const HorizontalTabs = () => {
    return (
        <ScrollView horizontal={true} space={'$4'} showsHorizontalScrollIndicator={false}>
            <DemoCard width={230}/>
            <DemoCard width={230}/>
            <DemoCard width={230}/>
            <DemoCard width={230}/>
            <DemoCard width={230}/>
        </ScrollView>
    )
}

export function DemoCard(props: CardProps) {
    const theme = useTheme();
    const purple = theme.purple.get()

    return (
        <TouchableOpacity onPress={() => router.push('/episode/')}>
            <Card size="$3" bordered {...props} br={'$5'} overflow={'hidden'}>
                <XStack>
                    <Image
                        resizeMode="cover"
                        alignSelf="center"
                        w={'100%'}
                        height={150}
                        source={require('@/assets/images/podcasts/a3bc8692-476f-4d2d-98df-3fc498321517/cover.webp')}
                    />
                </XStack>
                <Card.Header>
                    <XStack gap={'$2'}>
                        <H6 f={1} lineHeight={'$4'} numberOfLines={2}>5. Yusuf (Cont.) – Ayub – Yunus A.S.</H6>
                        <XStack alignItems={'center'} justifyContent={'flex-end'}>
                            <CircularProgress
                                value={(90)}
                                inActiveStrokeColor={'rgba(94,44,243,0.92)'}
                                activeStrokeColor={purple}
                                inActiveStrokeOpacity={0.1}
                                activeStrokeWidth={4}
                                progressValueColor={'#fff'}
                                valueSuffix={'%'}
                                radius={22}
                            />
                        </XStack>
                    </XStack>
                </Card.Header>
            </Card>
        </TouchableOpacity>
    )
}

export const PodcastElement = (podcast: Podcast) => {
    const { name, subTitle, image} = podcast

    return (
        <TouchableOpacity onPress={
            () =>  router.push({ pathname: "/series/", params: { id: podcast.id } })
        }>
            <XStack
                gap="$3"
                alignItems="center"
                borderRadius="$3"
            >
                <Image
                    src={image}
                    width={80}
                    aspectRatio={1}
                    borderRadius={'$3'}
                    overflow={'hidden'}
                    resizeMode="cover"
                />
                <YStack f={1} justifyContent="center" space="$2">
                    <H5 lineHeight="$4" numberOfLines={2}>{name}</H5>
                    <Text fontSize={'$4'} numberOfLines={2}>{subTitle}</Text>
                </YStack>
                <TouchableOpacity onPress={ () =>  router.push({ pathname: "/series/", params: { id: podcast.id, play: true } })}>
                    <PlayCircle size="$4" strokeWidth={1.3} color={'$color.purple'}/>
                </TouchableOpacity>
            </XStack>
        </TouchableOpacity>
    )
}
