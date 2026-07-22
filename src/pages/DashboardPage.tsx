import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, Clock, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import headerImage from '../../assets/spolu-down.jpg';
import { dashboardCards, notifications, quickActions } from '../data/appData';
import { DashboardCard, Section, StatCard } from '../components/ui';
import { emptyDogProfile, useSession } from '../session';

type StoredProfile = typeof emptyDogProfile;
type StoredActivity = { movementMin: number; outsideMin: number };

function loadProfile(key: string): StoredProfile {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? { ...emptyDogProfile, ...JSON.parse(stored) } : emptyDogProfile;
  } catch {
    return emptyDogProfile;
  }
}

function loadActivities(key: string): StoredActivity[] {
  try {
    const stored = window.localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function DashboardPage() {
  const { userKey } = useSession();
  const profile = loadProfile(userKey('dog-profile'));
  const activities = loadActivities(userKey('activity-history'));
  const latestActivity = activities[0];
  const hasProfile = Boolean(profile.name.trim());
  const weekMovement = activities.slice(0, 7).reduce((sum, entry) => sum + (entry.movementMin || 0), 0);

  return (
    <div className="dashboard">
      <section className="welcome-hero">
        <img src={headerImage} alt="" />
        <div>
          <span>{hasProfile ? `Packa pečuje s tebou o ${profile.name}` : 'Vítej v Pacce'}</span>
          <h2>{hasProfile ? 'Všechno důležité o pejskovi na jednom místě.' : 'Osobní péče o psa od prvního dne.'}</h2>
          <p>
            {hasProfile
              ? 'Packa hlídá zdraví, aktivity, připomínky, výcvik i důležité údaje, aby ses mohl rozhodovat s větším klidem každý den.'
              : 'Packa pomáhá majitelům vést profil psa, zdraví, očkování, léky, hárání, denní režim i výcvik. Začni vyplněním profilu a aplikace se přizpůsobí tvému pejskovi.'}
          </p>
        </div>
      </section>

      <div className="stats-row">
        <StatCard label="Profil psa" value={hasProfile ? profile.name : 'nezadáno'} detail={hasProfile ? profile.breed || 'plemeno není doplněné' : 'klikni na Profil a vyplň údaje'} tone="green" />
        <StatCard label="Pohyb dnes" value={latestActivity ? `${latestActivity.movementMin} min` : 'nezadáno'} detail={latestActivity ? 'podle posledního záznamu v aktivitách' : 'zapiš první denní aktivitu'} tone="orange" />
        <StatCard label="Týdenní pohyb" value={activities.length ? `${weekMovement} min` : 'nezadáno'} detail={activities.length ? 'součet posledních 7 záznamů' : 'graf se objeví po záznamech'} tone="blue" />
      </div>

      {!hasProfile && (
        <Section title="Jak začít" subtitle="Tahle instalace nemá žádná předvyplněná data. Každý uživatel si vyplní vlastního psa.">
          <div className="onboarding-steps">
            <Link to="/profil"><CheckCircle2 size={18} /> Vyplnit profil pejska</Link>
            <Link to="/profil"><CheckCircle2 size={18} /> Zapsat první váhu a veterináře</Link>
            <Link to="/aktivity"><CheckCircle2 size={18} /> Přidat první denní aktivitu</Link>
          </div>
        </Section>
      )}

      <div className="dashboard-grid">
        {dashboardCards.map((item, index) => (
          <motion.div key={item.path} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }}>
            <DashboardCard item={item} />
          </motion.div>
        ))}
      </div>

      <div className="content-grid two">
        <Section title="Nejbližší připomínky" subtitle="Upozornění se objeví, až si nastavíš léky, očkování nebo hárání.">
          <div className="stack">
            {notifications.length === 0 && <div className="empty-state"><strong>Zatím žádná upozornění</strong><p>Po nastavení zdraví a režimu se tu budou zobrazovat připomínky.</p></div>}
            {notifications.slice(0, 4).map(item => (
              <Link to={item.category === 'Hárání' ? '/harani' : item.category === 'Léky' ? '/zdravi/leky' : '/zdravi'} className={`reminder ${item.tone}`} key={item.id}>
                <Clock size={18} />
                <div><strong>{item.title}</strong><span>{item.time}</span></div>
              </Link>
            ))}
          </div>
        </Section>
        <Section title="Poslední aktivita" subtitle="Souhrn se počítá z denního deníku.">
          <div className="empty-state"><strong>{activities.length ? `${activities.length} uložených dní` : 'Deník je prázdný'}</strong><p>{activities.length ? 'Podrobnosti najdeš v aktivitách.' : 'Zapiš první aktivitu a přehled se začne plnit.'}</p></div>
          <div className="activity-summary">
            <span><CalendarDays size={18} /> {activities.length ? `${weekMovement} min tento týden` : 'čeká na první záznam'}</span>
            <span><HeartPulse size={18} /> {hasProfile ? 'péče se váže k přihlášenému uživateli' : 'nejdřív vyplň profil psa'}</span>
          </div>
        </Section>
      </div>

      <Section title="Rychlé akce" subtitle="Krátké úkony, které majitel řeší každý den.">
        <div className="quick-actions">
          {quickActions.map(action => <Link to={action.path} key={action.title}><action.icon size={18} />{action.title}</Link>)}
        </div>
      </Section>
    </div>
  );
}
