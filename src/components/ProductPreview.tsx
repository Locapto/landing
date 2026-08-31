import {
  Accessibility,
  Building2,
  Check,
  CheckCircle2,
  FileText,
  Landmark,
  SearchCheck,
  ShieldCheck,
  Wind,
} from "lucide-react";

export function ProductPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={compact ? "preview-wrap compact-preview" : "preview-wrap"}
      aria-label="Demostración de un resultado de Locapto"
    >
      <div className="product-preview">
        <div className="preview-progress" aria-hidden="true">
          <span />
        </div>
        <div className="preview-topline" aria-hidden="true">
          <div className="preview-status-copy">
            <span className="preview-loading-label">
              <span className="preview-spinner" />
              Consultando fuentes oficiales…
            </span>
            <span className="preview-ready-label">
              <CheckCircle2 />
              Resultado preparado
            </span>
          </div>
          <div className="status-pill">
            <span className="status-analyzing">ANALIZANDO</span>
            <span className="status-ready">LISTO</span>
          </div>
        </div>
        <div className="preview-fields">
          <div>
            <span>Actividad</span>
            <strong>Peluquería y tratamientos de belleza</strong>
          </div>
          <div>
            <span>Municipio</span>
            <strong>Madrid</strong>
          </div>
          <div>
            <span>Local</span>
            <strong>85 m²</strong>
          </div>
        </div>
        <div className="preview-result">
          <SearchCheck aria-hidden="true" />
          <div>
            <span>Trámite más probable</span>
            <strong>Declaración responsable</strong>
            <small>Antes de iniciar la actividad</small>
          </div>
        </div>
        <div className="preview-section-heading preview-requirements-heading">
          <span>Qué debe cumplir el local</span>
          <small>4 condiciones</small>
        </div>
        <div className="preview-requirements">
          <div>
            <Building2 aria-hidden="true" />
            <span>
              <strong>Uso compatible con peluquería</strong>
              <small>Permitido por el planeamiento urbanístico</small>
            </span>
          </div>
          <div>
            <Accessibility aria-hidden="true" />
            <span>
              <strong>Acceso e itinerario accesibles</strong>
              <small>Adaptados cuando corresponda</small>
            </span>
          </div>
          <div>
            <ShieldCheck aria-hidden="true" />
            <span>
              <strong>Protección contra incendios</strong>
              <small>Evacuación, señalización y extintores</small>
            </span>
          </div>
          <div>
            <Wind aria-hidden="true" />
            <span>
              <strong>Ventilación e instalaciones adecuadas</strong>
              <small>Según actividad, superficie y aforo</small>
            </span>
          </div>
        </div>
        <div className="preview-section-heading preview-steps-heading">
          <span>Pasos para avanzar</span>
          <small>4 pasos</small>
        </div>
        <ol className="preview-steps">
          <li>
            <span className="preview-step-number">1</span>
            <div>
              <strong>Confirmar que la actividad encaja en el local</strong>
              <span>Uso y situación urbanística</span>
            </div>
            <Check aria-hidden="true" />
          </li>
          <li>
            <span className="preview-step-number">2</span>
            <div>
              <strong>Preparar memoria técnica y planos</strong>
              <span>Con un profesional cuando corresponda</span>
            </div>
            <Check aria-hidden="true" />
          </li>
          <li>
            <span className="preview-step-number">3</span>
            <div>
              <strong>Presentar la declaración responsable</strong>
              <span>En la sede electrónica municipal</span>
            </div>
            <Check aria-hidden="true" />
          </li>
          <li>
            <span className="preview-step-number">4</span>
            <div>
              <strong>Conservar justificantes y documentación</strong>
              <span>Para posibles comprobaciones</span>
            </div>
            <Check aria-hidden="true" />
          </li>
        </ol>
        <div className="preview-sources">
          <div className="preview-section-heading">
            <span>Fuentes oficiales consultadas</span>
            <small>Verificadas</small>
          </div>
          <div className="preview-source-row">
            <Landmark aria-hidden="true" />
            <div>
              <strong>Ayuntamiento de Madrid</strong>
              <span>Sede electrónica · Actividades económicas</span>
              <small className="preview-source-review" aria-hidden="true">
                Revisar fuente oficial ↗
              </small>
            </div>
            <CheckCircle2 aria-hidden="true" />
          </div>
          <div className="preview-source-row">
            <FileText aria-hidden="true" />
            <div>
              <strong>Comunidad de Madrid</strong>
              <span>Normativa aplicable y accesibilidad</span>
              <small className="preview-source-review" aria-hidden="true">
                Revisar fuente oficial ↗
              </small>
            </div>
            <CheckCircle2 aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
