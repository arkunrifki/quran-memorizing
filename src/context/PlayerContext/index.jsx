import * as React from 'react'

const PlayerContext = React.createContext()

const initialState = {
    playlist: [],
    delay: 0,
    // stopped || playing || paused
    status: 'stopped',
    currentIndex: 0,
    currentIteration: 1,
    loop: 1,
    rawData: {}
}

const PlayerReducer = (state, { type, payload }) => {
    switch (type) {
        case 'SET_PLAYLIST':
            return {
                ...state,
                currentIndex: 0,
                loop: 1,
                playlist: payload
            }
        case 'SET_ALL_PLAYER_DATA':
            const {
                playlist,
                delay = 0,
                status,
                loop = 1,
                index = 0,
            } = payload
            return {
                ...state,
                playlist,
                delay,
                status,
                loop,
                currentIndex: index,
            }
        case 'PLAY_AUDIO':
            return {
                ...state,
                status: 'playing'
            }
        case 'PAUSE_AUDIO':
            return {
                ...state,
                status: 'paused'
            }
        case 'STOP_AUDIO':
            return {
                ...state,
                status: 'stopped',
                currentIndex: 0,
                currentIteration: 1,
            }
        case 'PLAY_NEXT':
            return {
                ...state,
                currentIndex: payload.index,
            }
        case 'INCREASE_CURRENT_ITERATION':
            return {
                ...state,
                currentIteration: state.currentIteration + 1,
            }
        case 'DECREMENT_LOOP':
            return {
                ...state,
                loop: state.loop - 1,
            }
        case 'SET_RAW_DATA':
            return {
                ...state,
                rawData: payload,
            }
    }
}

export default PlayerProvider = ({ children }) => {
    const [playerState, dispatch] = React.useReducer(PlayerReducer, initialState)
    return (
        <PlayerContext.Provider
            value={{
                playerState,
                dispatch,
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayerProvider = () => {
    const context = React.useContext(PlayerContext)
    return context
}