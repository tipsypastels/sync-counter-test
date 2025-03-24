import { Handlers } from "$fresh/server.ts";
import { updateCount } from "../server/db.ts";

export const handler: Handlers = {
  async POST(req) {
    const { type } = await req.json();

    if (type === "dec") {
      await updateCount((n) => n - 1);
    } else {
      await updateCount((n) => n + 1);
    }

    return new Response(null, { status: 200 });
  },
};
