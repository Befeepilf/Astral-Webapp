import React from 'react';

import {useSelector} from 'react-redux';
import {resolve} from 'styled-jsx/css';

import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isSameDay from 'date-fns/isSameDay';
import format from 'date-fns/format';

import Rating from '@material-ui/lab/Rating';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Button from '@material-ui/core/Button';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import ConfirmationNumberOutlinedIcon from '@material-ui/icons/ConfirmationNumberOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';

import Separator from 'components/Separator.jsx';

import {TEXT_PRIMARY} from 'colors.js';

import styles from 'styles/sections/MoviesPerDay/MovieDetails.css';


const day = resolve`
    margin-bottom: -35px;
`;

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


export default function(props) {
    const [selectedSession, setSelectedSession] = React.useState();

    const allMovieSessionsToday = useSelector(({sessions}) => sessions.filter(s => s.movieId === props.movie.tmdbId && isSameDay(s.startTime, props.startTime)));

    return (
        <div className="details">

            <Separator thin height={102} label={(() => {
                if(isToday(props.startTime)) return "Today";
                else if(isTomorrow(props.startTime)) return "Tomorrow";
                
                return format(props.startTime, 'iiii');
            })()} className={day.className}/>

            <div className="title">
                <p className="date">{format(props.startTime, 'dd')}</p>
                <h2>{props.movie.title}</h2>
            </div>

            <div className="details-row">
                <Rating
                    size="small"
                    value={props.movie.imdbRating * 5/10}
                    max={5}
                    precision={0.1}
                    readOnly 
                    emptyIcon={<StarBorderIcon color="primary" fontSize="small"/>}
                    className={rating.className}
                />
                <p className="genre">
                    <strong>Genre: </strong>
                    <span>{props.movie.genres.join(', ')}</span>
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
                        {allMovieSessionsToday.map(s => {
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
            
            {day.styles}
            {rating.styles}
            {btnSession.styles}
            {btnSessionSelected.styles}
            {btnBookSession.styles}
            {btnBookSessionIcon.styles}
            {btnMore.styles}
            {btnMoreIcon.styles}

            <style jsx>{styles}</style>

        </div>
    );
}