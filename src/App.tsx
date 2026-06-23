import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/routes/Home";
import { Docs } from "@/routes/Docs";
import { Demo } from "@/routes/Demo";
import { Pilot } from "@/routes/Pilot";
import { Pricing } from "@/routes/Pricing";
import { Login } from "@/routes/Login";
import { Register } from "@/routes/Register";
import { Dashboard } from "@/routes/Dashboard";
import { Legal } from "@/routes/Legal";
import { CookieBanner } from "@/components/layout/CookieBanner";

function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
      <Logo size={48} />
      <h1 className="mt-8 text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        Такой страницы нет — возможно, ссылка устарела.
      </p>
      <Link
        to="/"
        className="mt-9 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent-fg)] transition hover:opacity-90"
      >
        На главную
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs/*" element={<Docs />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/pilot" element={<Pilot />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/legal/*" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </BrowserRouter>
  );
}
