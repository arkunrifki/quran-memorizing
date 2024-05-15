import { useContext, createContext, useReducer, useEffect } from "react";
import { TikrarDuration } from "../../utils/constants";
import { VISIBILITY_MODE } from "../../utils/enums";
import { useUserData } from "../UserDataContext";

const MushafContext = createContext({});

const initialMushafState = {
  count: 0,
  maxCount: 40,
  counterRound: 0,
  duration: TikrarDuration[0].ms,
  selectedAyah: null,
  remainingDuration: 0,
  // iddle | running
  timerState: "iddle",
  tikrarMethod: "count",
  // Normal Setting
  ayahVisibility: VISIBILITY_MODE[1],
  visibilityMode: VISIBILITY_MODE[0],
  // --First Word Development--
  // visibilityMode: VISIBILITY_MODE[1]
  // Invisible Development
  // visibilityMode: VISIBILITY_MODE[2]
  // --------------------------
  content: {
    juz: null,
    verses: [],
  },
};

const MushafStateReducer = (state, { action, payload }) => {
  switch (action) {
    case "ADD_COUNT":
      return {
        ...state,
        count: state.count === Number(state.maxCount) ? 0 : state.count + 1,
        ...(Number(state.maxCount) === state.count && {
          counterRound: state.counterRound + 1,
        }),
      };
    case "RESET_COUNT":
      return {
        ...state,
        count: 0,
        counterRound: 0,
      };

    case "TOGGLE_TIMER_STATE":
      return {
        ...state,
        timerState: state.timerState === "iddle" ? "running" : "iddle",
      };
    case "RESET_REMAINING_DURATION":
      return {
        ...state,
        timerState: "iddle",
      };

    case "TOGGLE_VIEW_MODE":
      // START – USED DURING DEVELOPMENT
      // const currentIndex = VISIBILITY_MODE.indexOf(state.visibilityMode);
      // const newIndex =
      //   currentIndex === VISIBILITY_MODE.length - 1 ? 0 : currentIndex + 1;
      // return {
      //   ...state,
      //   visibilityMode: VISIBILITY_MODE[newIndex],
      // };
      // END – USED DURING DEVELOPMENT
      return {
        ...state,
        visibilityMode:
          state.visibilityMode === "all" ? state.ayahVisibility : "all",
      };
    case "SET_PERSONALIZATION_DATA":
      return {
        ...state,
        tikrarMethod: payload.tikrarMethod,
        ayahVisibility: payload.ayahVisibility,
        ...(payload.tikrarMethod === "duration" && {
          duration: TikrarDuration.find(
            (item) => item.value === payload.tikrarMethodImplementation
          ).ms,
          remainingDuration: TikrarDuration.find(
            (item) => item.value === payload.tikrarMethodImplementation
          ).ms,
        }),
        ...(payload.tikrarMethod === "count" && {
          maxCount: payload.tikrarMethodImplementation,
        }),
      };
    case "SET_SELECTED_AYAH":
      return {
        ...state,
        selectedAyah: payload,
      };
    case "SET_ACTIVE_CONTENT":
      return {
        ...state,
        content: payload,
      };
    default:
      return state;
  }
};

export const MushafProvider = ({ children }) => {
  const [mushafState, dispatch] = useReducer(
    MushafStateReducer,
    initialMushafState
  );
  const { userDataState } = useUserData();

  useEffect(() => {
    if (userDataState["personalization"]) {
      dispatch({
        action: "SET_PERSONALIZATION_DATA",
        payload: userDataState["personalization"],
      });
    }
  }, [userDataState]);

  return (
    <MushafContext.Provider value={{ mushafState, dispatch }}>
      {children}
    </MushafContext.Provider>
  );
};

export const useMushafState = () => {
  const context = useContext(MushafContext);
  return context;
};
