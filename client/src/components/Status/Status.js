import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'inline-block',
    borderRadius: '50%',
    flexGrow: 0,
    flexShrink: 0
  },
  sm: {
    height: theme.spacing(1),
    width: theme.spacing(1)
  },
  md: {
    height: theme.spacing(2),
    width: theme.spacing(2)
  },
  lg: {
    height: theme.spacing(3),
    width: theme.spacing(3)
  },
  neutral: {
    backgroundColor: theme.palette.common.neutral
  },
  primary: {
    backgroundColor: theme.palette.primary.main
  },
  info: {
    backgroundColor: theme.palette.info.main
  },
  warning: {
    backgroundColor: theme.palette.warning.main
  },
  danger: {
    backgroundColor: theme.palette.danger.main
  },
  success: {
    backgroundColor: theme.palette.success.main
  }
});

const Status = props => {
  const { classes, className, size, color, ...rest } = props;

  const rootClassName = classNames(
    {
      [classes.root]: true,
      [classes[size]]: size,
      [classes[color]]: color
    },
    className
  );

  return <span {...rest} className={rootClassName} />;
};

Status.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    'neutral',
    'primary',
    'info',
    'success',
    'warning',
    'danger'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

Status.defaultProps = {
  size: 'md',
  color: 'default'
};

export default withStyles(styles)(Status);
