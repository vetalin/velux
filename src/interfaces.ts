export interface IState {
  [key: string]: any
}

// export type IAction = keyof IReducer

export type IReducerFun<TState, TPayload> = (state: TState, payload: TPayload) => TState | Promise<TState>

export interface IReducer<TState extends IState, TPayload = any> {
  [key: string]: IReducerFun<TState, TPayload>
}

export interface IStore<TState extends IState, TReducer extends IReducer<TState>> {
  state: TState
  reducer: TReducer
}
