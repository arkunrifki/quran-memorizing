import { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import MemorizationHistoryItem from './MemorizationHistoryItem';
import { useUserData } from 'context/UserDataContext'
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment';
import 'moment/locale/id'
moment.locale('id')

const MemorizationHistory = ({ navigation }) => {
    const { userDataState } = useUserData()
    const { memorizationHistory } = userDataState
    const [memorizationHistoryData,setMemorizationHistoryData] = useState([])
    const isFocused = useIsFocused()

    useEffect(() => {
        if (memorizationHistory?.length > 0) {
            setMemorizationHistoryData(memorizationHistory)
        }
    },[memorizationHistory,isFocused])

    return (
        <View style={{ marginTop: 24, paddingBottom: 50 }}>
            <Text style={{ fontSize: 18, color: '#333333', fontWeight: '500', marginBottom: 16 }}>
                Riwayat Hafalan Terakhir
            </Text>
            <View>
                {
                    memorizationHistoryData.length > 0 ? (
                        memorizationHistory.map((item,idx) => (
                            <MemorizationHistoryItem
                                surah={item.surahName}
                                ayah={item.ayahNumber}
                                memorizedAt={moment(item.memorizedAt).fromNow()}
                                key={idx} style={{ marginBottom: 8}}
                                navigation={navigation}
                                item={item}
                            />
                        ))
                    ) : (
                        <View
                            style={{
                                paddingVertical: 0,
                                borderRadius: 4,
                            }}
                        >
                            <Text style={{ color: '#4f4f4f' }}>Kamu belum memiliki riwayat hafalan.</Text>
                        </View>
                    )
                }
            </View>
        </View>
    )
}

export default MemorizationHistory;