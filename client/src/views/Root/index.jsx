import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { connect } from "react-redux";

import ReplaceAnim from "~/components/anims/ReplaceAnim";
import LoaderTip from "~/components/LoaderTip";

import * as paths from "~/constants/paths";
import { routes } from "~/navigation";

import * as authActions from "~/actions/authActions";
import * as authSelector from "~/selectors/authSelector";

import { Container, FlexContainer } from "./style";

class Root extends Component {
  state = {
    shouldShowLoading: true,
    showLoading: true,
    shouldShowRoute: false,
    showRoute: false
  };

  componentDidMount() {
    const { initAuth } = this.props;
    initAuth();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.isFetchingAuthentication && !state.showLoading) {
      return {
        ...state,
        shouldShowLoading: true,
        showLoading: true,
        shouldShowRoute: false,
        showRoute: false
      };
    }
    if (props.isAuthenticated && !state.showRoute) {
      return {
        ...state,
        shouldShowLoading: false,
        showLoading: false,
        shouldShowRoute: true,
        showRoute: false
      };
    }
    if (!props.isFetchingAuthentication && !props.isAuthenticated) {
      return {
        shouldShowLoading: false,
        showLoading: false,
        shouldShowRoute: false,
        showRoute: true
      };
    }
    return null;
  }

  onAnimationEnd = (node, done = () => {}) => {
    const handleAnimationEnd = () => {
      done();
      const { shouldShowLoading, shouldShowRoute } = this.state;
      if (shouldShowLoading) {
        this.setState({
          shouldShowLoading: false,
          showLoading: true,
          shouldShowRoute: false,
          showRoute: false
        });
      }
      if (shouldShowRoute) {
        this.setState({
          shouldShowLoading: false,
          showLoading: false,
          shouldShowRoute: false,
          showRoute: true
        });
      }
      node.removeEventListener("transitionend", handleAnimationEnd);
    };

    node.addEventListener("transitionend", handleAnimationEnd, false);
  };

  contentToRender = () => {
    const { isAuthenticated, logout } = this.props;
    const { showLoading, showRoute } = this.state;
    if (showLoading || !showRoute) {
      return (
        <LoaderTip
          phrase="Learn to work harder on yourself than you do on your job"
          author="Jim Rohn"
        />
      );
    }

    const nextPath = isAuthenticated ? paths.TODOS : paths.LOGIN;
    return (
      <Router>
        <Container>
          <FlexContainer>
            <Route exact path="/" render={() => <Redirect to={nextPath} />} />
            {routes.map(route => {
              if (route.Drawer !== undefined) {
                return (
                  <Route
                    key={route.key}
                    path={route.path}
                    exact
                    render={() => <route.Drawer logout={logout} />}
                  />
                );
              }
              return undefined;
            })}
            <Switch>
              {routes.map(route => (
                <Route
                  key={route.key}
                  path={route.path}
                  exact
                  render={() =>
                    isAuthenticated === route.needAuth ? (
                      <route.Main />
                    ) : (
                      <Redirect to={route.redirectTo} />
                    )
                  }
                />
              ))}
            </Switch>
          </FlexContainer>
        </Container>
      </Router>
    );
  };

  render() {
    const { showLoading, showRoute } = this.state;
    const duration = showRoute ? 250 : 1500;
    return (
      <ReplaceAnim
        in={showLoading || showRoute}
        endListener={this.onAnimationEnd}
        duration={duration}
      >
        {this.contentToRender()}
      </ReplaceAnim>
    );
  }
}

Root.propTypes = {
  initAuth: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isFetchingAuthentication: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: authSelector.isAuthenticated(state),
  isFetchingAuthentication: authSelector.isFetchingAuthentication(state)
});

const mapDispatchToProps = dispatch => ({
  initAuth: () => {
    dispatch(authActions.initAuth());
  },
  logout: () => {
    dispatch(authActions.logout());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
