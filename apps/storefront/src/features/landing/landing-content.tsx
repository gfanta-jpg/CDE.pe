import Image from "next/image";
import type { ReactNode } from "react";

import { INSTAGRAM_CDE_URL, INSTAGRAM_DRA_URL, WHATSAPP_BOOKING_URL, WHATSAPP_URL } from "./landing-links";

/* Static sections of the CDE design HTML. Texts, links and images are kept verbatim. */

function Icon({ children, strokeWidth = 1.6, className }: Readonly<{ children: ReactNode; strokeWidth?: number; className?: string }>) {
  return <svg aria-hidden="true" className={className} fill="none" focusable="false" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24">{children}</svg>;
}

export function HeroSection() {
  return (
    <section aria-labelledby="inicio-title" className="hero" data-slot="landing-hero" id="inicio">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Centro de Diagnóstico Ecográfico · Lima, Perú</span>
          <h1 id="inicio-title">Ecografía dermatológica y estética,<br /><em>en alta resolución.</em></h1>
          <p className="lede">La Dra. Anne Kusch responde con imagen, no con suposiciones, lo que ocurre bajo la piel: seguimiento de rellenos, bioestimuladores, fibrosis y nódulos, con un enfoque radiológico aplicado a la medicina estética.</p>
          <div className="hero-ctas">
            <a className="btn btn-gold" href={WHATSAPP_BOOKING_URL} rel="noopener" target="_blank">
              <svg aria-hidden="true" fill="currentColor" height="15" viewBox="0 0 24 24" width="15"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm5.6 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.7-2.8-1-4.6-3.9-4.8-4.1-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.6.7 1.9.8 2.1.1.2.1.4 0 .6-.4.8-.8.8-.4 1.4 1.5 2 2.6 2.6 3.2 2.9.4.2.6.2.9-.1.2-.3.9-1.1 1.2-1.4.3-.3.5-.3.8-.2.3.1 2 1 2.4 1.1.4.2.6.3.7.4.1.2.1 1-.1 1.6Z" /></svg>
              Agendar por WhatsApp
            </a>
            <a className="btn btn-outline-light" href="#tienda">Explorar la tienda</a>
          </div>
          <div className="hero-tags">
            <div className="hero-tag"><Icon><path d="M12 21s-7-5.2-9.5-9.6C.7 7.7 2.6 4 6.3 4c2 0 3.4 1 4 2.2C11 4.9 12.4 4 14.4 4c3.7 0 5.6 3.7 3.8 7.4C19.5 15.8 12 21 12 21Z" /></Icon>Radióloga con enfoque estético</div>
            <div className="hero-tag"><Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></Icon>Docente de posgrado</div>
            <div className="hero-tag"><Icon><path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z" /><circle cx="12" cy="10" r="2.2" /></Icon>Atención en Lima, Perú</div>
          </div>
        </div>
        <div aria-label="Representación gráfica de un ecógrafo en modo escaneo" className="scan" role="img">
          <div className="scan-face">
            <svg aria-hidden="true" fill="none" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 18c-32 20-48 46-48 78 0 40 24 74 48 106 24-32 48-66 48-106 0-32-16-58-48-78Z" opacity=".55" stroke="#C9A567" strokeWidth="1" />
              <path d="M70 96c4-14 16-22 30-22s26 8 30 22" opacity=".8" stroke="#C9A567" strokeWidth="1" />
              <path d="M76 118c8 8 16 12 24 12s16-4 24-12" opacity=".8" stroke="#C9A567" strokeWidth="1" />
              <circle cx="100" cy="96" opacity=".35" r="46" stroke="#C9A567" strokeWidth=".6" />
              <circle cx="100" cy="96" opacity=".2" r="64" stroke="#C9A567" strokeWidth=".6" />
            </svg>
          </div>
          <div className="scan-sweep" />
          <div className="scan-corner tl" /><div className="scan-corner tr" />
          <div className="scan-corner bl" /><div className="scan-corner br" />
          <div className="scan-readout"><span>US · 18 MHz</span><span>CDE.PE</span></div>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section aria-label="Cifras" className="stats">
      <div className="wrap stats-row">
        <div className="stat"><b className="mono">100%</b><span>Enfoque radiológico aplicado a estética</span></div>
        <div className="stat"><b className="mono">1,500+</b><span>Comunidad en Instagram</span></div>
        <div className="stat"><b className="mono">18 MHz</b><span>Ecografía de alta resolución</span></div>
        <div className="stat"><b className="mono">1º</b><span>Centro de diagnóstico ecográfico especializado en estética, Perú</span></div>
      </div>
    </section>
  );
}

export function DoctoraSection() {
  return (
    <section aria-labelledby="doctora-title" className="section section-paper" id="doctora">
      <div className="wrap doctora-grid">
        <div className="doctora-card">
          <Image alt="Dra. Anne Kusch junto a un equipo de ecografía" className="doctora-photo" height={860} sizes="(min-width: 960px) 440px, 100vw" src="/images/cde/dra-anne-kusch.jpg" width={860} />
          <div className="doctora-card-body">
            <h3>Dra. Anne Kusch</h3>
            <span className="role">Ecografía dermatológica y estética</span>
            <ul className="doctora-list">
              <li><Icon><path d="M4 20V9l8-5 8 5v11" /><path d="M9 20v-6h6v6" /></Icon>CEO, Centro de Diagnóstico Ecográfico (CDE)</li>
              <li><Icon><path d="M4 6h16M4 12h16M4 18h10" /></Icon>Docente de posgrado</li>
              <li><Icon><path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z" /><circle cx="12" cy="10" r="2.2" /></Icon>Lima, Perú</li>
            </ul>
          </div>
        </div>
        <div className="doctora-copy">
          <span className="eyebrow">Sobre la doctora</span>
          <h2 id="doctora-title">Un ojo radiológico, aplicado a la piel.</h2>
          <p>La mayoría de las complicaciones estéticas —fibrosis, migración de relleno, nódulos, edema— no se ven a simple vista. La ecografía de alta resolución permite diferenciarlas con evidencia, en tiempo real, antes de decidir un tratamiento.</p>
          <p className="pull">{"\"¿Por qué acudir a un radiólogo con formación en estética?\" — es la pregunta que más responde en su comunidad, y el motivo por el que fundó CDE."}</p>
          <p>Desde Lima, la Dra. Kusch combina la lectura ecográfica propia de la radiología con un conocimiento profundo de los procedimientos estéticos actuales: bioestimuladores, hilos, ácido hialurónico y tecnologías como deep plane.</p>
          <div className="fine-note">Biografía en revisión editorial — reemplazar con la reseña profesional definitiva de la Dra. Kusch (formación, colegiatura, años de ejercicio) antes de publicar el sitio en producción.</div>
        </div>
      </div>
    </section>
  );
}

const SERVICIOS = [
  { num: "01", title: "Control de rellenos faciales", text: "Seguimiento en el tiempo del ácido hialurónico: dónde está, cómo se comporta y cuándo revisarlo.", icon: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></> },
  { num: "02", title: "¿Fibrosis o relleno?", text: "Diferenciar con imagen si un nódulo palpable es tejido fibroso o material remanente.", icon: <path d="M12 3 4 7v6c0 5 3.6 7.7 8 9 4.4-1.3 8-4 8-9V7l-8-4Z" /> },
  { num: "03", title: "Bioestimuladores", text: "Evaluación de bioestimuladores de colágeno y su comportamiento tras técnicas como deep plane.", icon: <><path d="M4 12c2-6 6-9 8-9s6 3 8 9c-2 6-6 9-8 9s-6-3-8-9Z" /><circle cx="12" cy="12" r="2.4" /></> },
  { num: "04", title: "Edema y linfedema", text: "Estudio ecográfico de edema y linfedema facial o corporal, y su evolución en controles sucesivos.", icon: <path d="M12 21c4-4 7-7.6 7-11.5A7 7 0 0 0 5 9.5C5 13.4 8 17 12 21Z" /> },
  { num: "05", title: "Retiro de materiales permanentes", text: "Localización ecográfica precisa antes de retirar un material de relleno permanente.", icon: <path d="M5 12h14M13 6l6 6-6 6" /> },
  { num: "06", title: "Nódulos post-inyectable", text: "Ecografía de alta frecuencia para investigar nódulos que aparecen tras un tratamiento inyectable.", icon: <><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /><circle cx="12" cy="12" r="3.2" /></> },
];

export function ServiciosSection() {
  return (
    <section aria-labelledby="servicios-title" className="section section-dark" id="servicios">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Lo que evaluamos con ecografía</span>
          <h2 id="servicios-title">Temas que la Dra. Kusch trata cada semana en consulta.</h2>
          <p>Seis preguntas recurrentes de su comunidad, convertidas en motivos de consulta.</p>
        </div>
        <div className="servicios-grid">
          {SERVICIOS.map((servicio) => (
            <div className="servicio" key={servicio.num}>
              <Icon strokeWidth={1.4}>{servicio.icon}</Icon>
              <span className="servicio-num mono">{servicio.num}</span>
              <h3>{servicio.title}</h3>
              <p>{servicio.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const IG_POSTS = [
  { href: "https://www.instagram.com/dra.annekusch/p/DJF1zAxN59z/", quote: "¿Cada cuánto tiempo debiera controlar mis rellenos faciales?", handle: "@dra.annekusch" },
  { href: "https://www.instagram.com/dra.annekusch/p/DIQFbketm50/", quote: "¿Por qué acudir a un radiólogo con formación en estética?", handle: "@dra.annekusch" },
  { href: "https://www.instagram.com/dra.annekusch/reel/DdFMORLKdrw/", quote: "¿No ves relleno... o sólo es fibrosis?", handle: "@dra.annekusch" },
  { href: INSTAGRAM_DRA_URL, quote: "Bioestimuladores y deep plane: ¿contraindicados entre sí?", handle: "@dra.annekusch" },
  { href: INSTAGRAM_CDE_URL, quote: "Lo que necesitas saber antes de retirar un material permanente.", handle: "@cde.pe" },
  { href: INSTAGRAM_CDE_URL, quote: "Utilidad del ultrasonido de alta frecuencia en el diagnóstico de nódulos.", handle: "@cde.pe" },
];

export function InstagramIcon({ className }: Readonly<{ className?: string }>) {
  return <Icon className={className} strokeWidth={1.5}><rect height="18" rx="5" width="18" x="3" y="3" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" /></Icon>;
}

export function InstagramSection() {
  return (
    <section aria-labelledby="instagram-title" className="section section-paper" id="instagram">
      <div className="wrap">
        <div className="ig-head">
          <div className="section-head">
            <span className="eyebrow">Directo de @dra.annekusch</span>
            <h2 id="instagram-title">Educación que también se ve en el feed.</h2>
            <p>Una muestra de los temas que trabaja en su cuenta — la fuente para el contenido educativo del sitio.</p>
          </div>
        </div>
        <div className="ig-grid">
          {IG_POSTS.map((post) => (
            <a className="ig-card" href={post.href} key={post.quote} rel="noopener" target="_blank">
              <InstagramIcon className="ig-icon" />
              <q>{post.quote}</q>
              <span className="ig-meta"><span>{post.handle}</span><span>Ver post →</span></span>
            </a>
          ))}
        </div>
        <div className="ig-cta">
          <a className="btn btn-outline-dark" href={INSTAGRAM_DRA_URL} rel="noopener" target="_blank">Seguir en Instagram</a>
        </div>
      </div>
    </section>
  );
}

export function ConfianzaSection() {
  return (
    <section aria-labelledby="confianza-title" className="section section-paper" id="confianza">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">Por qué un enfoque ecográfico</span>
          <h2 id="confianza-title">Evidencia antes que suposición.</h2>
        </div>
        <div className="confianza-grid">
          <div className="confianza-item">
            <Icon strokeWidth={1.4}><path d="M4 20V9l8-5 8 5v11" /><path d="M9 20v-6h6v6" /></Icon>
            <h3>Formación radiológica</h3>
            <p>Lectura de imagen entrenada en radiología, aplicada específicamente a piel y tejidos blandos.</p>
          </div>
          <div className="confianza-item">
            <Icon strokeWidth={1.4}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Icon>
            <h3>Diagnóstico, no supuestos</h3>
            <p>Antes de intervenir de nuevo, se documenta con imagen qué hay realmente bajo la piel.</p>
          </div>
          <div className="confianza-item">
            <Icon strokeWidth={1.4}><path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z" /><circle cx="12" cy="10" r="2.2" /></Icon>
            <h3>Un centro, un solo estándar</h3>
            <p>Atención en Lima, Perú, con un protocolo de evaluación ecográfica riguroso y consistente.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="cde-footer">
      <div className="wrap footer-row">
        <span>© {new Date().getFullYear()} Dra. Anne Kusch · Centro de Diagnóstico Ecográfico (CDE). Sitio de demostración.</span>
        <span><a href={INSTAGRAM_DRA_URL} rel="noopener" target="_blank">Instagram</a> · <a href={WHATSAPP_URL} rel="noopener" target="_blank">WhatsApp</a></span>
      </div>
    </footer>
  );
}
