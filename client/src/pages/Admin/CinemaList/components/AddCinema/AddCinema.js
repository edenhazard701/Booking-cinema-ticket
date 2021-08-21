import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField, Typography } from '@material-ui/core';
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from '../../../../../components';
import styles from './styles';
import { Add } from '@material-ui/icons';
import {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas
} from '../../../../../store/actions';

class AddCinema extends Component {
  state = {
    _id: '',
    name: '',
    image: '',
    ticketPrice: '',
    city: '',
    seatsAvailable: '',
    seats: [],
    notification: {}
  };

  componentDidMount() {
    if (this.props.editCinema) {
      this.setState({ ...this.props.editCinema });
    }
  }

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  onSubmitAction = async type => {
    const {
      getCinemas,
      createCinemas,
      updateCinemas,
      removeCinemas
    } = this.props;
    const { _id, name, ticketPrice, city, seatsAvailable, seats } = this.state;
    const cinema = { name, ticketPrice, city, seatsAvailable, seats };
    let notification = {};
    type === 'create'
      ? (notification = await createCinemas(cinema))
      : type === 'update'
      ? (notification = await updateCinemas(cinema, _id))
      : (notification = await removeCinemas(_id));
    this.setState({ notification });
    if (notification && notification.status === 'success') getCinemas();
  };

  handleSeatsChange = (index, value) => {
    if (value > 10) return;
    const { seats } = this.state;
    seats[index] = Array.from({ length: value }, () => 0);
    this.setState({
      seats
    });
  };

  onAddSeatRow = () => {
    this.setState(prevState => ({
      seats: [...prevState.seats, []]
    }));
  };

  renderSeatFields = () => {
    const { seats } = this.state;
    const { classes } = this.props;
    return (
      <>
        <div className={classes.field}>
          <Button onClick={() => this.onAddSeatRow()}>
            <Add /> add Seats
          </Button>
        </div>
        {seats.length > 0 &&
          seats.map((seat, index) => (
            <div className={classes.field}>
              <TextField
                key={`new-seat-${index}`}
                className={classes.textField}
                label={
                  'Add number of seats for row : ' +
                  (index + 10).toString(36).toUpperCase()
                }
                margin="dense"
                required
                value={seat.length}
                variant="outlined"
                type="number"
                inputProps={{
                  min: 0,
                  max: 10
                }}
                onChange={event =>
                  this.handleSeatsChange(index, event.target.value)
                }
              />
            </div>
          ))}
      </>
    );
  };

  render() {
    const { classes, className, ...rest } = this.props;
    const {
      name,
      image,
      ticketPrice,
      city,
      seatsAvailable,
      notification
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const mainTitle = this.props.editCinema ? 'Edit Cinema' : 'Add Cinema';
    const submitButton = this.props.editCinema
      ? 'Update Cinema'
      : 'Save Details';
    const submitAction = this.props.editCinema
      ? () => this.onSubmitAction('update')
      : () => this.onSubmitAction('create');

    return (
      <Portlet {...rest} className={rootClassName}>
        <PortletHeader>
          <PortletLabel title={mainTitle} />
        </PortletHeader>
        <PortletContent noPadding>
          <form autoComplete="off" noValidate>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                helperText="Please specify the cinema name"
                label="Name"
                margin="dense"
                required
                value={name}
                variant="outlined"
                onChange={event =>
                  this.handleFieldChange('name', event.target.value)
                }
              />

              <TextField
                fullWidth
                className={classes.textField}
                label="City"
                margin="dense"
                required
                variant="outlined"
                value={city}
                onChange={event =>
                  this.handleFieldChange('city', event.target.value)
                }
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Image Url"
                margin="dense"
                required
                value={image}
                variant="outlined"
                onChange={event =>
                  this.handleFieldChange('image', event.target.value)
                }
              />
            </div>

            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Ticket Price"
                margin="dense"
                type="number"
                value={ticketPrice}
                variant="outlined"
                onChange={event =>
                  this.handleFieldChange('ticketPrice', event.target.value)
                }
              />
              <TextField
                className={classes.textField}
                label="Seats Available"
                margin="dense"
                required
                value={seatsAvailable}
                variant="outlined"
                onChange={event =>
                  this.handleFieldChange('seatsAvailable', event.target.value)
                }
              />
            </div>
            {this.renderSeatFields()}
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            className={classes.buttonFooter}
            color="primary"
            variant="contained"
            onClick={submitAction}>
            {submitButton}
          </Button>
          {this.props.editCinema && (
            <Button
              className={classes.buttonFooter}
              color="dafault"
              variant="contained"
              onClick={() => this.onSubmitAction('remove')}>
              Delete Cinema
            </Button>
          )}

          {notification && notification.status ? (
            notification.status === 'success' ? (
              <Typography
                className={classes.infoMessage}
                color="primary"
                variant="caption">
                {notification.message}
              </Typography>
            ) : (
              <Typography
                className={classes.infoMessage}
                color="error"
                variant="caption">
                {notification.message}
              </Typography>
            )
          ) : null}
        </PortletFooter>
      </Portlet>
    );
  }
}

AddCinema.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = null;
const mapDispatchToProps = {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddCinema));
