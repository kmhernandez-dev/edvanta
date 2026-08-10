/**
 * ============================================================
 *  FstAppPortal.jsx — Portal de la app Feliz Sin Tiroides
 *
 *  Autenticación real con Supabase. Sin demo, sin ficticios.
 *  Usuarios autenticados → /mi-espacio (dashboard real).
 * ============================================================
 */

import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { FstAppProvider, useFstApp } from '../context/FstAppContext';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../components/fstApp/AuthScreen';
import FstAppShell from '../components/fstApp/FstAppShell';
import { updatePageSeo } from '../utils/seo';
import {
  FstDashboard, FstOnboarding, FstProfile, FstProgress,
} from '../components/fstApp/FstAppSections';
import {
  NutriFstChat, LevoSection, FoodCheckSection, PlateScanner, MenusSection,
  CookSection, ShoppingListSection, SupplementsSection, SymptomsSection,
  YodoSection, ConsultaSection,
} from '../components/fstApp/FstAppTools';
import {
  LabsSection, AppointmentsSection, TimelineSection, HabitsSection,
  QuestionsSection, PrivacySection,
} from '../components/fstApp/FstAppModules';

function LoadingScreen() {
  return (
    <div className="fst-app flex min-h-screen items-center justify-center bg-[#FFF9F4]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#EAE2F8] border-t-[#9274C9]" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Cargando tu espacio...</p>
      </div>
    </div>
  );
}

function PortalContent() {
  const { user, loading: authLoading, profile } = useAuth();
  const { data, loading } = useFstApp();
  const location = useLocation();

  if (authLoading) return <LoadingScreen />;
  if (!user) return <AuthScreen />;
  if (loading) return <LoadingScreen />;

  const onboardingCompleted = profile?.onboarding_completed || data.profile?.onboarding_completed;

  if (!onboardingCompleted) {
    return <FstOnboarding />;
  }

  let content = <FstDashboard />;
  const path = location.pathname;
  if (path.startsWith('/fst-app/nutrifst')) content = <NutriFstChat />;
  if (path.startsWith('/fst-app/levotiroxina')) content = <LevoSection />;
  if (path.startsWith('/fst-app/alimento')) content = <FoodCheckSection />;
  if (path.startsWith('/fst-app/escaneo')) content = <PlateScanner />;
  if (path.startsWith('/fst-app/menus')) content = <MenusSection />;
  if (path.startsWith('/fst-app/cocina')) content = <CookSection />;
  if (path.startsWith('/fst-app/lista')) content = <ShoppingListSection />;
  if (path.startsWith('/fst-app/suplementos')) content = <SupplementsSection />;
  if (path.startsWith('/fst-app/sintomas')) content = <SymptomsSection />;
  if (path.startsWith('/fst-app/yodo')) content = <YodoSection />;
  if (path.startsWith('/fst-app/consulta')) content = <ConsultaSection />;
  if (path.startsWith('/fst-app/progreso')) content = <FstProgress />;
  if (path.startsWith('/fst-app/perfil')) content = <FstProfile />;
  if (path.startsWith('/fst-app/laboratorios')) content = <LabsSection />;
  if (path.startsWith('/fst-app/citas')) content = <AppointmentsSection />;
  if (path.startsWith('/fst-app/historia')) content = <TimelineSection />;
  if (path.startsWith('/fst-app/habitos')) content = <HabitsSection />;
  if (path.startsWith('/fst-app/preguntas')) content = <QuestionsSection />;
  if (path.startsWith('/fst-app/privacidad')) content = <PrivacySection />;

  return <FstAppShell>{content}</FstAppShell>;
}

export default function FstAppPortal() {
  useEffect(() => updatePageSeo({
    title: 'Feliz Sin Tiroides | Tu espacio de acompañamiento',
    description: 'Aplicación HealthTech para personas con tiroidectomía, hipotiroidismo, Hashimoto, Graves o tratamiento con levotiroxina: NutriFST IA, registro de medicamentos, menús, síntomas y preparación de consultas.',
    canonical: 'https://edvanta.co/fst-app',
    image: 'https://edvanta.co/img/feliz-sin-tiroides-hero-v2.webp',
    jsonLdId: 'fst-app',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Feliz Sin Tiroides',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url: 'https://edvanta.co/fst-app',
      description: 'Aplicación educativa de acompañamiento para personas con condiciones tiroideas.',
    },
  }), []);
  return (
    <FstAppProvider>
      <Routes>
        <Route path="*" element={<PortalContent />} />
      </Routes>
    </FstAppProvider>
  );
}
