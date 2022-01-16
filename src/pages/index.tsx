import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Wordddle</title>
        <meta
          name="description"
          content="Wordle with increasing levels of difficulty."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-center text-3xl">Wordddle</h1>
    </div>
  );
}
