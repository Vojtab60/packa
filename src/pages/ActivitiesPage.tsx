import { Coffee, Edit3, Moon, Plus, Save, Trash2, Utensils, Waves, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MiniBars, Section, StatCard } from '../components/ui';
import { useSession } from '../session';

type ActivityEntry = {
  date: string;
  movementMin: number;
  outsideMin: number;
  meals: number;
  waterMl: number;
  sleepHours: number;
  trainingMin: number;
  restMin: number;
  mood: string;
  note: string;
};

const ACTIVITY_STORAGE_KEY = 'activity-history';
const initialActivities: ActivityEntry[] = [];

function todayInput() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCzechDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return value;
  }
  return `${day}. ${month}. ${year}`;
}

function isActivityEntry(value: unknown): value is ActivityEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<ActivityEntry>;
  return (
    typeof entry.date === 'string' &&
    typeof entry.movementMin === 'number' &&
    typeof entry.outsideMin === 'number' &&
    typeof entry.meals === 'number' &&
    typeof entry.waterMl === 'number' &&
    typeof entry.sleepHours === 'number' &&
    typeof entry.trainingMin === 'number' &&
    typeof entry.restMin === 'number' &&
    typeof entry.mood === 'string' &&
    typeof entry.note === 'string'
  );
}

function loadActivities(storageKey: string) {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return initialActivities;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.every(isActivityEntry) ? parsed : initialActivities;
  } catch {
    return initialActivities;
  }
}

function storeActivities(storageKey: string, entries: ActivityEntry[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(entries));
}

function blankActivity(): ActivityEntry {
  return {
    date: todayInput(),
    movementMin: 60,
    outsideMin: 90,
    meals: 2,
    waterMl: 800,
    sleepHours: 12,
    trainingMin: 5,
    restMin: 45,
    mood: 'spokojený',
    note: ''
  };
}

function formatOutside(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours <= 0) return `${rest} min`;
  return `${hours} h ${rest} min`;
}

function wellbeingText(entry: ActivityEntry) {
  if (entry.movementMin < 45) return 'méně pohybu, vhodný klidný den';
  if (entry.movementMin > 110) return 'hodně aktivity, hlídat regeneraci';
  if (entry.waterMl < 700) return 'zkontrolovat pitný režim';
  return 'vyvážený den';
}

export function ActivitiesPage() {
  const { userKey } = useSession();
  const activityStorageKey = userKey(ACTIVITY_STORAGE_KEY);
  const [activities, setActivities] = useState<ActivityEntry[]>(() => loadActivities(activityStorageKey));
  const [form, setForm] = useState<ActivityEntry>(() => blankActivity());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const hasActivities = activities.length > 0;
  const latest = activities[0] ?? blankActivity();
  const week = activities.slice(0, 7);
  const weeklyMovement = week.reduce((sum, entry) => sum + entry.movementMin, 0);
  const weeklyOutside = week.reduce((sum, entry) => sum + entry.outsideMin, 0);
  const weeklyAverage = Math.round(weeklyMovement / Math.max(week.length, 1));
  const bars = useMemo(() => {
    const max = Math.max(...week.map(entry => entry.movementMin), 1);
    return week.map(entry => Math.max(18, Math.round((entry.movementMin / max) * 100))).reverse();
  }, [week]);

  function persist(nextEntries: ActivityEntry[]) {
    setActivities(nextEntries);
    storeActivities(activityStorageKey, nextEntries);
  }

  function openNewActivity() {
    setEditingIndex(null);
    setForm(blankActivity());
    setModalOpen(true);
  }

  function editActivity(index: number) {
    setEditingIndex(index);
    setForm(activities[index]);
    setModalOpen(true);
  }

  function deleteActivity(index: number) {
    const nextEntries = activities.filter((_, rowIndex) => rowIndex !== index);
    persist(nextEntries);
    setToast('Aktivita byla smazaná.');
    window.setTimeout(() => setToast(''), 2200);
  }

  function saveActivity() {
    const cleaned: ActivityEntry = {
      ...form,
      note: form.note.trim() || 'bez poznámky',
      mood: form.mood.trim() || 'spokojený'
    };
    const nextEntries = editingIndex === null
      ? [cleaned, ...activities]
      : activities.map((entry, index) => index === editingIndex ? cleaned : entry);

    persist(nextEntries);
    setEditingIndex(null);
    setModalOpen(false);
    setToast(editingIndex === null ? 'Aktivita byla zapsaná.' : 'Aktivita byla upravená.');
    window.setTimeout(() => setToast(''), 2200);
  }

  function updateNumber(key: keyof Pick<ActivityEntry, 'movementMin' | 'outsideMin' | 'meals' | 'waterMl' | 'sleepHours' | 'trainingMin' | 'restMin'>, value: string) {
    setForm(current => ({ ...current, [key]: Number(value) }));
  }

  return (
    <div className="page-stack">
      {toast && <div className="toast"><Save size={17} /> {toast}</div>}

      {!hasActivities && (
        <Section title="Denní deník je zatím prázdný" subtitle="Začni prvním záznamem. Stačí vyplnit, kolik měl pejsek pohybu, jak dlouho byl venku, kolik pil, jedl a jakou měl náladu.">
          <button className="primary-button" onClick={openNewActivity}><Plus size={17} /> Zapsat první aktivitu</button>
        </Section>
      )}

      {modalOpen && (
        <div className="modal-backdrop">
          <section className="action-modal">
            <div className="panel-head">
              <div>
                <span>Denní deník</span>
                <h2>{editingIndex === null ? 'Zapsat aktivitu' : 'Upravit aktivitu'}</h2>
              </div>
              <button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Zavřít formulář"><X size={18} /></button>
            </div>
            <div className="form-grid">
              <label>Datum<input type="date" value={form.date} onChange={event => setForm(current => ({ ...current, date: event.target.value }))} /></label>
              <label>Pohyb v minutách<input type="number" min="0" value={form.movementMin} onChange={event => updateNumber('movementMin', event.target.value)} /></label>
              <label>Čas venku v minutách<input type="number" min="0" value={form.outsideMin} onChange={event => updateNumber('outsideMin', event.target.value)} /></label>
              <label>Krmení počet porcí<input type="number" min="0" value={form.meals} onChange={event => updateNumber('meals', event.target.value)} /></label>
              <label>Voda v ml<input type="number" min="0" value={form.waterMl} onChange={event => updateNumber('waterMl', event.target.value)} /></label>
              <label>Spánek v hodinách<input type="number" min="0" step="0.5" value={form.sleepHours} onChange={event => updateNumber('sleepHours', event.target.value)} /></label>
              <label>Trénink v minutách<input type="number" min="0" value={form.trainingMin} onChange={event => updateNumber('trainingMin', event.target.value)} /></label>
              <label>Klid po aktivitě v minutách<input type="number" min="0" value={form.restMin} onChange={event => updateNumber('restMin', event.target.value)} /></label>
              <label>Nálada<input value={form.mood} onChange={event => setForm(current => ({ ...current, mood: event.target.value }))} /></label>
            </div>
            <label className="full-field">Poznámka<textarea value={form.note} onChange={event => setForm(current => ({ ...current, note: event.target.value }))} placeholder="např. delší procházka, únava, čichací hry, aport" /></label>
            <div className="edit-footer">
              <button className="secondary-button" onClick={() => setModalOpen(false)}>Zrušit</button>
              <button className="primary-button" onClick={saveActivity}><Save size={17} /> {editingIndex === null ? 'Uložit aktivitu' : 'Uložit změnu'}</button>
            </div>
          </section>
        </div>
      )}

      <div className="stats-row">
        <StatCard label="Denní pohyb" value={hasActivities ? `${latest.movementMin} min` : 'nezadáno'} detail={hasActivities ? wellbeingText(latest) : 'zapiš první aktivitu'} />
        <StatCard label="Čas venku" value={hasActivities ? formatOutside(latest.outsideMin) : 'nezadáno'} detail={hasActivities ? `${latest.meals} porce krmení` : 'čeká na první záznam'} tone="orange" />
        <StatCard label="Spánek" value={hasActivities ? `${latest.sleepHours} h` : 'nezadáno'} detail={hasActivities ? `nálada: ${latest.mood}` : 'doplníš v deníku'} tone="blue" />
      </div>

      <div className="content-grid two">
        <Section title="Týdenní přehled" subtitle={`Za 7 dní ${weeklyMovement} min pohybu, průměr ${weeklyAverage} min denně.`}>
          {hasActivities ? <MiniBars values={bars} /> : <div className="empty-state"><strong>Zatím není co vykreslit</strong><p>Graf se objeví po prvním uloženém dni.</p></div>}
          <div className="activity-summary">
            <span><Waves size={18} /> Čas venku tento týden: {hasActivities ? formatOutside(weeklyOutside) : 'nezadáno'}</span>
            <span><Coffee size={18} /> Poslední záznam: {hasActivities ? formatCzechDate(latest.date) : 'žádný'}</span>
          </div>
        </Section>
        <Section title="Denní péče" subtitle="Souhrn podle posledního uloženého dne.">
          <div className="care-grid">
            <span><Utensils /> Krmení {hasActivities ? `${latest.meals} porce` : 'nezadáno'}</span>
            <span><Waves /> Pitný režim {hasActivities ? `${latest.waterMl} ml` : 'nezadáno'}</span>
            <span><Moon /> Spánek {hasActivities ? `${latest.sleepHours} hodin` : 'nezadáno'}</span>
            <span><Coffee /> Klid po aktivitě {hasActivities ? `${latest.restMin} min` : 'nezadáno'}</span>
          </div>
        </Section>
      </div>

      <Section title="Historie aktivit" subtitle="Každý den můžeš opravit nebo smazat." action={<button className="primary-button" onClick={openNewActivity}><Plus size={17} /> Zapsat aktivitu</button>}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Datum</th><th>Pohyb</th><th>Venku</th><th>Krmení</th><th>Voda</th><th>Spánek</th><th>Nálada</th><th>Poznámka</th><th>Akce</th></tr>
            </thead>
            <tbody>
              {activities.length === 0 && (
                <tr><td colSpan={9}>Zatím tu není žádná aktivita. Klikni na „Zapsat aktivitu“.</td></tr>
              )}
              {activities.map((entry, index) => (
                <tr key={`${entry.date}-${index}`}>
                  <td>{formatCzechDate(entry.date)}</td>
                  <td>{entry.movementMin} min</td>
                  <td>{formatOutside(entry.outsideMin)}</td>
                  <td>{entry.meals} porce</td>
                  <td>{entry.waterMl} ml</td>
                  <td>{entry.sleepHours} h</td>
                  <td>{entry.mood}</td>
                  <td>{entry.note}</td>
                  <td>
                    <div className="table-actions">
                      <button className="mini-action" onClick={() => editActivity(index)}><Edit3 size={16} /> Upravit</button>
                      <button className="mini-action danger" onClick={() => deleteActivity(index)}><Trash2 size={16} /> Smazat</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
