import { createStore } from '../src/createStore'
import { getDefStore } from './mocks'

describe('createStore return two functions for getState and dispatchAction', () => {
  it('createStore exist', () => {
    expect(createStore).toBeDefined()
    expect(createStore).toBeTruthy()
    expect(createStore).toBeInstanceOf(Function)
  })
  it('createStore return two functions', () => {
    const store = getDefStore()
    const {dispatch, getState} = createStore(store)
    expect(dispatch).toBeInstanceOf(Function)
    expect(getState).toBeInstanceOf(Function)
  })
})
