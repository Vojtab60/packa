import {
  Activity,
  Bell,
  Bone,
  CalendarHeart,
  Dumbbell,
  HeartPulse,
  Home,
  PawPrint,
  Pill,
  Plane,
  Search,
  Settings,
  ShieldCheck,
  Syringe,
  UserRound,
  Users,
  Wand2
} from 'lucide-react';
import type { CardLink, DogProfile, NavItem, Notification, TrainingCommand } from '../types';

export const navItems: NavItem[] = [
  { label: 'Přehled', path: '/', icon: Home },
  { label: 'Profil', path: '/profil', icon: UserRound },
  { label: 'Zdraví', path: '/zdravi', icon: HeartPulse },
  { label: 'Aktivity', path: '/aktivity', icon: Activity },
  { label: 'Výcvik', path: '/vycvik', icon: Wand2 },
  { label: 'Plemena', path: '/vyber-plemene', icon: Search },
  { label: 'Cestování', path: '/cestovani', icon: Plane },
  { label: 'Kamarádi', path: '/kamaradi', icon: Users },
  { label: 'Hárání', path: '/harani', icon: CalendarHeart },
  { label: 'Nastavení', path: '/nastaveni', icon: Settings }
];

export const dogProfile: DogProfile = {
  name: '',
  breed: '',
  photoUrl: '',
  birthday: '',
  age: '',
  weight: '',
  chip: '',
  tattoo: '',
  vet: '',
  contacts: ['', ''],
  notes: ''
};

export const dashboardCards: CardLink[] = [
  { title: 'Profil psa', subtitle: 'Jméno, plemeno, čip, veterinář', path: '/profil', icon: PawPrint, tone: 'green', metric: 'vyplnit' },
  { title: 'Denní deník', subtitle: 'Pohyb, krmení, voda, spánek', path: '/aktivity', icon: Activity, tone: 'orange', metric: 'začít' },
  { title: 'Zdraví', subtitle: 'Očkování, léky, alergie', path: '/zdravi', icon: HeartPulse, tone: 'red', metric: 'nastavit' },
  { title: 'Hárání', subtitle: 'Kalendář cyklu a rizikové dny', path: '/harani', icon: CalendarHeart, tone: 'blue', metric: 'volitelné' },
  { title: 'Výcvik', subtitle: 'Povely a návody krok za krokem', path: '/vycvik', icon: Wand2, tone: 'cream', metric: 'návody' }
];

export const notifications: Notification[] = [];

export const healthLinks: CardLink[] = [
  { title: 'Očkování', subtitle: 'Historie, další termín, typ vakcíny', path: '/zdravi/ockovani', icon: Syringe, tone: 'green' },
  { title: 'Léky', subtitle: 'Dávkování, historie a upozornění', path: '/zdravi/leky', icon: Pill, tone: 'orange' },
  { title: 'Alergie', subtitle: 'Spouštěče, doporučení, veterinární poznámky', path: '/zdravi/alergie', icon: ShieldCheck, tone: 'red' }
];

export const vaccineHistory: string[][] = [];

export const medicines: string[][] = [];

export const allergies: string[][] = [];

export const activityBars = [62, 88, 54, 76, 91, 68, 82];

export const trainingCommands: TrainingCommand[] = [
  {
    slug: 'ke-mne',
    name: 'Ke mně',
    difficulty: 'základní',
    age: 'od 8 týdnů',
    tools: ['měkké pamlsky', 'dlouhé vodítko', 'klidné místo'],
    duration: '5-8 minut',
    explanation: 'Povel pro bezpečné přivolání. Pes má pochopit, že návrat k člověku je vždy výhodný a radostný.',
    steps: ['Začni doma na krátkou vzdálenost.', 'Řekni jméno psa a jednou povel.', 'Odměň hned u nohou, ne za metr před tebou.', 'Postupně přidávej rušnější prostředí.', 'Nikdy nepoužívej povel pro nepříjemné ukončení hry.'],
    mistakes: ['opakování povelu desetkrát', 'trest po příchodu', 'příliš rychlý přechod do rušného parku'],
    tips: ['Měň odměny, ať je návrat překvapivě dobrý.', 'Trénuj krátce a často.']
  },
  {
    slug: 'sedni',
    name: 'Sedni',
    difficulty: 'základní',
    age: 'od 8 týdnů',
    tools: ['pamlsek', 'klidná místnost'],
    duration: '3-5 minut',
    explanation: 'Jednoduchý povel pro zklidnění a čekání před miskou, dveřmi nebo přechodem.',
    steps: ['Veď pamlsek od nosu mírně nahoru a dozadu.', 'Jakmile pes dosedne, označ chování pochvalou.', 'Přidej slovní povel až ve chvíli, kdy pohyb chápe.', 'Odměň v sedu, ne po vyskočení.'],
    mistakes: ['tlačení na záda', 'pozdní odměna', 'moc dlouhé lekce'],
    tips: ['Používej před běžnými radostmi, třeba před miskou.']
  },
  {
    slug: 'lehni',
    name: 'Lehni',
    difficulty: 'základní',
    age: 'od 10 týdnů',
    tools: ['pamlsek', 'podložka'],
    duration: '4-6 minut',
    explanation: 'Užitečný povel pro klid, čekání v kavárně nebo cestování.',
    steps: ['Ze sedu veď pamlsek dolů mezi tlapky.', 'Odměň při položení loktů.', 'Zkracuj gesto rukou.', 'Přidej delší výdrž až po pochopení polohy.'],
    mistakes: ['příliš tvrdý povrch', 'tahání tlapek', 'spěch na výdrž'],
    tips: ['Na začátku pomůže měkká podložka.']
  },
  {
    slug: 'zustan',
    name: 'Zůstaň',
    difficulty: 'střední',
    age: 'od 4 měsíců',
    tools: ['pamlsky', 'uvolňovací povel'],
    duration: '5 minut',
    explanation: 'Pes se učí, že má držet pozici, dokud nedostane jasné uvolnění.',
    steps: ['Začni jednou sekundou.', 'Odměň ještě před pohybem psa.', 'Přidej krok zpět.', 'Střídej délku i vzdálenost.', 'Vždy ukonči uvolňovacím povelem.'],
    mistakes: ['příliš dlouhé čekání', 'volání psa z povelu zůstaň', 'chybějící uvolnění'],
    tips: ['Navyšuj jen jednu věc najednou: čas, vzdálenost nebo rušení.']
  },
  {
    slug: 'nesmis',
    name: 'Nesmíš',
    difficulty: 'bezpečnostní',
    age: 'od 10 týdnů',
    tools: ['pamlsky', 'hračka', 'klidný hlas'],
    duration: '3-5 minut',
    explanation: 'Povel pomáhá přerušit rizikové chování a nabídnout psovi správnou alternativu.',
    steps: ['Polož pamlsek do zavřené dlaně.', 'Počkej, až pes přestane dobývat ruku.', 'Označ klid a odměň jiným pamlskem.', 'Přenes na předměty na zemi.', 'Vždy ukaž, co má pes udělat místo toho.'],
    mistakes: ['křik', 'honění psa s předmětem', 'žádná alternativa'],
    tips: ['Cílem je sebekontrola, ne strach z člověka.']
  },
  {
    slug: 'k-noze',
    name: 'K noze',
    difficulty: 'střední',
    age: 'od 5 měsíců',
    tools: ['pamlsky', 'krátké vodítko'],
    duration: '5-7 minut',
    explanation: 'Krátký soustředěný pohyb u nohy pro bezpečný průchod rušným místem.',
    steps: ['Odměň pozici u levé nebo pravé nohy.', 'Udělej jeden krok a odměň.', 'Přidej dva až tři kroky.', 'Trénuj krátké úseky, ne celou procházku.'],
    mistakes: ['tahání psa k noze', 'dlouhé úseky pro štěně', 'málo častá odměna'],
    tips: ['Používej jako krátký režim, potom psa zase pusť čichat.']
  },
  {
    slug: 'aport',
    name: 'Aport',
    difficulty: 'hravý',
    age: 'od 4 měsíců',
    tools: ['měkká hračka', 'druhá hračka', 'pamlsky'],
    duration: '5 minut',
    explanation: 'Aport učí spolupráci, návrat k člověku a pouštění předmětu bez přetahování.',
    steps: ['Začni krátkým hodem v místnosti.', 'Radostně pochval návrat.', 'Vyměň hračku za pamlsek nebo druhou hračku.', 'Ukonči dřív, než pes ztratí zájem.'],
    mistakes: ['honění psa', 'brání hračky násilím', 'příliš mnoho hodů'],
    tips: ['U sportovních psů hlídej počet hodů kvůli kloubům.']
  }
];

export const travelChecklist = ['Očkování proti vzteklině', 'Čip a registrace', 'Pas zvířete', 'Kontakt na veterináře', 'Léky a dávkování', 'Voda a cestovní miska', 'Krmivo na celou cestu', 'Náhubek', 'Vodítko a postroj', 'Přepravka nebo pás do auta'];

export const friends = [
  ['Luna', 'Australský ovčák', '2 roky', 'hravá, rychlá, miluje agility', 'Praha 7'],
  ['Max', 'Labrador', '5 let', 'klidný, vhodný pro štěňata', 'Stromovka'],
  ['Ruby', 'Pudl', '3 roky', 'jemná, kontaktní, menší psi', 'Letná'],
  ['Argo', 'Německý ovčák', '4 roky', 'sportovní, potřebuje prostor', 'Troja']
];

export const quickActions = [
  { title: 'Přidat lék', path: '/zdravi/leky', icon: Pill },
  { title: 'Zapsat váhu', path: '/profil', icon: Bone },
  { title: 'Nové hárání', path: '/harani', icon: CalendarHeart },
  { title: 'Trénink', path: '/vycvik/povely', icon: Dumbbell },
  { title: 'Připomínka', path: '/nastaveni', icon: Bell }
];
