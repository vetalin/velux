export interface IState {
  [key: string]: any
}

export type IAction = keyof IReducer

export type IReducerFun = (state: IState, payload: any) => IState | Promise<IState>

export interface IReducer {
  [key: string]: IReducerFun
}

export interface IStore {
  state: IState
  reducer: IReducer
}
