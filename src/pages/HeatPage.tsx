import { useMemo, useState } from 'react';
import { Download, Edit3, Info, Save } from 'lucide-react';
import { DataTable, EmptyState, Section, StatCard } from '../components/ui';
import { buildMonth, dateKey, formatDate, heatCalculations, type HeatForm } from '../utils/heatCycle';
import { useActionMenu } from '../components/ActionMenu';
import { useSession } from '../session';
import { loadJson, storeJson } from '../storage';

const initialForm: HeatForm = {
  startDate: '',
  heatLength: 20,
  cycleLength: 182,
  notes: '',
  symptoms: ''
};

const HEAT_FORM_KEY = 'heat-cycle';
const HEAT_HISTORY_KEY = 'heat-history';

function isHeatForm(value: unknown): value is HeatForm {
  if (!value || typeof value !== 'object') return false;
  const form = value as Partial<HeatForm>;
  return (
    typeof form.startDate === 'string' &&
    typeof form.heatLength === 'number' &&
    typeof form.cycleLength === 'number' &&
    typeof form.notes === 'string' &&
    typeof form.symptoms === 'string'
  );
}

function isRows(value: unknown): value is string[][] {
  return Array.isArray(value) && value.every(row => Array.isArray(row) && row.every(cell => typeof cell === 'string'));
}

function HeatCalendar({ form }: { form: HeatForm }) {
  const calc = form.startDate ? heatCalculations(form) : null;
  const baseDate = form.startDate ? new Date(`${form.startDate}T12:00:00`) : new Date();
  const days = buildMonth(baseDate.getFullYear(), baseDate.getMonth());
  const markers = new Map<string, string>();

  if (calc) {
    markers.set(dateKey(calc.start), 'start');
    markers.set(dateKey(calc.end), 'end');
    markers.set(dateKey(calc.nextStart), 'next');

    for (let day = new Date(calc.riskStart); day <= calc.riskEnd; day.setDate(day.getDate() + 1)) {
      markers.set(dateKey(day), 'risk');
    }
    for (let day = new Date(calc.fertileStart); day <= calc.fertileEnd; day.setDate(day.getDate() + 1)) {
      markers.set(dateKey(day), 'fertile');
    }
    markers.set(dateKey(calc.start), 'start');
    markers.set(dateKey(calc.end), 'end');
  }

  return (
    <div className="heat-calendar">
      {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => <strong key={day}>{day}</strong>)}
      {days.map(day => {
        const key = dateKey(day);
        const tone = markers.get(key) ?? '';
        return <span className={`calendar-day ${tone} ${day.getMonth() !== baseDate.getMonth() ? 'muted' : ''}`} key={key}>{day.getDate()}</span>;
      })}
    </div>
  );
}

export function HeatPage() {
  const { userKey } = useSession();
  const formStorageKey = userKey(HEAT_FORM_KEY);
  const historyStorageKey = userKey(HEAT_HISTORY_KEY);
  const [form, setForm] = useState<HeatForm>(() => loadJson(formStorageKey, initialForm, isHeatForm));
  const [history, setHistory] = useState<string[][]>(() => loadJson(historyStorageKey, [], isRows));
  const [toast, setToast] = useState(false);
  const { openAction } = useActionMenu();
  const calc = useMemo(() => form.startDate ? heatCalculations(form) : null, [form]);

  function update<K extends keyof HeatForm>(key: K, value: HeatForm[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }

  function save() {
    storeJson(formStorageKey, form);
    if (form.startDate) {
      const row = [formatDate(new Date(`${form.startDate}T12:00:00`)), `${form.heatLength} dní`, `${form.cycleLength} dní`, form.notes || form.symptoms || 'bez poznámky'];
      const nextHistory = [row, ...history.filter(existing => existing.join('|') !== row.join('|'))];
      setHistory(nextHistory);
      storeJson(historyStorageKey, nextHistory);
    }
    setToast(true);
    window.setTimeout(() => setToast(false), 2200);
  }

  function newCycle() {
    setForm(initialForm);
    storeJson(formStorageKey, initialForm);
  }

  return (
    <div className="page-stack">
      {toast && <div className="toast"><Save size={17} /> Údaje o hárání byly uložené.</div>}

      <div className="split-hero heat">
        <div>
          <Info />
          <h2>Hárání a cyklus</h2>
          <p>Orientační kalendář, připomínky, plodné dny, rizikové období a historie cyklů.</p>
        </div>
        <button className="primary-button" onClick={save}><Save size={17} /> Uložit údaje</button>
      </div>

      <div className="warning strong">
        <Info /> Výpočty jsou pouze orientační. Délka hárání i plodné dny se mohou lišit podle feny, věku, zdravotního stavu a stresu. Nenahrazují veterinární vyšetření.
      </div>

      <div className="stats-row">
        <StatCard label="Aktuální den cyklu" value={calc ? `${calc.currentDay}. den` : 'nezadáno'} detail={calc ? `začátek ${formatDate(calc.start)}` : 'vyplň datum začátku'} tone="blue" />
        <StatCard label="Plodné dny" value={calc ? `${formatDate(calc.fertileStart)} - ${formatDate(calc.fertileEnd)}` : 'nezadáno'} detail="orientační období" tone="orange" />
        <StatCard label="Očekávaný konec" value={calc ? formatDate(calc.end) : 'nezadáno'} detail={`délka ${form.heatLength} dní`} tone="green" />
        <StatCard label="Další hárání" value={calc ? formatDate(calc.nextStart) : 'nezadáno'} detail={`cyklus ${form.cycleLength} dní`} tone="red" />
      </div>

      <div className="content-grid two">
        <Section title="Zadání cyklu" action={<button className="secondary-button" onClick={newCycle}>Nový cyklus</button>}>
          <div className="form-grid">
            <label>Datum začátku<input type="date" value={form.startDate} onChange={event => update('startDate', event.target.value)} /></label>
            <label>Délka hárání<input type="number" value={form.heatLength} onChange={event => update('heatLength', Number(event.target.value))} /></label>
            <label>Délka cyklu<input type="number" value={form.cycleLength} onChange={event => update('cycleLength', Number(event.target.value))} /></label>
            <label>Příznaky<input value={form.symptoms} onChange={event => update('symptoms', event.target.value)} /></label>
          </div>
          <textarea value={form.notes} onChange={event => update('notes', event.target.value)} />
          <button className="primary-button" onClick={save}><Save size={17} /> Uložit a přepočítat</button>
        </Section>
        <Section title="Připomínky">
          <div className="timeline">
            <span>7 dní před očekávaným háráním · {calc ? formatDate(calc.reminder7) : 'čeká na datum začátku'}</span>
            <span>1 den před očekávaným háráním · {calc ? formatDate(calc.reminder1) : 'čeká na datum začátku'}</span>
            <span>Během plodných dnů · vodítko, vyhnout se volnému kontaktu</span>
            <span>Po skončení · zapsat délku, příznaky a poznámku</span>
          </div>
        </Section>
      </div>

      <Section title="Měsíční kalendář" subtitle={calc ? 'Barevně označené fáze cyklu.' : 'Kalendář se označí po zadání začátku hárání.'}>
        <HeatCalendar form={form} />
        <div className="legend">
          <span className="start">začátek</span>
          <span className="fertile">plodné dny</span>
          <span className="risk">rizikové období</span>
          <span className="end">konec</span>
          <span className="next">další cyklus</span>
        </div>
      </Section>

      <div className="content-grid two">
        <Section title="Historie cyklů" action={<button className="secondary-button" onClick={() => openAction({ title: 'Export historie hárání', description: 'Vyber formát a rozsah exportu historie cyklů.', kind: 'export', confirmLabel: 'Exportovat' })}><Download size={17} /> Export</button>}>
          {history.length ? <DataTable headers={['Začátek', 'Délka hárání', 'Délka cyklu', 'Poznámka']} rows={history} /> : <EmptyState title="Žádné cykly" text="Po zadání hárání se historie začne plnit." />}
        </Section>
        <Section title="Graf délky cyklů" action={<button className="secondary-button" onClick={() => openAction({ title: 'Upravit údaje grafu', description: 'Doplň nebo oprav historické cykly, aby graf odpovídal skutečnosti.', kind: 'edit', confirmLabel: 'Uložit úpravy' })}><Edit3 size={17} /> Upravit údaje</button>}>
          <EmptyState title="Graf čeká na data" text="Až bude uložená historie cyklů, zobrazí se zde graf délky cyklů." />
        </Section>
      </div>
    </div>
  );
}
