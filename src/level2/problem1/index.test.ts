// ExecutionCache.ts
export class ExecutionCache<TArgs extends any[], TResult> {
  private handler: (...args: TArgs) => Promise<TResult>;
  private cache = new Map<string, Promise<TResult>>();

  constructor(handler: (...args: TArgs) => Promise<TResult>) {
    this.handler = handler;
  }

  fire(key: string, ...args: TArgs): Promise<TResult> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const promise = this.handler(...args)
      .then((result) => {
        const resolved = Promise.resolve(result);
        this.cache.set(key, resolved);
        return result;
      })
      .catch((err) => {
        this.cache.delete(key);
        throw err;
      });

    this.cache.set(key, promise);
    return promise;
  }
}
