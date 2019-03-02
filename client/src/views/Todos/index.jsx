// @flow
import React, { Component } from "react";
import { connect } from "react-redux";

import LoaderLinear from "../../components/layout/LoaderLinear";
import MainAddButton from "../../components/layout/MainAddButton";
import CategoriesFilter from "../../components/todo/Category/CategoriesFilter";
import VisibilityFilter from "../../components/todo/visibility/VisibilityFilters";
import Tasks from "../../components/todo/Tasks";
import DialogAdd from "../../components/todo/dialogAdd/DialogAdd";
import Snackbar from "../../components/layout/Snackbar";

import * as todoFiltersActions from "../../actions/todoFiltersActions";
import * as messageActions from "../../actions/messageActions";
import * as commonSelectors from "../../selectors/commonSelectors";

import type { MessageState } from "../../reducers/message";

import { ContentApp, MainTopBar } from "./style";

type Props = {
  message: MessageState,
  hideMessage: () => void,
  initFetchAllCategories: () => void,
  showLoading: boolean
};

type State = {
  isDialogAddOpen: boolean
};

class Todos extends Component<Props, State> {
  state = {
    isDialogAddOpen: false
  };

  componentDidMount() {
    const { initFetchAllCategories } = this.props;
    initFetchAllCategories();
  }

  render() {
    const { isDialogAddOpen } = this.state;
    const { message, hideMessage, showLoading } = this.props;
    return (
      <ContentApp>
        <LoaderLinear show={showLoading} />
        <MainTopBar>
          <CategoriesFilter />
          <VisibilityFilter />
          <MainAddButton
            onClick={() => this.setState({ isDialogAddOpen: true })}
          />
        </MainTopBar>
        <Tasks />
        <DialogAdd
          open={isDialogAddOpen}
          onClose={() => this.setState({ isDialogAddOpen: false })}
        />
        <Snackbar
          show={message.show}
          isError={message.isError}
          message={message.text}
          onClose={() => hideMessage()}
        />
      </ContentApp>
    );
  }
}

const mapStateToProps = state => ({
  message: state.message,
  showLoading: commonSelectors.showLoading(state)
});

const mapDispatchToProps = dispatch => ({
  hideMessage: () => {
    dispatch(messageActions.hideMessage());
  },
  initFetchAllCategories: () => {
    dispatch(todoFiltersActions.fetchAllCategories());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Todos);
