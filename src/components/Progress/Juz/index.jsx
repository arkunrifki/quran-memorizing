import { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native'
import { JuzItems } from 'utils/constants'

import ProgressJuzItem from './Item'
import { useUserData } from 'context/UserDataContext'

const renderList = (juz, navigation) => <ProgressJuzItem juz={juz} navigation={navigation} />

const JuzProgressList = ({
    sortParam = 'number',
    navigation,
}) => {
    const [juzList,setJuzList] = useState([])
    const { userDataState } = useUserData()

    useEffect(() => {
        if (userDataState?.memorized?.juz) {
            let newJuzList = JuzItems.reduce((acc,cur) => {
                const memorized =
                    userDataState.memorized.juz[cur.id.replace(/^juz/,'')] || 0
                return [
                    ...acc,
                    {
                        ...cur,
                        memorized,
                    }
                ]
            },[])
            if (sortParam && sortParam === 'progress' ) {
                newJuzList = newJuzList.reduce((acc,cur) => {
                    if (cur.memorized > 0) {
                        acc.memorized.push(cur)
                    } else {
                        acc.unmemorized.push(cur)
                    }
                    return acc
                }, {
                    memorized: [],
                    unmemorized: [],
                })
                newJuzList = [
                    ...newJuzList.memorized,
                    ...newJuzList.unmemorized
                ]
            }
            setJuzList(newJuzList)
        } else {
            setJuzList(JuzItems)
        }
    },[userDataState, sortParam])

    return (
        <View style={{ backgroundColor: '#FFFFFF'}}>
            <FlatList
                data={juzList}
                renderItem={item => renderList(item, navigation)}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default JuzProgressList;