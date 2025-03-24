import { Handlers } from "$fresh/server.ts";
import { listenCount, updateCount } from "../library/count.ts";
import type {
  CounterClickEventData,
  CounterCountEventData,
} from "../library/events.d.ts";

export const handler: Handlers = {
  GET(req) {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = async () => {
      for await (const count of listenCount()) {
        const data: CounterCountEventData = { type: "count", count };
        socket.send(JSON.stringify(data));
      }
    };

    socket.onmessage = async (e: MessageEvent<string>) => {
      const data: CounterClickEventData = JSON.parse(e.data);
      if (data.kind === "dec") {
        await updateCount((n) => n - 1);
      } else {
        await updateCount((n) => n + 1);
      }
    };

    return response;
  },
};
