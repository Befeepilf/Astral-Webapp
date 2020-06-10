import Head from 'next/head';
import {useSelector} from 'react-redux';
import {resolve} from 'styled-jsx/css';

import Rating from '@material-ui/lab/Rating';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Button from '@material-ui/core/Button';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import ConfirmationNumberOutlinedIcon from '@material-ui/icons/ConfirmationNumberOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';

import MovieImage from 'components/MovieImage';

import {TEXT_PRIMARY} from 'colors.js';


const rating = resolve`
  margin-bottom: -2px;
  margin-right: 21px;
`;

const btnSession = resolve`
  padding: 2px 14px;
  margin-right: 14px;
  color: ${TEXT_PRIMARY};
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-radius: 35px !important;
`;

const btnBookSession = resolve`
  padding: 7px 14px;
  margin-right: 21px;
  border-radius: 2px;
`;

const btnBookSessionIcon = resolve`
  margin-right: 7px;
`;

const btnMore = resolve`
  padding: 7px 14px 7px 21px;
  border-radius: 2px;
`;

const btnMoreIcon = resolve`
  margin-left: 7px;
`;

export default function Home() {
  const movies = useSelector(({movies}) => movies.results);
  const genres = useSelector(({genres}) => genres);

  const [selectedMovie, setSelectedMovie] = React.useState(movies[0]);
  const [selectedSession, setSelectedSession] = React.useState();

  // effect for creating an interval to automatically change selectedMovie 
  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if(index === movies.length - 1) {
        index = 0;
      }
      else {
        index++;
      }
      setSelectedMovie(movies[index]);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main>
      <Head>
        <title>Astral</title>

        <link rel="stylesheet" href="https://use.typekit.net/ekd8nvl.css"/>
      </Head>

      <section>
        {movies.map(m => (
          <MovieImage
            key={m.id}
            type="backdrop"
            src={m.backdrop_path}
            hidden={m.id !== selectedMovie.id}
            className="bg"
          />
        ))}

        <div className="container">

          <div className="details">
            <div className="day">
              <svg viewBox="0 0 10 150">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="28%" style={{stopColor: '#fff'}}/>
                    <stop offset="100%" style={{stopColor: 'transparent'}}/>
                  </linearGradient>
                </defs>
                <circle cx="5" cy="5" r="5" fill="#fff"/>
                <rect x="4" y="10" width="2" height="140" fill="url(#grad)"/>
              </svg>
              <p>Today</p>
            </div>

            <div className="title">
              <p className="date">02</p>
              <h2>{selectedMovie.title}</h2>
            </div>

            <div className="details-row">
              <Rating
                size="small"
                value={selectedMovie.vote_average * 5/10}
                max={5}
                precision={0.1}
                readOnly 
                emptyIcon={<StarBorderIcon color="primary" fontSize="small"/>}
                className={rating.className}
              />
              <p className="genre">
                <strong>Genre: </strong>
                <span>{selectedMovie.genre_ids.map(id => genres.find(genre => genre.id === id).name).join(', ')}</span>
              </p>
            </div>
          
            <div className="schedule">
              <p>Session schedule:</p>
              <div className="sessions">
                <ToggleButtonGroup exclusive value={selectedSession} onChange={(event, value) => setSelectedSession(value)}>
                  {["15:20", "17:30", "18:40", "20:50", "23:15"].map(time => (
                    <ToggleButton key={time} value={time} disableRipple aria-label={time} className={btnSession.className}>{time}</ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>
              <div className="actions">
                <Button variant="contained" color="primary" disableElevation className={btnBookSession.className}>
                  <ConfirmationNumberOutlinedIcon fontSize="small" className={btnBookSessionIcon.className}/>
                  book {selectedSession ? "this" : "a"} session
                </Button>
                <Button variant="outlined" disableElevation className={btnMore.className}>
                  More
                  <PlayArrowOutlinedIcon className={btnMoreIcon.className}/>
                </Button>
              </div>
            </div>
          </div>

          <div className="timeline">
            {(() => {
              const arr = [];
              let selectedMovieIndex;
              movies.forEach((m, i) => {
                const Poster = (
                  <div key={m.id} className="poster">
                    <MovieImage type="poster" src={m.poster_path} className="bg"/>
                    <p>{m.title}</p>
                  </div>
                );

                if(m.id === selectedMovie.id) {
                  selectedMovieIndex = i;
                  arr.unshift(Poster);
                }
                else if(selectedMovieIndex !== undefined) {
                  arr.splice(i - selectedMovieIndex, 0, Poster);
                }
                else {
                  arr.push(Poster);
                }
              });

              return arr
            })()}
          </div>
        </div>
      </section>

      {rating.styles}
      {btnSession.styles}
      {btnBookSession.styles}
      {btnBookSessionIcon.styles}
      {btnMore.styles}
      {btnMoreIcon.styles}

      <style jsx>{`
        main::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent, rgba(0, 0, 0, 1));
        }

        section {
          display: flex;
          align-items: flex-end;
          height: 100vh;
          padding-bottom: 70px;
        }

        .container {
          display: flex;
          justify-content: space-between;
          position: relative;
        }

        .details {
          flex-basis: 490px;
          flex-shrink: 0;
        }

        .details .day {
          display: flex;
          margin-bottom: -35px;
        }

        .details .day p {
          margin-top: -12px;
          font-size: 1.375rem;
          font-weight: bold;
        }

        .details .day svg {
          width: 7px;
          margin-right: 7px;
        }

        .details .title, .details .details-row {
          display: flex;
          align-items: center;
        }

        .details .title .date {
          font-family: bebas-neue-pro, sans-serif;
          font-size: 7rem;
        }

        .details .title h2 {
          margin-left: 14px;
          font-size: 3rem;
          line-height: 1;
        }

        .details .details-row {
          margin-left: 4px;
        }

        .details .genre {
          font-size: 0.875rem;
        }

        .details .genre strong {
          margin-right: 4px;
        }

        .details .genre span {
          text-transform: lowercase;
        }

        .schedule {
          margin-top: 42px;
          margin-left: 4px;
        }

        .schedule p {
          margin-bottom: 21px;
          font-size: 0.875rem;
          font-weight: bold;
        }

        .schedule .actions {
          margin-top: 35px;
        }



        .timeline {
          display: flex;
          align-items: flex-end;
        }

        .timeline .poster {
          position: relative;
          width: 200px;
          height: 300px;
        }

        .timeline .poster:not(:last-child) {
          margin-right: 21px;
        }
      `}</style>
    </main>
  );
}