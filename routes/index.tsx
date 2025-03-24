import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { getCount } from "../server/db.ts";

interface HomeProps {
  count: number;
}

export default function Home(props: PageProps<HomeProps>) {
  const count = useSignal(props.data.count);

  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
        <Counter count={count} />
      </div>
    </div>
  );
}

export const handler: Handlers<HomeProps> = {
  async GET(_req, ctx) {
    const count = await getCount();
    return ctx.render({ count });
  },
};
