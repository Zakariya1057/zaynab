import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {Theme} from "../../constants";
import {ArrowLeft, Bookmark} from "@tamagui/lucide-icons";

interface Props {
    goBack: () => void
}

export default function ({ goBack }: Props) {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={goBack}>
                    <ArrowLeft size={30} color={'white'} />
                </TouchableOpacity>

                <View style={{ flex: 1}}/>

                <TouchableOpacity onPress={goBack}>
                    <Bookmark size={'$2'} color={'$color'}/>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
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
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 110
    },
})