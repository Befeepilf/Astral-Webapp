import React from 'react';
import classNames from 'classnames';

export default function(props) {
    return (
        <div className={classNames('separator', props.className)}>
            <svg viewBox={`0 0 7 ${props.height}`} height={props.height}>
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="42%" style={{stopColor: '#fff'}}/>
                        <stop offset="100%" style={{stopColor: 'transparent'}}/>
                    </linearGradient>
                </defs>
                <circle cx="3.5" cy="3.5" r="3.5" fill="#fff"/>
                <rect x={props.thin ? 3 : 2.8} y="7" width={props.thin ? 1.4 : 2} height={props.height - 7} fill="url(#grad1)"/>
            </svg>

            <p>{props.label}</p>

            <style jsx>{`
                .separator p {
                    position: absolute;
                    top: -12px;
                    left: 21px;
                    font-size: 1.375rem;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
}