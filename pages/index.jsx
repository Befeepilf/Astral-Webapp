import Head from 'next/head';
import {useSelector} from 'react-redux';
import {resolve} from 'styled-jsx/css';
import classNames from 'classnames';

import Rating from '@material-ui/lab/Rating';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import ConfirmationNumberOutlinedIcon from '@material-ui/icons/ConfirmationNumberOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import MovieImage from 'components/MovieImage';

import {TEXT_PRIMARY} from 'colors.js';


const INTERVAL = 10000; // interval in ms for switching selectedMovie


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

const btnSessionSelected = resolve`
  color: #000 !important;
  background-color: ${TEXT_PRIMARY} !important;
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

const btnTimeline = resolve`
  margin-right: 7px;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid currentColor;
`;

const imgPoster = resolve`
  width: 189px;
  height: 301px;
`;

export default function Home() {
  const movies = useSelector(({movies}) => movies);

  const [selectedMovieIndex, setSelectedMovieIndex] = React.useState(0);
  const selectedMovieIndexRef = React.useRef(selectedMovieIndex); // we need access to the current state inside the function that is created on mount and called via requestAnimationFrame for animating the circularProgress
  const animationRequestRef = React.useRef();

  const [selectedSession, setSelectedSession] = React.useState();

  const circularProgressRef = React.useRef();


  function changeSelectedMovieIndex(change) {
    let newSelectedMovieIndex = selectedMovieIndex + change;
    if(newSelectedMovieIndex < 0) {
      newSelectedMovieIndex = movies.length - 1;
    }
    else if(newSelectedMovieIndex > movies.length - 1) {
      newSelectedMovieIndex = 0;
    }

    setSelectedMovieIndex(newSelectedMovieIndex);
    selectedMovieIndexRef.current = newSelectedMovieIndex;
  }

  //effect for creating an interval to automatically change selectedMovie 
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      changeSelectedMovieIndex(1);
    }, INTERVAL);

    return () => {
      clearTimeout(timeout);
    };
  }, [selectedMovieIndex]);


  // animate circularProgress using canvas for high performance
  React.useEffect(() => {
    let start = new Date().getTime();

    let lastMovieIndex = selectedMovieIndexRef.current; // for preventing that animation and change of selectedMovie are out of sync

    const intervalCorrection = 70; // correct for any delays happening for whatever reason

    let draw = () => {
      const now = new Date().getTime();
      let diff = now - start;

      // reset animation if either INTERVAL ms have ellapsed or if selectedMovie changed
      if(diff >= (INTERVAL + intervalCorrection) || selectedMovieIndexRef.current !== lastMovieIndex) {
        start = now;
        diff = 0;
        lastMovieIndex = selectedMovieIndexRef.current;
      }

      const ctx = circularProgressRef.current.getContext('2d');
      circularProgressRef.current.width = 52 * window.devicePixelRatio;
      circularProgressRef.current.height = 52 * window.devicePixelRatio;

      ctx.arc(26, 26, 25, 0, diff / (INTERVAL + intervalCorrection) * 2 * Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      animationRequestRef.current = window.requestAnimationFrame(draw);
    }

    animationRequestRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationRequestRef.current);
    };
  }, []);


  const selectedMovie = movies[selectedMovieIndex];

  return (
    <main>
      <Head>
        <title>Astral</title>

        <link rel="stylesheet" href="https://use.typekit.net/ekd8nvl.css"/>
      </Head>

      <section>
        {movies.map(m => (
          <MovieImage
            key={m.imdb_id}
            type="backdrop"
            src={m.backdrop_path}
            hidden={m.imdb_id !== selectedMovie.imdb_id}
            className="bg"
          />
        ))}

        <div className="container">

          <div className="details">
            <div className="day">
              <svg viewBox="0 0 10 150">
                <defs>
                  <linearGradient id="grad0" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="28%" style={{stopColor: '#fff'}}/>
                    <stop offset="100%" style={{stopColor: 'transparent'}}/>
                  </linearGradient>
                </defs>
                <circle cx="5" cy="5" r="5" fill="#fff"/>
                <rect x="4" y="10" width="2" height="140" fill="url(#grad0)"/>
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
                value={selectedMovie.imdb_rating * 5/10}
                max={5}
                precision={0.1}
                readOnly 
                emptyIcon={<StarBorderIcon color="primary" fontSize="small"/>}
                className={rating.className}
              />
              <p className="genre">
                <strong>Genre: </strong>
                <span>{selectedMovie.genres.join(', ')}</span>
              </p>
            </div>
          
            <div className="schedule">
              <p>Session schedule:</p>
              <div className="sessions">
                <ToggleButtonGroup
                  exclusive
                  value={selectedSession}
                  onChange={(event, value) => setSelectedSession(value)}
                >
                  {selectedMovie.sessions.map(time => (
                    <ToggleButton
                      key={time}
                      value={time}
                      disableRipple
                      aria-label={time} 
                      classes={{root: btnSession.className, selected: btnSessionSelected.className}}
                    >{time}</ToggleButton>
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
            <div className="actions">
              <IconButton size="small" className={btnTimeline.className} onClick={() => changeSelectedMovieIndex(-1)}>
                <ChevronLeftIcon/>
              </IconButton>

              <canvas className="circularProgress" ref={circularProgressRef}/>
              <IconButton className={btnTimeline.className} onClick={() => changeSelectedMovieIndex(1)}>
                <ChevronRightIcon/>
              </IconButton>
            </div>

            <div className="posters">
              {(() => {
                const arr = [];
                movies.forEach((m, i) => {
                  const Poster = (
                    <div key={m.imdb_id} className="poster">
                      <p className="date">04</p>
                      <MovieImage type="poster" src={m.poster_path} className={imgPoster.className}/>
                    </div>
                  );

                  if(i === selectedMovieIndex) {
                    arr.unshift(Poster);
                  }
                  else if(i > selectedMovieIndex) {
                    arr.splice(i - selectedMovieIndex, 0, Poster);
                  }
                  else {
                    arr.push(Poster);
                  }
                });

                arr.splice(2, 0, (
                  <div key="tomorrow" className="separator">
                    <svg viewBox="0 0 7 401" height="401">
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="42%" style={{stopColor: '#fff'}}/>
                          <stop offset="100%" style={{stopColor: 'transparent'}}/>
                        </linearGradient>
                      </defs>
                      <circle cx="3.5" cy="3.5" r="3.5" fill="#fff"/>
                      <rect x="2.5" y="7" width="2" height="394" fill="url(#grad1)"/>
                    </svg>
                    <p>Tomorrow</p>
                  </div>
                ));

                return arr
              })()}
            </div>
          </div>
        </div>
      </section>

      {rating.styles}
      {btnSession.styles}
      {btnSessionSelected.styles}
      {btnBookSession.styles}
      {btnBookSessionIcon.styles}
      {btnMore.styles}
      {btnMoreIcon.styles}
      {btnTimeline.styles}
      {imgPoster.styles}

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

        .day p, .separator p {
          margin-top: -12px;
          margin-left: 14px;
          font-size: 1.375rem;
          font-weight: bold;
        }

        .details {
          flex-basis: 490px;
          flex-shrink: 0;
        }

        .details .day {
          display: flex;
          margin-bottom: -35px;
        }

        .details .day svg {
          width: 7px;
        }

        .details .title, .details .details-row {
          display: flex;
          align-items: center;
        }

        .details .title .date {
          font-family: bebas-neue-pro, sans-serif;
          font-size: 7rem;
          font-weight: 200;
          letter-spacing: 7px;
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

        .timeline .actions {
          display: flex;
          align-items: center;
          position: relative;
          margin-right: 21px;
          margin-bottom: -14px;
        }

        .timeline .actions .circularProgress {
          position: absolute;
          width: 52px;
          height: 52px;
          right: 6px;
          transform: rotate(180deg);
        }

        .timeline .posters {
          display: flex;
          align-items: flex-end;
        }

        .timeline .poster {
          display: flex;
          flex-direction: column;
        }

        .timeline .poster:not(:last-child) {
          margin-right: 21px;
        }

        .timeline .poster .date {
          margin-bottom: 14px;
          font-family: bebas-neue-pro, sans-serif;
          font-size: 1.25rem;
          font-weight: 400;
        }

        .timeline .separator {
          display: flex;
          position: relative;
          margin-right: 21px;
        }

        .timeline .separator p {
          position: absolute;
          left: 7px;
        }
      `}</style>
    </main>
  );
}