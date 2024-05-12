import {Text, XStack, YStack} from "tamagui";
import {Switch} from "react-native";
import React from "react";

// Define an interface for the component props
interface SettingToggleProps {
    label: string;
    onValueChange: (newValue: boolean) => void;
    value: boolean;
    description?: string; // Marked as optional since it can be undefined
}

// Update the function component to use the defined TypeScript interface
const SettingToggle: React.FC<SettingToggleProps> = ({ label, onValueChange, value, description }) => {
    return (
        <XStack>
            <YStack f={1} gap={'$2'}>
                <Text fontSize="$5">{label}</Text>
                {description && (
                    <Text fontSize="$4" color="rgba(255, 255, 255, 0.9)">
                        {description}
                    </Text>
                )}
            </YStack>
            <Switch value={value} onValueChange={onValueChange} trackColor={{ false: 'rgba(255,255,255,0.2)' }}/>
        </XStack>
    );
}

export default SettingToggle;
