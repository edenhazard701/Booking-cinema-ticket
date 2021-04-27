import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';

import { Grid, GridList, Typography } from '@material-ui/core';
import styles from './styles';
import MovieCard from '../MovieCard/MovieCard';

class MovieList extends Component {
  state = {
    movies: []
  };
  componentDidMount() {
    this.getMovies();
  }
  async getMovies() {
    try {
      const url = 'http://localhost:3001/movies';
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const responseData = await response.json();
      if (response.ok) {
        this.setState({ movies: responseData });
      }
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    const { classes } = this.props;
    const { movies } = this.state;
    return (
      <Container maxWidth="xl" className={classes.container}>
        <Grid
          className={classes.fullHeight}
          container
          alignItems="center"
          justify="center"
          spacing={5}>
          <Grid item xs={3}>
            <div className={classes.title}>
              <Typography className={classes.h2} variant="h2" color="inherit">
                Latest News
              </Typography>
              <Typography className={classes.h4} variant="h4" color="inherit">
                Covering March & April 2015
              </Typography>
            </div>
          </Grid>
          <Grid item xs={9}>
            <GridList className={classes.gridList} cols={2.5}>
              {movies.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </GridList>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

MovieList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(MovieList);
