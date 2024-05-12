import {Text, View} from "tamagui";
import React from "react";

export default function ({label, value}) {
    return (
        <View flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text fontSize="$5">{label}</Text>
            <Text fontSize="$5">{value}</Text>
        </View>
    )
}