import { type Signal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Button } from "../components/Button.tsx";
import type { WsClickEvent, WsCountEvent } from "../routes/ws.ts";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  const submit = useSubscriber(props.count);

  function decrement() {
    props.count.value -= 1;
    submit("dec");
  }

  function increment() {
    props.count.value += 1;
    submit("inc");
  }

  return (
    <div class="flex gap-8 py-6">
      <Button onClick={decrement}>-1</Button>
      <p class="text-3xl tabular-nums">{props.count}</p>
      <Button onClick={increment}>+1</Button>
    </div>
  );
}

function useSubscriber(count: Signal<number>) {
  const ref = useRef<WebSocket>();

  useEffect(() => {
    const wsUrl = new URL("./ws", location.origin);
    wsUrl.protocol = wsUrl.protocol.replace("http", "ws");

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (e: MessageEvent<string>) => {
      const data: WsCountEvent = JSON.parse(e.data);
      if (data.type === "count") {
        count.value = data.count;
      }
    };

    ref.current = ws;

    return () => {
      ref.current?.close();
    };
  }, []);

  return (kind: "inc" | "dec") => {
    const data: WsClickEvent = { type: "click", kind };
    ref.current?.send(JSON.stringify(data));
  };
}
