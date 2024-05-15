import { useState } from 'react'
import { SafeAreaView, TouchableOpacity, StyleSheet, View, Text, TextInput } from "react-native"
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import { Fontisto, MaterialIcons } from '@expo/vector-icons'
import SurahProgressList from 'components/Progress/Surah'
import JuzProgressList from 'components/Progress/Juz'

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        paddingBottom: 40,
    }
})

const Tabs = [
    {
        label: 'Surah',
        value: 'surah',
    },
    {
        label: 'Juz',
        value: 'juz',
    }
]

const MemorizationProgress = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState(Tabs[0].value)
    const [searchQuery, setSearchQuery] = useState(null)
    const [sortParam, setSortParam] = useState('number')
    return (
        <>
            <View style={{ backgroundColor: '#FFFFFF', width: '100%', height: 48}} />
            <SafeAreaView style={{ backgroundColor: '#FFFFFF'}}>
                <View style={{...styles.container, height: activeTab === 'surah' ? '95%' : '98%'}}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4}} onPress={() => navigation.navigate('Homepage')}>
                        <Ionicons name="chevron-back-sharp" size={16} color="#969696" />
                        <Text style={{ fontSize: 16, marginLeft: 8, color: '#969696' }}>Halaman Utama</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row'}}>
                            {Tabs.map(tab => (
                                <TouchableOpacity
                                    key={tab.value}
                                    style={{
                                        paddingHorizontal: 20,
                                        paddingVertical: 8,
                                        borderRadius: 999,
                                        backgroundColor: activeTab === tab.value ? '#1DC25D' : '#FFFFFF',
                                        borderWidth: 1,
                                        borderColor: activeTab === tab.value ? '#A9DDBE' : '#F1F1F1',
                                        marginRight: 8,
                                        width: 86,
                                    }}
                                    onPress={() => setActiveTab(tab.value)}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: activeTab === tab.value ? '#FFFFFF' : '#8A8A8A',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 8,
                                    paddingLeft: 12,
                                    // borderWidth: 1,
                                    borderRadius: 999,
                                    // backgroundColor: '#FFFFFF',
                                    borderColor: '#F1F1F1'
                                }}
                                onPress={() => {
                                    setSortParam(sortParam === 'number' ? 'progress' : 'number')
                                }}
                            >
                                <FontAwesome name="sort-amount-desc" size={12} color="#717171" />
                                <Text style={{ marginLeft: 8, color: '#717171' }}>
                                    Berdasarkan {sortParam === 'number' ? 'Progress' : 'Nomor'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Search Input */}
                    {
                        activeTab === 'surah' && (
                            <View
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    backgroundColor: '#FFFFFF',
                                    marginTop: 12,
                                    borderWidth: 1,
                                    borderColor: '#D1D1D1',
                                    borderRadius: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Fontisto name="search" size={12} color="#797979" style={{ marginTop: 2}} />
                                    <TextInput
                                        style={{
                                            marginLeft: 8,
                                            width: '90%',
                                            marginVertical: -12,
                                            height: 40,
                                        }}
                                        placeholder="Ketik surat yang ingin dicari"
                                        value={searchQuery}
                                        onChangeText={(q) => {
                                            if (!q) return setSearchQuery(null)
                                            setSearchQuery(q)
                                        }}
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                                {
                                    searchQuery && (
                                        <TouchableOpacity
                                            style={{
                                                width: 40,
                                                height: 40,
                                                marginVertical: -40,
                                                marginHorizontal: -16,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onPress={() => setSearchQuery(null)}
                                        >
                                            <MaterialIcons name="highlight-remove" size={16} color="#797979" style={{ marginTop: 1}} />
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        )
                    }
                    {/* Surah Progress List */}
                    {activeTab === 'surah' && (
                        <View style={{ marginTop: 20, paddingBottom: 40, backgroundColor: '#FFFFFF' }}>
                             <SurahProgressList
                                search={searchQuery}
                                sortParam={sortParam}
                                navigation={navigation}
                            />
                        </View>
                    )}
                    {/* Juz Progress List */}
                    {activeTab === 'juz' && (
                        <View style={{ marginTop: 20, paddingBottom: 40, backgroundColor: '#FFFFFF' }}>
                            <JuzProgressList
                                sortParam={sortParam}
                                navigation={navigation}
                            />
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </>
    )
}

export default MemorizationProgress