import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <h2>Home content</h2>
        {!session ? (
          <button
            onClick={() => {
              signIn();
            }}
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => {
              signOut({ callbackUrl: "/auth/login" });
            }}
          >
            Log Out
          </button>
        )}
      </main>
    </>
  );
}
