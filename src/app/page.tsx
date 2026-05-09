import Link from 'next/link';
import { FC } from 'react';

const HomePage: FC = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.10),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-8 text-(--builder-text) max-sm:px-3">
      <div className="mx-auto w-[min(1180px,92%)]">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[22px] font-black tracking-[-0.5px] text-[#020617]">
              Interview
              <span className="text-(--builder-blue)">Call</span>
            </div>

            <p className="mt-1 text-sm font-bold text-(--builder-muted)">
              Internal admin workspace
            </p>
          </div>

          <div className="rounded-full bg-[#dcfce7] px-4 py-2 text-sm font-black text-[#166534]">
            Admin Panel
          </div>
        </header>

        <section className="mb-8 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#1d4ed8,#0f172a)] p-8 text-white shadow-(--builder-shadow) max-sm:p-6">
          <div className="mb-3 inline-flex rounded-full bg-white/15 px-3.5 py-2 text-xs font-black text-[#dbeafe]">
            Candidate Form System
          </div>

          <h1 className="max-w-4xl text-[clamp(34px,5vw,58px)] font-black leading-[1.05] tracking-[-1.4px]">
            Manage qualification forms, questions, and lead capture flows.
          </h1>

          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-[#dbeafe]">
            Create dynamic forms for different lead segments, collect candidate
            answers, and prepare submissions for the booking flow.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
          <Link
            href="/form-builder"
            className="group rounded-3xl border border-(--builder-border) bg-white p-6 shadow-(--builder-shadow) transition duration-200 hover:-translate-y-1 hover:border-(--builder-blue) hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#eff6ff] text-2xl">
              🧩
            </div>

            <h2 className="text-xl font-black tracking-[-0.3px] text-[#020617]">
              Form Builder
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-(--builder-muted)">
              Create qualification forms, add step-wise questions, and preview
              the final payload.
            </p>

            <div className="mt-5 text-sm font-black text-(--builder-blue) transition group-hover:translate-x-1">
              Open Builder →
            </div>
          </Link>

          <div className="rounded-3xl border border-(--builder-border) bg-white p-6 shadow-(--builder-shadow)">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#f1f5f9] text-2xl">
              👥
            </div>

            <h2 className="text-xl font-black tracking-[-0.3px] text-[#020617]">
              Candidate Submissions
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-(--builder-muted)">
              View submitted leads and candidate answers after backend
              integration.
            </p>

            <div className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-black text-(--builder-muted-light)">
              Coming Soon
            </div>
          </div>

          <div className="rounded-3xl border border-(--builder-border) bg-white p-6 shadow-(--builder-shadow)">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#f1f5f9] text-2xl">
              📅
            </div>

            <h2 className="text-xl font-black tracking-[-0.3px] text-[#020617]">
              Booking Slots
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-(--builder-muted)">
              Manage advisor availability, dates, and time slots later.
            </p>

            <div className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-black text-(--builder-muted-light)">
              Coming Soon
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;