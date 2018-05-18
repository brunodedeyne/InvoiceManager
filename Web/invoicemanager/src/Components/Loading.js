import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './Loading.css';

class Loading extends React.Component {
    render () {
        return (
            <MuiThemeProvider>
                <div className="Loading__DivContainer">
                    <p className="Loading__PText">Even geduld, U wordt doorverwezen naar de gevraagde pagina</p>
                    <CircularProgress size={80} thickness={5} />
                </div>
            </MuiThemeProvider>
        )
    }
};

export default Loading;