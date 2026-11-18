"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PROFILE_STORAGE_KEY = "orhanza-profile-v1";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address.").max(254),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(24, "Phone number must be 24 characters or fewer.")
    .regex(/^\+?[0-9\s()-]+$/, "Use digits and standard phone separators only."),
  city: z.string().trim().max(80, "City or area must be 80 characters or fewer."),
});

type ProfileValues = z.infer<typeof profileSchema>;
type FormStatus = "idle" | "saving" | "saved" | "cleared" | "error";

const emptyProfile: ProfileValues = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
};

const inputClassName =
  "mt-2 w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-3 text-base text-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-ink";
const labelClassName = "block text-[11px] font-medium uppercase tracking-[0.14em] text-slate";

export function ProfileForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: emptyProfile,
  });

  useEffect(() => {
    let savedValue: string | null;
    try {
      savedValue = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    } catch {
      setStatus("error");
      setStatusMessage("Browser storage is unavailable. You can still complete the form, but your details cannot be saved here.");
      return;
    }

    if (savedValue === null) return;
    setHasSavedProfile(true);

    try {
      const parsedValue: unknown = JSON.parse(savedValue);
      const result = profileSchema.safeParse(parsedValue);
      if (!result.success) {
        setStatus("error");
        setStatusMessage("Your saved details could not be validated. Review the form and save again to replace them.");
        return;
      }

      reset(result.data);
    } catch {
      setStatus("error");
      setStatusMessage("Your saved details could not be read. Review the form and save again to replace them.");
    }
  }, [reset]);

  function onSubmit(values: ProfileValues) {
    setStatus("saving");
    setStatusMessage("");

    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(values));
      reset(values);
      setHasSavedProfile(true);
      setStatus("saved");
      setStatusMessage("Your profile has been saved in this browser.");
    } catch {
      setStatus("error");
      setStatusMessage("Your profile could not be saved in this browser. Check your storage settings and try again.");
    }
  }

  function clearProfile() {
    try {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      reset(emptyProfile);
      setHasSavedProfile(false);
      setStatus("cleared");
      setStatusMessage("Your saved profile has been removed from this browser.");
    } catch {
      setStatus("error");
      setStatusMessage("Your saved profile could not be removed. Please try again.");
    }
  }

  return (
    <form className="mt-7" onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-slate">
        Your details are stored in this browser only. They are not sent to ORHANZA or synced to an account.
        Anyone with access to this browser profile may be able to view them.
      </p>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <div>
          <label className={labelClassName} htmlFor="profile-full-name">Full name</label>
          <input
            {...register("fullName")}
            autoComplete="name"
            className={inputClassName}
            id="profile-full-name"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "profile-full-name-error" : undefined}
            placeholder="Your name"
          />
          {errors.fullName && <p className="mt-2 text-sm text-burgundy" id="profile-full-name-error">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className={labelClassName} htmlFor="profile-email">Email address</label>
          <input
            {...register("email")}
            autoComplete="email"
            className={inputClassName}
            id="profile-email"
            type="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "profile-email-error" : undefined}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-2 text-sm text-burgundy" id="profile-email-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClassName} htmlFor="profile-phone">Phone number</label>
          <input
            {...register("phone")}
            autoComplete="tel"
            className={inputClassName}
            id="profile-phone"
            type="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "profile-phone-error" : undefined}
            placeholder="+977 98…"
          />
          {errors.phone && <p className="mt-2 text-sm text-burgundy" id="profile-phone-error">{errors.phone.message}</p>}
        </div>

        <div>
          <label className={labelClassName} htmlFor="profile-city">
            City or area <span className="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input
            {...register("city")}
            autoComplete="address-level2"
            className={inputClassName}
            id="profile-city"
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? "profile-city-error" : undefined}
            placeholder="Your city or area"
          />
          {errors.city && <p className="mt-2 text-sm text-burgundy" id="profile-city-error">{errors.city.message}</p>}
        </div>
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          className="btn btn-burgundy min-w-40 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting || status === "saving"}
          type="submit"
        >
          {status === "saving" ? "Saving…" : "Save profile"}
        </button>
        {hasSavedProfile && (
          <button
            className="text-sm font-medium text-slate underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-ink"
            onClick={clearProfile}
            type="button"
          >
            Clear saved details
          </button>
        )}
      </div>

      {statusMessage && (
        <p
          aria-live="polite"
          className={`mt-5 text-sm ${status === "error" ? "text-burgundy" : "text-slate"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {statusMessage}
        </p>
      )}
      {status === "saved" && isDirty && (
        <p className="mt-5 text-sm text-slate" role="status">You have unsaved changes.</p>
      )}
    </form>
  );
}
