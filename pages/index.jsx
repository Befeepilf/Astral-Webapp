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

import {CSSTransition, TransitionGroup} from 'react-transition-group';

import MovieImage from 'components/MovieImage';

import styles from 'styles/index.css';
import {TEXT_PRIMARY} from 'colors.js';


const TRANSITION_INTERVAL = 10000; // interval in ms for switching selectedMovie
const TRANSITION_DURATION = 1000;


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

const posters = resolve`
  display: flex;
  align-items: flex-end;
`;

const imgPoster = resolve`
  width: 189px;
  height: 301px;
`;

export default function Home() {
  const movies = useSelector(({movies}) => movies);

  const isTransitioningRef = React.useRef(false);

  const slideDirectionRef = React.useRef(1); // indicates whether to slide forwards or backwards

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

    if(!isTransitioningRef.current) {
      slideDirectionRef.current = change;
      console.log("set", slideDirectionRef.current);
      setSelectedMovieIndex(newSelectedMovieIndex);
      selectedMovieIndexRef.current = newSelectedMovieIndex;

      isTransitioningRef.current = true;

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, TRANSITION_DURATION);
    }

  }

  //effect for creating an interval to automatically change selectedMovie 
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      changeSelectedMovieIndex(1);
    }, TRANSITION_INTERVAL);

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

      // reset animation if either TRANSITION_INTERVAL ms have ellapsed or if selectedMovie changed
      if(diff >= (TRANSITION_INTERVAL + intervalCorrection) || selectedMovieIndexRef.current !== lastMovieIndex) {
        start = now;
        diff = 0;
        lastMovieIndex = selectedMovieIndexRef.current;
      }

      const ctx = circularProgressRef.current.getContext('2d');
      circularProgressRef.current.width = 52 * window.devicePixelRatio;
      circularProgressRef.current.height = 52 * window.devicePixelRatio;

      ctx.arc(26, 26, 25, 0, diff / (TRANSITION_INTERVAL + intervalCorrection) * 2 * Math.PI);
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

  console.log("render", slideDirectionRef.current)

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
                  {["15:20", "17:30", "18:40", "20:50", "23:15"].map(time => (
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

          <div className={classNames('timeline', slideDirectionRef.current > 0 ? 'slide-forwards' : 'slide-backwards')}>
            <div className="actions">
              <IconButton size="small" className={btnTimeline.className} onClick={() => changeSelectedMovieIndex(-1)}>
                <ChevronLeftIcon/>
              </IconButton>

              <canvas className="circularProgress" ref={circularProgressRef}/>
              <IconButton className={btnTimeline.className} onClick={() => changeSelectedMovieIndex(1)}>
                <ChevronRightIcon/>
              </IconButton>
            </div>
            
            <TransitionGroup component={null}>
              <CSSTransition key={selectedMovieIndex} timeout={TRANSITION_DURATION}>
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
                      
                      // put selected movie at front
                      if(i === selectedMovieIndex) {
                        arr.unshift(Poster);
                      }
                      // movie comes after selected movie but before previously movies already added to arr
                      else if(i > selectedMovieIndex) {
                        arr.splice(i - selectedMovieIndex, 0, Poster);
                      }
                      // append movie to end of arr
                      else {
                        arr.push(Poster);
                      }
                    });
                    
                    // put last movie at front
                    // important for making posters slider work in both directions
                    arr.unshift(arr.pop());

                    arr.splice(3, 0, (
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
              </CSSTransition>
            </TransitionGroup>
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
      {posters.styles}
      {imgPoster.styles}

      <style jsx>{styles}</style>
      <style jsx>{`
        .timeline .posters {
          display: flex;
          align-items: flex-end;
        }

        .timeline .posters > * {
          transform: translateX(calc(-100% - 21px));
        }

        .timeline .posters > :first-child {
          opacity: 0;
        }

        .timeline .posters.enter {
            position: absolute;
            opacity: 0;
        }

        .timeline .posters.exit > * {
            transform: translateX(calc(-100% - 21px));
        }

        .timeline.slide-forwards .posters.exit-active > * {
            transform: translateX(calc(-200% - 42px));
            transition: all ${TRANSITION_DURATION}ms;
        }

        .timeline.slide-forwards .posters.exit-active > :nth-child(2) {
          opacity: 0;
        }

        .timeline.slide-backwards .posters.exit-active > * {
          transform: translateX(0);
          transition: all ${TRANSITION_DURATION}ms;
        }

        .timeline.slide-backwards .posters.exit-active > :first-child {
          opacity: 1;
        }
      `}</style>
    </main>
  );
}