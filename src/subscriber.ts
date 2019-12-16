import { IMomentTriggerWatch, IState, ISubscribeStore, IWatchTrigger } from './interfaces'

const generateListenerKey = (id?: string): string => `all-action-listener-${id || Math.round(Date.now() * Math.random() * 100)}`
const getValuesFromMap = (map: Map<any, any>) => map.size ? [...(map as any)].map(([key, value]) => value) : []
const getListenerKey = (map: Map<string, any>, key: string, index: number = 0): string => {
  if (map.get(`${key}-${index}`)) {
    if (index > 1000) throw new Error('getListenerKey not found key, index > 1000')
    return getListenerKey(map, key, index + 1)
  }
  return `${key}-${index}`
}

export const getSubscriber = <TState>() => {
  const listenerMap = new Map()
  const actionListenersMap = new Map()
  const stateListenerMap = new Map()
  return {
    getSubscribeListeners: () => listenerMap,
    getWatchToActionListeners: () => actionListenersMap,
    getWatchToStateListeners: () => stateListenerMap,
    getWatcherAction: (actionName: string, momentTrigger: IMomentTriggerWatch): ISubscribeStore[] => {
      const watcherKey = `${actionName}-${momentTrigger}-`
      return (() => {
        let filter: any = []
        actionListenersMap.forEach((value, key) => {
          if (key.includes(watcherKey)) filter = [...filter, value]
        })
        return filter
      })()
    },
    getWatcherState: <TState extends IState>(): (newState: TState, oldState?: TState) => ISubscribeStore[] => {
      let filteredWatcher: any = []
      const map = stateListenerMap
      return (newState: TState, oldState?: TState) => {
        map.forEach((value: ISubscribeStore, key: string) => {
          const [stateKey] = key.split('-')
          const [newStateString, oldStateString] = [newState, oldState].map(state => {
            if (!state) return undefined
            const stateObj = state[stateKey]
            if (!Array.isArray(stateObj) || typeof stateObj !== 'object') return state[stateKey]
            return JSON.stringify(stateObj)
          })
          if (newStateString !== oldStateString) filteredWatcher = [...filteredWatcher, value]
        })
        return filteredWatcher
      }
    },
    getActionListenerByKey: (listenerKey: string) => actionListenersMap.get(listenerKey),
    getStateListenerByKey: (listenerKey: string) => stateListenerMap.get(listenerKey),
    getAllListeners: () => getValuesFromMap(listenerMap),
    subscribe: (listener: ISubscribeStore) => {
      const listenerKey = generateListenerKey()
      listenerMap.set(listenerKey, listener)
      return () => {
        listenerMap.delete(listenerKey)
      }
    },
    watchToAction: (actionName: string, listener: ISubscribeStore, momentTrigger: IMomentTriggerWatch = 'after') => {
      const listenerKey = getListenerKey(actionListenersMap, `${actionName}-${momentTrigger}`)
      actionListenersMap.set(listenerKey, listener)
      return () => {
        actionListenersMap.delete(listenerKey)
      }
    },
    watchToState: (stateKey: string, listener: ISubscribeStore) => {
      const listenerKey = getListenerKey(actionListenersMap, stateKey)
      stateListenerMap.set(listenerKey, listener)
      return () => {
        stateListenerMap.delete(listenerKey)
      }
    }
  }
}

export const watchTrigger = async <TState>({
                                       subscribeListeners,
                                       actionPromise,
                                       oldState,
                                       watchersActionAfter,
                                       watchersActionBefore,
                                       allListenersSubscribe,
                                       getStateWatchers}: IWatchTrigger<TState>
) => {
  const beforeListenerCall = (listener: ISubscribeStore) => { listener(oldState) }
  watchersActionBefore.map(beforeListenerCall)
  const newState = await actionPromise
  const listenerFunCall = (listener: ISubscribeStore) => { listener(newState, oldState) }
  getStateWatchers(newState, oldState).map(listenerFunCall)
  watchersActionAfter.map(listenerFunCall)
  if (subscribeListeners.size) {
    allListenersSubscribe.map(listenerFunCall)
  }
}
