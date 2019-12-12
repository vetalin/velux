import { IStore } from '../src/interfaces'

export const getDefStore = (): IStore => ({
  state: {
    init: ''
  },
  reducer: {
    changeInit (state, payload: any) {
      return {
        state,
        init: payload
      }
    }
  }
})
