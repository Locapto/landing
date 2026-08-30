import { FileText, Landmark, SearchCheck } from "lucide-react";

export function ProductPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={compact ? "preview-wrap compact-preview" : "preview-wrap"}
      aria-label="Ejemplo ilustrativo de resultado de Locapto"
    >
      <div className="product-preview">
        <div className="preview-topline">
          <span>Resultado preliminar</span>
          <span className="status-pill">CONDICIONADO</span>
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
        <div className="preview-card accent-card">
          <SearchCheck aria-hidden="true" />
          <div>
            <span>Procedimiento probable</span>
            <strong>Declaración responsable</strong>
          </div>
        </div>
        <div className="preview-card">
          <div>
            <span>Puntos que requieren confirmación</span>
            <ul>
              <li>Compatibilidad del uso</li>
              <li>Obras previstas</li>
              <li>Condiciones técnicas del establecimiento</li>
              <li>Señalización y accesibilidad, cuando corresponda</li>
            </ul>
          </div>
        </div>
        <div className="preview-stats">
          <div>
            <FileText aria-hidden="true" />
            <strong>3</strong>
            <span>documentos habituales</span>
          </div>
          <div>
            <Landmark aria-hidden="true" />
            <strong>1</strong>
            <span>fuente oficial</span>
          </div>
        </div>
        <div className="source-row">
          <Landmark aria-hidden="true" />
          <div>
            <strong>Ayuntamiento de Madrid</strong>
            <span>Fuente revisada</span>
          </div>
        </div>
      </div>
      <p className="illustrative-note">Ejemplo ilustrativo de resultado</p>
    </div>
  );
}
