import * as FramerMotion from "framer-motion";
import * as LucideReact from "lucide-react";
import * as React from "react";

/** Merged scope for react-live: React + all Lucide icons (imports are stripped from live code). */
export const livePreviewScope = { React, ...LucideReact, ...FramerMotion };
