import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Drawer } from '@material-ui/core';
import { Footer, Sidebar, Topbar } from './components';

// Component styles
import styles from './styles';

class AdminLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  static defaultProps = {
    isSidebarOpen: false
  };
  static propTypes = {
    children: PropTypes.node,
    isSidebarOpen: PropTypes.bool,
    title: PropTypes.string
  };

  handleToggleOpen = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { isOpen } = this.state;
    const { title, children, classes } = this.props;
    return (
      <Fragment>
        <Topbar
          title={title}
          ToolbarClasses={classes.topbar}
          isSidebarOpen={isOpen}
          onToggleSidebar={this.handleToggleOpen}
        />
        <Drawer
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
          open={isOpen}
          onClose={this.handleClose}
          variant="persistent">
          <Sidebar className={classes.sidebar} />
        </Drawer>
        <main
          className={classnames({
            [classes.contentShift]: isOpen,
            [classes.content]: true
          })}>
          {children}
          <Footer />
        </main>
      </Fragment>
    );
  }
}

export default withStyles(styles)(AdminLayout);
