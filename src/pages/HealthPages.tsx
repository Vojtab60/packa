import { Bell, Pill, Save, ShieldCheck, Syringe, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { healthLinks } from '../data/appData';
import { DashboardCard, DataTable, EmptyState, Section, StatCard } from '../components/ui';
import { useSession } from '../session';
import { loadJson, storeJson } from '../storage';
import { useState } from 'react';

const VACCINATION_KEY = 'health-vaccinations';
const MEDICINE_KEY = 'health-medicines';
const ALLERGY_KEY = 'health-allergies';
const ALLERGY_NOTES_KEY = 'health-allergy-notes';

function isRows(value: unknown): value is string[][] {
  return Array.isArray(value) && value.every(row => Array.isArray(row) && row.every(cell => typeof cell === 'string'));
}

function useStoredRows(key: string) {
  const { userKey } = useSession();
  const storageKey = userKey(key);
  const [rows, setRows] = useState<string[][]>(() => loadJson(storageKey, [], isRows));

  function persist(nextRows: string[][]) {
    setRows(nextRows);
    storeJson(storageKey, nextRows);
  }

  return [rows, persist] as const;
}

function formatCzechDate(value: string) {
  if (!value) return 'nezadáno';
  const [year, month, day] = value.split('-').map(Number);
  return year && month && day ? `${day}. ${month}. ${year}` : value;
}

export function HealthPage() {
  const { userKey } = useSession();
  const vaccinations = loadJson(userKey(VACCINATION_KEY), [], isRows);
  const medicines = loadJson(userKey(MEDICINE_KEY), [], isRows);
  const allergies = loadJson(userKey(ALLERGY_KEY), [], isRows);
  const nextVaccination = vaccinations[0]?.[3] ?? 'nezadáno';

  return (
    <div className="page-stack">
      <div className="stats-row">
        <StatCard label="Další očkování" value={nextVaccination} detail={vaccinations.length ? 'nejbližší uložený termín' : 'přidej první záznam očkování'} />
        <StatCard label="Aktivní léky" value={medicines.length ? `${medicines.length}` : 'nezadáno'} detail={medicines.length ? 'uložené dávkování' : 'nastavíš v sekci léků'} tone="orange" />
        <StatCard label="Alergie" value={allergies.length ? `${allergies.length}` : 'nezadáno'} detail={allergies.length ? 'uložené spouštěče' : 'doplň jen ověřené alergie'} tone="red" />
      </div>
      <div className="dashboard-grid three-cards">
        {healthLinks.map(item => <DashboardCard item={item} key={item.path} />)}
      </div>
      <Section title="Zdravotní upozornění" subtitle="Všechny důležité termíny na jednom místě.">
        <div className="timeline">
          <span><Bell size={18} /> {vaccinations.length ? `Další očkování: ${nextVaccination}` : 'Zatím žádná zdravotní upozornění.'}</span>
          <span><Syringe size={18} /> Přidej očkování a aplikace ho bude zobrazovat v přehledu.</span>
          <span><ShieldCheck size={18} /> Alergie zapisuj podle doporučení veterináře.</span>
        </div>
      </Section>
    </div>
  );
}

export function HealthVaccinationPage() {
  const [rows, setRows] = useStoredRows(VACCINATION_KEY);
  const [form, setForm] = useState({ type: '', vaccine: '', applied: '', next: '' });
  const nextTerm = rows[0]?.[3] ?? 'nezadáno';

  function save() {
    if (!form.type.trim()) return;
    setRows([[form.type.trim(), form.vaccine.trim() || 'nezadáno', formatCzechDate(form.applied), formatCzechDate(form.next)], ...rows]);
    setForm({ type: '', vaccine: '', applied: '', next: '' });
  }

  return (
    <div className="page-stack">
      <div className="split-hero">
        <div><Syringe /><h2>Očkování</h2><p>Historie vakcín, typy, další termíny a připomínky přeočkování.</p></div>
        <button className="secondary-button" onClick={save}><Save size={17} /> Uložit očkování</button>
      </div>
      <div className="stats-row">
        <StatCard label="Nejbližší termín" value={nextTerm} detail={rows.length ? 'podle posledních záznamů' : 'přidej první očkování'} />
        <StatCard label="Připomínka" value={nextTerm} detail="uložený termín přeočkování" tone="blue" />
        <StatCard label="Stav" value={rows.length ? `${rows.length} záznamů` : 'prázdné'} detail="očkování uložené k e-mailu" tone="green" />
      </div>
      <Section title="Nový záznam očkování">
        <div className="form-grid">
          <label>Typ očkování<input value={form.type} onChange={event => setForm(current => ({ ...current, type: event.target.value }))} /></label>
          <label>Název vakcíny<input value={form.vaccine} onChange={event => setForm(current => ({ ...current, vaccine: event.target.value }))} /></label>
          <label>Aplikováno<input type="date" value={form.applied} onChange={event => setForm(current => ({ ...current, applied: event.target.value }))} /></label>
          <label>Další termín<input type="date" value={form.next} onChange={event => setForm(current => ({ ...current, next: event.target.value }))} /></label>
        </div>
        <button className="primary-button" onClick={save}><Save size={17} /> Uložit očkování</button>
      </Section>
      <Section title="Historie očkování">
        {rows.length ? <><DataTable headers={['Očkování', 'Vakcína', 'Aplikováno', 'Další termín']} rows={rows} /><button className="mini-action danger" onClick={() => setRows(rows.slice(1))}><Trash2 size={16} /> Smazat poslední přidané</button></> : <EmptyState title="Žádné očkování" text="Vyplň první záznam a ulož ho." />}
      </Section>
    </div>
  );
}

export function HealthMedicinePage() {
  const [rows, setRows] = useStoredRows(MEDICINE_KEY);
  const [form, setForm] = useState({ name: '', dose: '', regime: 'Každý den', time: '' });

  function save() {
    if (!form.name.trim()) return;
    setRows([[form.name.trim(), form.dose.trim() || 'nezadáno', form.regime, form.time || 'bez času'], ...rows]);
    setForm({ name: '', dose: '', regime: 'Každý den', time: '' });
  }

  return (
    <div className="page-stack">
      <div className="split-hero"><div><Pill /><h2>Léky a dávkování</h2><p>Upozornění na prášky, historie podání a dávkování podle režimu psa.</p></div><button className="secondary-button" onClick={save}><Save size={17} /> Uložit lék</button></div>
      <Section title="Upozornění léků">
        <div className="form-grid">
          <label>Název léku<input value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} /></label>
          <label>Dávkování<input value={form.dose} onChange={event => setForm(current => ({ ...current, dose: event.target.value }))} /></label>
          <label>Čas<input type="time" value={form.time} onChange={event => setForm(current => ({ ...current, time: event.target.value }))} /></label>
          <label>Režim<select value={form.regime} onChange={event => setForm(current => ({ ...current, regime: event.target.value }))}><option>Každý den</option><option>Jednou týdně</option><option>Podle potřeby</option></select></label>
        </div>
        <button className="primary-button" onClick={save}><Save size={17} /> Uložit upozornění</button>
      </Section>
      {rows.length ? <DataTable headers={['Lék', 'Dávka', 'Režim', 'Upozornění']} rows={rows} /> : <EmptyState title="Žádné léky" text="Až bude pejsek brát léky nebo doplňky, přidej dávkování a upozornění." />}
    </div>
  );
}

export function HealthAllergiesPage() {
  const { userKey } = useSession();
  const notesKey = userKey(ALLERGY_NOTES_KEY);
  const [rows, setRows] = useStoredRows(ALLERGY_KEY);
  const [notes, setNotes] = useState(() => loadJson(notesKey, '', (value): value is string => typeof value === 'string'));
  const [form, setForm] = useState({ allergy: '', symptoms: '', recommendation: '' });

  function saveAllergy() {
    if (!form.allergy.trim()) return;
    setRows([[form.allergy.trim(), form.symptoms.trim() || 'nezadáno', form.recommendation.trim() || 'nezadáno'], ...rows]);
    setForm({ allergy: '', symptoms: '', recommendation: '' });
  }

  function saveNotes() {
    storeJson(notesKey, notes);
  }

  return (
    <div className="page-stack">
      <div className="split-hero"><div><ShieldCheck /><h2>Alergie</h2><p>Spouštěče, doporučení a veterinární poznámky pro běžnou péči.</p></div><button className="secondary-button" onClick={saveAllergy}><Save size={17} /> Uložit alergii</button></div>
      <Section title="Nová alergie">
        <div className="form-grid">
          <label>Alergie<input value={form.allergy} onChange={event => setForm(current => ({ ...current, allergy: event.target.value }))} /></label>
          <label>Příznaky<input value={form.symptoms} onChange={event => setForm(current => ({ ...current, symptoms: event.target.value }))} /></label>
          <label>Doporučení<input value={form.recommendation} onChange={event => setForm(current => ({ ...current, recommendation: event.target.value }))} /></label>
        </div>
        <button className="primary-button" onClick={saveAllergy}><Save size={17} /> Uložit alergii</button>
      </Section>
      {rows.length ? <DataTable headers={['Alergie', 'Příznaky', 'Doporučení']} rows={rows} /> : <EmptyState title="Žádné alergie" text="Pokud má pejsek alergii, doplň spouštěč, příznaky a doporučení veterináře." />}
      <Section title="Veterinární poznámky">
        <textarea placeholder="Sem si můžeš uložit veterinární poznámky." value={notes} onChange={event => setNotes(event.target.value)} />
        <button className="primary-button" onClick={saveNotes}><Save size={17} /> Uložit poznámky</button>
      </Section>
      <Link className="text-link" to="/zdravi">Zpět na zdraví</Link>
    </div>
  );
}
