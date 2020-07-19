import React from 'react';

import {useSelector} from 'react-redux';

import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';

import {dateToDayName} from 'util.js';

import styles from 'styles/sections/SessionsPerDay/Timeline.css';


const DAY_START = 46800000 // 13:00
const DAY_END = 86400000 // 24:00

export default function(props) {
    const sessionsPerDay = useSelector(({sessions}) => sessions.reduce((acc, session) => {
        const day = startOfDay(session.startTime).getTime();

        acc[day] = acc[day] || [];
        acc[day].push(session);

        return acc;
    }, {}));


    return (
        <div className="timeline">
            {Object.entries(sessionsPerDay).map(([day, sessions]) => (
                <div key={day} className="day">
                    <h3>{dateToDayName(parseInt(day))}</h3>
                    <div className="sessions">
                        {(() => {
                            let wasLabelAboveCircle = true;
                            let lastStartTime = -Infinity;

                            return sessions.map(session => {
                                const startTime = session.startTime - parseInt(day);
                                const isLabelAboveCircle = startTime - lastStartTime < 3600000 ? !wasLabelAboveCircle : true;
                                
                                const sessionElem = (
                                    <div key={session.id} className="session" style={{left: `${(startTime - DAY_START) / (DAY_END - DAY_START) * 100}%`}}>
                                        <svg viewBox="0 0 7 7" width="7">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#fff"/>
                                        </svg>

                                        <p className={isLabelAboveCircle ? 'above' : 'below'}>{format(session.startTime, 'HH:mm')}</p>
                                    </div>
                                );

                                wasLabelAboveCircle = isLabelAboveCircle;
                                lastStartTime = startTime;
                                return sessionElem;
                            });
                        })()}
                    </div>
                </div>
            ))}

            <style jsx>{styles}</style>
        </div>
    );
}