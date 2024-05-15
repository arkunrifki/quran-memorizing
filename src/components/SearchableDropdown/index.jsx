import { FlatList, TextInput, TouchableOpacity, View, Text, Pressable, Keyboard, TouchableWithoutFeedback, ScrollView } from "react-native"
import { useEffect, useRef, useState } from "react"
import { AntDesign } from '@expo/vector-icons';

const dummyOptions = [
    {
        label: 'Option 1',
        value: 'option1',
    },
    {
        label: 'Option 2',
        value: 'option2',
    },
    {
        label: 'Option 3',
        value: 'option3',
    },
    {
        label: 'Option 4',
        value: 'option4',
    },
    {
        label: 'Option 5',
        value: 'option5',
    },
    {
        label: 'Option 6',
        value: 'option6',
    }
]

const SearchableDropdown = ({
    options = dummyOptions,
    value = null,
    onSelect = () => {},
    placeholder = 'Input Placeholder'
}) => {
    const [querying, setQuerying] = useState(false)
    const [searchQuery, setSearchQuery] = useState(null)
    const [showMenu, setShowMenu] = useState(false)
    const [availableOptions,setAvailableOptions] = useState(options)
    const [selectedValue, setSelectedValue] = useState(value)

    const queryRef = useRef(null)

    const handleQueryChange = (q) => {
        if (!q) return setSearchQuery(null)
        setSearchQuery(q)
    }

    useEffect(() => {
        if (searchQuery) {
            setAvailableOptions(
                options.filter((option) => {
                    return option.label.toLowerCase().includes(searchQuery.toLowerCase())
                })
            )
        } else {
            setAvailableOptions(options)
        }
    },[searchQuery])

    return (
        <View
            onPress={() => {
                setShowMenu(!showMenu)
            }}
        >
            <View
                style={{
                    position: 'relative'
                }}
            >
                <View
                    style={{
                        width: '100%',
                        height: 45,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#D1D1D1',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative'
                    }}
                >
                    {
                        querying ? (
                            <TextInput
                                ref={queryRef}
                                style={{
                                    flexGrow: 1,
                                    height: '100%',
                                    paddingLeft: 8,
                                    paddingVertical: 4,
                                }}
                                value={searchQuery}
                                onChangeText={handleQueryChange}
                                onFocus={() => {
                                    setShowMenu(true)
                                }}
                                onBlur={() => {
                                    setQuerying(false)
                                }}
                            />
                        ) : (
                            <Pressable
                                style={{ paddingLeft: 8, flexGrow: 1, height: '100%', justifyContent: 'center', borderRadius: 4 }}
                                onPress={() => new Promise((resolve) => {
                                    resolve(
                                        setQuerying(true)
                                    )
                                }).then(() => {
                                    queryRef.current.focus()
                                })}
                            >
                                <Text style={{ color: selectedValue && !showMenu ? 'black' : '#bdbdbd' }}>
                                    {selectedValue && !showMenu ? selectedValue.label : placeholder}
                                </Text>
                            </Pressable>
                        )
                    }
                    <TouchableOpacity
                        style={{
                            width: 40,
                            height:45,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => new Promise(resolve => {
                            resolve(
                                setShowMenu(!showMenu)
                            )
                        }).then(() => {
                            if (showMenu) {
                                Keyboard.dismiss()
                            }
                        })}
                    >
                        {showMenu ? (
                            <AntDesign name="caretup" size={14} color="#6b6b6b" />
                        ) : (
                            <AntDesign name="caretdown" size={14} color="#6b6b6b" />
                        )}  
                    </TouchableOpacity>
                </View>
                {
                    showMenu && availableOptions.length > 0 && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 42,
                                left: 0,
                                right: 0,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 4,
                                borderWidth: 1,
                                borderColor: '#D1D1D1',
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                maxHeight: 200,
                            }}
                        >
                            <FlatList
                                data={availableOptions}
                                contentContainerStyle={{
                                    flexGrow: 1,
                                }}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            style={{
                                                paddingVertical: 12,
                                                paddingHorizontal: 8,
                                                marginBottom: 4,
                                                borderRadius: 4,
                                                backgroundColor:
                                                    item.disabled ? '#f5f5f5' : selectedValue && selectedValue.value === item.value ? '#dbeaff' : '#FFFFFF',
                                            }}
                                            onPress={() => {
                                                if (!item.disabled) {
                                                    setSelectedValue(item)
                                                    onSelect(item.value)
                                                    setShowMenu(false)
                                                    setQuerying(false)
                                                    setSearchQuery(null)
                                                }
                                            }}
                                        >
                                            <Text style={{ color: item.disabled ? '#757575' : 'black' }}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    )
                }
            </View>
        </View>
    )
}

export default SearchableDropdown;