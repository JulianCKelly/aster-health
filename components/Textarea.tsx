import { FC, ChangeEvent } from 'react';
import { C } from '../lib/constants';

export interface TextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  minHeight?: string;
}

/**
 * A styled textarea used for accepting user input. It is controlled via
 * props and supports a configurable minimum height.
 */
const Textarea: FC<TextareaProps> = ({ value, onChange, placeholder, minHeight = '220px' }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: '100%',
      minHeight,
      background: 'rgba(0,0,0,0.35)',
      border: `1px solid ${C.border}`,
      borderRadius: '6px',
      color: C.textDim,
      fontFamily: 'inherit',
      fontSize: '12px',
      padding: '14px',
      resize: 'vertical',
      outline: 'none',
      lineHeight: '1.65',
      boxSizing: 'border-box',
    }}
  />
);

export default Textarea;