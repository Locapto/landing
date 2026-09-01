import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Gauge,
  Landmark,
  Network,
  Search,
  ShieldCheck,
  Store,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { BetaLeadForm } from "@/components/BetaLeadForm";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedBetaLink } from "@/components/TrackedBetaLink";
import { TrackedProductPreview } from "@/components/TrackedProductPreview";
import { AVAILABILITY_CHIP_LABEL, BETA_CTA_LABEL } from "@/config/marketing";

export const metadata: Metadata = {
  title: "Locapto | Qué necesitas para abrir un negocio",
  description:
    "Consulta trámites, requisitos, documentos y fuentes oficiales según la actividad, la ubicación y las características del local.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Locapto | Qué necesitas para abrir un negocio",
    description:
      "Consulta trámites, requisitos y fuentes oficiales según la actividad, la ubicación y las características del local.",
    url: "/",
    locale: "es_ES",
    siteName: "Locapto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Locapto | Qué necesitas para abrir un negocio",
    description:
      "Consulta trámites, requisitos y fuentes oficiales según la actividad, la ubicación y las características del local.",
  },
};

const audiences = [
  {
    icon: UsersRound,
    title: "Gestorías y asesorías",
    text: "Reduce búsquedas repetitivas y organiza la información inicial de cada expediente.",
    cta: "Locapto para gestorías",
    href: "/para-gestorias",
  },
  {
    icon: ClipboardCheck,
    title: "Arquitectura e ingeniería",
    text: "Revisa la actividad y el local antes de dedicar horas a un estudio o proyecto completo.",
    cta: "Locapto para técnicos",
    href: "/para-arquitectos-ingenieros",
  },
  {
    icon: Building2,
    title: "Empresas y cadenas",
    text: "Compara ubicaciones y detecta posibles obstáculos antes de comprometer una operación.",
    cta: "Locapto para empresas",
    href: "/para-empresas",
  },
  {
    icon: Store,
    title: "Emprendedores y pymes",
    text: "Entiende qué necesitas investigar antes de alquilar, reformar o invertir en un local.",
    cta: "Preparar una apertura",
    href: "/para-empresas",
  },
];
const outputs = [
  [Gauge, "Trámite más probable"],
  [ClipboardCheck, "Requisitos"],
  [FileText, "Documentos habituales"],
  [Landmark, "Organismos implicados"],
  [Search, "Puntos clave"],
  [ShieldCheck, "Posibles obstáculos"],
  [FileCheck2, "Fuentes oficiales"],
  [Network, "Fecha de revisión"],
  [Search, "Datos por confirmar"],
] as const;
const faqs = [
  [
    "¿Qué es Locapto?",
    "Una herramienta que reúne la información inicial para abrir un negocio: trámites, requisitos, documentos, dudas pendientes y fuentes oficiales según la actividad y el municipio.",
  ],
  [
    "¿Locapto concede licencias?",
    "No. Locapto no concede licencias, no representa una aprobación municipal y no sustituye la revisión profesional o administrativa necesaria.",
  ],
  [
    "¿Cómo influye la ubicación?",
    "Los requisitos pueden cambiar según la actividad, el municipio y las características del local. Locapto organizará ese contexto para facilitar su revisión.",
  ],
  [
    "¿Para quién está pensado?",
    "Para gestorías, asesorías, arquitectos, ingenieros, consultores de licencias, empresas, cadenas, proptech, emprendedores y otros perfiles que gestionan aperturas.",
  ],
  [
    "¿Qué fuentes utiliza Locapto?",
    "Locapto se basará en fuentes oficiales de las administraciones competentes. La información mostrará de dónde procede y cuándo se revisó.",
  ],
  [
    "¿Puedo usar Locapto si soy una gestoría?",
    "Sí. Locapto está pensado para reducir búsquedas repetitivas y organizar la información inicial de cada expediente.",
  ],
  [
    "¿Puedo utilizarlo para comprobar un local antes de alquilarlo?",
    "Cuando esté disponible, la orientación inicial podrá ayudarte a detectar dudas y posibles obstáculos, sin sustituir visitas, informes técnicos, revisiones jurídicas ni consultas municipales.",
  ],
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Locapto",
              url: "https://locapto.com",
              logo: "https://locapto.com/brand/icon-colors.webp",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Locapto",
              url: "https://locapto.com",
              inLanguage: "es",
            },
          ]}
        />
        <section className="hero-section">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{AVAILABILITY_CHIP_LABEL}</p>
              <h1>
                Descubre qué necesitas para abrir un negocio según tu actividad
                y ubicación.
              </h1>
              <p className="hero-lead">
                Cuando esté disponible, Locapto reunirá los trámites,
                requisitos, documentos y condiciones del local según la
                actividad y el municipio, para que detectes riesgos antes de
                invertir tiempo o dinero.
              </p>
              <div className="hero-actions">
                <TrackedBetaLink variant="home">
                  {BETA_CTA_LABEL} <ArrowRight aria-hidden="true" />
                </TrackedBetaLink>
                <Link className="button button-quiet" href="#como-funciona">
                  Ver cómo funciona
                </Link>
              </div>
              <p className="hero-note">
                Para gestorías, técnicos, empresas y emprendedores que preparan
                aperturas.
              </p>
            </div>
            <TrackedProductPreview variant="home" />
          </div>
        </section>
        <section className="trust-strip" aria-label="Principios de Locapto">
          <div className="shell trust-grid">
            {[
              "Fuentes oficiales",
              "Información verificable",
              "Contexto territorial",
              "Datos por confirmar",
            ].map((item) => (
              <div key={item}>
                <Check aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </section>
        <section className="section problem-section">
          <div className="shell split-copy">
            <div>
              <p className="eyebrow">El problema</p>
              <h2>
                Abrir un negocio no debería empezar con quince pestañas, PDFs y
                sedes electrónicas.
              </h2>
            </div>
            <div>
              <p>
                Los requisitos suelen estar repartidos entre administraciones,
                procedimientos, ordenanzas, formularios y documentos que
                utilizan criterios distintos.
              </p>
              <p>
                Locapto organizará esa información alrededor de una actividad y
                una ubicación concretas, y mostrará también lo que falta por
                confirmar.
              </p>
            </div>
          </div>
        </section>
        <section className="section alt-section" id="profesionales">
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">Para profesionales y empresas</p>
              <h2>Locapto para cada tipo de apertura</h2>
              <p>
                Una base común para revisar cada apertura sin confundir una
                primera orientación con una aprobación.
              </p>
            </div>
            <div className="audience-grid">
              {audiences.map(({ icon: Icon, ...item }) => (
                <article className="feature-card" key={item.title}>
                  <Icon aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link href={item.href}>
                    {item.cta}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section" id="como-funciona">
          <div className="shell">
            <div className="section-heading centered">
              <p className="eyebrow">Cómo funciona</p>
              <h2>Tres pasos para llegar antes a las preguntas importantes</h2>
            </div>
            <ol className="process-grid">
              <li>
                <span>01</span>
                <h3>Describe la actividad</h3>
                <p>Explícanos qué quieres abrir en lenguaje normal.</p>
              </li>
              <li>
                <span>02</span>
                <h3>Indica dónde</h3>
                <p>
                  Selecciona municipio y, si ya tienes local, proporciona sus
                  características.
                </p>
              </li>
              <li>
                <span>03</span>
                <h3>Revisa la orientación inicial</h3>
                <p>
                  Cuando esté disponible, revisa el procedimiento probable, los
                  requisitos, las dudas pendientes y las fuentes oficiales.
                </p>
              </li>
            </ol>
            <div className="centered-action">
              <Link className="button button-quiet" href="/como-funciona">
                Cómo funciona Locapto <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <section className="section dark-section">
          <div className="shell output-layout">
            <div>
              <p className="eyebrow">Qué recibirás</p>
              <h2>Una respuesta clara para decidir el siguiente paso</h2>
              <p>
                Verás por separado lo que parece aplicable, lo que falta por
                confirmar y las fuentes consultadas.
              </p>
            </div>
            <div className="output-grid">
              {outputs.map(([Icon, label]) => (
                <div key={label}>
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section professional-section">
          <div className="shell professional-grid">
            <div>
              <p className="eyebrow">Trabajo profesional</p>
              <h2>Cada nuevo expediente no debería empezar desde cero.</h2>
              <p>
                Locapto está diseñado para ayudar a quienes trabajan
                repetidamente con aperturas, actividades y locales.
              </p>
              <TrackedBetaLink variant="home" href="#acceso-beta">
                {BETA_CTA_LABEL} <ArrowRight aria-hidden="true" />
              </TrackedBetaLink>
            </div>
            <ul className="benefit-list">
              {[
                "Menos investigación repetitiva",
                "Expedientes estructurados",
                "Fuentes oficiales fáciles de localizar",
                "Dudas pendientes identificadas",
                "Información ordenada para revisar",
                "Resultados fáciles de compartir",
              ].map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="beta-section" id="acceso-beta">
          <div className="shell beta-grid">
            <div>
              <p className="eyebrow">Aviso de disponibilidad</p>
              <h2>Te avisaremos cuando Locapto esté disponible.</h2>
              <p>
                Déjanos tu contacto y, si quieres, indica la actividad y la
                ubicación que te interesan.
              </p>
              <div className="beta-points">
                <span>
                  <Check aria-hidden="true" />
                  Trámite más probable
                </span>
                <span>
                  <Check aria-hidden="true" />
                  Pasos y documentos necesarios
                </span>
                <span>
                  <Check aria-hidden="true" />
                  Fuentes oficiales consultadas
                </span>
              </div>
            </div>
            <BetaLeadForm landingVariant="home" />
          </div>
        </section>
        <section className="section faq-section">
          <div className="shell faq-layout">
            <div>
              <p className="eyebrow">Preguntas frecuentes</p>
              <h2>Lo que conviene saber antes de apuntarte</h2>
            </div>
            <div className="faq-list">
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
