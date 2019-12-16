import { createStore } from '../src/createStore'
import { getDefStore } from './mocks'
import { IReducer, IReducerFun } from '../src/interfaces'

describe('getState function returns state', () => {
  it('getState return initial state', () => {
    const store = getDefStore()
    const {getState} = createStore(store)
    const {init} = getState()
    expect(init).toBe('')
  })
  it('getState return state after change', async () => {
    const state = {
      init: ''
    }
    type State = typeof state
    const reducer = {
      async changeInit (state: State, payload: string) {
        return {
          ...state,
          init: payload
        }
      }
    }
    const store = {
      state,
      reducer
    }
    const {getState, dispatch} = createStore<State, typeof reducer>(store)
    await dispatch('changeInit', '1')
    await dispatch('changeInit', '2')
    const {init} = getState()
    expect(init).toBe('2')
  })
  it('getState return state after change with long state', async () => {
    interface Cats {
      name: string
      color: number
    }
    interface Dogs {
      name: string
      bork: boolean
    }
    interface State {
      init: string
      cats: Cats[]
      dogs: Dogs[]
    }
    const state: State = {
      init: '',
      cats: [],
      dogs: []
    }
    const reducer = {
      'changeInit': async (state: State, payload: string) => {
        return {
          ...state,
          init: payload
        }
      },
      'changeDogs': async (state: State, payload: Dogs | Dogs[]) => {
        const newDogs = Array.isArray(payload) ? payload : [payload]
        return {
          ...state,
          dogs: newDogs,
          cacaca: 'caca'
        }
      }
    }
    const store = {
      state,
      reducer
    }
    const {getState, dispatch} = createStore<State, typeof reducer>(store)
    await dispatch('changeInit', '1')
    await dispatch('changeInit', '2')
    const {init} = getState()
    expect(init).toBe('2')
    await dispatch('changeDogs', [
      {
        name: 'sharik',
        bork: false
      }, {
        name: 'jack',
        bork: true
      }
    ])
    const {dogs} = getState()
    expect(dogs).toStrictEqual([
      {
        name: 'sharik',
        bork: false
      }, {
        name: 'jack',
        bork: true
      }
    ])
  })
})
