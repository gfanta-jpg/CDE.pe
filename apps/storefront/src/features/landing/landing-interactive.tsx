"use client";

import { useFlashStore } from "@technology-ecommerce/ui";
import { useRef, type FormEvent, type MouseEvent } from "react";

import { INSTAGRAM_CDE_URL, INSTAGRAM_DRA_URL, WHATSAPP_BOOKING_URL, WHATSAPP_FILLERS_URL } from "./landing-links";

export function BlogSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  return (
    <section aria-labelledby="blog-title" className="section section-paper" id="blog">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Blog / Contenido educativo</span>
          <h2 id="blog-title">De la consulta y el feed, a una lectura completa.</h2>
          <p>Ampliamos algunos de los temas que la Dra. Kusch comparte en Instagram, con más contexto del que entra en un post.</p>
        </div>
        <div className="blog-grid">
          <button aria-haspopup="dialog" className="blog-featured" onClick={() => dialogRef.current?.showModal()} type="button">
            <span className="eyebrow">Cuidado post-tratamiento</span>
            <h3>¿Cada cuánto tiempo debes controlar tus rellenos faciales?</h3>
            <p>{"Una de las preguntas más frecuentes en consulta — y por qué \"esperar a que se note algo raro\" no debería ser el plan de seguimiento."}</p>
            <span className="blog-read">Leer artículo completo →</span>
          </button>
          <div className="blog-side">
            <a className="blog-teaser" href={INSTAGRAM_DRA_URL} rel="noopener" target="_blank">
              <span className="badge">Próximamente</span>
              <q>Bioestimuladores y deep plane: ¿contraindicados entre sí?</q>
              <span className="blog-meta"><span>@dra.annekusch</span><span>Ver en Instagram →</span></span>
            </a>
            <a className="blog-teaser" href="https://www.instagram.com/dra.annekusch/reel/DdFMORLKdrw/" rel="noopener" target="_blank">
              <span className="badge">Próximamente</span>
              <q>¿No ves relleno... o sólo es fibrosis?</q>
              <span className="blog-meta"><span>@dra.annekusch</span><span>Ver en Instagram →</span></span>
            </a>
          </div>
        </div>
      </div>

      <dialog aria-labelledby="blog-article-title" className="blog-dialog" onClick={closeOnBackdrop} ref={dialogRef}>
        <div className="modal-head">
          <button aria-label="Cerrar" className="modal-close" onClick={() => dialogRef.current?.close()} type="button">
            <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" width="20"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <article className="blog-article">
          <span className="eyebrow">Cuidado post-tratamiento</span>
          <h3 id="blog-article-title">¿Cada cuánto tiempo debes controlar tus rellenos faciales?</h3>
          <p>{"Es una de las preguntas que más se repite en consulta: \"¿cada cuánto debería revisarme?\". La respuesta corta es que \"esperar a que se note algo raro\" no es en realidad un plan de seguimiento — para entonces, muchas veces ya pasó tiempo de más."}</p>
          <h4>El relleno no envejece igual en todos los rostros</h4>
          <p>Cuánto dura y cómo se comporta un relleno con el tiempo depende de varios factores: el metabolismo de cada persona, la zona tratada, la densidad y reticulación del producto usado, la actividad muscular de la zona y la exposición solar acumulada. Por eso los rangos que se manejan en general — entre 6 y 18 meses, o más, según el caso — son solo una referencia, no una regla fija para todos.</p>
          <h4>{"Señales para no esperar al control \"de rutina\""}</h4>
          <p>{"Hay señales que conviene consultar antes de la fecha de control habitual: un bulto nuevo que no estaba antes, una asimetría que aparece de forma repentina, o dolor y enrojecimiento que no ceden en pocos días. Ninguna de estas señales debería \"esperar\" al siguiente chequeo programado."}</p>
          <h4>Qué ve una ecografía que un espejo no puede</h4>
          <p>A simple vista, o incluso al tacto, es difícil distinguir entre fibrosis, remanente de relleno o un granuloma — y confundirlos lleva a decisiones de tratamiento equivocadas. Un ecógrafo de alta frecuencia permite diferenciar estas estructuras de forma no invasiva, algo que ni el espejo ni la palpación pueden ofrecer por sí solos.</p>
          <h4>Entonces, ¿cada cuánto?</h4>
          <p>Como orientación general: un primer control unas semanas después del tratamiento, y luego cada 6 a 12 meses aproximadamente, según el producto y la zona — antes si aparece alguna de las señales de alerta mencionadas arriba. Esto es una guía orientativa y no reemplaza una evaluación individualizada con un especialista.</p>
          <p className="fine-note">Nota editorial: este artículo está pendiente de revisión clínica por la Dra. Kusch antes de su publicación final. Los tiempos y señales mencionados son orientativos y no constituyen una indicación médica personalizada.</p>
          <a className="ig-source" href="https://www.instagram.com/dra.annekusch/p/DJF1zAxN59z/" rel="noopener" target="_blank">Ver la publicación original en Instagram →</a>
          <a className="btn btn-gold btn-block" href={WHATSAPP_FILLERS_URL} rel="noopener" target="_blank">Agendar evaluación ecográfica por WhatsApp</a>
        </article>
      </dialog>
    </section>
  );
}

export function ContactSection() {
  const showFlash = useFlashStore((state) => state.showFlash);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showFlash("info", "Gracias — este formulario es una vista previa; conéctalo a tu correo o CRM al publicar el sitio.");
  }

  return (
    <section aria-labelledby="contacto-title" className="section contact" id="contacto">
      <div className="wrap contact-grid">
        <div>
          <span className="eyebrow">Contacto</span>
          <h2 id="contacto-title">Agenda tu evaluación ecográfica.</h2>
          <p className="lede">La forma más rápida de coordinar una cita o resolver una duda es por WhatsApp — la doctora responde ahí directamente.</p>
          <a className="btn btn-gold" href={WHATSAPP_BOOKING_URL} rel="noopener" target="_blank">Escribir por WhatsApp</a>
          <div className="contact-locations">
            <div className="loc"><h3>Lima, Perú</h3><p>CDE — Centro de Diagnóstico Ecográfico. Dirección exacta a confirmar por WhatsApp.</p></div>
            <div className="loc"><h3>Redes</h3><p><a href={INSTAGRAM_DRA_URL} rel="noopener" target="_blank">@dra.annekusch</a> · <a href={INSTAGRAM_CDE_URL} rel="noopener" target="_blank">@cde.pe</a></p></div>
          </div>
        </div>
        <div className="form-card">
          <h3>¿Prefieres que te contactemos?</h3>
          <p className="hint">Déjanos tus datos y coordinamos por WhatsApp o correo.</p>
          <form onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="cf-name">Nombre completo</label><input id="cf-name" placeholder="Tu nombre" required type="text" /></div>
            <div className="field"><label htmlFor="cf-phone">WhatsApp</label><input id="cf-phone" placeholder="+51 9XX XXX XXX" required type="tel" /></div>
            <div className="field">
              <label htmlFor="cf-motivo">Motivo de consulta</label>
              <select id="cf-motivo">
                <option>Control de rellenos</option>
                <option>Evaluación de nódulo / fibrosis</option>
                <option>Bioestimuladores</option>
                <option>Otro</option>
              </select>
            </div>
            <button className="btn btn-gold btn-block" type="submit">Solicitar contacto</button>
          </form>
        </div>
      </div>
    </section>
  );
}
