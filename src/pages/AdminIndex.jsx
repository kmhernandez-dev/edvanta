import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseBusiness, ClipboardList, FileText, GraduationCap, LayoutDashboard, LineChart, ShieldCheck,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updatePageSeo } from '../utils/seo';

const PANELS = [
  {
    to: '/admin/community',
    icon: BriefcaseBusiness,
    title: 'Banco de empleo y talento',
    desc: 'Aprueba ofertas, marca las no vigentes y elimina publicaciones de la comunidad.',
    token: 'ADMIN_TOKEN',
  },
  {
    to: '/admin/orders',
    icon: ClipboardList,
    title: 'Órdenes y pagos',
    desc: 'Órdenes de compra, pagos de Mercado Pago y descargas.',
    token: 'ADMIN_TOKEN',
  },
  {
    to: '/admin/academia',
    icon: GraduationCap,
    title: 'Academia FST',
    desc: 'Cursos, módulos, lecciones, estudiantes, comentarios y Retos FST.',
    token: 'ADMIN_TOKEN',
  },
  {
    to: '/admin/tracking',
    icon: LineChart,
    title: 'Seguimiento',
    desc: 'Eventos de comportamiento y análisis de uso de la plataforma.',
    token: 'ADMIN_TOKEN',
  },
  {
    to: '/admin/edvanta',
    icon: FileText,
    title: 'Contenido Edvanta',
    desc: 'Catálogo profesional: carreras, cursos, empresas, proyectos y certificaciones.',
    token: 'ADMIN_TOKEN',
  },
  {
    to: '/admin',
    icon: LayoutDashboard,
    title: 'Usuarios y métricas (Supabase)',
    desc: 'Usuarios, métricas y detalle de cuentas. Requiere rol admin en Supabase.',
    token: 'Rol admin Supabase',
  },
];

export default function AdminIndex() {
  useEffect(() => updatePageSeo({
    title: 'Paneles administrativos | Edvanta',
    description: 'Acceso a los paneles administrativos de Edvanta.',
    canonical: 'https://edvanta.co/admin-paneles',
    robots: 'noindex,nofollow',
  }), []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Administración</p>
            <h1 className="mt-2 text-3xl font-bold text-[#071a4a] sm:text-4xl">Paneles administrativos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Cada panel pide el token de administración (ADMIN_TOKEN) al entrar, excepto el de usuarios y métricas que usa el rol admin de Supabase.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {PANELS.map(panel => (
              <Link
                key={panel.to}
                to={panel.to}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <panel.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{panel.token}</span>
                </div>
                <h2 className="mt-4 text-lg font-bold text-[#071a4a] group-hover:text-teal-800">{panel.title}</h2>
                <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">{panel.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700">
                  <ShieldCheck className="h-4 w-4" /> Abrir panel
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
