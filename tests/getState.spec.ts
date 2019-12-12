import { createStore } from '../src/createStore'
import { getDefStore } from './mocks'

describe('getState function returns state', () => {
  it('getState return initial state', () => {
    const store = getDefStore()
    const {getState} = createStore(store)
    const {init} = getState()
    expect(init).toBe('')
  })
  it('getState return state after change', () => {
    const store = getDefStore()
    const {getState, dispatch} = createStore(store)
    dispatch('changeInit', '2')
    const {init} = getState()
    expect(init).toBe('2')
  })
})
