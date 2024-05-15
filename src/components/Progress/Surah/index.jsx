import { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native'
import { SurahItems } from 'utils/constants';
import { useUserData } from 'context/UserDataContext'

import ProgressSurahItem from './Item'

const renderList = (surah, active, setActive, navigation) => <ProgressSurahItem
        surah={surah}
        activeSurah={active}
        setActiveSurah={setActive}
        navigation={navigation}
    />

const generateSurahNameAliases = (surahName) => {
    const surahNameLower = String(surahName).toLowerCase()
    return [
        surahNameLower,
        surahNameLower.replace('-',''),
        surahNameLower.replace('-', ' '),
        surahNameLower.replace(/'/g, ''),
    ]
}

const SurahProgressList = ({
    sortParam = 'number',
    search = null,
    navigation,
}) => {
    const [surahList,setSurahList] = useState([]);
    const {userDataState} = useUserData()
    const [activeSurah,setActiveSurah] = useState(null)

    useEffect(() => {
        if (userDataState?.memorized?.surah) {
            let newSurahList = SurahItems.reduce((acc,cur) => {
                const memorized = 
                    userDataState.memorized.surah[cur.no] ?
                        userDataState.memorized.surah[cur.no].length : 0
                return [
                    ...acc,
                    {
                        ...cur,
                        memorized,
                    }
                ]
            }, [])
            if (sortParam && sortParam === 'progress') {
                newSurahList = newSurahList.reduce((acc,cur) => {
                    if (cur.memorized > 0) {
                        acc.memorized.push(cur)
                    } else {
                        acc.unmemorized.push(cur)
                    }
                    return acc
                }, {
                    memorized: [],
                    unmemorized: []
                })
                newSurahList = [
                    ...newSurahList.memorized,
                    ...newSurahList.unmemorized,
                ]
            }
            setSurahList(newSurahList)
        } else {
            setSurahList(SurahItems)
        }
    },[userDataState, sortParam])

    return (
        <View style={{ backgroundColor: '#FFFFFF'}}>
            <FlatList
                data={!search
                    ? surahList
                    : surahList.filter(
                        surah => {
                            const aliases = generateSurahNameAliases(surah.name)
                            return aliases.some(alias => alias.includes(search.toLowerCase()))
                        })}
                renderItem={surah => renderList(surah, activeSurah, setActiveSurah, navigation)}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default SurahProgressList;