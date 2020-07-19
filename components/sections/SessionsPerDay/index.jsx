import React from 'react';

import Timeline from 'components/sections/SessionsPerDay/Timeline.jsx';


export default function() {
    return (
        <section className="container">
            <h2>All movies</h2>
            <Timeline/>

            <style jsx>{`
                section {
                    padding-top: 70px;
                }
            `}</style>
        </section>
    );
}