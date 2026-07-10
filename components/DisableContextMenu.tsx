"use client";

import { useEffect } from "react";

/** يمنع قائمة السياق (كليك يمين) على مستوى الصفحة. */
export function DisableContextMenu() {
  useEffect(() => {
    const preventContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", preventContext);
    return () => document.removeEventListener("contextmenu", preventContext);
  }, []);

  return null;
}
