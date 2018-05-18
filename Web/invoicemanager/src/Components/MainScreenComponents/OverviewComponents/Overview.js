
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Header from '../../HeaderComponents/Header';
import Menu from '../../MenuComponents/Menu';
import * as firebase from 'firebase';
import {withRouter} from 'react-router-dom';

//Import CSS
import './Overview.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});
class Overview extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      unPaid: '1100, 20'
    };
  }

  customgrid(props) {
    const { classes } = props;
    return props;
  }

  render () {
    const classes = this.customgrid;
    return  (
      <div>
        <Header headerTitle="Overzicht"/>
        <Menu /> 
        <div>
        <div>
          <div className="container paddingClass">
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Paper className="unPaid paddingClass shadowClass">Bedrag bij Cliënten: <strong>€{this.state.unPaid}</strong></Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className="paddingClass shadowClass">
                  
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className="paddingClass shadowClass">xs=6</Paper>
              </Grid>
            </Grid>
          </div>
        </div>
        </div>
      </div>
    )
  }
}
Overview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Overview);