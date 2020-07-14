import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png'
import './logo.css'

const Logo = () => {
    return(
        <div className = {'ma4 mt0 center'}>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 140, width: 140 }} >
                <div className="Tilt-inner pa1"> 
                    <img style={{paddingTop: '20px'}} alt='logo' src={brain} /> 
                </div>
            </Tilt>
        </div>
    );
}

export default Logo

// {/* <div className = 'ma4 mt0 '> */}