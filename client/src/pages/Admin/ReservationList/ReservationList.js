import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, CircularProgress } from '@material-ui/core';
import styles from './styles';
import { ReservationsToolbar, ReservationsTable } from './components';
import { getReservations, getMovies, getCinemas } from '../../../store/actions';
import ReservationsCalendar from './components/ReservationsCalendar/ReservationsCalendar';
import { match } from '../../../utils';

class ReservationList extends Component {
  state = { mode: 'list', search: '' };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
  };

  componentDidMount() {
    const {
      reservations,
      movies,
      cinemas,
      getReservations,
      getMovies,
      getCinemas
    } = this.props;

    if (!reservations.length) getReservations();
    if (!movies.length) getMovies();
    if (!cinemas.length) getCinemas();
  }

  onChangeMode = () =>
    this.setState(({ mode }) => ({ mode: mode === 'grid' ? 'list' : 'grid' }));

  onChangeSearch = e => this.setState({ search: e.target.value });

  render() {
    const { mode, search } = this.state;
    const { classes, reservations, movies, cinemas } = this.props;

    const filteredReservations = match(search, reservations, 'phone');

    return (
      <div className={classes.root}>
        <ReservationsToolbar
          reservations={filteredReservations}
          search={search}
          onChangeSearch={this.onChangeSearch}
          mode={mode}
          onChangeMode={this.onChangeMode}
        />
        <div className={classes.content}>
          {!filteredReservations.length ? (
            <div className={classes.progressWrapper}>
              <CircularProgress />
            </div>
          ) : mode === 'list' ? (
            <ReservationsTable
              reservations={filteredReservations}
              movies={movies}
              cinemas={cinemas}
            />
          ) : (
            <ReservationsCalendar
              reservations={filteredReservations}
              movies={movies}
              cinemas={cinemas}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ reservationState, movieState, cinemaState }) => ({
  reservations: reservationState.reservations,
  movies: movieState.movies,
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = {
  getReservations,
  getMovies,
  getCinemas
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ReservationList));
