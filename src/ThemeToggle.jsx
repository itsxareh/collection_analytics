import { useTheme } from "./useTheme";
import "./ThemeToggle.css";

/**
 * ThemeToggle — an animated pill-style toggle button.
 * Drop it anywhere; it reads & writes theme state via useTheme().
 *
 * Props (all optional):
 *   className  – extra class names for the wrapper
 *   size       – "sm" | "md" (default) | "lg"
 */
export function ThemeToggle({ className = "", size = "md" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={`theme-toggle theme-toggle--${size} ${className}`}
      data-theme={theme}
    >
      {/* Track */}
      <span className="theme-toggle__track" aria-hidden="true">
        {/* Sun icon (light side) */}
        <span className="theme-toggle__icon theme-toggle__icon--sun">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1"  x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1"  y1="12" x2="3"  y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </span>

        {/* Moon icon (dark side) */}
        <span className="theme-toggle__icon theme-toggle__icon--moon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </span>

        {/* Sliding thumb */}
        <span className="theme-toggle__thumb" aria-hidden="true"/>
      </span>

      {/* Visible label */}
      <span className="theme-toggle__label">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
