import { configureStore, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Timer } from "../types/timer";

// Helper functions for localStorage
const loadTimersFromLocalStorage = (): Timer[] => {
  const savedTimers = localStorage.getItem("timers");
  return savedTimers ? JSON.parse(savedTimers) : [];
};

const saveTimersToLocalStorage = (timers: Timer[]) => {
  localStorage.setItem("timers", JSON.stringify(timers));
};

const initialState = {
  timers: loadTimersFromLocalStorage(),
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    addTimer: (state, action) => {
      const newTimer = {
        ...action.payload,
        id: crypto.randomUUID(),
        remainingTime: action.payload.duration, // Set remainingTime equal to duration
        createdAt: Date.now(),
      };
      state.timers.push(newTimer);
      saveTimersToLocalStorage(state.timers); // Save to localStorage
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter(
        (timer) => timer.id !== action.payload
      );
      saveTimersToLocalStorage(state.timers); // Save to localStorage
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
      }
      saveTimersToLocalStorage(state.timers); // Save to localStorage
    },
    updateTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer && timer.isRunning) {
        timer.remainingTime -= 1;
        timer.isRunning = timer.remainingTime > 0;
      }
      saveTimersToLocalStorage(state.timers); // Save to localStorage
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
      }
      saveTimersToLocalStorage(state.timers); // Save to localStorage
    },
    editTimer: (state, action) => {
      const timer = state.timers.find(
        (timer) => timer.id === action.payload.id
      );
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
      }
      saveTimersToLocalStorage(state.timers); // Save to localStorage
    },
  },
});

const store = configureStore({
  reducer: timerSlice.reducer,
});

export { store };

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  updateTimer,
  restartTimer,
  editTimer,
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, "id" | "createdAt">) =>
      dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: (id: string) => dispatch(updateTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) =>
      dispatch(editTimer({ id, updates })),
  };
};
