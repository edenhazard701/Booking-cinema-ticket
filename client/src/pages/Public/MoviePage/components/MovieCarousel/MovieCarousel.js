import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import MovieCardSimple from '../MovieCardSimple/MovieCardSimple';
const useStyles = makeStyles(theme => ({
  carousel: {
    width: '85%',
    height: '100%',
    margin: 'auto'
  },
  arrow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0,0,0,.5)',
    color: theme.palette.common.white,
    textAlign: 'center',
    zIndex: 1,
    '&.prevArrow': {
      left: 0
    },
    '&.nextArrow': {
      right: 0
    }
  },

  sliderContainer: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(1),
    '& .swiper-wrapper': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '75%',
      margin: 'auto',
      '& .swiper-slide': {
        width: 'auto',
        height: 'auto'
      }
    }
  }
}));

function NextArrow(props) {
  const { classes, onClick } = props;
  return (
    <div className={classnames(classes.arrow, 'nextArrow')} onClick={onClick}>
      <ArrowForwardIos color="inherit" />
    </div>
  );
}

function PrevArrow(props) {
  const { classes, onClick } = props;
  return (
    <div className={classnames(classes.arrow, 'prevArrow')} onClick={onClick}>
      <ArrowBackIos color="inherit" />
    </div>
  );
}

function MovieCarousel({ movies = [] }) {
  const classes = useStyles();
  const settings = {
    centerMode: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    nextArrow: <NextArrow classes={classes} />,
    prevArrow: <PrevArrow classes={classes} />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  return (
    <Slider {...settings}>
      {movies.map(movie => (
        <div key={movie._id}>
          <MovieCardSimple movie={movie} />
        </div>
      ))}
    </Slider>
  );
}
export default MovieCarousel;
