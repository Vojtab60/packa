import { Bell, Lock, Save, UserRound } from 'lucide-react';
import { Section } from '../components/ui';
import { useSession } from '../session';
import { loadJson, storeJson } from '../storage';
import { useState } from 'react';

const SETTINGS_PROFILE_KEY = 'settings-profile';
const SETTINGS_NOTIFICATIONS_KEY = 'settings-notifications';
const notificationNames = ['Léky', 'Krmení', 'Hárání', 'Veterinář', 'Výcvik', 'Aktivity'];

type SettingsProfile = {
  name: string;
  email: string;
  city: string;
};

function isSettingsProfile(value: unknown): value is SettingsProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<SettingsProfile>;
  return typeof profile.name === 'string' && typeof profile.email === 'string' && typeof profile.city === 'string';
}

function isNotificationMap(value: unknown): value is Record<string, boolean> {
  return Boolean(value) && typeof value === 'object' && Object.values(value).every(item => typeof item === 'boolean');
}

export function SettingsPage() {
  const { user, userKey } = useSession();
  const profileStorageKey = userKey(SETTINGS_PROFILE_KEY);
  const notificationsStorageKey = userKey(SETTINGS_NOTIFICATIONS_KEY);
  const [profile, setProfile] = useState<SettingsProfile>(() => loadJson(profileStorageKey, {
    name: user?.name ?? '',
    email: user?.email ?? '',
    city: ''
  }, isSettingsProfile));
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() => loadJson(
    notificationsStorageKey,
    Object.fromEntries(notificationNames.map(name => [name, true])),
    isNotificationMap
  ));
  const [toast, setToast] = useState('');

  function saveSettings() {
    storeJson(profileStorageKey, profile);
    storeJson(notificationsStorageKey, notifications);
    setToast('Nastavení bylo uložené.');
    window.setTimeout(() => setToast(''), 2200);
  }

  return (
    <div className="page-stack">
      {toast && <div className="toast"><Save size={17} /> {toast}</div>}
      <div className="content-grid two">
        <Section title="Profil uživatele">
          <div className="form-grid">
            <label>Jméno majitele<input value={profile.name} onChange={event => setProfile(current => ({ ...current, name: event.target.value }))} /></label>
            <label>E-mail<input value={profile.email} onChange={event => setProfile(current => ({ ...current, email: event.target.value }))} /></label>
            <label>Město<input value={profile.city} onChange={event => setProfile(current => ({ ...current, city: event.target.value }))} /></label>
          </div>
          <button className="primary-button" onClick={saveSettings}><Save size={17} /> Uložit profil</button>
        </Section>
        <Section title="Upozornění">
          <div className="toggle-list">
            {notificationNames.map(item => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={notifications[item] ?? true}
                  onChange={event => setNotifications(current => ({ ...current, [item]: event.target.checked }))}
                />
                <Bell size={16} /> {item}
              </label>
            ))}
          </div>
          <button className="primary-button" onClick={saveSettings}><Save size={17} /> Uložit upozornění</button>
        </Section>
      </div>
      <Section title="Soukromí a bezpečnost">
        <div className="warning"><Lock /> Poloha pro hledání kamarádů by měla být sdílena jen orientačně a pouze po souhlasu uživatele.</div>
        <div className="warning"><UserRound /> Komunitní funkce je připravená jako produktová sekce, před backendem je potřeba řešit blokování a nahlašování profilů.</div>
      </Section>
    </div>
  );
}
