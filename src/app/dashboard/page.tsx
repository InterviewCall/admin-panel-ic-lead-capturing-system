'use client';

import Link from 'next/link';
import { FC,useState , useEffect } from 'react';

import CreateUserModal from '@/components/dashboard/CreateUserModal';

const HomePage: FC = () => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [userRole, setUserRole] = useState<'ADMIN' | 'MANAGER' | null>(null);

  useEffect(() => {
      const role = sessionStorage.getItem('user-role');

      if (role === 'ADMIN' || role === 'MANAGER') {
          setUserRole(role);
      }
  }, []);

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

          
          <div className="flex items-center gap-3">
            {userRole === 'ADMIN' && (
              <button
                  type="button"
                  onClick={() => setIsCreateUserOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
              >
                  <span aria-hidden="true">+</span>
                  Create User
              </button>
          )}

            <div className="rounded-full bg-[#dcfce7] px-4 py-2 text-sm font-black text-[#166534]">
              {userRole === 'MANAGER' ? 'Manager Panel' : 'Admin Panel'}
            </div>
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

        <section
            className={`grid ${userRole === 'MANAGER' ? 'grid-cols-2' : 'grid-cols-3'} gap-5 max-lg:grid-cols-1`}
        >
          {userRole === 'ADMIN' && (
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
          )}

          <Link
            href="/submissions"
            className="group rounded-3xl border border-(--builder-border) bg-white p-6 shadow-(--builder-shadow) transition duration-200 hover:-translate-y-1 hover:border-(--builder-blue) hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#eff6ff] text-2xl">
              👥
            </div>

            <h2 className="text-xl font-black tracking-[-0.3px] text-[#020617]">
              Candidate Submissions
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-(--builder-muted)">
              View submitted leads, lead scores, candidate answers and booking status.
            </p>

            <div className="mt-5 text-sm font-black text-(--builder-blue) transition group-hover:translate-x-1">
              Open Submissions →
            </div>
          </Link>

          <Link
            href="/bookings"
            className="group rounded-3xl border border-(--builder-border) bg-white p-6 shadow-(--builder-shadow) transition duration-200 hover:-translate-y-1 hover:border-(--builder-blue) hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#eff6ff] text-2xl">
              📅
            </div>

            <h2 className="text-xl font-black tracking-[-0.3px] text-[#020617]">
              Bookings
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-(--builder-muted)">
              See booked counselling calls, message delivery, and how full the week is.
            </p>

            <div className="mt-5 text-sm font-black text-(--builder-blue) transition group-hover:translate-x-1">
              Open Bookings →
            </div>
          </Link>
        </section>
      </div>
        <CreateUserModal
          isOpen={isCreateUserOpen}
          onClose={() => setIsCreateUserOpen(false)}
        />
    </main>
  );
};

export default HomePage;