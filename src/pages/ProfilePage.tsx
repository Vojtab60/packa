import { Camera, Edit3, ImagePlus, MapPin, Plus, Phone, Save, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { DataTable, Section, StatCard } from '../components/ui';
import { emptyDogProfile, useSession } from '../session';
import { loadJson, storeJson } from '../storage';

type EditableProfile = typeof emptyDogProfile;
type EditableProfileTextKey = Exclude<keyof EditableProfile, 'contacts'>;
type WeightForm = { date: string; weight: string; note: string };
type VetVisitForm = { date: string; reason: string; result: string };
type GalleryPhoto = { id: string; photoUrl: string; place: string; addedAt: string };
type PreviewPhoto = { photoUrl: string; title: string; detail?: string };
const PROFILE_STORAGE_KEY = 'dog-profile';
const WEIGHT_STORAGE_KEY = 'weight-history';
const VET_STORAGE_KEY = 'vet-visits';
const GALLERY_STORAGE_KEY = 'dog-gallery';
const initialWeightRows: string[][] = [];
const initialVetRows: string[][] = [];

function isEditableProfile(value: unknown): value is EditableProfile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<EditableProfile>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.breed === 'string' &&
    (candidate.photoUrl === undefined || typeof candidate.photoUrl === 'string') &&
    typeof candidate.birthday === 'string' &&
    typeof candidate.age === 'string' &&
    typeof candidate.weight === 'string' &&
    typeof candidate.chip === 'string' &&
    typeof candidate.tattoo === 'string' &&
    typeof candidate.vet === 'string' &&
    Array.isArray(candidate.contacts) &&
    candidate.contacts.every(contact => typeof contact === 'string') &&
    typeof candidate.notes === 'string'
  );
}

function loadStoredProfile(storageKey: string) {
  try {
    const storedProfile = window.localStorage.getItem(storageKey);
    if (!storedProfile) {
      return emptyDogProfile;
    }

    const parsedProfile = JSON.parse(storedProfile);
    if (!isEditableProfile(parsedProfile)) {
      return emptyDogProfile;
    }

    const birthdayInputValue = toDateInputValue(parsedProfile.birthday);
    return {
      ...emptyDogProfile,
      ...parsedProfile,
      age: birthdayInputValue ? calculateAgeFromDate(birthdayInputValue) : parsedProfile.age
    };
  } catch {
    return emptyDogProfile;
  }
}

function storeProfile(storageKey: string, profile: EditableProfile) {
  window.localStorage.setItem(storageKey, JSON.stringify(profile));
}

function isTableRows(value: unknown): value is string[][] {
  return Array.isArray(value) && value.every(row => Array.isArray(row) && row.every(cell => typeof cell === 'string'));
}

function isGalleryPhotos(value: unknown): value is GalleryPhoto[] {
  return Array.isArray(value) && value.every(photo => {
    const candidate = photo as Partial<GalleryPhoto>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.photoUrl === 'string' &&
      typeof candidate.place === 'string' &&
      typeof candidate.addedAt === 'string'
    );
  });
}

function loadStoredRows(key: string, fallback: string[][]) {
  try {
    const storedRows = window.localStorage.getItem(key);
    if (!storedRows) {
      return fallback;
    }

    const parsedRows = JSON.parse(storedRows);
    return isTableRows(parsedRows) ? parsedRows : fallback;
  } catch {
    return fallback;
  }
}

function storeRows(key: string, rows: string[][]) {
  window.localStorage.setItem(key, JSON.stringify(rows));
}

function toDateInputValue(czechDate: string) {
  const parts = czechDate.match(/\d+/g);
  if (!parts || parts.length < 3) {
    return '';
  }
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function formatCzechDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return '';
  }
  return `${day}. ${month}. ${year}`;
}

function toInputDateFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayInput() {
  return toInputDateFromDate(new Date());
}

function pluralizeYears(years: number) {
  if (years === 1) return '1 rok';
  if (years >= 2 && years <= 4) return `${years} roky`;
  return `${years} let`;
}

function pluralizeMonths(months: number) {
  if (months === 1) return '1 měsíc';
  if (months >= 2 && months <= 4) return `${months} měsíce`;
  return `${months} měsíců`;
}

function calculateAgeFromDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return '';
  }

  const birthday = new Date(year, month - 1, day, 12);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  if (birthday > today) {
    return 'datum je v budoucnosti';
  }

  let years = today.getFullYear() - birthday.getFullYear();
  let months = today.getMonth() - birthday.getMonth();

  if (today.getDate() < birthday.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0) {
    return pluralizeMonths(months);
  }

  return `${pluralizeYears(years)} a ${pluralizeMonths(months)}`;
}

function resizeDogPhoto(file: File, maxSize = 900, quality = 0.84) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Fotku se nepodařilo zpracovat.'));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      image.onerror = () => reject(new Error('Soubor nevypadá jako obrázek.'));
      image.src = String(reader.result);
    };

    reader.onerror = () => reject(new Error('Fotku se nepodařilo načíst.'));
    reader.readAsDataURL(file);
  });
}

export function ProfilePage() {
  const { userKey } = useSession();
  const profileStorageKey = userKey(PROFILE_STORAGE_KEY);
  const weightStorageKey = userKey(WEIGHT_STORAGE_KEY);
  const vetStorageKey = userKey(VET_STORAGE_KEY);
  const galleryStorageKey = userKey(GALLERY_STORAGE_KEY);
  const [profile, setProfile] = useState<EditableProfile>(() => loadStoredProfile(profileStorageKey));
  const [draft, setDraft] = useState<EditableProfile>(() => loadStoredProfile(profileStorageKey));
  const [weightRows, setWeightRows] = useState<string[][]>(() => loadStoredRows(weightStorageKey, initialWeightRows));
  const [vetRows, setVetRows] = useState<string[][]>(() => loadStoredRows(vetStorageKey, initialVetRows));
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => loadJson(galleryStorageKey, [], isGalleryPhotos));
  const [editingGalleryPlaceId, setEditingGalleryPlaceId] = useState<string | null>(null);
  const [galleryPlaceDraft, setGalleryPlaceDraft] = useState('');
  const [weightForm, setWeightForm] = useState<WeightForm>({ date: todayInput(), weight: '', note: '' });
  const [vetForm, setVetForm] = useState<VetVisitForm>({ date: todayInput(), reason: '', result: '' });
  const [entryModal, setEntryModal] = useState<'weight' | 'vet' | null>(null);
  const [editingWeightIndex, setEditingWeightIndex] = useState<number | null>(null);
  const [editingVetIndex, setEditingVetIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<PreviewPhoto | null>(null);
  const [toast, setToast] = useState('');
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  function persistGalleryPhotos(nextPhotos: GalleryPhoto[]) {
    if (!storeJson(galleryStorageKey, nextPhotos)) {
      setToast('Galerii se nepodařilo uložit. Zkus smazat pár starších fotek nebo nahrát menší fotku.');
      window.setTimeout(() => setToast(''), 3200);
      return false;
    }

    setGalleryPhotos(nextPhotos);
    return true;
  }

  function startEditing() {
    setDraft(profile);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraft(profile);
    setIsEditing(false);
  }

  function saveProfile() {
    setProfile(draft);
    storeProfile(profileStorageKey, draft);
    setIsEditing(false);
    setToast('Profil pejska byl uložený.');
    window.setTimeout(() => setToast(''), 2200);
  }

  function updateProfile(key: EditableProfileTextKey, value: string) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  async function updateDogPhoto(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setToast('Vyber prosím obrázek.');
      window.setTimeout(() => setToast(''), 2200);
      return;
    }

    try {
      const photoUrl = await resizeDogPhoto(file);
      const nextProfile = { ...profile, photoUrl };
      setProfile(nextProfile);
      setDraft(current => ({ ...current, photoUrl }));
      storeProfile(profileStorageKey, nextProfile);
      setToast('Fotka pejska byla uložená.');
    } catch {
      setToast('Fotku se nepodařilo uložit.');
    } finally {
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
      window.setTimeout(() => setToast(''), 2200);
    }
  }

  async function addGalleryPhoto(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setToast('Vyber prosím obrázek.');
      window.setTimeout(() => setToast(''), 2200);
      return;
    }

    try {
      const photoUrl = await resizeDogPhoto(file, 720, 0.76);
      const nextPhotos = [
        { id: `${Date.now()}-${file.name}`, photoUrl, place: '', addedAt: formatCzechDate(todayInput()) },
        ...galleryPhotos
      ];
      if (persistGalleryPhotos(nextPhotos)) {
        setToast('Fotka byla přidaná do galerie.');
      }
    } catch {
      setToast('Fotku se nepodařilo uložit.');
    } finally {
      if (galleryInputRef.current) {
        galleryInputRef.current.value = '';
      }
      window.setTimeout(() => setToast(''), 2200);
    }
  }

  function deleteGalleryPhoto(id: string) {
    const nextPhotos = galleryPhotos.filter(photo => photo.id !== id);
    if (persistGalleryPhotos(nextPhotos)) {
      setToast('Fotka byla smazaná z galerie.');
      window.setTimeout(() => setToast(''), 2200);
    }
  }

  function startEditingGalleryPlace(photo: GalleryPhoto) {
    setEditingGalleryPlaceId(photo.id);
    setGalleryPlaceDraft(photo.place);
  }

  function saveGalleryPlace(id: string) {
    const currentPhoto = galleryPhotos.find(photo => photo.id === id);
    if (!currentPhoto) {
      return;
    }

    const nextPlace = galleryPlaceDraft.trim();
    if (!nextPlace) {
      setEditingGalleryPlaceId(null);
      setGalleryPlaceDraft('');
      setToast(currentPhoto.place ? 'Místo zůstalo beze změny.' : 'Místo nebylo vyplněné.');
      window.setTimeout(() => setToast(''), 2200);
      return;
    }

    const nextPhotos = galleryPhotos.map(photo => photo.id === id ? { ...photo, place: nextPlace } : photo);
    if (!persistGalleryPhotos(nextPhotos)) {
      return;
    }

    setEditingGalleryPlaceId(null);
    setGalleryPlaceDraft('');
    setToast('Místo bylo uložené k fotce.');
    window.setTimeout(() => setToast(''), 2200);
  }

  function updateBirthday(value: string) {
    setDraft(current => ({
      ...current,
      birthday: formatCzechDate(value),
      age: calculateAgeFromDate(value)
    }));
  }

  function saveWeightEntry() {
    const value = weightForm.weight.trim();
    if (!value) {
      return;
    }

    const weight = value.includes('kg') ? value : `${value.replace('.', ',')} kg`;
    const row = [formatCzechDate(weightForm.date), weight, weightForm.note.trim() || 'bez poznámky'];
    const nextRows = editingWeightIndex === null
      ? [row, ...weightRows]
      : weightRows.map((existingRow, index) => index === editingWeightIndex ? row : existingRow);
    const nextProfile = { ...profile, weight: nextRows[0]?.[1] ?? 'nezadáno' };

    setWeightRows(nextRows);
    storeRows(weightStorageKey, nextRows);
    setProfile(nextProfile);
    setDraft(nextProfile);
    storeProfile(profileStorageKey, nextProfile);
    setWeightForm({ date: todayInput(), weight: '', note: '' });
    setEditingWeightIndex(null);
    setEntryModal(null);
    setToast(editingWeightIndex === null ? 'Nová váha byla přidaná do historie.' : 'Záznam váhy byl upravený.');
    window.setTimeout(() => setToast(''), 2200);
  }

  function openNewWeightEntry() {
    setEditingWeightIndex(null);
    setWeightForm({ date: todayInput(), weight: '', note: '' });
    setEntryModal('weight');
  }

  function editWeightEntry(index: number) {
    const [date, weight, note] = weightRows[index];
    setEditingWeightIndex(index);
    setWeightForm({
      date: toDateInputValue(date),
      weight: weight.replace(/\s?kg/i, ''),
      note
    });
    setEntryModal('weight');
  }

  function deleteWeightEntry(index: number) {
    const nextRows = weightRows.filter((_, rowIndex) => rowIndex !== index);
    const nextWeight = nextRows[0]?.[1] ?? 'nezadáno';
    const nextProfile = { ...profile, weight: nextWeight };

    setWeightRows(nextRows);
    storeRows(weightStorageKey, nextRows);
    setProfile(nextProfile);
    setDraft(nextProfile);
    storeProfile(profileStorageKey, nextProfile);
    setToast('Záznam váhy byl smazaný.');
    window.setTimeout(() => setToast(''), 2200);
  }

  function saveVetVisit() {
    const reason = vetForm.reason.trim();
    if (!reason) {
      return;
    }

    const row = [formatCzechDate(vetForm.date), reason, vetForm.result.trim() || 'čeká se'];
    const nextRows = editingVetIndex === null
      ? [row, ...vetRows]
      : vetRows.map((existingRow, index) => index === editingVetIndex ? row : existingRow);

    setVetRows(nextRows);
    storeRows(vetStorageKey, nextRows);
    setVetForm({ date: todayInput(), reason: '', result: '' });
    setEditingVetIndex(null);
    setEntryModal(null);
    setToast(editingVetIndex === null ? 'Návštěva veterináře byla přidaná do historie.' : 'Návštěva veterináře byla upravená.');
    window.setTimeout(() => setToast(''), 2200);
  }

  function openNewVetVisit() {
    setEditingVetIndex(null);
    setVetForm({ date: todayInput(), reason: '', result: '' });
    setEntryModal('vet');
  }

  function editVetVisit(index: number) {
    const [date, reason, result] = vetRows[index];
    setEditingVetIndex(index);
    setVetForm({
      date: toDateInputValue(date),
      reason,
      result
    });
    setEntryModal('vet');
  }

  function deleteVetVisit(index: number) {
    const nextRows = vetRows.filter((_, rowIndex) => rowIndex !== index);
    setVetRows(nextRows);
    storeRows(vetStorageKey, nextRows);
    setToast('Návštěva veterináře byla smazaná.');
    window.setTimeout(() => setToast(''), 2200);
  }

  function updateContact(index: number, value: string) {
    setDraft(current => ({
      ...current,
      contacts: current.contacts.map((contact, contactIndex) => contactIndex === index ? value : contact)
    }));
  }

  const visibleProfile = isEditing ? draft : profile;
  const hasProfile = Boolean(profile.name.trim());
  const vetShortName = visibleProfile.vet ? visibleProfile.vet.replace('Veterina ', '') : 'nezadáno';
  const todayInputValue = toInputDateFromDate(new Date());
  const latestWeightDate = weightRows[0]?.[0] ?? 'bez záznamu';

  return (
    <div className="page-stack">
      {toast && <div className="toast"><Save size={17} /> {toast}</div>}

      {previewPhoto && (
        <div className="modal-backdrop photo-preview-backdrop" onClick={() => setPreviewPhoto(null)}>
          <section className="photo-preview" aria-label="Náhled fotografie psa" onClick={event => event.stopPropagation()}>
            <button className="icon-button photo-preview-close" onClick={() => setPreviewPhoto(null)} aria-label="Zavřít náhled fotky"><X size={18} /></button>
            <img src={previewPhoto.photoUrl} alt={previewPhoto.title} />
            <div className="photo-preview-caption">
              <strong>{previewPhoto.title}</strong>
              {previewPhoto.detail && <span>{previewPhoto.detail}</span>}
            </div>
          </section>
        </div>
      )}

      {!hasProfile && !isEditing && (
        <Section title="Začni vyplněním profilu" subtitle="Aplikace je pro nového uživatele prázdná. Nejdřív přidej základní údaje o svém pejskovi, potom můžeš zapisovat váhu, veterináře a denní aktivity.">
          <button className="primary-button" onClick={startEditing}><Plus size={17} /> Vyplnit profil pejska</button>
        </Section>
      )}

      {entryModal && (
        <div className="modal-backdrop">
          <section className="action-modal">
            <div className="panel-head">
              <div>
                <span>Nový záznam</span>
                <h2>{entryModal === 'weight' ? editingWeightIndex === null ? 'Zapsat váhu' : 'Upravit váhu' : editingVetIndex === null ? 'Přidat návštěvu veterináře' : 'Upravit návštěvu veterináře'}</h2>
              </div>
              <button className="icon-button" onClick={() => { setEntryModal(null); setEditingWeightIndex(null); setEditingVetIndex(null); }} aria-label="Zavřít formulář"><X size={18} /></button>
            </div>
            {entryModal === 'weight' ? (
              <>
                <div className="form-grid">
                  <label>Datum<input type="date" value={weightForm.date} onChange={event => setWeightForm(current => ({ ...current, date: event.target.value }))} /></label>
                  <label>Váha<input inputMode="decimal" placeholder="např. 18,2" value={weightForm.weight} onChange={event => setWeightForm(current => ({ ...current, weight: event.target.value }))} /></label>
                </div>
                <label className="full-field">Poznámka<textarea value={weightForm.note} onChange={event => setWeightForm(current => ({ ...current, note: event.target.value }))} placeholder="např. po delší pauze, stabilní, kontrola krmiva" /></label>
                <div className="edit-footer">
                  <button className="secondary-button" onClick={() => { setEntryModal(null); setEditingWeightIndex(null); }}>Zrušit</button>
                  <button className="primary-button" onClick={saveWeightEntry}><Save size={17} /> {editingWeightIndex === null ? 'Uložit váhu' : 'Uložit změnu'}</button>
                </div>
              </>
            ) : (
              <>
                <div className="form-grid">
                  <label>Datum<input type="date" value={vetForm.date} onChange={event => setVetForm(current => ({ ...current, date: event.target.value }))} /></label>
                  <label>Důvod<input placeholder="např. očkování, alergie, kontrola" value={vetForm.reason} onChange={event => setVetForm(current => ({ ...current, reason: event.target.value }))} /></label>
                </div>
                <label className="full-field">Výsledek<textarea value={vetForm.result} onChange={event => setVetForm(current => ({ ...current, result: event.target.value }))} placeholder="např. bez reakce, kontrola za měsíc, kapky 5 dní" /></label>
                <div className="edit-footer">
                  <button className="secondary-button" onClick={() => { setEntryModal(null); setEditingVetIndex(null); }}>Zrušit</button>
                  <button className="primary-button" onClick={saveVetVisit}><Save size={17} /> {editingVetIndex === null ? 'Uložit návštěvu' : 'Uložit změnu'}</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      <section className="profile-hero">
        <input
          ref={photoInputRef}
          className="visually-hidden-file"
          type="file"
          accept="image/*"
          onChange={event => void updateDogPhoto(event.target.files?.[0])}
        />
        <div className={`dog-portrait ${visibleProfile.photoUrl ? 'has-photo' : ''}`}>
          <button
            className="dog-portrait-image"
            aria-label={visibleProfile.photoUrl ? 'Zobrazit fotografii psa' : 'Přidat fotografii psa'}
            onClick={() => visibleProfile.photoUrl ? setPreviewPhoto({ photoUrl: visibleProfile.photoUrl, title: visibleProfile.name || 'Fotka psa' }) : photoInputRef.current?.click()}
          >
            {visibleProfile.photoUrl ? (
              <img src={visibleProfile.photoUrl} alt={`Fotka psa ${visibleProfile.name || ''}`} />
            ) : (
              <span><Camera size={30} /> Přidat fotku psa</span>
            )}
          </button>
          <button className="portrait-change-button" onClick={() => photoInputRef.current?.click()}>
            <Camera size={18} /> {visibleProfile.photoUrl ? 'Změnit fotku' : 'Vybrat fotku'}
          </button>
        </div>
        <div className="profile-card">
          <div>
            <h2>{visibleProfile.name || 'Profil pejska zatím není vyplněný'}</h2>
            <p>{visibleProfile.breed || 'Doplň plemeno'} · {visibleProfile.age || 'věk se spočítá z narození'}</p>
          </div>
          {isEditing ? (
            <div className="profile-actions">
              <button className="secondary-button" onClick={cancelEditing}><X size={17} /> Zrušit</button>
              <button className="primary-button" onClick={saveProfile}><Save size={17} /> Uložit</button>
            </div>
          ) : (
            <button className="secondary-button" onClick={startEditing}><Edit3 size={17} /> Upravit</button>
          )}
        </div>
      </section>

      <div className="stats-row">
        <StatCard label="Váha" value={visibleProfile.weight || 'nezadáno'} detail={`poslední zápis ${latestWeightDate}`} tone="green" />
        <StatCard label="Narozeniny" value={visibleProfile.birthday || 'nezadáno'} detail="věk se počítá automaticky" tone="orange" />
        <StatCard label="Veterinář" value={vetShortName} detail="kontakt uložen v profilu" tone="blue" />
      </div>

      {isEditing && (
        <Section title="Úprava profilu" subtitle="Změny se po uložení propíšou do celého profilu.">
          <div className="form-grid profile-edit-grid">
            <label>Jméno psa<input value={draft.name} onChange={event => updateProfile('name', event.target.value)} /></label>
            <label>Plemeno<input value={draft.breed} onChange={event => updateProfile('breed', event.target.value)} /></label>
            <label>Datum narození<input type="date" max={todayInputValue} value={toDateInputValue(draft.birthday)} onChange={event => updateBirthday(event.target.value)} /></label>
            <label>Věk <small>počítá se automaticky</small><input className="readonly-input" value={draft.age} readOnly aria-readonly="true" /></label>
            <label>Váha<input value={draft.weight} onChange={event => updateProfile('weight', event.target.value)} /></label>
            <label>Veterinář<input value={draft.vet} onChange={event => updateProfile('vet', event.target.value)} /></label>
            <label>Číslo čipu<input value={draft.chip} onChange={event => updateProfile('chip', event.target.value)} /></label>
            <label>Tetovací číslo<input value={draft.tattoo} onChange={event => updateProfile('tattoo', event.target.value)} /></label>
            {draft.contacts.map((contact, index) => (
              <label key={index}>Kontakt {index + 1}<input value={contact} onChange={event => updateContact(index, event.target.value)} /></label>
            ))}
          </div>
          <label className="full-field">Poznámky<textarea value={draft.notes} onChange={event => updateProfile('notes', event.target.value)} /></label>
          <div className="edit-footer">
            <button className="secondary-button" onClick={cancelEditing}><X size={17} /> Zrušit změny</button>
            <button className="primary-button" onClick={saveProfile}><Save size={17} /> Uložit profil</button>
          </div>
        </Section>
      )}

      <div className="content-grid two">
        <Section title="Identifikace a kontakty" action={isEditing ? undefined : <button className="secondary-button" onClick={startEditing}><Edit3 size={17} /> Upravit</button>}>
          <div className="detail-grid">
            <div><strong>Číslo čipu</strong><span>{visibleProfile.chip || 'nezadáno'}</span></div>
            <div><strong>Tetovací číslo</strong><span>{visibleProfile.tattoo || 'nezadáno'}</span></div>
            <div><strong>Veterinář</strong><span>{visibleProfile.vet || 'nezadáno'}</span></div>
            {visibleProfile.contacts.filter(Boolean).length === 0 && <div><strong><Phone size={16} /> Kontakt</strong><span>nezadáno</span></div>}
            {visibleProfile.contacts.filter(Boolean).map(contact => <div key={contact}><strong><Phone size={16} /> Kontakt</strong><span>{contact}</span></div>)}
          </div>
        </Section>
        <Section title="Poznámky" subtitle="Vhodné pro hlídání, veterináře nebo cestování.">
          <textarea
            value={visibleProfile.notes}
            disabled={!isEditing}
            onChange={event => updateProfile('notes', event.target.value)}
          />
          {isEditing ? <button className="primary-button" onClick={saveProfile}><Save size={17} /> Uložit poznámku</button> : <button className="secondary-button" onClick={startEditing}><Edit3 size={17} /> Upravit poznámky</button>}
        </Section>
      </div>

      <div className="content-grid two">
        <Section title="Historie vážení" action={<button className="secondary-button" onClick={openNewWeightEntry}><Plus size={17} /> Zapsat váhu</button>}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Datum</th><th>Váha</th><th>Poznámka</th><th>Akce</th></tr>
              </thead>
              <tbody>
                {weightRows.map((row, index) => (
                  <tr key={`${row.join('-')}-${index}`}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>
                      <div className="table-actions">
                        <button className="mini-action" onClick={() => editWeightEntry(index)}><Edit3 size={16} /> Upravit</button>
                        <button className="mini-action danger" onClick={() => deleteWeightEntry(index)}><Trash2 size={16} /> Smazat</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
        <Section title="Návštěvy veterináře" action={<button className="secondary-button" onClick={openNewVetVisit}><Plus size={17} /> Přidat návštěvu</button>}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Datum</th><th>Důvod</th><th>Výsledek</th><th>Akce</th></tr>
              </thead>
              <tbody>
                {vetRows.map((row, index) => (
                  <tr key={`${row.join('-')}-${index}`}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>
                      <div className="table-actions">
                        <button className="mini-action" onClick={() => editVetVisit(index)}><Edit3 size={16} /> Upravit</button>
                        <button className="mini-action danger" onClick={() => deleteVetVisit(index)}><Trash2 size={16} /> Smazat</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      <Section title="Galerie pejska" subtitle="Přidej fotky ze společných míst a výletů. U každé se uloží, kde vznikla.">
        <div className="gallery-add">
          <input
            ref={galleryInputRef}
            className="visually-hidden-file"
            type="file"
            accept="image/*"
            onChange={event => void addGalleryPhoto(event.target.files?.[0])}
          />
          <button className="primary-button" onClick={() => galleryInputRef.current?.click()}><ImagePlus size={17} /> Přidat fotku</button>
        </div>

        {galleryPhotos.length ? (
          <div className="dog-gallery">
            {galleryPhotos.map(photo => (
              <article className="gallery-photo-card" key={photo.id}>
                <button onClick={() => setPreviewPhoto({ photoUrl: photo.photoUrl, title: photo.place || 'Fotka pejska', detail: photo.addedAt })} aria-label={`Zobrazit fotku: ${photo.place || 'bez místa'}`}>
                  <img src={photo.photoUrl} alt={`Fotka psa: ${photo.place || 'bez místa'}`} />
                </button>
                <div>
                  <strong><MapPin size={15} /> {photo.place || 'místo není zadané'}</strong>
                  <span>{photo.addedAt}</span>
                </div>
                {editingGalleryPlaceId === photo.id && (
                  <div className="gallery-place-editor">
                    <input value={galleryPlaceDraft} onChange={event => setGalleryPlaceDraft(event.target.value)} placeholder="např. Attersee, Stromovka, doma" autoFocus />
                    <button className="mini-action" onClick={() => saveGalleryPlace(photo.id)}><Save size={16} /> Uložit</button>
                    <button className="mini-action" onClick={() => { setEditingGalleryPlaceId(null); setGalleryPlaceDraft(''); }}><X size={16} /> Zrušit</button>
                  </div>
                )}
                <div className="gallery-card-actions">
                  <button className="mini-action" onClick={() => startEditingGalleryPlace(photo)}><MapPin size={16} /> {photo.place ? 'Upravit místo' : 'Přidat místo'}</button>
                  <button className="mini-action danger" onClick={() => deleteGalleryPhoto(photo.id)}><Trash2 size={16} /> Smazat</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state"><strong>Galerie je zatím prázdná</strong><p>Nejdřív přidej fotku. Místo můžeš doplnit hned potom přímo pod ní.</p></div>
        )}
      </Section>
    </div>
  );
}
