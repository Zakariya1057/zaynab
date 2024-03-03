import {
    Text,
    View,
    YStack,
    XStack,
    Image,
    ZStack,
    ScrollView,
    Stack,
    H5,
    Tabs,
    SizableText,
    Separator,
    Paragraph,
    Avatar,
    H2,
    TabsContentProps, Button, CardProps, Card, H3, H4
} from 'tamagui';
import {Bell, Home, PlayCircle} from "@tamagui/lucide-icons";
import {Redirect, router, Stack as RouterStack} from "expo-router";
import {TouchableOpacity} from "react-native";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import React from "react";

export default function App() {
    const openEpisode = () => router.push('/episode/')

    return (
        <Stack f={1}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <YStack flex={1} padding={10} gap={'$5'}>

                    {/*<Redirect href={'/series/'} />*/}

                    <XStack>
                        <YStack f={1} space={'$2'}>
                            <Text fontWeight="bold" fontSize={24}>
                                Discover
                            </Text>
                            <Text fontSize={16} color="gray">
                                Enjoy your favorite podcast.
                            </Text>
                        </YStack>
                        <YStack jc={'center'}>
                            <Stack br={'$8'} borderWidth={1} borderColor={'#cccccc'} p={'$2'}>
                                <Bell size={'$1'}/>
                            </Stack>
                        </YStack>
                    </XStack>

                    {/* Podcast List */}
                    <YStack width="100%" >
                        <XStack justifyContent="space-between" alignItems="center">
                            <Text fontSize={20} fontWeight="bold">
                                Listen Podcast
                            </Text>
                        </XStack>
                        <YStack width="100%" marginTop={10}>
                            <HorizontalTabs />
                        </YStack>
                    </YStack>

                    <YStack>
                        <Text fontSize={20} fontWeight="bold">
                            Top Speakers
                        </Text>

                        <ScrollView horizontal={true} mt={'$3'} space={'$3'} showsHorizontalScrollIndicator={false}>
                            <Speaker image={'https://i.ytimg.com/vi/5MjMUEi2pn8/maxresdefault.jpg'} firstName={'Mufti'} lastName={'Menk'}/>
                            <Speaker image={'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201908/Zakir-Naik-PTI.jpeg?VersionId=Vzj5OB46sWoaYW5mSfcpOgS6iWMGbYXI&size=690:388'} firstName={'Zaker'} lastName={'Naik'}/>
                            <Speaker image={'https://celebrays.com/wp-content/uploads/2023/11/Nouman-Ali-Khan-1-768x1024.webp'} firstName={'Nouman'} lastName={'Ali Khan'}/>
                            <Speaker image={'https://imamsonline.com/wp-content/uploads/2015/10/hamza-yusuf.jpg'} firstName={'Hamza'} lastName={'Yusuf'}/>
                            <Speaker image={'https://islamicseminary.us/wp-content/uploads/2023/11/mail-3.png'} firstName={'Yasir'} lastName={'Qadhi'}/>
                            <Speaker image={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZQkm-nVwTkn1oY_B2opIwSUDO_MOlN92UCg&usqp=CAU'} firstName={'Omar'} lastName={'Suleiman'}/>
                            <Speaker image={'https://www.islamicity.org/wp-content/plugins/blueprint-timthumb/timthumb.php?src=http://media.islamicity.org/wp-content/uploads/2017/04/Yusuf_Estes.jpg&w=350&h=350'} firstName={'Yusuf'} lastName={'Estes'}/>
                            <Speaker image={'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Bilal_Philips.jpg/440px-Bilal_Philips.jpg'} firstName={'Bilal'} lastName={'Philips'}/>
                        </ScrollView>
                    </YStack>

                    <YStack>
                        <Text fontSize={20} fontWeight="bold">
                            Trending Podcasts
                        </Text>

                        <ScrollView mt={'$3'} space={'$4'} showsHorizontalScrollIndicator={false}>
                            <Podcast title={'Controversy - Marriage App - New Quran and TikTok Refutations'} speaker={'Nouman Ali Khan'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                            <Podcast title={'This book is NOT a new Quran'} speaker={'Zakir Naik'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                            <Podcast title={'Reviving Your Heart'} speaker={'Hamza Yusuf'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                            <Podcast title={'Life of the Prophet'} speaker={'Yasir Qadhi'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                            <Podcast title={'The Middle Path'} speaker={'Omar Suleiman'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                            <Podcast title={'Struggling with Sin'} speaker={'Suhaib Webb'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                            <Podcast title={'Understanding Islam'} speaker={'Bilal Philips'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                            <Podcast title={'Islam and Modernity'} speaker={'Tariq Ramadan'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                            <Podcast title={'The Path to Wisdom'} speaker={'Ahmad Deedat'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                            <Podcast title={'Finding Peace'} speaker={'Abdul Nasir Jangda'} image={"https://mymuslimincom.files.wordpress.com/2023/04/343539708_758348462500153_2932433872809281200_n.jpeg"} />
                        </ScrollView>
                    </YStack>
                </YStack>
            </ScrollView>
            <TouchableOpacity onPress={openEpisode} activeOpacity={0.9}>
                <CompactAudioPlayer edges={[]}/>
            </TouchableOpacity>
        </Stack>
    )
}

const HorizontalTabs = () => {
    return (
        <Tabs
            defaultValue="tab1"
            orientation="horizontal"
            flexDirection="column"
        >
            <Tabs.List
                scrollable={true}
            >
                <Tabs.Tab flex={1} value="tab1">
                    <SizableText fontFamily="$body">Recent</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value="tab2">
                    <SizableText fontFamily="$body">Topics</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value="tab3">
                    <SizableText fontFamily="$body">Authors</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value="tab4">
                    <SizableText fontFamily="$body">Episodes</SizableText>
                </Tabs.Tab>
            </Tabs.List>
            <Separator />
            <TabsContent value="tab1">
                <ScrollView horizontal={true} space={'$4'} showsHorizontalScrollIndicator={false}>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                </ScrollView>
            </TabsContent>

            <TabsContent value="tab2">
                <ScrollView horizontal={true} space={'$4'}>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                </ScrollView>
            </TabsContent>

            <TabsContent value="tab3">
                <ScrollView horizontal={true} space={'$4'}>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                </ScrollView>
            </TabsContent>

            <TabsContent value="tab4">
                <ScrollView horizontal={true} space={'$4'}>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                    <DemoCard width={230}/>
                </ScrollView>
            </TabsContent>
        </Tabs>
    )
}

const TabsContent = (props: TabsContentProps) => {
    return (
        <Tabs.Content
            // backgroundColor="$background"
            key="tab3"
            padding="$2"
            alignItems="center"
            justifyContent="center"
            flex={1}
            // borderColor="$background"
            // borderRadius="$2"
            // borderTopLeftRadius={0}
            // borderTopRightRadius={0}
            // borderWidth="$2"
            {...props}
        >
            {props.children}
        </Tabs.Content>
    )
}

export function DemoCard(props: CardProps) {
    return (
        <TouchableOpacity onPress={() => router.push('/episode/')}>
            <Card size="$4" bordered {...props} br={'$5'} overflow={'hidden'}>
                <XStack>
                    <Image
                        resizeMode="cover"
                        alignSelf="center"
                        w={'100%'}
                        height={200}
                        source={{
                            uri: 'data:image/jpeg;base64,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'
                        }}
                    />
                </XStack>
                <Card.Header padded pb={'$3'}>
                    <H5 lineHeight={'$4'}>Episode 01: Preparing for ramadan</H5>
                </Card.Header>
                <Card.Footer padded pt={0} f={1} >
                    <Avatar circular size="$3" mr={'$2'}>
                        <Avatar.Image src="https://i.ytimg.com/vi/5MjMUEi2pn8/maxresdefault.jpg" />
                        <Avatar.Fallback bc="red" />
                    </Avatar>
                    <Paragraph f={1} alignSelf={'center'}>Mufti Menk</Paragraph>
                    <PlayCircle size={'$3'} strokeWidth={1} color={'$color.purple'}/>
                </Card.Footer>

            </Card>
        </TouchableOpacity>
    )
}

const Speaker = ({ image, firstName, lastName}) => {
    return (
        <TouchableOpacity onPress={() => router.push('/speaker/')}>
            <YStack alignItems={'center'}>
                <Avatar circular size="$7" mb={'$3'}>
                    <Avatar.Image src={image} />
                    <Avatar.Fallback bc="red" />
                </Avatar>
                <Text fontSize={16} fontWeight={'500'}>
                    {firstName}
                </Text>
                <Text fontSize={16} fontWeight={'500'}>
                    {lastName}
                </Text>
            </YStack>
        </TouchableOpacity>

    )
}

export const Podcast = ({ title, speaker, image, episode }) => (
    <TouchableOpacity onPress={() => episode ? router.push('/series/') : router.push('/speaker/') }>
        <XStack
            gap="$3"
            alignItems="center"
            borderRadius="$3"
        >
            <Image
                src={image}
                height={80}
                aspectRatio={1}
                borderRadius={'$3'}
                overflow={'hidden'}
                resizeMode="cover"
            />
            <YStack f={1} justifyContent="center" space="$2">
                <H4 lineHeight="$4" fontWeight="bold" numberOfLines={2}>{title}</H4>
                <Text fontSize={'$5'}>{speaker}</Text>
            </YStack>
            <YStack justifyContent="center" padding="$2">
                <PlayCircle size="$4" strokeWidth={1} color={'$color.purple'}/>
            </YStack>
        </XStack>
    </TouchableOpacity>

)
