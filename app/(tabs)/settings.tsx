import {ScrollView} from 'tamagui';
import CompactAudioPlayer from "@/components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import About from "@/components/Settings/About/About";
import Notifications from "@/components/Settings/Notification/Notifications";
import Storage from "@/components/Settings/Storage/Storage";
import Downloads from "@/components/Settings/Download/Downloads";
import Feedback from "@/components/Settings/Feedback/Feedback";


const SettingsPage = () => {
    return (
        <>
            <ScrollView flex={1}>
                <Downloads />

                <Storage />

                <Notifications />

                <Feedback />

                <About />
            </ScrollView>
            <CompactAudioPlayer/>
        </>
    );
};

export default SettingsPage;
