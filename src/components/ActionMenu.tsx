import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Download, Plus, Save, X } from 'lucide-react';
import { createContext, type ReactNode, useContext, useState } from 'react';

type ActionKind = 'add' | 'save' | 'edit' | 'export' | 'schedule' | 'photo' | 'generic';

type ActionConfig = {
  title: string;
  description?: string;
  kind?: ActionKind;
  confirmLabel?: string;
};

type ActionContextValue = {
  openAction: (config: ActionConfig) => void;
};

const ActionContext = createContext<ActionContextValue | null>(null);

function getIcon(kind: ActionKind) {
  if (kind === 'add') return Plus;
  if (kind === 'save') return Save;
  if (kind === 'export') return Download;
  if (kind === 'schedule') return CalendarDays;
  return Save;
}

function getFields(kind: ActionKind) {
  if (kind === 'add') {
    return ['Název záznamu', 'Datum', 'Poznámka'];
  }
  if (kind === 'schedule') {
    return ['Datum setkání', 'Čas', 'Místo procházky'];
  }
  if (kind === 'export') {
    return ['Formát exportu', 'Rozsah dat'];
  }
  if (kind === 'photo') {
    return ['Název fotografie', 'Poznámka'];
  }
  return ['Poznámka ke změně'];
}

export function ActionProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<ActionConfig | null>(null);
  const [toast, setToast] = useState('');

  function closeAction() {
    setAction(null);
  }

  function confirmAction() {
    const title = action?.title ?? 'Akce';
    setAction(null);
    setToast(`${title} potvrzeno.`);
    window.setTimeout(() => setToast(''), 2200);
  }

  return (
    <ActionContext.Provider value={{ openAction: setAction }}>
      {children}
      <AnimatePresence>
        {action && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.section className="action-modal" initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 14, scale: 0.98 }}>
              <div className="panel-head">
                <div>
                  <span>{action.kind === 'add' ? 'Nový záznam' : 'Akce'}</span>
                  <h2>{action.title}</h2>
                </div>
                <button className="icon-button" onClick={closeAction} aria-label="Zavřít akci"><X size={18} /></button>
              </div>
              {action.description && <p className="modal-copy">{action.description}</p>}
              <div className="form-grid">
                {getFields(action.kind ?? 'generic').map((field, index) => (
                  <label key={field}>
                    {field}
                    {field.includes('Datum') ? <input type="date" /> : field.includes('Čas') ? <input type="time" /> : <input placeholder={index === 0 ? action.title : field} />}
                  </label>
                ))}
              </div>
              <div className="edit-footer">
                <button className="secondary-button" onClick={closeAction}>Zrušit</button>
                <button className="primary-button" onClick={confirmAction}>
                  {(() => {
                    const Icon = getIcon(action.kind ?? 'generic');
                    return <Icon size={17} />;
                  })()}
                  {action.confirmLabel ?? 'Potvrdit'}
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      {toast && <div className="toast"><Save size={17} /> {toast}</div>}
    </ActionContext.Provider>
  );
}

export function useActionMenu() {
  const context = useContext(ActionContext);
  if (!context) {
    return {
      openAction: () => undefined
    };
  }
  return context;
}
