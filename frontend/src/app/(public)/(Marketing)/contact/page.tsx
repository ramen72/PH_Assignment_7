// import Header from '@/components/layout/public/Header';
// import React from 'react';

// const Contact = () => {
//     return (
//         <div>
//             <Header/>
//             <h1 className="text-3xl font-bold text-center mt-10">Contact Page</h1>
//         </div>
//     );
// };

// export default Contact;
"use client";

import { useState, type FormEvent } from "react";
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";

import Header from "@/components/layout/public/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    // Connect this handler to your backend contact endpoint.
    // Do not show success until the API confirms submission.
    setIsSending(false);
    setError(
      "The contact form is not connected to a submission service yet.",
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-gradient-to-br from-[#0d719e] to-[#124f70] px-5 py-16 text-center text-white md:py-20">
          <p className="font-semibold uppercase tracking-[0.2em] text-orange-200">
            Contact NovoSoft
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Let&apos;s talk
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/80">
            Have a question about asset management or need
            assistance? Send us a message.
          </p>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-5 md:py-16">
          <aside className="space-y-5 md:col-span-2">
            <div>
              <h2 className="text-2xl font-bold">
                Get in touch
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Use the contact form to tell us about your
                question or project.
              </p>
            </div>

            {[
              {
                icon: Mail,
                title: "Email",
                description: "Add your official support email",
              },
              {
                icon: Phone,
                title: "Phone",
                description: "Add your official contact number",
              },
              {
                icon: MapPin,
                title: "Office",
                description: "Add your verified office address",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border bg-white p-5"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0d719e]">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </aside>

          <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-8 md:col-span-3">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-[#f15825]">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Send us a message
                </h2>
                <p className="text-sm text-slate-500">
                  Fill in the fields below.
                </p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="rounded-xl bg-emerald-50 p-5 text-emerald-800">
                Your message was submitted successfully.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium"
                    >
                      Full name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium"
                    >
                      Email address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      maxLength={254}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    required
                    maxLength={150}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your message here..."
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={6}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-sm text-red-600"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#f15825] hover:bg-[#dc4819] sm:w-auto"
                >
                  <Send className="mr-2 size-4" />
                  {isSending ? "Sending..." : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  );
}