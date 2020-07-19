import Head from 'next/head';
import MoviesPerDay from 'components/sections/MoviesPerDay';
import SessionsPerDay from 'components/sections/SessionsPerDay';

export default function() {
  return (
    <main>
      <Head>
        <title>Astral</title>

        <link rel="stylesheet" href="https://use.typekit.net/ekd8nvl.css"/>
      </Head>

      <MoviesPerDay/>
      <SessionsPerDay/>
    </main>
  );
}