import Head from 'next/head';
import {useSelector} from 'react-redux';
import MovieImage from 'components/MovieImage';

export default function Home() {
  const movies = useSelector(({movies}) => movies);
  const [selectedMovie, setSelectedMovie] = React.useState(movies.results[0].id);

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
      setSelectedMovie(movies.results[index].id);
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
        {movies.results.map(m => (
          <MovieImage key={m.id} type="backdrop" src={m.backdrop_path} hidden={m.id !== selectedMovie}/>
        ))}
      </section>

      <style jsx>{`
        & {
          height: 100vh;
        }
      `}</style>
    </main>
  );
}