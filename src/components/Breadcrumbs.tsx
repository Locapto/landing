import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; path: string };
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/">Inicio</Link>
        </li>
        {items.map((item, index) => (
          <li key={item.path}>
            <ChevronRight aria-hidden="true" />
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link href={item.path}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
