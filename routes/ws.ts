import { Handlers } from "$fresh/server.ts";
import { listenCount, updateCount } from "../server/db.ts";

export type WsClickEvent = { type: "click"; kind: "inc" | "dec" };
export type WsCountEvent = { type: "count"; count: number };

export const handler: Handlers = {
  GET(req) {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = async () => {
      for await (const count of listenCount()) {
        socket.send(
          JSON.stringify({ type: "count", count } satisfies WsCountEvent),
        );
      }
    };

    socket.onmessage = async (e: MessageEvent<WsClickEvent>) => {
      if (e.data.kind === "dec") {
        await updateCount((n) => n - 1);
      } else {
        await updateCount((n) => n + 1);
      }
    };

    return response;
  },
};
