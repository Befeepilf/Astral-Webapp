import Head from 'next/head';
import MoviesPerDay from 'components/sections/MoviesPerDay';
import SessionsPerDay from 'components/sections/SessionsPerDay';

export default function() {
  return (
    <main>
      <Head>
        <title>Astral</title>

        <link rel="preconnect" href="https://p.typekit.net"/>
        <link rel="preload" href="https://use.typekit.net/ekd8nvl.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <noscript><link rel="stylesheet" href="https://use.typekit.net/ekd8nvl.css"/></noscript>
      </Head>

      <MoviesPerDay/>
      <SessionsPerDay/>
    </main>
  );
}