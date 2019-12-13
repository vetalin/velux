import { IReducer, IState, IStore } from './interfaces'

export const createStore = <TState extends IState, TReducer extends IReducer<TState>>(store: IStore<TState, TReducer>) => {
  const {reducer, state: initialState} = store
  let state = initialState
  return {
    dispatch: async<TAction extends keyof TReducer, TPayload extends Parameters<TReducer[TAction]>[1]>(action: TAction, payload: TPayload) => {
      state = await reducer[action](state, payload)
    },
    getState: (): typeof state => state
  }
}
