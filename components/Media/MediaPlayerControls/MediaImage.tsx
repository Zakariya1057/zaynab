import {Image} from "tamagui";
import {ImageSourcePropType} from "react-native";

export default function ({ image }: { image: ImageSourcePropType }) {
    return (
        <Image source={image}
               resizeMode={'cover'}
               height={'50%'}
               width={'100%'}
               alignSelf={'center'}
               borderRadius={'$5'}
        />
    )
}