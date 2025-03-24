export interface CounterCountEventData {
  type: "count";
  count: number;
}

export interface CounterClickEventData {
  type: "click";
  kind: "inc" | "dec";
}
