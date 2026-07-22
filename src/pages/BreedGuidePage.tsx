import { useEffect, useMemo, useState } from 'react';
import { Heart, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { breeds } from '../data/breeds';
import { EmptyState, Section } from '../components/ui';

const filters = ['malý', 'střední', 'velký', 'sport', 'děti', 'byt', 'zahrada', 'začátečník', 'alergici'];

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function BreedGuidePage() {
  const [active, setActive] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(breeds[0]);
  const recommended = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return breeds.filter(breed => {
      const matchesFilter = active.length === 0 || active.some(filter => breed.size.includes(filter) || breed.tags.includes(filter));
      const searchable = normalize(`${breed.name} ${breed.size} ${breed.tags.join(' ')} ${breed.temperament} ${breed.suitableFor}`);
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [active, query]);

  useEffect(() => {
    if (recommended.length > 0 && !recommended.some(breed => breed.slug === selected.slug)) {
      setSelected(recommended[0]);
    }
  }, [recommended, selected.slug]);

  function toggle(filter: string) {
    setActive(current => current.includes(filter) ? current.filter(item => item !== filter) : [...current, filter]);
  }

  return (
    <div className="page-stack">
      <Section title="Průvodce výběrem plemene" subtitle={`${breeds.length} plemen s povahou, péčí a doporučením pro koho se hodí.`}>
        <label className="breed-search">
          <Search size={18} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Hledat plemeno, povahu nebo vhodnost..." />
        </label>
        <div className="filter-panel">
          <SlidersHorizontal />
          {filters.map(filter => <button className={active.includes(filter) ? 'active' : ''} onClick={() => toggle(filter)} key={filter}>{filter}</button>)}
        </div>
      </Section>
      <div className="content-grid two">
        <Section title="Doporučená plemena" subtitle={`${recommended.length} výsledků podle vyhledávání a filtrů.`}>
          {recommended.length === 0 ? <EmptyState title="Nic neodpovídá" text="Zkus ubrat některé filtry." /> : (
            <div className="breed-list">
              {recommended.map(breed => (
                <button className={selected.slug === breed.slug ? 'breed-result active' : 'breed-result'} onClick={() => setSelected(breed)} key={breed.slug}>
                  <Search size={18} />
                  <div><strong>{breed.name}</strong><span>{breed.size} · energie {breed.energy}/5 · {breed.tags.join(', ')}</span></div>
                </button>
              ))}
            </div>
          )}
        </Section>
        <Section title={selected.name} subtitle={selected.description}>
          <div className="detail-grid">
            <div><strong>Velikost</strong><span>{selected.size}</span></div>
            <div><strong>Energie</strong><span>{selected.energy}/5</span></div>
            <div><strong><Heart size={17} /> Povaha</strong><span>{selected.temperament}</span></div>
            <div><strong><Sparkles size={17} /> Vhodné pro</strong><span>{selected.suitableFor}</span></div>
            <div><strong>Aktivita</strong><span>{selected.activity}</span></div>
            <div><strong>Srst a péče</strong><span>{selected.care}</span></div>
            <div><strong>Na co dát pozor</strong><span>{selected.watchFor}</span></div>
            <div><strong>Hodí se na</strong><span>{selected.tags.join(', ')}</span></div>
          </div>
        </Section>
      </div>
    </div>
  );
}
