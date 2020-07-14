import React from 'react';
import "./rank.css"

const Rank = ({name, entries}) => {
    return (
        <div className="rank1">
            <div className='white f3 pl1 pr1'>
                {`${name}, you have identified: `}
            </div>
            <div className='white f2 pl1 pr1'>
                {entries}
            </div>
            <div className='white f3 pl1 pr1'>
                {'faces!'}
            </div>
        </div>
    );
}
export default Rank;