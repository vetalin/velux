## Flux without boilerplate

### How to use
#### createStore
For create store you must a have store object:
```typescript
export interface IStore {
  state: IState
  reducer: IReducer
}
```

State is object extends from:
```typescript
export interface IState {
  [key: string]: any
}
```

Reducer is object with functions:
```typescript
export type IAction = keyof IReducer

export type IReducerFun = (state: IState, payload: any) => IState | Promise<IState>

export interface IReducer {
  [key: string]: IReducerFun
}
```

#### getState
createStore returns object:
```typescript
{
    dispatch: async (action: IAction, payload: any) => {
      state = store.reducer[action](state, payload)
    },
    getState: (): typeof state => state
  }
```

getState() returns a current state object;

dispatch(string): void update state