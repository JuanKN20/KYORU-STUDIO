import { useState } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';

import { disciplines, positioning, servicePath } from '../data/disciplines';
import { entryKeyFor, lastCommittedEntry, readEntry, rememberEntry } from '../services/navigationMemory';

export default function HomeCapabilities() {
  const location = useLocation();
  const key = entryKeyFor(location);
  const navigation = useNavigationType();
  const previous = lastCommittedEntry();
  const saved = navigation === 'POP' ? readEntry(key)?.discipline
    : navigation === 'REPLACE' && previous?.pathname === location.pathname ? readEntry(previous.key)?.discipline
    : undefined;
  return <CapabilitiesAccordion key={key} entryKey={key} initialActive={saved === undefined ? 'digital' : saved} />;
}

function CapabilitiesAccordion({ entryKey, initialActive }: { entryKey: string; initialActive: string | null }) {
  const [active, setActive] = useState(initialActive);
  const selected = disciplines.find((item) => item.id === active);

  const toggle = (id: string) => {
    const next = active === id ? null : id;
    rememberEntry(entryKey, { discipline: next });
    setActive(next);
  };

  return (
    <section id="home-capabilities" className="kyoru-capabilities kyoru-capabilities--editorial" aria-labelledby="capabilities-title">
      <div className="kyoru-capabilities__inner">
        <header className="kyoru-capabilities__heading">
          <div className="kyoru-section-index"><span>CAPABILITIES</span></div>
          <div><h2 id="capabilities-title">WHAT WE CREATE.</h2><p className="kyoru-disciplines__intro">Six disciplines. One creative vision.</p></div>
        </header>
        <div className="kyoru-disciplines">
          <div className="kyoru-disciplines__list">
            {disciplines.map((item) => {
              const open = active === item.id;
              return (
                <div className="kyoru-discipline" key={item.id}>
                  <h3><button type="button" id={`discipline-${item.id}`} aria-expanded={open} aria-controls={`discipline-panel-${item.id}`} onClick={() => toggle(item.id)}>
                    <span>{item.home.title}</span><Plus aria-hidden="true" className={open ? 'is-open' : ''} />
                  </button></h3>
                  <div id={`discipline-panel-${item.id}`} role="region" aria-labelledby={`discipline-${item.id}`} aria-hidden={!open} className={`kyoru-discipline__panel${open ? ' is-open' : ''}`}>
                    <div><div className="kyoru-discipline__body"><p>{item.home.description}</p><ul>{item.home.areas.map((area) => <li key={area}>{area}</li>)}</ul><Link id={`capability-explore-${item.id}`} data-history-origin to={servicePath(item.slug)} tabIndex={open ? 0 : -1}>{item.home.explore} <ArrowUpRight aria-hidden="true" size={16} /></Link></div></div>
                  </div>
                </div>
              );
            })}
          </div>
          <aside className="kyoru-disciplines__preview" aria-label="Creative practice">
            <div key={active ?? 'closed'} className="kyoru-disciplines__preview-copy"><p className="kyoru-disciplines__label">{selected?.home.title ?? 'ART × TECHNOLOGY × STORY'}</p><p className="kyoru-disciplines__statement">{selected ? selected.home.headline : 'More than one medium.'}</p><p>{selected ? selected.home.panel : 'Choose a discipline to explore the practice behind it.'}</p>{selected && <p className="kyoru-disciplines__label">{positioning[selected.position].en}</p>}</div>
            <div className="kyoru-disciplines__technology"><h3>Creative Technology / Applied AI</h3><p>We explore creative technology and applied AI to support design, development, prototyping and production, guided by human creative direction.</p></div>
          </aside>
        </div>
        <p className="kyoru-disciplines__footer">Looking for support on a project? <Link id="capability-explore-all" data-history-origin to="/services">Explore our current services <ArrowUpRight aria-hidden="true" size={16} /></Link></p>
      </div>
    </section>
  );
}
