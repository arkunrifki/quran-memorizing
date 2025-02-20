import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMushafState } from 'context/MushafContext';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 0,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        paddingLeft: 12,
        flexGrow: 1,
    }
})

const TikrarCount = () => {
    const { mushafState, dispatch } = useMushafState()

    const resetCounter = () => {
        return dispatch({
            action: 'RESET_COUNT',
        })
    }
    return (
            <View
                style={styles.container}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: '#FFFFFF',
                        flexGrow: 0,
                        width: 32,
                        height: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 4,
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                    }}
                    onPress={resetCounter}
                >
                    <MaterialIcons name="loop" size={20} color="#696969" />
                </TouchableOpacity>
                <View
                    style={{
                        height: 8,
                        backgroundColor: '#EAEAEA',
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: '#EEEEEE',
                        marginLeft: 8,
                        flexGrow: 7,
                    }}
                >
                    <View
                        style={{ height: '100%', width: `${(mushafState.count/mushafState.maxCount)*100}%`, borderRadius: 999}}
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
                <Text style={{ marginLeft: 8, flexGrow: 1 }}>{`${mushafState.count}/${mushafState.maxCount}`}</Text>
            </View>
    )
}

export default TikrarCount