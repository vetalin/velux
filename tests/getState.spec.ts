import { createStore } from '../src/createStore'
import { getDefStore } from './mocks'
import { IReducer, IReducerFun, IState } from '../src/interfaces'

describe('getState function returns state', () => {
  it('getState return initial state', () => {
    const store = getDefStore()
    const {getState} = createStore(store)
    const {init} = getState()
    expect(init).toBe('')
  })
  it('getState return state after change', () => {
    interface State extends IState {
      init: string
    }
    const state1: State = {
      init: ''
    }
    interface Reducer extends IReducer<State> {
      changeInit: IReducerFun<State, string>
    }
    const reducer: Reducer = {
      changeInit (state: State, payload: string): State {
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
    const {getState, dispatch} = createStore<State, Reducer>(store)
    dispatch('changeInit', '1')
    const {init} = getState()
  })
})
