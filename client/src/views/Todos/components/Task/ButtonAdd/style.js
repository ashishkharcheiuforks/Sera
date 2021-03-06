import styled from "styled-components";

import { buttonAddCategoryTaskColors } from "~/styles/colors";
import { buttonAddCategoryTaskSizes } from "~/styles/sizes";

export const Button = styled.button`
  display: inherit;
  background: none;
  height: ${buttonAddCategoryTaskSizes.height};
  background-color: ${buttonAddCategoryTaskColors.background};
  outline: none;
  border: none;
  cursor: pointer;
  align-self: center;
  justify-self: end;
  padding: 0;
  box-sizing: border-box;
  border-radius: 50%;
`;

export const Text = styled.span`
  color: ${buttonAddCategoryTaskColors.icon};
  font-weight: 300;
  font-size: 1em;
  transition: color 200ms ease-in;
  padding-right: 5px;

  ${Button}:hover & {
    color: ${buttonAddCategoryTaskColors.iconHover};
  }
`;

export const Icon = styled.i`
  margin: auto;
  font-size: 1.2em;
  color: ${buttonAddCategoryTaskColors.icon};
  transition: color 200ms ease-in;
  padding: 0;

  ${Button}:hover & {
    color: ${buttonAddCategoryTaskColors.iconHover};
  }
`;
