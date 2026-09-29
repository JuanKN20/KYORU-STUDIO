import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Mail, Send } from 'lucide-react';
import { createContactMessage } from '../services/api';

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

const initialFormState: ContactFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const interestOptions = [
  'Desarrollo Web',
  'Modelado y Experiencias 3D',
  'Animación y Contenido Digital',
  'Proyecto multidisciplinario',
  'Consulta general',
];

const officialServices = [
  'Desarrollo Web',
  'Modelado y Experiencias 3D',
  'Animación y Contenido Digital',
];

const MIN_MESSAGE_LENGTH = 20;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateForm(values: ContactFormState): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = 'El nombre es obligatorio.';
  }

  if (!email) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (!message) {
    errors.message = 'El mensaje es obligatorio.';
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = `El mensaje debe tener al menos ${MIN_MESSAGE_LENGTH} caracteres.`;
  }

  return errors;
}

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const focusStatusMessage = () => {
    window.requestAnimationFrame(() => statusRef.current?.focus());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSuccessMessage('');
      setErrorMessage('Revisa los campos marcados para continuar.');

      const firstInvalidField = (['name', 'email', 'message'] as const).find((field) => nextErrors[field]);
      if (firstInvalidField) {
        window.requestAnimationFrame(() => document.getElementById(`contact-${firstInvalidField}`)?.focus());
      }
      return;
    }

    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
    setLoading(true);

    try {
      await createContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        subject: form.subject || undefined,
      });
      setSuccessMessage('Recibimos tu mensaje correctamente. Gracias por compartir tu proyecto con Kyoru Studio.');
      setForm(initialFormState);
      focusStatusMessage();
    } catch {
      setErrorMessage(
        'No pudimos confirmar el envío. Tus datos permanecen en el formulario; revisa tu conexión antes de intentarlo nuevamente.',
      );
      focusStatusMessage();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <header className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36" aria-labelledby="contact-page-title">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_16%_18%,rgba(179,23,47,0.24),transparent_42%),radial-gradient(circle_at_84%_28%,rgba(255,59,92,0.12),transparent_38%),linear-gradient(180deg,#0a0b0f_0%,#050506_62%,#08090d_100%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-akai-grid bg-[length:32px_32px] opacity-[0.15] [mask-image:radial-gradient(circle_at_center,black_18%,transparent_80%)]"
        />

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-end lg:gap-14">
            <div className="min-w-0 animate-fade-up motion-reduce:animate-none">
              <div className="flex items-center gap-3">
                <div aria-hidden="true" className="akai-hud-line" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">HABLEMOS</p>
              </div>
              <h1
                id="contact-page-title"
                className="mt-6 max-w-4xl break-words text-[2.45rem] font-black leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem] xl:text-6xl"
              >
                Cuéntanos qué quieres crear.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                Comparte tu idea, necesidad o proyecto. Revisaremos el contexto para comprender qué dirección creativa y tecnológica
                puede tener sentido como punto de partida.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#contact-form"
                  className="akai-btn-primary w-full gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
                >
                  Presentar un proyecto
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link
                  to="/services"
                  className="akai-btn-secondary w-full motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
                >
                  Explorar servicios
                </Link>
              </div>
            </div>

            <aside className="akai-panel relative overflow-hidden p-6 sm:p-7" aria-labelledby="contact-services-title">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,59,92,0.14),transparent_44%)]"
              />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">ÁREAS DE INTERÉS</p>
                <h2 id="contact-services-title" className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">
                  Tres disciplinas para abordar necesidades digitales.
                </h2>
                <ul className="mt-6 space-y-3">
                  {officialServices.map((service) => (
                    <li key={service} className="flex items-center gap-3 rounded-2xl border border-red-900/40 bg-black/30 px-4 py-3">
                      <Check className="h-4 w-4 shrink-0 text-red-300" aria-hidden="true" />
                      <span className="text-sm font-semibold text-zinc-100">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-10 lg:px-8 lg:py-24">
        <aside className="min-w-0 lg:sticky lg:top-28" aria-labelledby="contact-guidance-title">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="akai-hud-line" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">PUNTO DE PARTIDA</p>
          </div>
          <h2 id="contact-guidance-title" className="akai-section-title mt-3">
            La información esencial para comenzar.
          </h2>
          <p className="akai-section-subtitle leading-relaxed">
            No necesitas tener todo resuelto. Un contexto claro ayuda a comprender mejor la necesidad y el alcance inicial.
          </p>

          <ol className="mt-8 space-y-4">
            <li className="akai-panel flex gap-4 p-5">
              <span className="text-sm font-black tracking-[0.18em] text-red-300">01</span>
              <div>
                <h3 className="font-semibold text-white">Explica el objetivo</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">Qué necesitas crear, mejorar o comunicar.</p>
              </div>
            </li>
            <li className="akai-panel flex gap-4 p-5">
              <span className="text-sm font-black tracking-[0.18em] text-red-300">02</span>
              <div>
                <h3 className="font-semibold text-white">Comparte el contexto</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">En qué etapa se encuentra la idea y a quién busca servir.</p>
              </div>
            </li>
            <li className="akai-panel flex gap-4 p-5">
              <span className="text-sm font-black tracking-[0.18em] text-red-300">03</span>
              <div>
                <h3 className="font-semibold text-white">Añade referencias útiles</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">Alcance conocido, requisitos o decisiones ya tomadas.</p>
              </div>
            </li>
          </ol>

          <div className="mt-6 rounded-2xl border border-red-900/40 bg-black/30 p-5">
            <p className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-red-300" aria-hidden="true" />
              El formulario es el canal principal para iniciar una conversación con Kyoru Studio.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              to="/services"
              className="akai-btn-secondary w-full motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Ver servicios
            </Link>
            <Link
              to="/trabajos"
              className="akai-btn-secondary w-full motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Ver proyectos
            </Link>
          </div>
        </aside>

        <section id="contact-form" aria-labelledby="contact-form-title" className="akai-panel scroll-mt-28 p-5 sm:p-7 lg:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">FORMULARIO DE CONTACTO</p>
            <h2 id="contact-form-title" className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              Presenta tu proyecto.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
              Completa los campos obligatorios y utiliza el mensaje para compartir el contexto disponible.
            </p>
            <p className="mt-3 text-xs text-zinc-400">
              <span aria-hidden="true" className="text-red-300">*</span> Campos obligatorios
            </p>
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate aria-busy={loading}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="contact-name" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  Nombre <span aria-hidden="true" className="text-red-300">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  required
                  className="min-h-12 w-full rounded-xl border border-red-900/40 bg-black/45 px-4 py-3 text-sm text-white outline-none transition motion-reduce:transition-none focus:border-red-500/70 focus-visible:ring-2 focus-visible:ring-red-400/70"
                />
                {errors.name ? (
                  <p id="contact-name-error" className="mt-2 text-xs text-red-200">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="min-w-0">
                <label htmlFor="contact-email" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  Correo electrónico <span aria-hidden="true" className="text-red-300">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  required
                  className="min-h-12 w-full rounded-xl border border-red-900/40 bg-black/45 px-4 py-3 text-sm text-white outline-none transition motion-reduce:transition-none focus:border-red-500/70 focus-visible:ring-2 focus-visible:ring-red-400/70"
                />
                {errors.email ? (
                  <p id="contact-email-error" className="mt-2 text-xs text-red-200">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-300">
                Área de interés <span className="normal-case tracking-normal text-zinc-500">(opcional)</span>
              </label>
              <select
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={(event) => handleChange('subject', event.target.value)}
                className="min-h-12 w-full rounded-xl border border-red-900/40 bg-black/45 px-4 py-3 text-sm text-white outline-none transition motion-reduce:transition-none focus:border-red-500/70 focus-visible:ring-2 focus-visible:ring-red-400/70"
              >
                <option value="">Selecciona un área</option>
                {interestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-300">
                Mensaje <span aria-hidden="true" className="text-red-300">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={(event) => handleChange('message', event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-help contact-message-error' : 'contact-message-help'}
                required
                minLength={MIN_MESSAGE_LENGTH}
                rows={7}
                className="min-h-44 w-full resize-y rounded-xl border border-red-900/40 bg-black/45 px-4 py-3 text-sm leading-relaxed text-white outline-none transition motion-reduce:transition-none focus:border-red-500/70 focus-visible:ring-2 focus-visible:ring-red-400/70"
              />
              <p id="contact-message-help" className="mt-2 text-xs text-zinc-500">
                Mínimo {MIN_MESSAGE_LENGTH} caracteres.
              </p>
              {errors.message ? (
                <p id="contact-message-error" className="mt-2 text-xs text-red-200">
                  {errors.message}
                </p>
              ) : null}
            </div>

            {successMessage || errorMessage ? (
              <div
                ref={statusRef}
                tabIndex={-1}
                role={errorMessage ? 'alert' : 'status'}
                aria-live={errorMessage ? 'assertive' : 'polite'}
                className={`rounded-xl border px-4 py-3 text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 ${
                  errorMessage
                    ? 'border-red-700/60 bg-red-950/30 text-red-100'
                    : 'border-emerald-500/45 bg-emerald-950/30 text-emerald-100'
                }`}
              >
                {errorMessage || successMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="akai-btn-primary min-h-12 w-full gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Enviando mensaje…' : 'Enviar mensaje'}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
