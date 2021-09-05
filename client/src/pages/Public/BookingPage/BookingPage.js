import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Grid, Container } from '@material-ui/core';
import Navbar from '../../../layouts/Public/components/Navbar/Navbar';
import {
  getMovie,
  getCinema,
  getCinemas,
  getShowtimes,
  getReservations,
  setSelectedSeats,
  setSelectedCinema,
  setSelectedTime,
  toggleLoginPopup
} from '../../../store/actions';
import { ResponsiveDialog } from '../../../components';
import LoginForm from '../Login/components/LoginForm';
import styles from './styles';
import MovieInfo from './components/MovieInfo/MovieInfo';
import BookingForm from './components/BookingForm/BookingForm';
import BookingSeats from './components/BookingSeats/BookingSeats';
import BookingCheckout from './components/BookingCheckout/BookingCheckout';

class BookingPage extends Component {
  componentDidMount() {
    this.props.getCinemas();
    this.props.getMovie(this.props.match.params.id);
    this.props.getShowtimes();
    this.props.getReservations();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedCinema !== this.props.selectedCinema) {
      this.props.getCinema(this.props.selectedCinema);
    }
  }

  onSelectSeat = async (row, seat) => {
    const { cinema, selectedSeats, setSelectedSeats } = this.props;
    const seats = [...cinema.seats];
    if (seats[row][seat] === 1) return;

    const newSeats = [...seats];
    let selectedSeatsTotal = 0;

    if (seats[row][seat] === 2) {
      newSeats[row][seat] = 0;
      selectedSeatsTotal = selectedSeats - 1;
    } else {
      newSeats[row][seat] = 2;
      selectedSeatsTotal = selectedSeats + 1;
    }
    setSelectedSeats(selectedSeatsTotal);
  };

  async checkout(seats) {
    const { movie, cinema, selectedSeats, selectedTime } = this.props;
    if (!selectedSeats) return;
    try {
      const url = '/reservations';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startAt: selectedTime,
          seats,
          ticketPrice: cinema.ticketPrice,
          total: selectedSeats * cinema.ticketPrice,
          movieId: movie._id,
          cinemaId: cinema._id
        })
      });
      const reservation = await response.json();
      if (response.ok) {
        console.log(reservation);
        this.props.getReservations();
        // Need to reset Checkout State
      }
    } catch (error) {
      console.log(error);
    }
  }

  async bookSeat() {
    const { isAuth, toggleLoginPopup } = this.props;
    if (!isAuth) return toggleLoginPopup();

    const { cinema, selectedSeats } = this.props;
    const seats = [...cinema.seats];

    if (!selectedSeats) return;
    // const newSeats = seats.map(row =>
    //   row.map(seat => ([1, 2].includes(seat) ? 1 : 0))
    // );

    // const totalBookedSeats = newSeats
    //   .reduce((a, b) => a.concat(b))
    //   .reduce((a, b) => a + b);

    const bookedSeats = seats
      .map(row =>
        row.map((seat, i) => (seat === 2 ? i : -1)).filter(seat => seat !== -1)
      )
      .map((seats, i) => (seats.length ? seats.map(seat => [i, seat]) : -1))
      .filter(seat => seat !== -1)
      .reduce((a, b) => a.concat(b));

    this.checkout(bookedSeats);
  }

  onFilterCinema() {
    const { cinemas, showtimes, selectedCinema, selectedTime } = this.props;
    const initialReturn = { uniqueCinemas: [], uniqueTimes: [] };
    if (!showtimes || !cinemas) return initialReturn;

    const uniqueCinemasId = showtimes
      .filter(showtime =>
        selectedTime ? showtime.startAt === selectedTime : true
      )
      .map(showtime => showtime.cinemaId)
      .filter((value, index, self) => self.indexOf(value) === index);

    const uniqueCinemas = cinemas.filter(cinema =>
      uniqueCinemasId.includes(cinema._id)
    );

    const uniqueTimes = showtimes
      .filter(showtime =>
        selectedCinema ? selectedCinema === showtime.cinemaId : true
      )
      .map(showtime => showtime.startAt)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort(
        (a, b) => new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b)
      );

    return { ...initialReturn, uniqueCinemas, uniqueTimes };
  }

  onGetReservedSeats = () => {
    const { reservations, cinema, selectedTime } = this.props;
    const filteredReservations = reservations.filter(
      reservation => reservation.startAt === selectedTime
    );
    if (filteredReservations.length && cinema && selectedTime) {
      const reservedSeats = filteredReservations
        .map(reservation => reservation.seats)
        .reduce((a, b) => a.concat(b));
      const newSeats = [...cinema.seats];
      reservedSeats.forEach(([row, seat]) => (newSeats[row][seat] = 1));
      return newSeats;
    }
    if (cinema) return cinema.seats;
  };

  onChangeCinema = event => this.props.setSelectedCinema(event.target.value);
  onChangeTime = event => this.props.setSelectedTime(event.target.value);

  render() {
    const {
      classes,
      movie,
      cinema,
      selectedSeats,
      selectedCinema,
      selectedTime,
      showLoginPopup,
      toggleLoginPopup
    } = this.props;
    const { uniqueCinemas, uniqueTimes } = this.onFilterCinema();
    const seats = this.onGetReservedSeats();

    return (
      <div className={classes.root}>
        <Navbar />
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={2} style={{ height: '100%' }}>
            <MovieInfo movie={movie} />
            <Grid item lg={9} xs={12} md={12}>
              <BookingForm
                cinemas={uniqueCinemas}
                times={uniqueTimes}
                selectedCinema={selectedCinema}
                selectedTime={selectedTime}
                onChangeCinema={this.onChangeCinema}
                onChangeTime={this.onChangeTime}
              />

              {cinema && selectedCinema && selectedTime && (
                <>
                  <BookingSeats
                    cinema={cinema}
                    seats={seats}
                    selectedSeats={selectedSeats}
                    onSelectSeat={(indexRow, index) =>
                      this.onSelectSeat(indexRow, index)
                    }
                    onBookSeats={() => this.bookSeat()}
                  />
                  <BookingCheckout
                    ticketPrice={cinema.ticketPrice}
                    seatsAvailable={cinema.seatsAvailable}
                    selectedSeats={selectedSeats}
                    onBookSeats={() => this.bookSeat()}
                  />
                </>
              )}
            </Grid>
          </Grid>
        </Container>
        <ResponsiveDialog
          id="Edit-cinema"
          open={showLoginPopup}
          handleClose={() => toggleLoginPopup()}
          maxWidth="sm">
          <LoginForm />
        </ResponsiveDialog>
      </div>
    );
  }
}

BookingPage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (
  {
    authState,
    movieState,
    cinemaState,
    showtimeState,
    reservationState,
    checkoutState
  },
  ownProps
) => ({
  isAuth: authState.isAuthenticated,
  user: authState.user,
  movie: movieState.selectedMovie,
  cinema: cinemaState.selectedCinema,
  cinemas: cinemaState.cinemas,
  showtimes: showtimeState.showtimes.filter(
    showtime => showtime.movieId === ownProps.match.params.id
  ),
  reservations: reservationState.reservations,
  selectedSeats: checkoutState.selectedSeats,
  selectedCinema: checkoutState.selectedCinema,
  selectedTime: checkoutState.selectedTime,
  showLoginPopup: checkoutState.showLoginPopup
});

const mapDispatchToProps = {
  getMovie,
  getCinema,
  getCinemas,
  getShowtimes,
  getReservations,
  setSelectedSeats,
  setSelectedCinema,
  setSelectedTime,
  toggleLoginPopup
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BookingPage));
