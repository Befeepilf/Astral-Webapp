import Head from 'next/head';
import MoviesPerDay from 'components/sections/MoviesPerDay';

export default function() {
  return (
    <main>
      <Head>
        <title>Astral</title>

        <link rel="stylesheet" href="https://use.typekit.net/ekd8nvl.css"/>
      </Head>

      <MoviesPerDay/>

      <style jsx>{`
        main::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent, rgba(0, 0, 0, 1)), linear-gradient(to bottom left, transparent, rgba(0, 0, 0, 1));
        }
      `}</style>
    </main>
  );
}