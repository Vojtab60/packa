import { Bell, Pill, ShieldCheck, Syringe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { allergies, healthLinks, medicines, vaccineHistory } from '../data/appData';
import { AddButton, DashboardCard, DataTable, EmptyState, PrimaryButton, Section, StatCard } from '../components/ui';

export function HealthPage() {
  return (
    <div className="page-stack">
      <div className="stats-row">
        <StatCard label="Další očkování" value="nezadáno" detail="přidej první záznam očkování" />
        <StatCard label="Aktivní léky" value="nezadáno" detail="nastavíš v sekci léků" tone="orange" />
        <StatCard label="Alergie" value="nezadáno" detail="doplň jen ověřené alergie" tone="red" />
      </div>
      <div className="dashboard-grid three-cards">
        {healthLinks.map(item => <DashboardCard item={item} key={item.path} />)}
      </div>
      <Section title="Zdravotní upozornění" subtitle="Všechny důležité termíny na jednom místě.">
        <div className="timeline">
          <span><Bell size={18} /> Zatím žádná zdravotní upozornění.</span>
          <span><Syringe size={18} /> Přidej očkování a aplikace ho bude zobrazovat v přehledu.</span>
          <span><ShieldCheck size={18} /> Alergie zapisuj podle doporučení veterináře.</span>
        </div>
      </Section>
    </div>
  );
}

export function HealthVaccinationPage() {
  return (
    <div className="page-stack">
      <div className="split-hero">
        <div><Syringe /><h2>Očkování</h2><p>Historie vakcín, typy, další termíny a připomínky přeočkování.</p></div>
        <AddButton>Přidat očkování</AddButton>
      </div>
      <div className="stats-row">
        <StatCard label="Nejbližší termín" value="nezadáno" detail="přidej první očkování" />
        <StatCard label="Připomínka" value="nezadáno" detail="nastavíš po zadání termínu" tone="blue" />
        <StatCard label="Stav" value="prázdné" detail="žádné očkování zatím není uložené" tone="green" />
      </div>
      <Section title="Historie očkování">
        {vaccineHistory.length ? <DataTable headers={['Očkování', 'Vakcína', 'Aplikováno', 'Další termín']} rows={vaccineHistory} /> : <EmptyState title="Žádné očkování" text="Klikni na Přidat očkování a vyplň první záznam." />}
      </Section>
      <Section title="Nový záznam očkování" subtitle="Formulář připravený pro napojení na backend.">
        <div className="form-grid">
          <input placeholder="Typ očkování" />
          <input placeholder="Název vakcíny" />
          <input type="date" />
          <input type="date" />
        </div>
        <PrimaryButton>Uložit očkování</PrimaryButton>
      </Section>
    </div>
  );
}

export function HealthMedicinePage() {
  return (
    <div className="page-stack">
      <div className="split-hero"><div><Pill /><h2>Léky a dávkování</h2><p>Upozornění na prášky, historie podání a dávkování podle režimu psa.</p></div><AddButton>Přidat lék</AddButton></div>
      {medicines.length ? <DataTable headers={['Lék', 'Dávka', 'Režim', 'Upozornění']} rows={medicines} /> : <EmptyState title="Žádné léky" text="Až bude pejsek brát léky nebo doplňky, přidej dávkování a upozornění." />}
      <Section title="Upozornění léků" subtitle="Ukázka opakovaných notifikací.">
        <div className="form-grid">
          <input placeholder="Název léku" />
          <input placeholder="Dávkování" />
          <input type="time" />
          <select defaultValue="daily"><option value="daily">Každý den</option><option>Jednou týdně</option><option>Podle potřeby</option></select>
        </div>
        <PrimaryButton>Uložit upozornění</PrimaryButton>
      </Section>
    </div>
  );
}

export function HealthAllergiesPage() {
  return (
    <div className="page-stack">
      <div className="split-hero"><div><ShieldCheck /><h2>Alergie</h2><p>Spouštěče, doporučení a veterinární poznámky pro běžnou péči.</p></div><AddButton>Přidat alergii</AddButton></div>
      {allergies.length ? <DataTable headers={['Alergie', 'Příznaky', 'Doporučení']} rows={allergies} /> : <EmptyState title="Žádné alergie" text="Pokud má pejsek alergii, doplň spouštěč, příznaky a doporučení veterináře." />}
      <Section title="Veterinární poznámky">
        <textarea placeholder="Sem si můžeš uložit veterinární poznámky." />
        <PrimaryButton>Uložit poznámky</PrimaryButton>
      </Section>
      <Link className="text-link" to="/zdravi">Zpět na zdraví</Link>
    </div>
  );
}
