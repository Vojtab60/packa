import { Plane, ShieldCheck } from 'lucide-react';
import { travelChecklist } from '../data/appData';
import { Checklist, Section, StatCard } from '../components/ui';

export function TravelPage() {
  return (
    <div className="page-stack">
      <div className="stats-row">
        <StatCard label="Doklady" value="Pas + čip" detail="ověřit před každou cestou" />
        <StatCard label="Očkování" value="Vzteklina" detail="zkontrolovat platnost v cílové zemi" tone="orange" />
        <StatCard label="Výbava" value="10 položek" detail="voda, náhubek, přepravka" tone="blue" />
      </div>
      <Section title="Checklist před cestou"><Checklist items={travelChecklist} /></Section>
      <Section title="Cestování do zahraničí" subtitle="Požadavky se liší podle země a dopravce.">
        <div className="travel-info">
          <Plane />
          <p>U zahraniční cesty ověř platnost očkování proti vzteklině, pas zvířete, čip, lokální pravidla pro náhubek a požadavky dopravce. Před cestou s rizikem parazitů se poraď s veterinářem.</p>
        </div>
        <div className="warning"><ShieldCheck /> Informace jsou orientační a nenahrazují veterinární ani úřední ověření podmínek cílové země.</div>
      </Section>
    </div>
  );
}
