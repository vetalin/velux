import { IAction, IReducer, IState, IStore } from 'src/interfaces'

export const createStore = (store: IStore, initialState: IState = {}) => {
  let state = initialState
  return {
    dispatch: async (action: IAction, payload: IReducer[typeof action]) => {
      state = store.reducer[action](state, payload)
    },
    getState: () => state
  }
}
