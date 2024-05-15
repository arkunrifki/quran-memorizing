import { Text, View, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { showMessage } from 'react-native-flash-message'

const ProgressJuzItem = ({ juz, navigation }) => {
    const memorized = juz.item.memorized ?? 0
    
    const navigateToSurah = (target) => {
        if (!target) return null
        const juzNo = Number(target.replace(/^juz/,''))
        if (juzNo !== 30) return showMessage({
            message: "Halaman yang diminta belum tersedia saat ini.",
            type: 'warning',
            color: '#472a00'
        });
        navigation.navigate('Mushaf', {
            pageIndex: 22
        })
    }

    return (
        <TouchableOpacity
            onPress={() => navigateToSurah(juz?.item?.id)}
        >
            <View
                style={{
                    marginBottom: 8,
                    padding: 12,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: '#F0F0F0',
                    borderRadius: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            marginRight: 2,
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#3F4043',
                        }}
                    >
                        {juz.item.label}
                    </Text>
                </View>
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
                    style={{ height: '100%', width: `${(memorized/juz.item.numberOfAyah)*100}%`, borderRadius: 999}}
                >
                    <LinearGradient
                        colors={['#26E065', '#13A355']}
                        style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 999
                        }}
                        end={{
                            x: 1,
                            y: 1,
                        }}
                    />
                </View>
            </View>
            <View style={{ marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                        {memorized}
                    </Text>
                    <Text style={{ fontSize: 12, marginLeft: 3 }}>
                        ayat dari
                    </Text>
                    <Text style={{ fontSize: 12, marginLeft: 3 }}>
                        {juz.item.numberOfAyah}
                    </Text>
                    <Text style={{ fontSize: 12, marginLeft: 3 }}>
                        ayat
                    </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 16, color: '#3F4043', fontWeight: 'bold'}}>
                        {Math.floor((memorized/juz.item.numberOfAyah) * 100)}%
                    </Text>
                </View>
            </View>
            </View>
        </TouchableOpacity>
    )
}

export default ProgressJuzItem;