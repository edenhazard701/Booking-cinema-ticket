import {
  SET_SELECTED_SEATS,
  SET_SELECTED_CINEMA,
  SET_SELECTED_DATE,
  SET_SELECTED_TIME,
  SET_INVITATION,
  TOGGLE_LOGIN_POPUP,
  SHOW_INVITATION_FORM,
  RESET_CHECKOUT,
  SET_SUGGESTED_SEATS,
  SET_QR_CODE
} from '../types';

export const setSelectedSeats = seats => ({
  type: SET_SELECTED_SEATS,
  payload: seats
});

export const setSuggestedSeats = seats => ({
  type: SET_SUGGESTED_SEATS,
  payload: seats
});

export const setSelectedCinema = cinema => ({
  type: SET_SELECTED_CINEMA,
  payload: cinema
});
export const setSelectedDate = date => ({
  type: SET_SELECTED_DATE,
  payload: date
});
export const setSelectedTime = time => ({
  type: SET_SELECTED_TIME,
  payload: time
});
export const setInvitation = event => ({
  type: SET_INVITATION,
  payload: event
});

export const setQRCode = QRCode => ({
  type: SET_QR_CODE,
  payload: QRCode
});

export const toggleLoginPopup = () => ({ type: TOGGLE_LOGIN_POPUP });
export const showInvitationForm = () => ({ type: SHOW_INVITATION_FORM });
export const resetCheckout = () => ({ type: RESET_CHECKOUT });
