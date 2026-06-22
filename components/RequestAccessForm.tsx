"use client";

import { useState, type FormEvent } from "react";

const INITIAL_FORM = {
  name: "",
  email: "",
  organization: "",
  message: "",
};

const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 transition duration-200 focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-60";

const PRIMARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 transition duration-200 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60";

const SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-slate-200 transition duration-200 hover:border-white/20 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60";

type RequestAccessFormProps = {
  onCancel: () => void;
  onClose: () => void;
  onSuccessChange?: (success: boolean) => void;
};

export default function RequestAccessForm({
  onCancel,
  onClose,
  onSuccessChange,
}: RequestAccessFormProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm(INITIAL_FORM);
        setStatus("success");
        onSuccessChange?.(true);
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Request Received
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Thank you for your interest in SurgicalDataOS.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Your request has been received successfully. We will review your
          submission and contact you if there is a suitable opportunity for
          collaboration.
        </p>
        <button
          type="button"
          onClick={onClose}
          className={`${PRIMARY_BUTTON_CLASS} mt-8`}
        >
          Close
        </button>
      </div>
    );
  }

  const isLoading = status === "loading";

  return (
    <form
      onSubmit={handleSubmit}
      className="text-left"
      aria-label="Request access form"
      noValidate
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="sr-only">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={isLoading}
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Name"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="sr-only">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={isLoading}
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="Email"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="contact-organization" className="sr-only">
            Organization
          </label>
          <input
            id="contact-organization"
            name="organization"
            type="text"
            required
            autoComplete="organization"
            disabled={isLoading}
            value={form.organization}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                organization: event.target.value,
              }))
            }
            placeholder="Organization"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="sr-only">
            Message (optional)
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            disabled={isLoading}
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            placeholder="Message (optional)"
            className={`${INPUT_CLASS} resize-y`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className={PRIMARY_BUTTON_CLASS}
        >
          {isLoading ? "Sending..." : "Submit Request"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={SECONDARY_BUTTON_CLASS}
        >
          Cancel
        </button>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 text-center text-sm text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
