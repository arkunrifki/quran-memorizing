import { View, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

const HomepagePrimaryPercentage = ({
    style = {},
    surah = '',
    memorized = 0,
    total = 0,
    navigation,
    page,
}) => {
    const navigateToSurah = (target) => {
        if (typeof target !== 'number') return
        navigation.navigate('Mushaf', { pageIndex: Number(target) })
    }
    return (
        <TouchableOpacity
            onPress={() => navigateToSurah(page)}
        >
            <View
                style={{
                    ...style,
                }}
            >
                <Text style={{ fontSize: 32, fontWeight: 'bold'}}>{surah}</Text>
                <View
                    style={{
                        height: 8,
                        width: '100%',
                        backgroundColor: '#EAEAEA',
                        borderRadius: 999,
                        marginTop: 8,
                        borderWidth: 1,
                        borderColor: '#EEEEEE'
                    }}
                >
                    <View
                        style={{ height: '100%', width: `${(memorized/total)*100}%`, borderRadius: 999}}
                    >
                        <LinearGradient
                            colors={['#26E065', '#13A355']}
                            style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: 999,
                            }}
                            end={{
                                x: 1,
                                y: 1,
                            }}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{ fontSize: 14 }}>
                        {`${memorized} ayat dari ${total} ayat surat ${surah}`}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold'}}>
                        {`${Math.floor((memorized/total) * 100)}%`}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default HomepagePrimaryPercentage;