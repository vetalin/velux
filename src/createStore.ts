import { IReducer, IState, IStore, ISubscribeStore, MakeReadOnly } from './interfaces'

export const createStore = <TState extends IState, TReducer extends IReducer<TState>>(store: IStore<TState, TReducer>) => {
  const {reducer, state: initialState} = store
  let state = initialState
  let initialListener: Function = () => {}
  return {
    dispatch: async<TAction extends keyof TReducer, TPayload extends Parameters<TReducer[TAction]>[1]>(action: TAction, payload: TPayload): Promise<void> => {
      const prevState = state
      const newState = await reducer[action](state, payload)
      initialListener(newState, prevState)
      state = newState
    },
    getState: (): MakeReadOnly<TState> => state,
    subscribe: (listener: ISubscribeStore) => {
      initialListener = listener
    }
  }
}
