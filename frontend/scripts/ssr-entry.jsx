/* eslint-disable */
// SSR entry — bundled by scripts/prerender-ssg.js via esbuild and executed
// once per route at build time. Returns a static HTML string for the given
// pathname, which the build step injects into <div id="root"> in the
// per-route index.html shell.

import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { MotionConfig } from "framer-motion";
import { AppShell } from "@/App";

export function render(pathname) {
    // MotionConfig `reducedMotion="user"` makes framer-motion evaluate the
    // preference from the client's media query at hydration time instead of
    // during SSR — that eliminates the SSR/CSR mismatch that otherwise
    // trips hydration warnings for users with prefers-reduced-motion.
    return renderToString(
        React.createElement(
            MotionConfig,
            { reducedMotion: "user" },
            React.createElement(
                StaticRouter,
                { location: pathname },
                React.createElement(AppShell)
            )
        )
    );
}
