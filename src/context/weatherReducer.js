import { GET_WEATHER, SET_LOADING } from "./types";

const handlers = {
  [GET_WEATHER]: (state, { payload }) => ({
    ...state,
    weather: payload,
    loading: false,
    clear: false,
  }),
  [SET_LOADING]: (state) => ({ ...state, loading: true }),
  DEFAULT: (state) => state,
};

const weatherReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};

export default weatherReducer;
