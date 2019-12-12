import { IAction, IStore } from 'src/interfaces'

export const createStore = (store: IStore) => {
  let state = store.state
  return {
    dispatch: async (action: IAction, payload: any) => {
      state = store.reducer[action](state, payload)
    },
    getState: (): typeof state => state
  }
}
