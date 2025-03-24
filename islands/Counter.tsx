import type { Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  useSubscriber(props.count);

  async function decrement() {
    props.count.value -= 1;
    await submit("dec");
  }

  async function increment() {
    props.count.value += 1;
    await submit("inc");
  }

  async function submit(type: "inc" | "dec") {
    await fetch("/click", { method: "post", body: JSON.stringify({ type }) });
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
  useEffect(() => {
    const stream = new EventSource("/stream");

    stream.onmessage = (e) => {
      console.log(e);
    };

    return () => {
      console.log("closing stream");
      stream.close();
    };
  }, []);
}
