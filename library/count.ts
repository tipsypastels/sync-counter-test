const KEY: Deno.KvKey = ["count"];

const kv = await Deno.openKv();

export async function getCount() {
  return (await kv.get<number>(KEY)).value ?? 0;
}

export async function updateCount(f: (n: number) => number) {
  const currentRes = await kv.get<number>(KEY);
  const current = currentRes.value ?? 0;
  const next = f(current);
  await kv.atomic().check(currentRes).set(KEY, next).commit();
}

export async function* listenCount() {
  for await (const [{ value }] of kv.watch<[number]>([KEY])) {
    if (value != null) yield value;
  }
}
