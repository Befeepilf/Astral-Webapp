import React from 'react';

import classNames from 'classnames';
import {resolve} from 'styled-jsx/css';
import {useSelector} from 'react-redux';

import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';

import IconButton from '@material-ui/core/IconButton';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {CSSTransition, TransitionGroup} from 'react-transition-group';

import MovieImage from 'components/MovieImage.jsx';
import Separator from 'components/Separator.jsx';

import styles from 'styles/sections/MoviesPerDay/MoviesTimeline.css';
import {dateToDayName} from 'util.js';


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

const separatorStyles = resolve`
    display: flex;
    position: absolute;
    right: -21px;
    bottom: 0;
`;


export default function(props) {
    const movies = useSelector(({movies}) => movies);

    const arrangedSessions = props.sessions
        .slice(props.displayedSessionIndex)
        .concat(props.sessions.slice(0, props.displayedSessionIndex));
  
    // create a padding of one session on the left of the selected session
    // important for making posters slider work in both directions
    arrangedSessions.unshift(arrangedSessions.pop());

    const prevDisplayedSessionIndex = React.useRef(props.displayedSessionIndex);
    
    let slideDirection = props.displayedSessionIndex - prevDisplayedSessionIndex.current; // indicates whether to slide forwards or backwards
    if(prevDisplayedSessionIndex.current === props.sessions.length - 1 && props.displayedSessionIndex === 0) {
        slideDirection = 1;
    }
    else if(prevDisplayedSessionIndex.current === 0 && props.displayedSessionIndex === props.sessions.length - 1) {
        slideDirection = -1;
    }


    const animationRequestRef = React.useRef();
    const circularProgressRef = React.useRef();


    // animate circularProgress using canvas for high performance
    React.useEffect(() => {
        let start = new Date().getTime();

        const intervalCorrection = 70; // correct for any delays happening for whatever reason

        let draw = () => {
            const now = new Date().getTime();
            let diff = now - start;

            // reset animation if either props.transitionInterval ms have ellapsed or if displayedSession changed
            if(diff >= (props.transitionInterval + intervalCorrection)) {
                start = now;
                diff = 0;
            }

            const ctx = circularProgressRef.current.getContext('2d');
            circularProgressRef.current.width = 52 * window.devicePixelRatio;
            circularProgressRef.current.height = 52 * window.devicePixelRatio;

            ctx.arc(26, 26, 25, 0, diff / (props.transitionInterval + intervalCorrection) * 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            animationRequestRef.current = window.requestAnimationFrame(draw);
        }

        animationRequestRef.current = window.requestAnimationFrame(draw);

        return () => window.cancelAnimationFrame(animationRequestRef.current);
    }, [props.displayedSessionIndex]);


    React.useEffect(() => {
        prevDisplayedSessionIndex.current = props.displayedSessionIndex;
    }, [props.displayedSessionIndex]);


    return (
        <div className={classNames('timeline', slideDirection < 0 ? 'slide-backwards' : 'slide-forwards')}>
            <div className="actions">
                <IconButton size="small" className={btnTimeline.className} onClick={() => props.changeDisplayedSessionIndex(-1)}>
                    <ChevronLeftIcon/>
                </IconButton>

                <canvas className="circularProgress" ref={circularProgressRef}/>
                <IconButton className={btnTimeline.className} onClick={() => props.changeDisplayedSessionIndex(1)}>
                    <ChevronRightIcon/>
                </IconButton>
            </div>
            
            <TransitionGroup component={null}>
                <CSSTransition key={props.displayedSessionIndex} timeout={props.transitionDuration}>
                    <div className="posters">
                        {(() => {
                            const posters = [];
                            
                            arrangedSessions.forEach((session, i) => {
                                const movie = movies.find(m => m.tmdbId === session.movieId);

                                let separator;
                                if(i < props.sessions.length - 1) {
                                    const nextSession = arrangedSessions[i + 1];

                                    if(!isSameDay(nextSession.startTime, session.startTime)) {
                                        separator = <Separator height={401} label={dateToDayName(nextSession.startTime)} className={separatorStyles.className}/>;
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

            {btnTimeline.styles}
            {posters.styles}   
            {imgPoster.styles}
            {separatorStyles.styles}

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

                @keyframes stretchPosters {
                    0% {
                        transform: scaleX(1);
                    }
                    28% {
                        transform: scaleX(1.03);
                    }
                    100% {
                        transform: scaleX(1);
                    }
                }

                .timeline .posters.enter-active, .timeline .posters.exit-active {
                    transform-origin: left;
                    animation-name: stretchPosters;
                    animation-duration: ${props.transitionDuration}ms;
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
                    transition: all ${props.transitionDuration}ms;
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

                .timeline.slide-forwards .posters.exit-active .poster:nth-child(2) :global(.${separatorStyles.className}) {
                    transform: translateY(-14px);
                    transition: transform ${props.transitionDuration}ms;
                }


                .timeline.slide-backwards .posters.exit .poster.has-separator:first-child {
                    margin-left: -21px;
                    margin-right: 42px;
                }

                .timeline.slide-backwards .posters.exit .poster.has-separator:first-child :global(.${separatorStyles.className}) {
                    transform: translateY(-14px);
                }

                .timeline.slide-backwards .posters.exit-active .poster {
                    transform: translateX(0);
                    transition: all ${props.transitionDuration}ms;
                }

                .timeline.slide-backwards .posters.exit-active .poster.has-separator:first-child {
                    transform: translateX(21px);
                }

                .timeline.slide-backwards .posters.exit-active .poster.has-separator:first-child :global(.${separatorStyles.className}) {
                    transform: translateY(0);
                    transition: transform ${props.transitionDuration}ms;
                }

                .timeline.slide-backwards .posters.exit-active .poster.has-separator:first-child ~ .poster {
                    transform: translateX(21px);
                }

                .timeline.slide-backwards .posters.exit-active > :first-child {
                    opacity: 1;
                }
            `}</style>
        </div>
        );
}