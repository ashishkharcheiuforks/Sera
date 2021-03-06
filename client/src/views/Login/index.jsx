import React from "react";
import PropTypes from "prop-types";
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";

import Snackbar from "~/components/Snackbar";
import Button from "~/components/Button";

import * as authActions from "~/actions/authActions";
import * as messageActions from "~/actions/messageActions";

import { getCurrentBaseUrl } from "~/utils/Common";
import { SeraLogo } from "~/assets/Svgs";

import {
  Container,
  LoginContainer,
  ContentDeclaration,
  Title,
  Description,
  ContentLogo,
  ButtonGoogleLogin,
  GoogleIcon,
  Label,
  ContentButtonGuest,
  ContentTip,
  Tip,
} from "./style";

const Login = ({
  message,
  enterAsGuest,
  authenticateGoogleToken,
  hideMessage,
}) => {
  const responseGoogle = (response) => {
    if (response.code !== undefined) {
      authenticateGoogleToken(response.code);
    }
  };
  return (
    <Container>
      <ContentDeclaration>
        <Title>This is an Experimental App</Title>
        <Description>
          {`Dont use to store your confidential data. This app is Highly
            experimental and has been created only for my personal test. Entering
            as a guest will not save any information (all data will be lost if you
            refresh this page or close your browser) and some feature may not be
            available`}
        </Description>
      </ContentDeclaration>
      <LoginContainer>
        <ContentLogo>{SeraLogo}</ContentLogo>
        <GoogleLogin
          clientId="489823671693-0vvlltnvkavfa37o2jl123jb57ulcphu.apps.googleusercontent.com"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          accessType="offline"
          responseType="code"
          redirectUri={getCurrentBaseUrl}
          render={(renderProps) => (
            <ButtonGoogleLogin onClick={renderProps.onClick}>
              <GoogleIcon className="icon-google-g">
                <span className="path1" />
                <span className="path2" />
                <span className="path3" />
                <span className="path4" />
              </GoogleIcon>
              <span>Log in with Google</span>
            </ButtonGoogleLogin>
          )}
        />
        <Label>or</Label>
        <ContentButtonGuest>
          <Button onClick={() => enterAsGuest()}>Enter as Guest</Button>
        </ContentButtonGuest>
        <ContentTip>
          <Tip>“Don’t wish it was easier wish you were better”</Tip>
        </ContentTip>
      </LoginContainer>
      <Snackbar
        show={message.show}
        isError={message.isError}
        message={message.text}
        onClose={() => hideMessage()}
      />
    </Container>
  );
};

Login.propTypes = {
  message: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    text: PropTypes.string,
  }).isRequired,
  enterAsGuest: PropTypes.func.isRequired,
  authenticateGoogleToken: PropTypes.func.isRequired,
  hideMessage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  message: state.message,
});

const mapDispatchToProps = (dispatch) => ({
  enterAsGuest: () => {
    dispatch(authActions.enterAsGuest());
  },
  authenticateGoogleToken: (idToken) => {
    dispatch(authActions.authenticateGoogleToken(idToken));
  },
  hideMessage: () => {
    dispatch(messageActions.hideMessage());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
