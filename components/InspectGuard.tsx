"use client";

import { useEffect, useRef, useState } from "react";

/** فرق إضافي فوق خط الأساس يُعتبر فتح DevTools (لوحة جانبية أو سفلية). */
const DEVTOOLS_DELTA_THRESHOLD = 120;
/** عرض الفرق المطلق — لوحة DevTools الجانبية تقلّل innerWidth بشكل كبير. */
const DEVTOOLS_WIDTH_ABSOLUTE_THRESHOLD = 200;

function isTouchPrimaryDevice() {
  return (
    window.matchMedia?.("(max-width: 768px)")?.matches ||
    window.matchMedia?.("(pointer: coarse)")?.matches
  );
}

function measureWindowChromeDiff() {
  return {
    widthDiff: window.outerWidth - window.innerWidth,
    heightDiff: window.outerHeight - window.innerHeight,
  };
}

/**
 * يمنع النقر بالزر الأيمن واختصارات فتح أدوات المطور،
 * ويعرض تحذيراً عند اكتشاف فتح DevTools/Inspect.
 */
export function InspectGuard() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const devToolsOpenRef = useRef(false);

  useEffect(() => {
    devToolsOpenRef.current = devToolsOpen;
  }, [devToolsOpen]);

  useEffect(() => {
    // على شاشات الموبايل/اللمس لا نفعّل كشف DevTools — outer/inner غير موثوق.
    if (isTouchPrimaryDevice()) return;

    // منع قائمة السياق (كليك يمين)
    const preventContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", preventContext);

    // منع اختصارات لوحة المفاتيح لفتح Inspect
    const preventShortcuts = (e: KeyboardEvent) => {
      const key = e.key;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      if (
        key === "F12" ||
        (ctrl && shift && (key === "I" || key === "J" || key === "C")) ||
        (ctrl && key === "U") ||
        (ctrl && key === "S") // حفظ المصدر أحياناً
      ) {
        e.preventDefault();
        setDevToolsOpen(true);
      }
    };
    document.addEventListener("keydown", preventShortcuts);

    // خط أساس لفرق chrome (شريط عنوان، تبويبات، إلخ) — يختلف بين الشاشات الصغيرة والكبيرة.
    let baseline: { widthDiff: number; heightDiff: number } | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;

    function calibrateBaseline() {
      baseline = measureWindowChromeDiff();
    }

    function checkDevTools() {
      const { widthDiff, heightDiff } = measureWindowChromeDiff();

      if (!baseline) {
        calibrateBaseline();
        return;
      }

      const widthGrowth = widthDiff - baseline.widthDiff;
      const heightGrowth = heightDiff - baseline.heightDiff;

      // لوحة جانبية: innerWidth يتقلص كثيراً. لوحة سفلية: innerHeight يتقلص فوق chrome العادي.
      const sideDockOpen = widthDiff >= DEVTOOLS_WIDTH_ABSOLUTE_THRESHOLD;
      const dockedPanelOpen =
        widthGrowth > DEVTOOLS_DELTA_THRESHOLD ||
        heightGrowth > DEVTOOLS_DELTA_THRESHOLD;

      if (sideDockOpen || dockedPanelOpen) {
        setDevToolsOpen(true);
        return;
      }

      // إعادة معايرة عند تغيير حجم النافذة بدون DevTools (تكبير/تصغير، إظهار/إخفاء شريط).
      if (widthGrowth < 0 || heightGrowth < 0) {
        baseline = { widthDiff, heightDiff };
      }
    }

    // تأخير قصير حتى يستقر chrome المتصفح بعد التحميل.
    const calibrateTimeout = setTimeout(calibrateBaseline, 500);
    checkInterval = setInterval(checkDevTools, 1000);

    const onResize = () => {
      if (!devToolsOpenRef.current) calibrateBaseline();
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(calibrateTimeout);
      document.removeEventListener("contextmenu", preventContext);
      document.removeEventListener("keydown", preventShortcuts);
      window.removeEventListener("resize", onResize);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  if (!devToolsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/95 p-3 sm:p-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="my-auto max-h-[min(100dvh-1.5rem,32rem)] w-full max-w-md overflow-y-auto rounded-2xl border-2 border-red-500/50 bg-[var(--color-surface)] p-5 text-center shadow-2xl sm:p-8">
        <div className="mb-3 text-4xl sm:mb-4 sm:text-5xl">⚠️</div>
        <h2 className="mb-2 text-lg font-bold text-red-500 sm:text-xl">
          تحذير: أدوات المطور (Inspect)
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-[var(--color-foreground)] sm:mb-6 sm:text-base">
          يبدو أنك فتحت أدوات المطور (Developer Tools / Inspect). يُمنع استخدامها على هذه المنصة. يُرجى إغلاق نافذة الأدوات للمتابعة.
        </p>
        <button
          type="button"
          onClick={() => setDevToolsOpen(false)}
          className="w-full rounded-[var(--radius-btn)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] sm:w-auto sm:px-6 sm:py-3 sm:text-base"
        >
          فهمت، إغلاق التحذير
        </button>
      </div>
    </div>
  );
}
