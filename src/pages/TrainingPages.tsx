import { BookOpen, Dumbbell, Image, PlayCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { trainingCommands } from '../data/appData';
import { Checklist, DashboardCard, EmptyState, Section, StatCard } from '../components/ui';

export function TrainingPage() {
  return (
    <div className="page-stack">
      <div className="dashboard-grid three-cards">
        <DashboardCard item={{ title: 'Povely', subtitle: 'Sedni, ke mně, zůstaň a další', path: '/vycvik/povely', icon: Dumbbell, tone: 'green', metric: '7 povelů' }} />
        <DashboardCard item={{ title: 'Návody', subtitle: 'Socializace, samota, vodítko', path: '/vycvik/navody', icon: BookOpen, tone: 'orange', metric: '4 návody' }} />
        <DashboardCard item={{ title: 'Denní trénink', subtitle: 'Krátké lekce podle věku psa', path: '/aktivity', icon: PlayCircle, tone: 'blue', metric: '8 min' }} />
      </div>
      <Section title="Doporučený plán" subtitle="Krátké lekce jsou účinnější než dlouhé tréninky.">
        <Checklist items={['Ráno 5 minut přivolání doma', 'Odpoledne 3 minuty chůze u nohy', 'Večer klidové lehni na podložce', 'Vždy skončit úspěchem a odpočinkem']} />
      </Section>
    </div>
  );
}

export function TrainingCommandsPage() {
  return (
    <div className="page-stack">
      <div className="command-grid">
        {trainingCommands.map(command => (
          <Link className="command-card" to={`/vycvik/povely/${command.slug}`} key={command.slug}>
            <Dumbbell size={20} />
            <div><h3>{command.name}</h3><p>{command.explanation}</p></div>
            <span>{command.difficulty}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TrainingCommandPage() {
  const { slug } = useParams();
  const command = trainingCommands.find(item => item.slug === slug);

  if (!command) {
    return <EmptyState title="Povel nenalezen" text="Vyber jiný povel ze seznamu výcviku." />;
  }

  return (
    <div className="page-stack">
      <div className="split-hero">
        <div>
          <Dumbbell />
          <h2>{command.name}</h2>
          <p>{command.explanation}</p>
        </div>
        <Link className="secondary-button" to="/vycvik/povely">Všechny povely</Link>
      </div>
      <div className="stats-row">
        <StatCard label="Obtížnost" value={command.difficulty} detail="tempo přizpůsob psovi" />
        <StatCard label="Věk" value={command.age} detail="krátké lekce bez tlaku" tone="orange" />
        <StatCard label="Délka" value={command.duration} detail="lepší často a krátce" tone="blue" />
      </div>
      <div className="content-grid two">
        <Section title="Postup krok za krokem"><Checklist items={command.steps} /></Section>
        <Section title="Pomůcky"><Checklist items={command.tools} /></Section>
      </div>
      <div className="content-grid two">
        <Section title="Časté chyby"><Checklist items={command.mistakes} /></Section>
        <Section title="Tipy"><Checklist items={command.tips} /></Section>
      </div>
      <Section title="Ilustrační média" subtitle="Místo pro fotografie a videa tréninku.">
        <div className="media-row">
          <span><Image /> fotka postoje</span>
          <span><PlayCircle /> krátké video lekce</span>
          <span><BookOpen /> trenérská poznámka</span>
        </div>
      </Section>
    </div>
  );
}

export function TrainingGuidesPage() {
  return (
    <div className="page-stack">
      <Section title="Návody pro každodenní výcvik">
        <div className="guide-grid">
          {['Samota doma bez stresu', 'Chůze na vodítku bez tahání', 'Socializace štěněte ve městě', 'Klid v kavárně a dopravě'].map(title => (
            <article className="guide-card" key={title}>
              <BookOpen size={20} />
              <h3>{title}</h3>
              <p>Praktický postup, doporučená délka lekcí, chyby a signály, kdy zpomalit.</p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
