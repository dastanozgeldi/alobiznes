export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <form
        action={async (formData) => {
          "use server";
          const file = formData.get("receipt") as File;
          console.log("принял", file.name);
        }}
      >
        <input type="file" name="receipt" id="receipt" accept="image/*" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
