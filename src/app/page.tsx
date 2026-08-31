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
import { BETA_CTA_LABEL } from "@/config/marketing";

export const metadata: Metadata = {
  title: "Precalificación para abrir negocios y locales | Locapto",
  description:
    "Precalifica aperturas en cualquier municipio de España. Consulta requisitos, procedimientos, condicionantes y fuentes oficiales con Locapto.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Precalificación para abrir negocios y locales | Locapto",
    description:
      "Precalifica aperturas en toda España con requisitos, condicionantes y fuentes oficiales.",
    url: "/",
    locale: "es_ES",
    siteName: "Locapto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precalificación para abrir negocios y locales | Locapto",
    description:
      "Precalifica aperturas en toda España con requisitos, condicionantes y fuentes oficiales.",
  },
};

const audiences = [
  {
    icon: UsersRound,
    title: "Gestorías y asesorías",
    text: "Reduce la investigación repetitiva y estructura mejor la información inicial de cada expediente.",
    cta: "Locapto para gestorías",
    href: "/para-gestorias",
  },
  {
    icon: ClipboardCheck,
    title: "Arquitectura e ingeniería",
    text: "Precalifica actividad y local antes de dedicar horas a un estudio o proyecto completo.",
    cta: "Locapto para técnicos",
    href: "/para-arquitectos-ingenieros",
  },
  {
    icon: Building2,
    title: "Empresas y cadenas",
    text: "Compara ubicaciones y detecta condicionantes antes de comprometer una operación.",
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
  [Gauge, "Procedimiento probable"],
  [ClipboardCheck, "Requisitos"],
  [FileText, "Documentación"],
  [Landmark, "Administraciones"],
  [Search, "Variables críticas"],
  [ShieldCheck, "Bloqueos habituales"],
  [FileCheck2, "Fuentes oficiales"],
  [Network, "Vigencia"],
  [Search, "Información pendiente"],
] as const;
const faqs = [
  [
    "¿Qué es Locapto?",
    "Una herramienta en preparación para estructurar orientación regulatoria preliminar sobre aperturas por actividad, municipio y, cuando exista, local.",
  ],
  [
    "¿Locapto concede licencias?",
    "No. Locapto no concede licencias, no representa una aprobación municipal y no sustituye la revisión profesional o administrativa necesaria.",
  ],
  [
    "¿Dónde está disponible la beta?",
    "Puedes solicitar acceso desde cualquier municipio de España. Locapto está planteado para prestar servicio en todo el territorio nacional.",
  ],
  [
    "¿Para quién está pensado?",
    "Para gestorías, asesorías, arquitectos, ingenieros, consultores de licencias, empresas, cadenas, proptech, emprendedores y otros perfiles que gestionan aperturas.",
  ],
  [
    "¿Qué fuentes utiliza Locapto?",
    "La propuesta se basa en fuentes oficiales de las administraciones competentes, con trazabilidad y fecha de revisión.",
  ],
  [
    "¿Puedo usar Locapto si soy una gestoría?",
    "Ese es uno de los perfiles prioritarios: queremos reducir investigación repetitiva y ordenar la información inicial de cada expediente.",
  ],
  [
    "¿Puedo utilizarlo para comprobar un local antes de alquilarlo?",
    "La precalificación puede ayudar a detectar preguntas y condicionantes, pero no sustituye visitas, informes técnicos, verificaciones jurídicas ni consultas municipales.",
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
              areaServed: {
                "@type": "Country",
                name: "España",
              },
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
              <p className="eyebrow">BETA PRIVADA · Lista de acceso</p>
              <h1>Precalifica aperturas de negocio con fuentes oficiales.</h1>
              <p className="hero-lead">
                Locapto reúne requisitos, procedimientos, documentación y
                condicionantes del local según actividad y municipio, para que
                puedas detectar riesgos antes de invertir tiempo o dinero.
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
                Para gestorías, técnicos, empresas y emprendedores de toda
                España.
              </p>
            </div>
            <TrackedProductPreview variant="home" />
          </div>
        </section>
        <section className="trust-strip" aria-label="Principios de Locapto">
          <div className="shell trust-grid">
            {[
              "Fuentes oficiales",
              "Trazabilidad",
              "Ámbito nacional",
              "Sin falsas certezas",
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
                Locapto aspira a estructurar esa información alrededor de una
                actividad y una ubicación concretas, mostrando también lo que
                falta por confirmar.
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
                Una base común para investigar mejor sin convertir una
                orientación en una falsa certeza.
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
                <h3>Obtén una precalificación</h3>
                <p>
                  Consulta procedimiento probable, requisitos, preguntas
                  pendientes y evidencia oficial.
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
              <p className="eyebrow">Salida estructurada</p>
              <h2>Una respuesta diseñada para poder actuar</h2>
              <p>
                Lo probable, lo pendiente y la evidencia permanecen separados
                para que sepas qué puedes utilizar y qué necesitas validar.
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
                "Evidencia oficial localizable",
                "Preguntas pendientes identificadas",
                "Histórico y seguimiento en el futuro producto",
                "Resultados compartibles en el futuro producto",
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
              <p className="eyebrow">Lista de acceso a la beta</p>
              <h2>Apúntate para cuando Locapto esté disponible.</h2>
              <p>
                Déjanos tu contacto ahora y podremos avisarte cuando abramos el
                acceso en todo el territorio nacional.
              </p>
              <div className="beta-points">
                <span>
                  <Check aria-hidden="true" />
                  Solicitud breve
                </span>
                <span>
                  <Check aria-hidden="true" />
                  Sin compromiso
                </span>
                <span>
                  <Check aria-hidden="true" />
                  Sin newsletter automática
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
              <h2>Lo importante antes de solicitar acceso</h2>
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
