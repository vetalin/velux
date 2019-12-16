import { IReducer, IState, IStore, MakeReadOnly } from './interfaces'
import { getSubscriber, watchTrigger } from './subscriber'

export const createStore = <TState extends IState, TReducer extends IReducer<TState>>(store: IStore<TState, TReducer>) => {
  const {reducer, state: initialState} = store
  let state = initialState
  const {
    subscribe,
    watchToAction,
    watchToState,
    getSubscribeListeners,
    getWatcherAction,
    getAllListeners,
    getWatcherState
  } = getSubscriber()
  return {
    dispatch: async<TAction extends keyof TReducer, TPayload extends Parameters<TReducer[TAction]>[1]>(action: TAction, payload: TPayload): Promise<void> => {
      const subscribeListeners = getSubscribeListeners()
      const [watchersActionBefore, watchersActionAfter] = ['before', 'after'].map((moment: any) => getWatcherAction((action as string), moment))
      const getStateWatchers = getWatcherState()
      const prevState = state
      const actionPromise = reducer[action](state, payload)
      watchTrigger({
        oldState: prevState,
        actionPromise,
        watchersActionBefore,
        watchersActionAfter,
        actionName: (action as string),
        subscribeListeners,
        allListenersSubscribe: getAllListeners(),
        getStateWatchers
      })
      state = await actionPromise
    },
    getState: (): MakeReadOnly<TState> => state,
    subscribe,
    watchToAction,
    watchToState
  }
}
