import { Handlers } from "$fresh/server.ts";
import { ServerSentEventStream } from "@std/http";
import { listenCount } from "../server/db.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return new Response(
      new ReadableStream({
        async start(controller) {
          console.log("Connected", ctx.remoteAddr);

          for await (const [{ value: count }] of listenCount()) {
            if (count == null) {
              continue;
            }

            controller.enqueue({
              data: JSON.stringify({ count }),
              id: crypto.randomUUID(),
              event: "count",
            });
          }
        },
      }).pipeThrough(new ServerSentEventStream()),
      {
        headers: { "Content-Type": "text/event-stream" },
      },
    );
  },
};
