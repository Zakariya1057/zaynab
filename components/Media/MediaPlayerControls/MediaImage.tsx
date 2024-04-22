import PlaceholderImage from '../../../assets/images/img_10.png'
import {Image} from "tamagui";

export default function () {
    return (
        <Image source={PlaceholderImage}
               resizeMode={'cover'}
               height={'42%'}
               aspectRatio={1}
               alignSelf={'center'}
               borderRadius={'$5'}
        />
    )
}