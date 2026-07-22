import { Bell, Lock, UserRound } from 'lucide-react';
import { PrimaryButton, Section } from '../components/ui';
import { useSession } from '../session';

export function SettingsPage() {
  const { user } = useSession();

  return (
    <div className="page-stack">
      <div className="content-grid two">
        <Section title="Profil uživatele">
          <div className="form-grid">
            <input defaultValue={user?.name ?? ''} placeholder="Jméno majitele" />
            <input defaultValue={user?.email ?? ''} placeholder="E-mail" />
            <input placeholder="Město" />
          </div>
          <PrimaryButton>Uložit profil</PrimaryButton>
        </Section>
        <Section title="Upozornění">
          <div className="toggle-list">
            {['Léky', 'Krmení', 'Hárání', 'Veterinář', 'Výcvik', 'Aktivity'].map(item => <label key={item}><input type="checkbox" defaultChecked /> <Bell size={16} /> {item}</label>)}
          </div>
        </Section>
      </div>
      <Section title="Soukromí a bezpečnost">
        <div className="warning"><Lock /> Poloha pro hledání kamarádů by měla být sdílena jen orientačně a pouze po souhlasu uživatele.</div>
        <div className="warning"><UserRound /> Komunitní funkce je připravená jako produktová sekce, před backendem je potřeba řešit blokování a nahlašování profilů.</div>
      </Section>
    </div>
  );
}
