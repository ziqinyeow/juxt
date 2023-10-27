export function defaultdict(f: Function) {
  return new Proxy(Object.create(null), {
    get(storage, property) {
      if (!(property in storage)) storage[property] = f(property);
      return storage[property];
    },
  });
}
