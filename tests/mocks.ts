import { IStore } from '../src/interfaces'

export const getDefStore = (): IStore<any, any> => ({
  state: {
    init: ''
  },
  reducer: {
    changeInit (state: any, payload: any) {
      return {
        ...state,
        init: payload
      }
    }
  }
})
