import { View, Text, TouchableOpacity, Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Quran from 'assets/Quran.png'
import { useEffect, useState } from 'react';
import { useUserData } from 'context/UserDataContext';
import { useIsFocused } from '@react-navigation/native'
import { SurahItems } from 'utils/constants';

const LastMemorizedBanner = ({
    style,
    navigation
}) => {
    const { userDataState } = useUserData()
    const { memorizationHistory } = userDataState
    const isFocused = useIsFocused()
    
    const [lastMemorized,setLastMemorized] = useState({
        surah: 'An-Nas',
        ayah: 1,
    })

    useEffect(() => {
        if (memorizationHistory && memorizationHistory.length > 0) {
            setLastMemorized({
                surah: memorizationHistory[0].surahName,
                ayah: memorizationHistory[0].ayahNumber,
            })
        }
    },[memorizationHistory, isFocused])

    const navigateToSurah = () => {
        if (!memorizationHistory || memorizationHistory?.length < 1) return navigation.navigate('Mushaf')
        const surahContent = SurahItems[String(
            Number(memorizationHistory[0].surahNumber) - 1
        )]
        if(!surahContent.hasOwnProperty('page')) return navigation.navigate('Mushaf')
        return navigation.navigate('Mushaf', {
            pageIndex: Number(surahContent?.page)
        })
    }

    return (
        <TouchableOpacity
            onPress={navigateToSurah}
        >
            <LinearGradient
                colors={['#1FD365', '#00B145']}
                style={{
                    ...style,
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                    borderRadius: 8,
                    marginTop: 16,
                    position: 'relative'
                }}
                start={{
                    x: 1,
                    y: 0,
                }}
                end={{
                    x: 1,
                    y: 1,
                }}
            >
                <View style={{ position: 'absolute', right: 0, bottom: 0, zIndex: 1, elevation: 1}}>
                    <Image source={Quran} />
                </View>
                <View style={{ position: 'relative', zIndex: 2, elevation: 2}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="bookmark" size={12} color="#FFFFFF" style={{ opacity: 0.75}} />
                        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '500', marginLeft: 4, opacity: 0.9 }}>Terakhir Dihafalkan</Text>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 28, color: '#FFFFFF', fontWeight: '600' }}>
                            {lastMemorized.surah}
                        </Text>
                        <Text style={{ fontSize: 20, color: 'rgba(255,255,255,0.75)' }}>
                            Ayat {lastMemorized.ayah}
                        </Text>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            // borderWidth: 1,
                            // borderRadius: 999,
                            // borderColor: 'rgba(255,255,255,0.9)',
                            // backgroundColor: 'rgba(255,255,255,0.8)',
                        }}
                    >
                        {/* <Text style={{ color: '#059669', fontWeight: '600', marginRight: 4}}>
                            Buka
                        </Text> */}
                        <FontAwesome name="angle-right" size={64} color="rgba(255,255,255,0.5)" style={{ marginTop: 1}} />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default LastMemorizedBanner;