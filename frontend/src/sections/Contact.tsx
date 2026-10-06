import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, MapPin, Download, Github, Linkedin, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SectionHeading } from "../components/SectionHeading";
import { site } from "../data/site";
import { sendContact } from "../lib/api";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100, "Keep your name under 100 characters"),
  email: z.string().trim().email("Enter a valid email address").max(254),
  message: z.string().trim().min(10, "Write at least 10 characters").max(2000, "Keep the message under 2000 characters"),
  website: z.string().max(0).optional(), // honeypot: real users never fill this
});
type FormValues = z.infer<typeof schema>;
type Status = { kind: "idle" } | { kind: "success" } | { kind: "error"; message: string; offline: boolean };

const chip = "btn btn-ghost !min-h-[40px] !px-4 text-muted hover:text-fg";

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus({ kind: "idle" });
    const res = await sendContact(values);
    if (res.ok) { setStatus({ kind: "success" }); reset(); }
    else setStatus({ kind: "error", message: res.message, offline: res.kind === "offline" || res.kind === "server" });
  };

  const field = "mt-2 w-full rounded-md border border-line bg-bg/60 px-3 py-3 text-sm placeholder:text-muted/60 focus:border-accent";
  const err = "mt-1 text-sm text-red-400";

  return (
    <section id="contact" aria-labelledby="contact-title" className="section pt-0 sm:pt-0">
      <div className="container-page">
        <SectionHeading id="contact-title" label="Contact" center sub="I am looking for data science and machine learning internships. Email is the fastest way to reach me.">
          Let's Build Your Next <span className="text-gradient">Data Story.</span>
        </SectionHeading>

        <div className="mx-auto -mt-4 mb-8 flex max-w-xl flex-col items-center gap-3 text-center">
          <p className="inline-flex items-center gap-2 text-sm text-accent"><MapPin size={14} aria-hidden /> {site.location}</p>
          <a className="text-sm text-muted hover:text-fg" href={`mailto:${site.social.email}`}>{site.social.email}</a>
          <div className="flex flex-wrap justify-center gap-2">
            <a className={chip} href={`mailto:${site.social.email}`}><Mail size={14} aria-hidden /> Email</a>
            <a className={chip} href={site.social.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} aria-hidden /> LinkedIn</a>
            <a className={chip} href={site.social.github} target="_blank" rel="noreferrer"><Github size={14} aria-hidden /> GitHub</a>
            <a className={chip} href={site.resume} target="_blank" rel="noreferrer"><Download size={14} aria-hidden /> Resume</a>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card mx-auto max-w-xl space-y-5 p-5 sm:p-7" aria-label="Contact form">
          <div>
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" autoComplete="name" placeholder="Your name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} {...register("name")} />
            {errors.name && <p id="name-err" className={err}>{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} {...register("email")} />
            {errors.email && <p id="email-err" className={err}>{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <textarea id="message" rows={5} placeholder="Tell me about your data challenge..." className={field} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} {...register("message")} />
            {errors.message && <p id="message-err" className={err}>{errors.message.message}</p>}
          </div>
          {/* Honeypot: hidden from people and assistive tech */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
            <label htmlFor="website">Leave this field empty</label>
            <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full !rounded-full disabled:opacity-60">
            <Send size={15} aria-hidden /> {isSubmitting ? "Sending…" : "Send message"}
          </button>

          <div aria-live="polite">
            {status.kind === "success" && (
              <p className="flex items-start gap-2 text-sm text-emerald-400"><CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden /> Message sent. I will reply by email.</p>
            )}
            {status.kind === "error" && (
              <p className="flex items-start gap-2 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
                <span>{status.message}{status.offline && <> You can email me directly at <a className="underline" href={`mailto:${site.social.email}`}>{site.social.email}</a>.</>}</span>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
