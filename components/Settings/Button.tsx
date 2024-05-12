import {Button} from "tamagui";
import React from "react";

export default function ({title, onPress}) {
    return (
        <Button onPress={onPress} fontSize={'$4'}>{title}</Button>
    )
}