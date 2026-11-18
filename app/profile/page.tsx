import type { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
  title: "Your Profile",
  description: "Manage your ORHANZA contact details.",
};

export default function ProfilePage() {
  return (
    <section className="min-h-svh bg-white p-3 pt-20 text-ink">
      <div className="grid min-h-[calc(100svh-5rem)] gap-3 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="flex items-start border border-black/15 bg-white px-6 py-10 sm:px-10 lg:px-12 lg:py-14 xl:px-16">
          <div className="mx-auto w-full max-w-[590px]">
            <p className="eyebrow text-slate">ORHANZA / PROFILE</p>
            <h1 className="mt-5 text-3xl font-medium tracking-[-0.04em] sm:text-4xl lg:text-[42px] lg:leading-[1.05]">
              Your profile
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate sm:text-lg">
              Keep your contact details close for your next fitting or consultation.
            </p>

            <div className="mt-8 border-t border-black/15 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">
                Contact details
              </h2>
              <ProfileForm />
            </div>

            <div className="mt-7 flex flex-wrap gap-6 text-sm font-medium">
              <Link href="/contact" className="border-b border-ink pb-1 transition-opacity hover:opacity-60">
                Book a consultation
              </Link>
              <Link href="/shop" className="border-b border-ink/40 pb-1 transition-opacity hover:opacity-60">
                Explore the collection
              </Link>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[420px] overflow-hidden bg-charcoal p-8 text-white sm:min-h-[520px] sm:p-12 lg:min-h-0 lg:p-14 xl:p-16">
          <video
            aria-hidden="true"
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            poster="/videos/showreel-poster.jpg"
            preload="metadata"
          >
            <source src="/videos/showreel.mp4" type="video/mp4" />
          </video>
          <div aria-hidden className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 flex min-h-[372px] w-full flex-col justify-between sm:min-h-[424px] lg:min-h-full">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">
              ORHANZA · MADE TO MEASURE
            </p>
            <div className="max-w-[620px]">
              <h2 className="text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-[64px] xl:text-[70px]">
                Made for the moments that matter.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
