import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { notifications } from '../data/appData';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function NotificationPanel({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className="notification-panel"
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="panel-head">
            <div>
              <span>Centrum upozornění</span>
              <h2>Co Packa hlídá</h2>
            </div>
            <button className="icon-button" onClick={onClose} aria-label="Zavřít upozornění"><X size={18} /></button>
          </div>
          <div className="notification-list">
            {notifications.length === 0 && (
              <div className="empty-state">
                <strong>Zatím žádná upozornění</strong>
                <p>Připomínky se objeví, až si nastavíš léky, očkování, veterináře nebo hárání.</p>
              </div>
            )}
            {notifications.map(item => (
              <article className={`notice-item ${item.tone}`} key={item.id}>
                <strong>{item.category}</strong>
                <p>{item.title}</p>
                <span>{item.time}</span>
              </article>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
