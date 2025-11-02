"use client";

import { useActionState } from "react";
import { readReceipt } from "./actions";

const initialState = {
  success: false,
  data: [],
};

export default function Page() {
  const [state, formAction, isPending] = useActionState(
    readReceipt,
    initialState
  );

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-2xl font-bold">Ало, бизнес?</h1>
      <form action={formAction}>
        <div className="flex flex-col gap-2">
          <label htmlFor="receipt">Загрузить чек</label>
          <input type="file" name="receipt" id="receipt" accept="image/*" />
        </div>
        <button className="mt-6">Submit</button>
      </form>

      {isPending && <p>Loading...</p>}

      {state.success && (
        <pre className="mt-6">{JSON.stringify(state.data, null, 2)}</pre>
      )}
    </div>
  );
}
