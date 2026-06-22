"use client";

import RequestAccessForm from "@/components/RequestAccessForm";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function trapFocus(
  container: HTMLElement,
  event: KeyboardEvent,
  onEscape: () => void,
) {
  if (event.key === "Escape") {
    event.preventDefault();
    onEscape();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.offsetParent !== null);

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

type RequestAccessModalProps = {
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

export default function RequestAccessModal({
  triggerRef: externalTriggerRef,
}: RequestAccessModalProps = {}) {
  const [open, setOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );
  const internalTriggerRef = useRef<HTMLButtonElement>(null);
  const triggerRef = externalTriggerRef ?? internalTriggerRef;
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const prefersReducedMotion = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    setShowSuccess(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, [triggerRef]);

  const openModal = useCallback(() => {
    setFormSession((current) => current + 1);
    setShowSuccess(false);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!modalRef.current) return;
      trapFocus(modalRef.current, event, close);
    };

    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      const focusable = modalRef.current?.querySelector<HTMLElement>(
        FOCUSABLE_SELECTOR,
      );
      focusable?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [close, open]);

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 transition duration-200 hover:bg-cyan-50"
      >
        Request Access
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <motion.button
                  type="button"
                  aria-label="Close request access dialog"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                  className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                  onClick={close}
                />

                <motion.div
                  ref={modalRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  aria-describedby={descriptionId}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.98 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, scale: 1 }
                  }
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.98 }
                  }
                  transition={transition}
                  className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/85 p-6 shadow-xl backdrop-blur-xl sm:p-8"
                  onClick={(event) => event.stopPropagation()}
                >
                  {!showSuccess && (
                    <div className="mb-6 text-center">
                      <h2
                        id={titleId}
                        className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
                      >
                        Request Access
                      </h2>
                      <p
                        id={descriptionId}
                        className="mt-3 text-sm leading-relaxed text-slate-400"
                      >
                        Request access to SurgicalDataOS. We welcome researchers,
                        clinicians, AI scientists, robotics teams and strategic
                        collaborators interested in advancing structured surgical
                        intelligence.
                      </p>
                    </div>
                  )}

                  <RequestAccessForm
                    key={formSession}
                    onCancel={close}
                    onClose={close}
                    onSuccessChange={setShowSuccess}
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
