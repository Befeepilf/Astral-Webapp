import Head from 'next/head';
import {useSelector} from 'react-redux';
import MovieImage from 'components/MovieImage';

export default function Home() {
  const movies = useSelector(({movies}) => movies);
  const [selectedMovie, setSelectedMovie] = React.useState(movies.results[0]);

  // effect for creating an interval to automatically change selectedMovie 
  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if(index === movies.results.length - 1) {
        index = 0;
      }
      else {
        index++;
      }
      setSelectedMovie(movies.results[index]);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main>
      <Head>
        <title>Astral</title>
      </Head>

      <section>
        <MovieImage type="backdrop" src={selectedMovie.backdrop_path}/>
      </section>

      <style jsx>{`
        & {
          height: 100vh;
        }
      `}</style>
    </main>
  );
}