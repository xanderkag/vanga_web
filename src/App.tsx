import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/routes/Home";
import { Docs } from "@/routes/Docs";
import { Demo } from "@/routes/Demo";
import { Pilot } from "@/routes/Pilot";

function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-4 text-[var(--muted)]">Страница не найдена.</p>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
