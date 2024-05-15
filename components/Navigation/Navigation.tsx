import { StyleSheet, TouchableOpacity, View } from "react-native";
import { DownloadStatus } from "@/interfaces/download-status";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../constants";
import {ArrowLeft, CheckCircle, Download} from "@tamagui/lucide-icons";
import {Spinner} from "tamagui";
import {Ionicons} from "@expo/vector-icons"; // Correctly import icons

interface Props {
    goBack: () => void;
    download: () => void;
    downloadStatus: DownloadStatus|undefined;
}

const DownloadIcon = ({ status }) => {
    switch (status) {
        case DownloadStatus.CompletedDownload:
            return  <Ionicons name="cloud-done" size={30} color="white" strokeWidth={2}/>;
        case DownloadStatus.InProgress:
            return  <Download size={30} color={'white'} strokeWidth={2}/>
        case DownloadStatus.WaitingToDownload:
            return <Download size={30} color={'white'} strokeWidth={2}/>
        default:
            return null; // Default case to handle unexpected status
    }
};

export default function NavigationBar({ goBack, download, downloadStatus }: Props) {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={goBack} style={{ padding: 15, left: -20, top: -15}}>
                    <ArrowLeft size={30} color="white" strokeWidth={2}/>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <TouchableOpacity onPress={download} style={{ padding: 15, right: -15, top: -15}}>
                    <DownloadIcon status={downloadStatus}/>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.large,
        paddingVertical: 0,
        paddingBottom: 30,
    }
});
