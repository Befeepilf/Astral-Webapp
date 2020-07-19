import React from 'react';

import {useSelector} from 'react-redux';
import isSameDay from 'date-fns/isSameDay';

import MovieImage from 'components/MovieImage.jsx';
import MovieDetails from 'components/sections/MoviesPerDay/MovieDetails.jsx';
import MovieTimeline from 'components/sections/MoviesPerDay/MoviesTimeline.jsx';

import {BG} from 'colors.js';
import styles from 'styles/sections/MoviesPerDay/index.css';


const TRANSITION_INTERVAL = 10000; // interval in ms for switching displayedSession
const TRANSITION_DURATION = 2000;


export default function Home() {
    const sessionsWithUniqueMoviesPerDay = useSelector(({sessions}) => (
        sessions.filter(s1 => !sessions.find(s2 => s2.id !== s1.id && isSameDay(s2.startTime, s1.startTime) && s2.movieId === s1.movieId))
    ));

    const movies = useSelector(({movies}) => movies);

    const [displayedSessionIndex, setDisplayedSessionIndex] = React.useState(0);
    const displayedSession = sessionsWithUniqueMoviesPerDay[displayedSessionIndex];
    const displayedSessionMovie = movies.find(m => m.tmdbId === displayedSession.movieId);

    const isTransitioningRef = React.useRef(false); // for blocking displayedSessionIndex changes while a transition is taking place

    function changeDisplayedSessionIndex(change) {
        let newDisplayedSessionIndex = displayedSessionIndex + change;
        if(newDisplayedSessionIndex < 0) {
            newDisplayedSessionIndex = sessionsWithUniqueMoviesPerDay.length - 1;
        }
        else if(newDisplayedSessionIndex > sessionsWithUniqueMoviesPerDay.length - 1) {
            newDisplayedSessionIndex = 0;
        }
    
        if(!isTransitioningRef.current) {            
            setDisplayedSessionIndex(newDisplayedSessionIndex);
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
    }, [displayedSession]);

    return (
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
                <MovieDetails
                    movie={displayedSessionMovie}
                    startTime={displayedSession.startTime}
                />

                <MovieTimeline
                    sessions={sessionsWithUniqueMoviesPerDay}
                    displayedSessionIndex={displayedSessionIndex}
                    changeDisplayedSessionIndex={changeDisplayedSessionIndex}
                    transitionInterval={TRANSITION_INTERVAL}
                    transitionDuration={TRANSITION_DURATION}
                />
            </div>

            <style jsx>{styles}</style>
            <style jsx>{`
                section::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    background: linear-gradient(to top, ${BG}, transparent, rgba(0, 0, 0, 1)), linear-gradient(to bottom left, transparent, rgba(0, 0, 0, 1));
                }
            `}</style>
        </section>
    );
}