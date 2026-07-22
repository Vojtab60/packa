import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { BreedGuidePage } from './pages/BreedGuidePage';
import { FriendsPage } from './pages/FriendsPage';
import { HeatPage } from './pages/HeatPage';
import { HealthAllergiesPage, HealthMedicinePage, HealthPage, HealthVaccinationPage } from './pages/HealthPages';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { TrainingCommandPage, TrainingGuidesPage, TrainingPage, TrainingCommandsPage } from './pages/TrainingPages';
import { TravelPage } from './pages/TravelPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { useSession } from './session';

export function App() {
  const { user } = useSession();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="profil" element={<ProfilePage />} />
        <Route path="zdravi" element={<HealthPage />} />
        <Route path="zdravi/ockovani" element={<HealthVaccinationPage />} />
        <Route path="zdravi/leky" element={<HealthMedicinePage />} />
        <Route path="zdravi/alergie" element={<HealthAllergiesPage />} />
        <Route path="aktivity" element={<ActivitiesPage />} />
        <Route path="vycvik" element={<TrainingPage />} />
        <Route path="vycvik/povely" element={<TrainingCommandsPage />} />
        <Route path="vycvik/povely/:slug" element={<TrainingCommandPage />} />
        <Route path="vycvik/navody" element={<TrainingGuidesPage />} />
        <Route path="vyber-plemene" element={<BreedGuidePage />} />
        <Route path="cestovani" element={<TravelPage />} />
        <Route path="kamaradi" element={<FriendsPage />} />
        <Route path="harani" element={<HeatPage />} />
        <Route path="nastaveni" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
