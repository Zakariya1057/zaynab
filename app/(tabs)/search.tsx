import {Text, View, Input, Stack, ScrollView} from 'tamagui'
import {Search} from "@tamagui/lucide-icons";
import {Podcast} from "./index";

export default function () {
    return (
        <Stack flex={1} alignItems="center" p={'$3'}>
            <Input width={'100%'} placeholder={'Search'}/>

            <ScrollView mt={'$3'} space={'$3'} showsHorizontalScrollIndicator={false} width={'100%'}>
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
        </Stack>
    )
}
