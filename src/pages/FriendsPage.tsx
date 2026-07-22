import { MessageCircle, UserPlus } from 'lucide-react';
import { friends } from '../data/appData';
import { Section } from '../components/ui';
import { useActionMenu } from '../components/ActionMenu';

export function FriendsPage() {
  const { openAction } = useActionMenu();

  return (
    <div className="page-stack">
      <Section title="Psí kamarádi v okolí" subtitle="Profily psů vhodných na společnou procházku.">
        <div className="friends-grid">
          {friends.map(([name, breed, age, personality, location]) => (
            <article className="friend-card" key={name}>
              <span className="friend-photo">{name[0]}</span>
              <h3>{name}</h3>
              <p>{breed} · {age}</p>
              <strong>{location}</strong>
              <span>{personality}</span>
              <button className="secondary-button" onClick={() => openAction({ title: `Procházka s ${name}`, description: `Domluv společnou procházku s pejskem ${name}.`, kind: 'schedule', confirmLabel: 'Odeslat návrh' })}><MessageCircle size={17} /> Domluvit procházku</button>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Doporučení pro setkání">
        <div className="warning"><UserPlus /> První setkání plánuj na neutrálním místě, s dostatkem prostoru a možností odejít, když některý pes potřebuje pauzu.</div>
      </Section>
    </div>
  );
}
