import * as React from 'react';

import {
    StyledLabel,
    StyledInput,
} from './StyledComponents';

export type InputWithLabelProps = {
    onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    id: string;
    type?: string;
    children?: React.ReactNode;
    isFocused?: boolean;
  };

export class InputWithLabel extends React.Component<InputWithLabelProps> {

    private inputRef: React.RefObject<HTMLInputElement>;
  
    constructor(props: InputWithLabelProps) {
      super(props);
      this.inputRef = React.createRef();
    }
  
    //Class component’s lifecycle method 
    componentDidMount() {
      /*
      if (this.props.isFocused) {
        this.inputRef.current?.focus();
      }
      */
    }
  
    render() {
      const {
        id,
        value,
        type = 'text',
        onInputChange,
        children,
      } = this.props;
      return (
        <>
          <StyledLabel htmlFor={id}>{children}</StyledLabel>
          &nbsp;
          <StyledInput
            ref={this.inputRef}
            id={id}
            type={type}
            value={value}
            onChange={onInputChange} />
        </>
      );
    }
  }

/*
const InputWithLabel: React.FC<InputWithLabelProps> = ({ value, onInputChange, id, type = 'text', children, isFocused = false }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        id={id}
        type={type}
        onChange={onInputChange}
        value={value}
        ref={inputRef} />
      <p>
        Searching for <strong>{value}</strong>
      </p>
    </div>)
}
*/