import {DarkTheme, ThemeProvider} from '@react-navigation/native'
import {router, SplashScreen, Stack, usePathname} from 'expo-router'
import {TouchableOpacity, useColorScheme} from 'react-native'
import {TamaguiProvider} from 'tamagui'
import config from '../tamagui.config'
import {useFonts} from 'expo-font'
import React, {useEffect} from 'react'
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {ArrowLeft} from "@tamagui/lucide-icons";
import Toast from 'react-native-toast-message';
import '@/utils/database/setup'
import {recordAudioPosition} from '@/utils/audio/record-audio-position'
import {DownloadProvider} from "@/contexts/download-context";
import {QueueProvider} from "@/contexts/queue-context";
import {trackChangeAndSeekPosition} from "@/hooks/trackChangeAndSeekPosition";
import {setupPlayer} from "@/utils/track/setup-player";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [interLoaded, interError] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    })

    trackChangeAndSeekPosition()
    recordAudioPosition()

    useEffect(() => {
        async function initApp() {
            await setupPlayer()
        }

        initApp();
    }, []);


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
                    <QueueProvider>
                        <DownloadProvider>
                            <Stack screenOptions={{
                                title: '',
                                animation: 'slide_from_right',
                                headerLeft: () =>
                                    <TouchableOpacity onPress={() => router.back()}>
                                        <ArrowLeft size={30} color={'$color'}/>
                                    </TouchableOpacity>
                            }}
                            >
                                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                                <Stack.Screen name="series" options={{headerShown: false}}/>
                                <Stack.Screen name="episode"/>
                            </Stack>
                            <Toast/>

                        </DownloadProvider>
                    </QueueProvider>
                </GestureHandlerRootView>
            </ThemeProvider>
        </TamaguiProvider>
    )
}
