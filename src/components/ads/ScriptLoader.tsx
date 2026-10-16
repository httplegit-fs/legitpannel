import React, { useEffect } from 'react';
import { sanitizeScriptTag } from '../../services/securitySanitizer';

interface ScriptLoaderProps {
  socialBarScript?: string;
  popunderScript?: string;
}

export const ScriptLoader: React.FC<ScriptLoaderProps> = ({ socialBarScript, popunderScript }) => {
  useEffect(() => {
    const injectedScripts: HTMLScriptElement[] = [];

    const loadScriptSafely = (rawScriptTag: string | undefined, identifier: string) => {
      if (!rawScriptTag || !rawScriptTag.trim()) return;

      const check = sanitizeScriptTag(rawScriptTag);
      if (!check.isValid || !check.srcUrl) {
        console.warn(`[Security Neutralizer] Blocked unauthorized ad script in ${identifier}`);
        return;
      }

      // Check if script already exists
      const existing = document.querySelector(`script[data-legit-ad="${identifier}"]`);
      if (existing) return;

      try {
        const scriptEl = document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.src = check.srcUrl;
        scriptEl.setAttribute('data-cfasync', 'false');
        scriptEl.setAttribute('data-legit-ad', identifier);
        scriptEl.async = true;

        document.head.appendChild(scriptEl);
        injectedScripts.push(scriptEl);
      } catch (err) {
        console.error(`Failed to inject script ${identifier}:`, err);
      }
    };

    loadScriptSafely(socialBarScript, 'social-bar');
    loadScriptSafely(popunderScript, 'popunder');

    return () => {
      injectedScripts.forEach((script) => {
        try {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        } catch {
          // Ignore removal errors
        }
      });
    };
  }, [socialBarScript, popunderScript]);

  return null;
};
