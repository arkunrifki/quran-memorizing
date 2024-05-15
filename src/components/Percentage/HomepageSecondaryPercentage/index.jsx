import { Text, View, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { showMessage } from 'react-native-flash-message';

const HomepageSecondaryPercentage = ({ style, memorized, total, juz, navigation }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                const target = juz.split(' ')[1]
                if (Number(target) !== 30) {
                    showMessage({
                        message: "Halaman yang diminta belum tersedia saat ini.",
                        type: 'warning',
                        color: '#472a00'
                    });
                    return null
                } else return navigation.navigate('Mushaf', { pageIndex: 22 })
            }}
            style={{
                ...style,
                paddingRight: 16,
            }}
        >
            <Text style={{ fontSize: 20, fontWeight: 'bold'}}>{juz}</Text>
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
                            borderRadius: 999
                        }}
                        end={{
                            x: 1,
                            y: 1,
                        }}
                    />
                </View>
            </View>
            <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12}}>
                {`${memorized} ayat dari ${total} ayat ${juz}`}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold'}}>
                {`${Math.floor((memorized/total) * 100)}%`}
            </Text>
            </View>
        </TouchableOpacity>
    )
}

export default HomepageSecondaryPercentage;