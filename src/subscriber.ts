import { IMomentTriggerWatch, ISubscribeStore } from './interfaces'

const generateListenerKey = (id?: string): string => `all-action-listener-${id || Math.round(Date.now() * Math.random() * 100)}`
const getValuesFromMap = (map: Map<any, any>) => [...(map as any)].map(([key, value]) => value)
const getListenerKey = (map: Map<string, any>, key: string, index: number = 0): string => {
  if (map.get(`${key}-${index}`)) {
    if (index > 1000) throw new Error('getListenerKey not found key, index > 1000')
    return getListenerKey(map, key, index + 1)
  }
  return `${key}-${index}`
}

export const getSubscriber = <TState>() => {
  let mockListener:ISubscribeStore = () => {}
  const listenerMap = new Map()
  const actionListenersMap = new Map()
  const stateListenerMap = new Map()
  return {
    getInitialListener: () => mockListener,
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
    watchToState: (stateKey: string, listener: ISubscribeStore, momentTrigger: IMomentTriggerWatch = 'after') => {
      const listenerKey = getListenerKey(actionListenersMap, `${stateKey}-${momentTrigger}`)
      stateListenerMap.set(listenerKey, listener)
      return () => {
        stateListenerMap.delete(listenerKey)
      }
    }
  }
}
