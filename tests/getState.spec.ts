import { createStore } from '../src/createStore'
import { getDefStore } from './mocks'

describe('getState function returns state', () => {
  it('getState return initial state', () => {
    const store = getDefStore()
    const {getState} = createStore(store)
    const {init} = getState()
    expect(init).toBe('')
  })
  it('getState return state after change', async () => {
    const state1 = {
      init: ''
    }
    type State = typeof state1
    const reducer = {
      async changeInit (state: State, payload: string) {
        return {
          ...state,
          init: payload
        }
      }
    }
    const store = {
      state: state1,
      reducer
    }
    const {getState, dispatch} = createStore<State, typeof reducer>(store)
    await dispatch('changeInit', '1')
    await dispatch('changeInit', '2')
    const {init} = getState()
    expect(init).toBe('2')
  })
})
