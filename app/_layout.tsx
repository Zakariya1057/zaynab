import {DarkTheme, ThemeProvider} from '@react-navigation/native'
import {router, SplashScreen, Stack, usePathname} from 'expo-router'
import {Platform, TouchableOpacity, useColorScheme} from 'react-native'
import {TamaguiProvider, Text} from 'tamagui'
import config from '../tamagui.config'
import {useFonts} from 'expo-font'
import React, {useEffect} from 'react'
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {ArrowLeft, Download} from "@tamagui/lucide-icons";
import Toast from 'react-native-toast-message';
import '@/utils/database/setup'
import {recordAudioPosition} from '@/utils/audio/record-audio-position'
import {DownloadProvider} from "@/contexts/download-context";
import {trackChangeAndSeekPosition} from "@/hooks/trackChangeAndSeekPosition";
import {setupPlayer} from "@/utils/track/setup-player";
import {initializeCache} from "@/utils/cache/episode-cache";
import {View} from 'react-native';
import {PopoverDemo} from "@/components/PopoverDemon";
import {AudioPlaybackProvider} from "@/hooks/useAudioPlayback";
import {prefetchLastPodcastTracks} from "@/utils/track/prefetch-last-podcast-tracks";
import {setAutoPlay} from "@/utils/track/auto-play";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [interLoaded, interError] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    })

    const { setupListener } = trackChangeAndSeekPosition()

    useEffect(() => {
        async function initApp() {
            await setupPlayer()
            await initializeCache()
            setupListener()

            await prefetchLastPodcastTracks()
        }

        initApp();
    }, []);

    recordAudioPosition()

    useEffect(() => {
        if (interLoaded || interError) {
            // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
            SplashScreen.hideAsync()
        }
    }, [interLoaded, interError])

    if (!interLoaded && !interError) {
        return null
    }

    return <RootLayoutNav/>
}

function RootLayoutNav() {
    const colorScheme = useColorScheme()

    return (
        <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
            <ThemeProvider value={DarkTheme}>
                <GestureHandlerRootView style={{flex: 1}}>
                    <DownloadProvider>
                        <AudioPlaybackProvider>
                            <Stack screenOptions={{
                                title: '',
                                animation: 'slide_from_right',
                                headerLeft: () =>
                                    <TouchableOpacity onPress={() => router.back()}>
                                        <ArrowLeft size={30} color={'$color'} strokeWidth={2}/>
                                    </TouchableOpacity>
                            }}
                            >
                                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                                <Stack.Screen name="series" options={{headerShown: false}}/>
                                <Stack.Screen name="notification.click" />
                            </Stack>
                            <Toast/>
                        </AudioPlaybackProvider>
                    </DownloadProvider>
                </GestureHandlerRootView>
            </ThemeProvider>
        </TamaguiProvider>
    )
}
