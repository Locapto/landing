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
      aria-label="Vista ilustrativa del formato futuro de Locapto; no es una consulta real"
    >
      <div className="product-preview">
        <div className="preview-progress" aria-hidden="true">
          <span />
        </div>
        <div className="preview-topline" aria-hidden="true">
          <div className="preview-status-copy">
            <span className="preview-loading-label">
              <span className="preview-spinner" />
              Ejemplo ilustrativo
            </span>
            <span className="preview-ready-label">
              <CheckCircle2 />
              Formato previsto
            </span>
          </div>
          <div className="status-pill">
            <span className="status-analyzing">EJEMPLO</span>
            <span className="status-ready">ILUSTRATIVO</span>
          </div>
        </div>
        <div className="preview-fields">
          <div>
            <span>Actividad</span>
            <strong>Actividad indicada</strong>
          </div>
          <div>
            <span>Ubicación</span>
            <strong>Ubicación indicada</strong>
          </div>
          <div>
            <span>Local</span>
            <strong>Características disponibles</strong>
          </div>
        </div>
        <div className="preview-result">
          <SearchCheck aria-hidden="true" />
          <div>
            <span>Procedimiento</span>
            <strong>Por identificar y contrastar</strong>
            <small>Según actividad, ubicación y local</small>
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
              <strong>Compatibilidad del uso</strong>
              <small>Información que deberá comprobarse</small>
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
              <strong>Identificar el procedimiento aplicable</strong>
              <span>En la administración competente</span>
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
            <span>Fuentes oficiales relevantes</span>
            <small>Por identificar</small>
          </div>
          <div className="preview-source-row">
            <Landmark aria-hidden="true" />
            <div>
              <strong>Administración competente</strong>
              <span>Sede electrónica y procedimiento aplicable</span>
              <small className="preview-source-review" aria-hidden="true">
                Revisar fuente oficial ↗
              </small>
            </div>
            <CheckCircle2 aria-hidden="true" />
          </div>
          <div className="preview-source-row">
            <FileText aria-hidden="true" />
            <div>
              <strong>Fuentes territoriales y sectoriales</strong>
              <span>Normativa y documentación relevante</span>
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
