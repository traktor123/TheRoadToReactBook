
import * as React from 'react';
import {
    StyledButtonLarge,
    StyledSearchForm,
} from './StyledComponents';

import { InputWithLabel } from './InputWithLabel';

export type SearchFormProps = {
    onSearchSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchTerm: string;
  }

export const SearchForm: React.FC<SearchFormProps> = ({ onSearchSubmit: onSearchSubmit, onSearchInput: onSearchInput, searchTerm }) => {
    return (
        <StyledSearchForm onSubmit={onSearchSubmit}>
            <InputWithLabel
                onInputChange={onSearchInput}
                value={searchTerm}
                id="search" isFocused={true}>
                <strong><strong>Search:</strong></strong>
            </InputWithLabel>
            &nbsp;
            {/* <button type="submit" disabled={!searchTerm} className={`${styles.button} ${styles.buttonSmall}`}>Submit</button> */}
            {/* <button type="submit" disabled={!searchTerm} className="smallButton1">Submit</button> */}
            <StyledButtonLarge type="submit" disabled={!searchTerm}>Submit</StyledButtonLarge>
        </StyledSearchForm>)
}