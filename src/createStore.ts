import { IReducer, IState, IStore, ISubscribeStore, MakeReadOnly } from './interfaces'
import { getSubscriber } from './subscriber'

export const createStore = <TState extends IState, TReducer extends IReducer<TState>>(store: IStore<TState, TReducer>) => {
  const {reducer, state: initialState} = store
  let state = initialState
  const {
    subscribe,
    watchToAction,
    watchToState,
    getSubscribeListeners,
    getWatcherAction,
    getAllListeners
  } = getSubscriber()
  return {
    dispatch: async<TAction extends keyof TReducer, TPayload extends Parameters<TReducer[TAction]>[1]>(action: TAction, payload: TPayload): Promise<void> => {
      const subscribeListeners = getSubscribeListeners()
      const watchersActionBefore = getWatcherAction((action as string), 'before')
      const watchersActionAfter = getWatcherAction((action as string), 'after')
      const prevState = state
      const beforeListenerCall = (listener: ISubscribeStore) => { listener(prevState) }
      beforeListenerCall(watchersActionBefore)
      const newState = await reducer[action](state, payload)
      const listenerFunCall = (listener: ISubscribeStore) => { listener(prevState, newState) }
      listenerFunCall(watchersActionAfter)
      if (subscribeListeners.size) {
        const allListenersSubscribe = getAllListeners()
        allListenersSubscribe.map(listenerFunCall)
      }
      state = newState
    },
    getState: (): MakeReadOnly<TState> => state,
    subscribe,
    watchToAction,
    watchToState
  }
}
