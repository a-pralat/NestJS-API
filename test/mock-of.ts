export type Constructor<T> = new (...args: any[]) => T;

export type Mocked<T extends object> = T & {[P in keyof T]: jest.Mock}

export function mockOf<T extends object>(cls: Constructor<T>):Mocked<T> {
  return new Proxy<T>({  } as T, {
    get:(target, property)=>{
      if(!(property in target))
        target[property] = jest.fn()
      return target[property]
    }
  }) as Mocked<T>
}
