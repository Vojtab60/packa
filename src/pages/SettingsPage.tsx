import { Bell, Download, Lock, Save, Upload, UserRound } from 'lucide-react';
import { Section } from '../components/ui';
import { USER_DATA_KEYS, useSession } from '../session';
import { loadJson, storeJson } from '../storage';
import { useRef, useState } from 'react';

const SETTINGS_PROFILE_KEY = 'settings-profile';
const SETTINGS_NOTIFICATIONS_KEY = 'settings-notifications';
const notificationNames = ['Léky', 'Krmení', 'Hárání', 'Veterinář', 'Výcvik', 'Aktivity'];

type SettingsProfile = {
  name: string;
  email: string;
  city: string;
};

type BackupFile = {
  app: 'packa';
  version: number;
  email: string;
  exportedAt: string;
  data: Record<string, unknown>;
};

function isSettingsProfile(value: unknown): value is SettingsProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<SettingsProfile>;
  return typeof profile.name === 'string' && typeof profile.email === 'string' && typeof profile.city === 'string';
}

function isNotificationMap(value: unknown): value is Record<string, boolean> {
  return Boolean(value) && typeof value === 'object' && Object.values(value).every(item => typeof item === 'boolean');
}

function isBackupFile(value: unknown): value is BackupFile {
  if (!value || typeof value !== 'object') return false;
  const backup = value as Partial<BackupFile>;
  return backup.app === 'packa' && typeof backup.email === 'string' && Boolean(backup.data) && typeof backup.data === 'object';
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
  const importInputRef = useRef<HTMLInputElement | null>(null);

  function saveSettings() {
    storeJson(profileStorageKey, profile);
    storeJson(notificationsStorageKey, notifications);
    setToast('Nastavení bylo uložené.');
    window.setTimeout(() => setToast(''), 2200);
  }

  function exportUserData() {
    const data = USER_DATA_KEYS.reduce<Record<string, unknown>>((result, key) => {
      const stored = window.localStorage.getItem(userKey(key));
      if (stored) {
        try {
          result[key] = JSON.parse(stored);
        } catch {
          result[key] = stored;
        }
      }
      return result;
    }, {});

    const backup: BackupFile = {
      app: 'packa',
      version: 1,
      email: user?.email ?? '',
      exportedAt: new Date().toISOString(),
      data
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `packa-zaloha-${user?.email ?? 'data'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setToast('Záloha dat byla stažená.');
    window.setTimeout(() => setToast(''), 2200);
  }

  async function importUserData(file: File | undefined) {
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      if (!isBackupFile(parsed)) {
        setToast('Soubor nevypadá jako záloha Packa.');
        window.setTimeout(() => setToast(''), 2600);
        return;
      }

      for (const key of USER_DATA_KEYS) {
        if (Object.prototype.hasOwnProperty.call(parsed.data, key)) {
          storeJson(userKey(key), parsed.data[key]);
        }
      }

      setToast('Data byla importovaná. Obnov stránku, aby se všude načetla.');
    } catch {
      setToast('Zálohu se nepodařilo načíst.');
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = '';
      }
      window.setTimeout(() => setToast(''), 3600);
    }
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
      <Section title="Přenos dat" subtitle="Data jsou uložená v prohlížeči podle adresy webu. Tady je můžeš přenést mezi localhostem a GitHub verzí.">
        <input
          ref={importInputRef}
          className="visually-hidden-file"
          type="file"
          accept="application/json"
          onChange={event => void importUserData(event.target.files?.[0])}
        />
        <div className="transfer-actions">
          <button className="secondary-button" onClick={exportUserData}><Download size={17} /> Stáhnout zálohu</button>
          <button className="primary-button" onClick={() => importInputRef.current?.click()}><Upload size={17} /> Nahrát zálohu</button>
        </div>
      </Section>
    </div>
  );
}
