import { LogIn, PawPrint } from 'lucide-react';
import { useState } from 'react';
import logoImage from '../../assets/packa-logo.png';
import headerImage from '../../assets/spolu-down.jpg';
import { useSession } from '../session';

export function LoginPage() {
  const { login } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (!email.includes('@')) {
      setError('Zadej e-mail, podle kterého se data uloží k tvému účtu.');
      return;
    }
    login({ name, email });
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <img src={headerImage} alt="" />
        <div className="login-content">
          <img className="brand-logo login-logo" src={logoImage} alt="Packa" />
          <h1>Packa</h1>
          <p>Začni s prázdnou aplikací. Po přihlášení si vyplníš vlastního psa a Packa si data zapamatuje podle tvého e-mailu.</p>
          <div className="form-grid login-form">
            <label>Jméno majitele<input value={name} onChange={event => setName(event.target.value)} placeholder="např. Vojtěch" /></label>
            <label>E-mail<input value={email} onChange={event => setEmail(event.target.value)} placeholder="např. vojtech@email.cz" /></label>
          </div>
          {error && <div className="warning strong"><PawPrint size={18} /> {error}</div>}
          <button className="primary-button" onClick={submit}><LogIn size={18} /> Pokračovat do aplikace</button>
          <div className="onboarding-steps">
            <span>1. Přihlas se e-mailem</span>
            <span>2. Vyplň profil pejska</span>
            <span>3. Začni zapisovat váhu, veterináře a denní aktivity</span>
          </div>
        </div>
      </section>
    </main>
  );
}
