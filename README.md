# Type safe Flux without boilerplate

## install
`npm install velux`

## How to use
### createStore

```typescript
interface MyState {
  test: string
}
const state: MyState = {test: ''}
const reducer: IReducer<MyState> = {
  changeTest(state, payload: string) {
    return {
      ...state,
      test: payload
    }     
  }
}
export const store = createStore<MyState, typeof reducer>({state, reducer})
```

For create store you must a have store object:
```typescript
interface IStore<TState, TReducer extends IReducer<TState>> {
  state: TState
  reducer: TReducer
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
export type IReducerFun<TState, TPayload = any> = (state: TState, payload: TPayload) => Promise<TState>

export interface IReducer<TState, TPayload = any> {
  [key:string]: IReducerFun<TState, TPayload>
}
```

### getState, dispatch
createStore returns object:
```typescript
{
    dispatch: Promise<void>,
    getState: (): typeof state => state
}
```

getState() returns a current state object;

dispatch(string): void update state

```typescript
interface MyState {
  test: string
}
const state: MyState = {test: ''}
const reducer: IReducer<MyState> = {
  changeTest(state, payload: string) {
    return {
      ...state,
      test: payload
    }     
  }
}
export const store = createStore<MyState, typeof reducer>({state, reducer})

store.getState().test // ''
await store.dispatch('changeTest', 'changed text')
store.getState().test // 'changed text'
```

### subscribe, watchToAction, watchToState
createStore returns object:

```typescript
{
  subscribe: (listener: ISubscribeStore) => destroyFunction,
  watchToAction: (actionName: string, listener: ISubscribeStore, momentTrigger: IMomentTriggerWatch = 'after') => destroyFunction,
  watchToState: (stateKey: string, listener: ISubscribeStore, momentTrigger: IMomentTriggerWatch = 'after') => destroyFunction
}

export type ISubscribeStore = (currentState?: any, prevState?: any) => void
export type IMomentTriggerWatch = 'before' | 'after'

```

#### subscribe
Subscribe call argument function after any changes in store. Subscribe returns a destroyFunction for remove subscribing.\
example:
```typescript
interface MyState {
  test: string
}
const state: MyState = {test: ''}
const reducer: IReducer<MyState> = {
  changeTest(state, payload: string) {
    return {
      ...state,
      test: payload
    }     
  }
}
export const store = createStore<MyState, typeof reducer>({state, reducer})

const destroySubscribe = store.subscribe((newState, oldState) => {
  oldState // ''
  newState // 'changed text'
})

await store.dispatch('changeTest', 'changed text')
```

Subscribe functions is determinated and unique:
```typescript
const destroySubscribe1 = store.subscribe((newState, oldState) => { 
  // some changes
})
const destroySubscribe2 = store.subscribe((newState, oldState) => { 
  // some changes
})
const destroySubscribe3 = store.subscribe((newState, oldState) => { 
  // some changes
})
```

#### watchToAction
WatchToAction call listener before or after dispatch action by actionName

#### watchToState
WatchToState call listener after change state by stateKey

