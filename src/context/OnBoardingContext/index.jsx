import {
    useContext,
    createContext,
    useReducer
} from 'react'

const OnBoardingContext = createContext({})

const OnBoardingStateReducer = (state,
    {
        action,
        payload
    }) => {
        switch (action) {
            case 'ADD_JUZ':
                return {
                    ...state,
                    memorized: {
                        ...state.memorized,
                        surah: [],
                        juz: [...state.memorized.juz, payload]
                    },
                }
            case 'ADD_BULK_JUZ':
                return {
                    ...state,
                    memorized: {
                        ...state.memorized,
                        surah: [],
                        juz: [...state.memorized.juz, ...payload]
                    }
                }
            case 'REMOVE_JUZ':
                return {
                    ...state,
                    memorized: {
                        ...state.memorized,
                        juz: state.memorized.juz.filter(juz => juz !== payload)
                    },
                }
            case 'ADD_ALL_AYAH_IN_SURAH':
                return {
                    ...state,
                    memorized: {
                        ...state.memorized,
                        juz: [],
                        surah: [
                            ...state.memorized.surah.filter((item) => !item.includes(`${payload.numberOfSurah}:`)),
                            ...Array.from({ length: payload.numberOfAyah }, (_, i) => i + 1)
                            .map((ayah) => {
                                return `${payload.numberOfSurah}:${ayah}`
                            })
                        ]
                    }
                }
            case 'REMOVE_ALL_AYAH_IN_SURAH':
                const newState = {
                    ...state,
                    memorized: {
                        ...state.memorized,
                        juz: [],
                        surah: state.memorized.surah.filter(surah => !surah.includes(`${payload.numberOfSurah}:`))
                    }
                }
                return newState;
            case 'ADD_ONE_AYAH_IN_SURAH':
                return {
                    ...state,
                    memorized: {
                        juz: [],
                        surah: [
                            ...state.memorized.surah,
                            `${payload.numberOfSurah}:${payload.numberOfAyah}`,
                        ]
                    }
                }
            case 'REMOVE_ONE_AYAH_IN_SURAH':
                return {
                    ...state,
                    memorized: {
                        juz: [],
                        surah: state.memorized.surah.filter(surah => surah !== `${payload.numberOfSurah}:${payload.numberOfAyah}`),
                    }
                }
            case 'SET_MULTIPLE_SURAH_AND_AYAH':
                return {
                    ...state,
                    memorized: {
                        juz: [],
                        surah: payload
                    }
                }
            case 'SET_PERSONALIZATION':
                return {
                    ...state,
                    personalization: {
                        ...state.personalization,
                        [payload.field]: payload.value
                    }
                }
            case 'SET_ONBOARDING_STATUS':
                return {
                    ...state,
                    initialUsage: payload,
                }
            case 'SET_USER_DATA': 
                return {
                    ...payload,
                }
            case 'RESET_ONBOARDING_DATA':
                return {
                    ...state,
                    memorized: {
                        juz: [],
                        surah: [],
                    }
                }
            case 'ADD_ALL_JUZ':
                return {
                    ...state,
                    memorized: {
                        surah: [],
                        juz: [...Array.from({ length: 30 }, (_, i) => `juz${i + 1}`)]
                    }
                }
            case 'REMOVE_ALL_JUZ':
                return {
                    ...state,
                    memorized: {
                        juz: [],
                        surah: [],
                    }
                }
        }
    }

export const OnBoardingProvider = ({ children }) => {
    const [onBoardingState, dispatch] = useReducer(
        OnBoardingStateReducer,
        {
            personalization: {
                ayahVisibility: 'firstWord',
                tikrarMethod: 'count',
                tikrarMethodImplementation: 10,
            },
            memorized: {
                juz: [],
                surah: []
            }
        }
    )

    return (
        <OnBoardingContext.Provider
            value={{
                onBoardingState,
                dispatch
            }}
            >
            {children}
        </OnBoardingContext.Provider>
    )
}

export const useOnBoardingState = () => {
    const context = useContext(OnBoardingContext)
    return context
}