const kv = await Deno.openKv();

const countKey: Deno.KvKey = ["count"];

export async function getCount() {
  return (await kv.get<number>(countKey)).value ?? 0;
}

export async function updateCount(f: (n: number) => number) {
  const currentRes = await kv.get<number>(countKey);
  const current = currentRes.value ?? 0;
  const next = f(current);
  await kv.atomic().check(currentRes).set(countKey, next).commit();
}

export function listenCount() {
  return kv.watch<[number]>([countKey]);
}
