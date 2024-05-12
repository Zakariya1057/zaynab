import React, {useState, useEffect} from 'react';
import {Input, Button, Text, YStack, View, ScrollView} from 'tamagui';
import {Switch} from 'react-native';
import CompactAudioPlayer from "@/components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";

const SettingsSection = ({title, children}) => (
    <View backgroundColor="$backgroundContrast" borderRadius="$4">
        <Text fontSize="$6" px="$4" py={'$3'} fontWeight="bold" backgroundColor={'$background'}>{title}</Text>

        <YStack gap="$4" px="$4" my={'$5'}>
            {children}
        </YStack>
    </View>
);

const SettingsToggle = ({label, onValueChange, value}) => (
    <YStack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text fontSize="$5">{label}</Text>
        <Switch value={value} onValueChange={onValueChange} trackColor={{false: 'rgba(255,255,255,0.2)'}}/>
    </YStack>
);

const SettingsInfo = ({label, value}) => (
    <View flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text fontSize="$5">{label}</Text>
        <Text fontSize="$5">{value}</Text>
    </View>
);

const SettingsButton = ({title, onPress}) => (
    <Button onPress={onPress} fontSize={'$4'}>{title}</Button>
);

const SettingsPage = () => {
    const [downloadSize, setDownloadSize] = useState(false);
    const [downloadNewSeries, setDownloadNewSeries] = useState(true);
    const [deleteAfterDownload, setDeleteAfterDownload] = useState(false);
    const [smartDownloads, setSmartDownloads] = useState(true);
    const [reminder, setReminder] = useState(false);
    const [totalDownloadsSize, setTotalDownloadsSize] = useState('0 MB');
    const [totalCacheSize, setTotalCacheSize] = useState('0 MB');

    useEffect(() => {
        fetchTotalSizes();
    }, []);

    const fetchTotalSizes = async () => {
        // Simulate fetching sizes
        const downloadsSize = await fetchDownloadsSize();
        const cacheSize = await fetchCacheSize();
        setTotalDownloadsSize(downloadsSize);
        setTotalCacheSize(cacheSize);
    };

    const fetchDownloadsSize = () => {
        // Replace with actual logic to fetch the size of all downloads
        return Promise.resolve('350 MB');
    };

    const fetchCacheSize = () => {
        // Replace with actual logic to fetch the size of the cache
        return Promise.resolve('150 MB');
    };

    const clearDownloads = () => {
        // Replace with actual logic to clear all downloads
        console.log('Downloads cleared');
        setTotalDownloadsSize('0 MB');
    };

    const clearCache = () => {
        // Replace with actual logic to clear the cache
        console.log('Cache cleared');
        setTotalCacheSize('0 MB');
    };

    return (
        <>
            <ScrollView flex={1}>
                <SettingsSection title="Downloads">
                    <SettingsToggle label="Limit download size" value={downloadSize} onValueChange={setDownloadSize}/>
                    <SettingsToggle label="Automatically download new series" value={downloadNewSeries}
                                    onValueChange={setDownloadNewSeries}/>
                    <SettingsToggle label="Delete after watching" value={deleteAfterDownload}
                                    onValueChange={setDeleteAfterDownload}/>
                    <SettingsToggle label="Enable smart downloads" value={smartDownloads}
                                    onValueChange={setSmartDownloads}/>
                </SettingsSection>

                <SettingsSection title="Storage">
                    <SettingsInfo label="Total Downloads Size" value={totalDownloadsSize}/>
                    <Button onPress={clearDownloads} fontSize={'$4'}>Delete Downloads</Button>
                </SettingsSection>

                <SettingsSection title="Notifications">
                    <SettingsToggle label="Reminder to complete episode" value={reminder} onValueChange={setReminder}/>
                </SettingsSection>

                <SettingsSection title="Feedback & Support">
                    <SettingsButton title="Contact Us" onPress={() => console.log('Contact Us')}/>
                    <SettingsButton title="Submit Feedback" onPress={() => console.log('Feedback')}/>
                    <SettingsButton title="Report Bugs" onPress={() => console.log('Report Bugs')}/>
                </SettingsSection>

                <SettingsSection title="About">
                    <Text fontSize="$5">App Version: 1.0.0</Text>
                    <Text fontSize="$5">Developed by: Zakariya Mohummed</Text>
                </SettingsSection>
            </ScrollView>
            <CompactAudioPlayer/>
        </>
    );
};

export default SettingsPage;
