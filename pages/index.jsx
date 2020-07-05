import Head from 'next/head';
import {useSelector} from 'react-redux';
import {resolve} from 'styled-jsx/css';
import classNames from 'classnames';

import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isSameDay from 'date-fns/isSameDay';

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


const TRANSITION_INTERVAL = 10000; // interval in ms for switching displayedSession
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
  const sessions = useSelector(({sessions}) => sessions.map(s => Object.assign({}, s, {startTime: new Date(s.startTime)})));
  const sessionsWithUniqueMoviesPerDay = useSelector(({sessions}) => (
    sessions.filter(s1 => !sessions.find(s2 => s2.id !== s1.id && isSameDay(s2.startTime, s1.startTime) && s2.movieId === s1.movieId))
  ));
  const movies = useSelector(({movies}) => movies);
  
  const isTransitioningRef = React.useRef(false);

  const slideDirectionRef = React.useRef(1); // indicates whether to slide forwards or backwards

  const [displayedSessionIndex, setDisplayedSessionIndex] = React.useState(0);
  const displayedSessionIndexRef = React.useRef(displayedSessionIndex); // we need access to the current state inside the function that is created on mount and called via requestAnimationFrame for animating the circularProgress
  const animationRequestRef = React.useRef();


  const [selectedSession, setSelectedSession] = React.useState();

  const circularProgressRef = React.useRef();


  function changeDisplayedSessionIndex(change) {
    let newDisplayedSessionIndex = displayedSessionIndex + change;
    if(newDisplayedSessionIndex < 0) {
      newDisplayedSessionIndex = sessionsWithUniqueMoviesPerDay.length - 1;
    }
    else if(newDisplayedSessionIndex > sessionsWithUniqueMoviesPerDay.length - 1) {
      newDisplayedSessionIndex = 0;
    }

    if(!isTransitioningRef.current) {
      slideDirectionRef.current = change;
      setDisplayedSessionIndex(newDisplayedSessionIndex);
      displayedSessionIndexRef.current = newDisplayedSessionIndex;

      isTransitioningRef.current = true;

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, TRANSITION_DURATION);
    }

  }

  //effect for creating an interval to automatically change displayedSession 
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      changeDisplayedSessionIndex(1);
    }, TRANSITION_INTERVAL);

    return () => {
      clearTimeout(timeout);
    };
  }, [displayedSessionIndex]);


  // animate circularProgress using canvas for high performance
  React.useEffect(() => {
    let start = new Date().getTime();

    let lastMovieIndex = displayedSessionIndexRef.current; // for preventing that animation and change of displayedSession are out of sync

    const intervalCorrection = 70; // correct for any delays happening for whatever reason

    let draw = () => {
      const now = new Date().getTime();
      let diff = now - start;

      // reset animation if either TRANSITION_INTERVAL ms have ellapsed or if displayedSession changed
      if(diff >= (TRANSITION_INTERVAL + intervalCorrection) || displayedSessionIndexRef.current !== lastMovieIndex) {
        start = now;
        diff = 0;
        lastMovieIndex = displayedSessionIndexRef.current;
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


  const displayedSession = sessionsWithUniqueMoviesPerDay[displayedSessionIndex];
  const displayedSessionMovie = movies.find(m => m.tmdbId === displayedSession.movieId);

  return (
    <main>
      <Head>
        <title>Astral</title>

        <link rel="stylesheet" href="https://use.typekit.net/ekd8nvl.css"/>
      </Head>

      <section>
        {movies.map(m => (
          <MovieImage
            key={m.tmdbId}
            type="backdrop"
            src={m.backdropPath}
            hidden={m.tmdbId !== displayedSession.movieId}
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
              <p>{(() => {
                if(isToday(displayedSession.startTime)) return "Today";
                else if(isTomorrow(displayedSession.startTime)) return "Tomorrow";
                
                return format(displayedSession.startTime, 'iiii');
              })()}</p>
            </div>

            <div className="title">
              <p className="date">{format(displayedSession.startTime, 'dd')}</p>
              <h2>{displayedSessionMovie.title}</h2>
            </div>

            <div className="details-row">
              <Rating
                size="small"
                value={displayedSessionMovie.imdbRating * 5/10}
                max={5}
                precision={0.1}
                readOnly 
                emptyIcon={<StarBorderIcon color="primary" fontSize="small"/>}
                className={rating.className}
              />
              <p className="genre">
                <strong>Genre: </strong>
                <span>{displayedSessionMovie.genres.join(', ')}</span>
              </p>
            </div>
          
            <div className="schedule">
              <p>Session schedule:</p>
              <div className="sessions">
                <ToggleButtonGroup
                  exclusive
                  value={displayedSession.id}
                  onChange={(event, value) => setSelectedSession(value)}
                >
                  {sessions
                    .filter(s => s.movieId === displayedSession.movieId && isSameDay(s.startTime, displayedSession.startTime))
                    .map(s => {
                      const formattedStartTime = format(s.startTime, 'HH:mm');
                      return (
                        <ToggleButton
                          key={s.id}
                          value={s.id}
                          disableRipple
                          aria-label={formattedStartTime} 
                          classes={{root: btnSession.className, selected: btnSessionSelected.className}}
                        >{formattedStartTime}</ToggleButton>
                      );
                  })}
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
              <IconButton size="small" className={btnTimeline.className} onClick={() => changeDisplayedSessionIndex(-1)}>
                <ChevronLeftIcon/>
              </IconButton>

              <canvas className="circularProgress" ref={circularProgressRef}/>
              <IconButton className={btnTimeline.className} onClick={() => changeDisplayedSessionIndex(1)}>
                <ChevronRightIcon/>
              </IconButton>
            </div>
            
            <TransitionGroup component={null}>
              <CSSTransition key={displayedSessionIndex} timeout={TRANSITION_DURATION}>
                <div className="posters">
                  {(() => {
                    const posters = [];
                    
                    const arrangedSessions = sessionsWithUniqueMoviesPerDay
                      .slice(displayedSessionIndex)
                      .concat(sessionsWithUniqueMoviesPerDay
                        .slice(0, displayedSessionIndex)
                      );

                    // put last poster at front
                    // important for making posters slider work in both directions
                    arrangedSessions.unshift(arrangedSessions.pop());
                    
                    arrangedSessions.forEach((session, i) => {
                      const movie = movies.find(m => m.tmdbId === session.movieId);

                      let separator;
                      if(i < sessionsWithUniqueMoviesPerDay.length - 1) {
                        const nextSession = arrangedSessions[i + 1];

                        if(!isSameDay(nextSession.startTime, session.startTime)) {
                          const separatorLabel = isTomorrow(nextSession.startTime) ? "Tomorrow" : format(nextSession.startTime, 'iiii');
                          
                          separator = (
                            <div className="separator">
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
  
                              <p>{separatorLabel}</p>
                            </div>
                          );
                        }
                      }

                      posters.push((
                        <div key={session.id} className={classNames('poster', {'has-separator': separator})}>
                          <p className="date">{format(session.startTime, 'dd')}</p>
                          <MovieImage type="poster" src={movie.posterPath} className={imgPoster.className}/>
                          {separator}
                        </div>
                      ));
                    });

                    return posters
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

        .timeline .posters .poster {
          transform: translateX(calc(-100% - 21px));
        }

        .timeline .posters .poster:first-child {
          margin-left: 0;
          opacity: 0;
        }

        .timeline .posters.enter {
            position: absolute;
            opacity: 0;
        }

        .timeline .posters.exit .poster {
            transform: translateX(calc(-100% - 21px));
        }


        .timeline.slide-forwards .posters.exit-active .poster {
            transform: translateX(calc(-200% - 42px));
            transition: all ${TRANSITION_DURATION}ms;
        }

        .timeline.slide-forwards .posters.exit-active .poster.has-separator:nth-child(2) {
          transform: translateX(calc(-200% - 63px));
        }

        .timeline.slide-forwards .posters.exit-active .poster.has-separator:nth-child(2) ~ .poster {
          transform: translateX(calc(-200% - 63px));
        }

        .timeline.slide-forwards .posters.exit-active .poster:nth-child(2) {
          opacity: 0;
        }

        .timeline.slide-forwards .posters.exit-active .poster:nth-child(2) .separator {
          transform: translateY(-14px);
          transition: transform ${TRANSITION_DURATION}ms;
        }


        .timeline.slide-backwards .posters.exit .poster.has-separator:first-child {
          margin-left: -21px;
          margin-right: 42px;
        }

        .timeline.slide-backwards .posters.exit .poster.has-separator:first-child .separator {
          transform: translateY(-14px);
        }

        .timeline.slide-backwards .posters.exit-active .poster {
          transform: translateX(0);
          transition: all ${TRANSITION_DURATION}ms;
        }

        .timeline.slide-backwards .posters.exit-active .poster.has-separator:first-child {
          transform: translateX(21px);
        }

        .timeline.slide-backwards .posters.exit-active .poster.has-separator:first-child .separator {
          transform: translateY(0);
          transition: transform ${TRANSITION_DURATION}ms;
        }

        .timeline.slide-backwards .posters.exit-active .poster.has-separator:first-child ~ .poster {
          transform: translateX(21px);
        }

        .timeline.slide-backwards .posters.exit-active > :first-child {
          opacity: 1;
        }
      `}</style>
    </main>
  );
}