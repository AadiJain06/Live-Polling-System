import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Global styles that work with both light and dark themes */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--background);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Ensure all elements inherit theme colors */
  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }

  /* Override any hardcoded colors with CSS variables */
  .App {
    background: var(--background);
    color: var(--text-primary);
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  button {
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
  }

  /* Ensure modals and overlays work in dark mode */
  .modal, .overlay {
    background: var(--overlay);
  }

  /* Ensure toasts work in dark mode */
  .toast {
    background: var(--surface) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border) !important;
  }
`;

export default GlobalStyles; 