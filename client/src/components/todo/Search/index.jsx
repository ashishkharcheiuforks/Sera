// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { debounce } from "lodash";
import { TransitionGroup } from "react-transition-group";

import Resize from "../../anims/Resize";
import { searchCategory } from "../../../actions/todoFiltersActions";

import CategoryComponent from "../Category";
import type { Category } from "../../../models/category";

import {
  Container,
  ContentInput,
  Input,
  Suggestions,
  Suggestion,
  itemAnimationStyle
} from "./style";

const waitTime = 300;

type Props = {
  doSearchCategory: (string, (Array<Category>) => void) => void
};

type State = {
  text: string,
  categories?: Array<Category>,
  suggestionsVisible: boolean,
  inputHeight: number
};

class SearchComponent extends Component<Props, State> {
  state = {
    text: "",
    categories: undefined,
    suggestionsVisible: false,
    inputHeight: 0
  };

  debounceSearch = undefined;

  contentInput = undefined;

  constructor(props) {
    super(props);
    this.contentInput = React.createRef();
  }

  componentDidMount() {
    this.debounceSearch = debounce(() => this.searchCategories(), waitTime, {
      leading: false,
      trailing: true
    });
    if (this.contentInput !== undefined) {
      this.setState({ inputHeight: this.contentInput.current.clientHeight });
    }
  }

  componentWillUnmount() {
    if (this.debounceSearch !== undefined) {
      this.debounceSearch.cancel();
    }
  }

  handleOnTextChange = (e: {}) => {
    const text = e.target.value;
    this.setState({ text });
    if (this.debounceSearch !== undefined) {
      this.debounceSearch();
    }
  };

  handleOnInputBlur = () => {
    this.setState({ suggestionsVisible: false, categories: undefined });
  };

  searchCategories = () => {
    const { text } = this.state;
    const { doSearchCategory } = this.props;
    if (text === "") {
      this.setState({ suggestionsVisible: false, categories: undefined });
      return;
    }
    doSearchCategory(text, categories => {
      console.log("categories", categories);
      this.setState({ suggestionsVisible: true, categories });
    });
  };

  render() {
    const { text, categories, suggestionsVisible, inputHeight } = this.state;

    return (
      <Container>
        <ContentInput ref={this.contentInput}>
          <Input
            value={text}
            placeholder="Type to search"
            onChange={e => this.handleOnTextChange(e)}
            onBlur={this.handleOnInputBlur}
          />
        </ContentInput>
        <Suggestions
          top={inputHeight}
          className={`${suggestionsVisible ? "" : "empty"}`}
        >
          <TransitionGroup>
            {categories !== undefined &&
              categories.map((category, i) => (
                <Resize
                  key={category.id}
                  style={itemAnimationStyle(i === categories.length - 1)}
                >
                  <Suggestion>
                    <CategoryComponent category={category} onClick={() => {}} />
                  </Suggestion>
                </Resize>
              ))}
          </TransitionGroup>
        </Suggestions>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  doSearchCategory: (text, callback) => dispatch(searchCategory(text, callback))
});

export default connect(
  undefined,
  mapDispatchToProps
)(SearchComponent);
