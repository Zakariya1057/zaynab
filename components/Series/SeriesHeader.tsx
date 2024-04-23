import React from 'react';
import {YStack, Text, Image, Button, useTheme, H1, H2} from 'tamagui';
import EpisodeHeader from './EpisodeHeader';
import { Play } from '@tamagui/lucide-icons'; // Ensure you have the correct icon import

export default function SeriesHeader({ image, title, description, play }: SeriesHeaderProps) {
    const theme = useTheme();
    const purple = theme.purple.get()

    return (
        <>
            <YStack>
                <YStack width="100%" aspectRatio={1}>
                    <Image src={image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    <YStack
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        justifyContent="center"
                        alignItems="center"
                        backgroundColor="rgba(0,0,0,0.6)"
                    />
                </YStack>
                <YStack
                    position="absolute"
                    alignSelf="center"
                    justifyContent="flex-end"
                    paddingHorizontal={'$4'} // Assuming $4 matches Theme.spacing.large in your theme
                    paddingBottom={'$4'}
                    space="$4" // Assuming you want to maintain a 20px gap similar to 'rowGap: 20'
                    bottom={0}
                    top={0}
                >
                    <H2
                        color="white"
                        textAlign="center"
                    >
                        {title}
                    </H2>

                    <Button
                        icon={<Play color={purple} fill={purple} size={'$1'} />} // Adjust the color according to your theme
                        onPress={play}
                        size="$4"
                        fontSize="$7" // Adjust based on your theme
                        width={'$12'}
                        alignSelf="center"
                        backgroundColor="rgba(0,0,0,0.60)"
                        borderColor={purple}
                        borderWidth={'$0.3'}
                    >
                        Play
                    </Button>

                    <Text
                        color="white"
                        fontSize={16} // Adjust based on your theme or use a direct value
                        numberOfLines={5}
                    >
                        {description}
                    </Text>
                </YStack>
            </YStack>
            <EpisodeHeader />
        </>
    );
}

// Define the props interface if not already done
interface SeriesHeaderProps {
    image: any; // Adjust the type to match your image source type, e.g., string for URI
    title: string;
    description: string;
    play: () => void;
}
