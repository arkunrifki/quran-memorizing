import { Text, Animated, TouchableOpacity } from "react-native"
import { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import FindSurah from "../Modal/FindSurah";

import TikrarCount from "../Tikrar/Count";
import TikrarDuration from "../Tikrar/Duration";
import { useMushafState } from "context/MushafContext";

const MushafTopMenu = ({ top = 0, navigation }) => {
    const { mushafState } = useMushafState()
    const [searchSurahVisible, setSearchSurahVisible] = useState(false)

    const navigateToSurah = (target) => {
        if (!target || !target.hasOwnProperty('page')) setSearchSurahVisible(false)
        return navigation.setParams({
            pageIndex: Number(target?.page)
        })
    }
    return (
        <>
            <FindSurah
                visible={searchSurahVisible}
                setVisibility={setSearchSurahVisible}
                navigateToSurah={navigateToSurah}
            />
            <Animated.View
                style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: top,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    zIndex: 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <TouchableOpacity
                    style={{
                        paddingRight: 12,
                        borderRightWidth: 1,
                        borderRightColor: '#E6E6E6'
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                {
                    mushafState.tikrarMethod === 'count' && (
                        <TikrarCount />
                    )
                }
                {
                    mushafState.tikrarMethod === 'duration' && (
                        <TikrarDuration durationTarget={mushafState.duration} />
                    )
                }
                <TouchableOpacity
                    style={{
                        padding: 8,
                        borderWidth: 1,
                        borderColor: '#e0e0e0',
                        borderRadius: 4,
                    }}
                    onPress={() => setSearchSurahVisible(!searchSurahVisible)}
                >
                    <FontAwesome name="search" size={16} color="#8f8f8f" />
                </TouchableOpacity>
            </Animated.View>
        </>
    )
}

export default MushafTopMenu;