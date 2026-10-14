import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Header from "@/components/layout/public/Header";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Boxes,
    title: "Centralized management",
    description:
      "Organize asset records, categories, assignments, and maintenance activities in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Accountability",
    description:
      "Maintain clearer ownership records and track asset-related activities across the organization.",
  },
  {
    icon: Users,
    title: "Employee experience",
    description:
      "Make asset requests and tracking easier for employees and the teams supporting them.",
  },
  {
    icon: Target,
    title: "Operational visibility",
    description:
      "Use structured records and reporting to support better asset management decisions.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-linear-to-br from-[#0d719e] to-[#124f70] px-5 py-20 text-white md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="font-semibold uppercase tracking-[0.2em] text-orange-200">
              About NovoSoft
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Smarter asset management for modern teams.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
              NovoSoft Asset Management brings asset records,
              employee requests, assignments, and maintenance
              workflows together in one organized platform.
            </p>
            <Button              
              className="mt-8 bg-[#f15825] hover:bg-[#dc4819]"
              nativeButton={false}
              render={
                <Link href="/contact">
                Contact our team
                <ArrowRight className="ml-2 size-4" />
              </Link>
              }
            ></Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-semibold text-[#f15825]">
                WHO WE ARE
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                One platform for your asset lifecycle
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                From registering equipment to requesting assets,
                assigning them to employees, and recording
                maintenance, NovoSoft helps bring everyday
                asset-related processes into a consistent workflow.
              </p>
              <p className="mt-4 leading-8 text-slate-600">
                Our goal is to make asset information easier to
                access, responsibilities easier to track, and
                administrative work easier to manage.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-7 shadow-sm md:p-10">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-[#f15825]">
                <Target className="size-7" />
              </div>
              <h3 className="text-2xl font-bold">Our mission</h3>
              <p className="mt-4 leading-8 text-slate-600">
                To simplify organizational asset management
                through accessible information, structured
                workflows, and clear operational visibility.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y bg-white px-5 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold">
                What we focus on
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Practical tools for managing organizational
                resources with greater clarity.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <article
                    key={value.title}
                    className="rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-[#0d719e]">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-semibold">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {value.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold">
              Want to learn more?
            </h2>
            <p className="mt-4 text-slate-600">
              Get in touch to discuss your asset management needs.
            </p>
            <Button
              className="mt-7 bg-[#f15825] hover:bg-[#dc4819]"
              nativeButton={false}
              render={
                <Link href="/contact">Get in touch</Link>
              }
            ></Button>
          </div>
        </section>
      </main>
    </>
  );
}