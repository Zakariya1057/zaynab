import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Bookmark, Download } from '@tamagui/lucide-icons';
import { PopoverProps, Text, Separator } from 'tamagui';
import { Button, Popover, YStack, XStack, Adapt } from 'tamagui';

export function PopoverDemo() {
    return (
        <XStack space="$2" flex={1} justifyContent="center" alignItems="center">
            <Demo placement="bottom" Icon={() => <Entypo name="dots-three-vertical" size={24} color="white"/>} Name="bottom-popover"/>
        </XStack>
    );
}

export function Demo({
                         Icon,
                         Name,
                         ...props
                     }: PopoverProps & { Icon?: any; Name?: string }) {
    return (
        <Popover size="$5" allowFlip {...props}>
            <Popover.Trigger asChild>
                <TouchableOpacity>
                    <Icon/>
                </TouchableOpacity>
            </Popover.Trigger>

            <Adapt when="sm" platform="touch">
                <Popover.Sheet modal dismissOnSnapToBottom>
                    <Popover.Sheet.Frame padding="$4">
                        <Adapt.Contents/>
                    </Popover.Sheet.Frame>
                    <Popover.Sheet.Overlay enterStyle={{opacity: 0}} exitStyle={{opacity: 0}}/>
                </Popover.Sheet>
            </Adapt>

            <Popover.Content
                borderWidth={1}
                borderColor="$borderColor"
            >
                <Popover.Arrow borderWidth={1} borderColor="$borderColor"/>
                <YStack gap="$3">
                    <Option title="Download" icon={<Download size={25} color="white" strokeWidth={1.7}/>}/>
                    <Separator alignSelf="stretch"/>
                    <Option title="Delete Download" icon={<Ionicons name="trash-outline" size={25} color="white"/>}/>
                    <Separator alignSelf="stretch"/>
                    <Option title="Bookmark" icon={<Bookmark size={25} color="white"/>}/>
                </YStack>
            </Popover.Content>
        </Popover>
    );
}

function Option({ title, icon }) {
    return (
        <TouchableOpacity onPress={() => {}}>
            <XStack alignItems="center" justifyContent="space-evenly" >
                <Text fontSize="$4">{title}</Text>
                {icon}
            </XStack>
        </TouchableOpacity>
    );
}
