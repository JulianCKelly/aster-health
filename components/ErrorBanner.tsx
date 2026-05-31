import { FC } from 'react';

export interface ErrorBannerProps {
  msg: string;
}

/**
 * A generic error banner used across tools. It presents an error title
 * followed by the provided message. Colours are inline to avoid CSS
 * dependencies.
 */
const ErrorBanner: FC<ErrorBannerProps> = ({ msg }) => (
  <div
    style={{
      padding: '14px 16px',
      background: 'rgba(220,38,38,0.07)',
      border: '1px solid rgba(220,38,38,0.25)',
      borderRadius: '8px',
      color: '#fca5a5',
      fontSize: '12px',
      lineHeight: '1.6',
      fontFamily: 'inherit',
      wordBreak: 'break-word',
    }}
  >
    <div
      style={{
        fontSize: '10px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '6px',
        color: '#ef4444',
      }}
    >
      Error
    </div>
    {msg}
  </div>
);

export default ErrorBanner;