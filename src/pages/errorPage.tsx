import { useRouting } from '@/helper/hooks/useRouting';

export default function ErrorPage() {
  const { goTo } = useRouting();

  return (
    <section className=" h-screen flex justify-center items-center">
      <div className=" text-center">
        <p>
          <code>An error as occurred</code>
        </p>
        <button
          onClick={() => goTo()}
          className=" mt-3 rounded-md px-3 py-1.5 cursor-pointer  font-bold bg-GOLD_01  "
        >
          Go back
        </button>
      </div>
    </section>
  );
}
