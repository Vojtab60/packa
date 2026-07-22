import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Plus, Save } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { CardLink, Tone } from '../types';
import { useActionMenu } from './ActionMenu';

export function DashboardCard({ item }: { item: CardLink }) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.015 }} whileTap={{ scale: 0.99 }}>
      <Link className={`card-link ${item.tone ?? 'green'}`} to={item.path}>
        <div className="card-icon"><item.icon size={22} /></div>
        <div>
          <span>{item.metric}</span>
          <h3>{item.title}</h3>
          <p>{item.subtitle}</p>
        </div>
        <ArrowRight className="card-arrow" size={20} />
      </Link>
    </motion.div>
  );
}

export function StatCard({ label, value, detail, tone = 'green' }: { label: string; value: string; detail: string; tone?: Tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

export function Section({ title, subtitle, children, action }: { title: string; subtitle?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PrimaryButton({ children = 'Uložit změny' }: { children?: ReactNode }) {
  const { openAction } = useActionMenu();
  const label = String(children);
  return (
    <button
      className="primary-button"
      onClick={() => openAction({
        title: label,
        description: 'Zkontroluj údaje a potvrď akci. V produkční verzi se odsud zavolá API a uloží data do účtu.',
        kind: 'save',
        confirmLabel: 'Uložit'
      })}
    >
      <Save size={17} />{children}
    </button>
  );
}

export function AddButton({ children }: { children: ReactNode }) {
  const { openAction } = useActionMenu();
  const label = String(children);
  return (
    <button
      className="secondary-button"
      onClick={() => openAction({
        title: label,
        description: 'Vyplň základní údaje nového záznamu. Formulář je sjednocený pro celou aplikaci.',
        kind: 'add',
        confirmLabel: 'Přidat'
      })}
    >
      <Plus size={17} />{children}
    </button>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map(item => <li key={item}><CheckCircle2 size={18} />{item}</li>)}
    </ul>
  );
}

export function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{headers.map(header => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.join('-')}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function MiniBars({ values }: { values: number[] }) {
  return (
    <div className="mini-bars">
      {values.map((value, index) => <span key={index} style={{ height: `${value}%` }} />)}
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 4 }).map((_, index) => <span key={index} />)}
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}
