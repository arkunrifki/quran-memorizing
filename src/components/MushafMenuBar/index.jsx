import { TouchableOpacity, View, Image, Animated } from 'react-native'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import tikrarPlus from 'assets/tikrarPlus.png'
import { useMushafState } from 'context/MushafContext';

const MushafMenuBar = ({ bottom = 13 }) => {
    const { dispatch } = useMushafState()

    const increaseCounter = () => {
        dispatch({
            action: 'ADD_COUNT',
        })
    }
    return (
        <Animated.View
            style={{
                width: '100%',
                height: 85,
                backgroundColor: '#FFFFFF',
                position: 'absolute',
                bottom: bottom,
                paddingHorizontal: 20,
                borderTopWidth: 1,
                borderTopColor: '#E0E0E0',
                paddingTop: 4,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ marginLeft: 0, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20}}>
                        <FontAwesome name="play" size={24} color="#A0A0A0" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 0, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20}}>
                        <FontAwesome name="cog" size={24} color="#A0A0A0" />
                    </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#1DC25D',
                        paddingLeft: 13,
                        paddingRight: 11,
                        paddingVertical: 12,
                        borderRadius: 999,
                        textAlign: 'center',
                    }}
                    onPress={increaseCounter}
                >
                    <Image source={tikrarPlus} style={{ width: 35, height: 32}}/>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <TouchableOpacity style={{ marginLeft: 0, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20}}>
                        <FontAwesome5 name="globe-asia" size={24} color="#A0A0A0" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 0, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20}}>
                        <FontAwesome name="eye" size={24} color="#A0A0A0" />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    )
}

export default MushafMenuBar;