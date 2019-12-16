import { IReducer, IState, IStore, ISubscribeStore, MakeReadOnly } from './interfaces'
import { getSubscriber } from './subscriber'

export const createStore = <TState extends IState, TReducer extends IReducer<TState>>(store: IStore<TState, TReducer>) => {
  const {reducer, state: initialState} = store
  let state = initialState
  const { getInitialListener, subscribe } = getSubscriber()
  let initialListener = getInitialListener()
  return {
    dispatch: async<TAction extends keyof TReducer, TPayload extends Parameters<TReducer[TAction]>[1]>(action: TAction, payload: TPayload): Promise<void> => {
      const prevState = state
      const newState = await reducer[action](state, payload)
      initialListener(newState, prevState)
      state = newState
    },
    getState: (): MakeReadOnly<TState> => state,
    subscribe
  }
}
