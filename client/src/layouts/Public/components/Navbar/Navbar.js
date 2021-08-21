import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../../../store/actions';
import classnames from 'classnames';
import { withStyles, Typography } from '@material-ui/core';

// Component styles
import styles from './styles';

class Navbar extends Component {
  state = { showMenu: false, scrollPos: window.pageYOffset };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.setState({
      scrollPos: window.pageYOffset
    });
  };

  render() {
    const { showMenu, scrollPos } = this.state;
    const { classes, isAuth, user, logout } = this.props;
    return (
      <Fragment>
        <nav
          className={classnames({
            [classes.navbar]: true,
            [classes.navbarColor]: scrollPos > 30
          })}>
          <Link className={classes.logoLink} to="/">
            <Typography className={classes.logo} variant="h2">
              Movie +
            </Typography>
          </Link>
          <div className={classes.navLinks}>
            {user && user.role === 'superadmin' && (
              <Link className={classes.navLink} to="/admin/dashboard">
                Dashboard
              </Link>
            )}
            <Link className={classes.navLink} to="/movie/category/latest">
              Latest Movies
            </Link>
            <Link className={classes.navLink} to="/cinemas">
              Cinemas
            </Link>
            <Link className={classes.navLink} to="/">
              Page 3
            </Link>
            <Link className={classes.navLink} to="/login">
              Login
            </Link>
          </div>

          <div
            className={classes.navBtn}
            onClick={() => this.setState({ showMenu: !this.state.showMenu })}>
            <div className={classes.navIcon}>
              <div
                className={classnames(
                  classes.navIconLine,
                  classes.navIconLine__left
                )}
              />
              <div className={classes.navIconLine} />
              <div
                className={classnames(
                  classes.navIconLine,
                  classes.navIconLine__right
                )}
              />
            </div>
          </div>
        </nav>
        <div
          className={classnames({
            [classes.navActive]: showMenu,
            [classes.nav]: true
          })}>
          <div className={classes.navContent}>
            <div className={classes.currentPageShadow}>Movies</div>
            <ul className={classes.innerNav}>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/">
                  Home
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link
                  className={classes.innerNavLink}
                  to="/movie/category/latest">
                  Latest Movies
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/cinemas">
                  Cinemas
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/">
                  Page 3
                </Link>
              </li>
              {isAuth ? (
                <>
                  <li className={classes.innerNavListItem}>
                    <Link
                      className={classes.innerNavLink}
                      to="/admin/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className={classes.innerNavListItem}>
                    <Link
                      className={classes.innerNavLink}
                      onClick={logout}
                      to="/">
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <li className={classes.innerNavListItem}>
                  <Link className={classes.innerNavLink} to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.authState.isAuthenticated,
  user: state.authState.user
});

const mapDispatchToProps = {
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Navbar));
