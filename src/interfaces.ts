export interface IState {
  [key: string]: any
}

export type IReducerFun<TState, TPayload = any> = (state: TState, payload: TPayload) => Promise<TState>

export interface IReducer<TState, TPayload = any> {
  [key: string]: IReducerFun<TState, TPayload>
}

export interface IStore<TState, TReducer extends IReducer<TState>> {
  state: TState
  reducer: TReducer
}
