import React from 'react';

const PrintableCV = () => {
  // Estilos constantes para mantener consistencia
  const styles = {
    page: {
      width: '210mm',
      minHeight: '297mm',
      padding: '15mm',
      background: 'white',
      margin: '0 auto',
      boxSizing: 'border-box',
      fontFamily: "'Roboto Mono', 'Courier New', monospace", // Fuente estilo código, muy legible
      color: '#111',
      display: 'grid',
      gridTemplateColumns: '1fr 2fr', // Columna lateral pequeña, contenido grande
      gap: '20px',
      borderTop: '10px solid #ffde00' // Detalle de color arriba
    },
    sectionTitle: {
      fontFamily: "'Press Start 2P', cursive", // Solo para títulos muy cortos
      fontSize: '1rem',
      textTransform: 'uppercase',
      borderBottom: '3px solid #000',
      paddingBottom: '5px',
      marginBottom: '15px',
      color: '#000',
      marginTop: '20px'
    },
    retroBox: {
      border: '2px solid #000',
      padding: '10px',
      marginBottom: '15px',
      boxShadow: '3px 3px 0 #ccc', // Sombra gris suave para imprimir mejor
      borderRadius: '4px'
    },
    subHeader: {
      fontWeight: 'bold',
      fontSize: '1.1rem',
      display: 'flex',
      justifyContent: 'space-between'
    },
    dateBadge: {
      background: '#000',
      color: '#fff',
      padding: '2px 6px',
      fontSize: '0.8rem',
      borderRadius: '4px'
    }
  };

  return (
    <div style={styles.page} className="print-container">

      {/* === SIDEBAR (IZQUIERDA) === */}
      <div style={{ paddingRight: '15px', borderRight: '2px dashed #ccc' }}>

        {/* FOTO / AVATAR */}
        <div style={{
          width: '120px', height: '120px',
          border: '3px solid #000',
          margin: '0 auto 20px',
          background: '#f0f0f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '4px 4px 0 #000'
        }}>
          {/* Tu foto aquí */}
           <span style={{fontSize: '3rem'}}>😎</span>
        </div>

        {/* CONTACTO */}
        <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          <h3 style={styles.sectionTitle}>STATS</h3>
          <div>📧 email@ejemplo.com</div>
          <div>📱 +34 600 000 000</div>
          <div>📍 Ciudad Real, ES</div>
          <div style={{marginTop: '10px'}}>🔗 linkedin.com/in/tu-perfil</div>
          <div>🐱 github.com/tu-usuario</div>
        </div>

        {/* SKILLS TECNICAS */}
        <h3 style={styles.sectionTitle}>SKILLS</h3>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
          {['JavaScript (ES6+)', 'React / Vite', 'Node.js', 'SQL / Bases de Datos', 'Git / GitHub', 'HTML5 / CSS3'].map(skill => (
            <li key={skill} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{color: '#ffde00'}}>▶</span> {skill}
            </li>
          ))}
        </ul>

        {/* IDIOMAS */}
        <h3 style={styles.sectionTitle}>LANG</h3>
        <div style={styles.retroBox}>
          <strong>Español:</strong> Nativo<br/>
          <strong>Inglés:</strong> B2 (Intermedio)
        </div>

      </div>

      {/* === CONTENIDO PRINCIPAL (DERECHA) === */}
      <div>

        {/* CABECERA NOMBRE */}
        <header style={{ borderBottom: '4px solid #000', paddingBottom: '20px', marginBottom: '20px' }}>
          <h1 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '2rem', margin: 0, lineHeight: '1.5' }}>
            Ángel García Lopezlira
          </h1>
          <h2 style={{ fontFamily: "'VT323', monospace", fontSize: '1.8rem', color: '#666', margin: '5px 0 0 0' }}>
            &lt;Software Engineer Student /&gt;
          </h2>
        </header>

        {/* PERFIL */}
        <section>
          <p style={{ fontStyle: 'italic', fontSize: '1rem', borderLeft: '4px solid #ffde00', paddingLeft: '15px' }}>
            Estudiante de Ingeniería Informática apasionado por el desarrollo web y la arquitectura de software. Busco un entorno donde aplicar mis conocimientos en React y backend, resolver bugs complejos ("Quest Complete!") y seguir subiendo de nivel profesionalmente.
          </p>
        </section>

        {/* FORMACIÓN */}
        <section>
          <h3 style={styles.sectionTitle}>LOGS DE FORMACIÓN</h3>

          <div style={styles.retroBox}>
            <div style={styles.subHeader}>
              <span>Grado en Ingeniería Informática</span>
              <span style={styles.dateBadge}>2022 - Actualidad</span>
            </div>
            <div style={{ color: '#666', fontWeight: 'bold' }}>Universidad de Castilla-La Mancha</div>
            <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
              <li>Especialidad en Ingeniería del Software.</li>
              <li>Proyectos destacados en Java y Arquitectura de Sistemas.</li>
            </ul>
          </div>

          <div style={styles.retroBox}>
            <div style={styles.subHeader}>
              <span>Bachillerato de Ciencias</span>
              <span style={styles.dateBadge}>2020 - 2022</span>
            </div>
            <div style={{ color: '#666', fontWeight: 'bold' }}>I.E.S. Bernardo de Balbuena</div>
            <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>Itinerario Tecnológico.</div>
          </div>
        </section>

        {/* PROYECTOS (IMPORTANTE PARA JUNIORS) */}
        <section>
          <h3 style={styles.sectionTitle}>MISIONES (PROYECTOS)</h3>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>🛒 E-Commerce Full Stack</div>
            <div style={{ fontSize: '0.85rem', fontFamily: "'VT323', monospace", background: '#eee', display: 'inline-block', padding: '2px 5px', border: '1px solid #999' }}>React • Firebase • Stripe</div>
            <p style={{ margin: '5px 0' }}>Desarrollo de una tienda online completa con gestión de usuarios, carrito persistente y pasarela de pagos real.</p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>👾 Portfolio Gamificado</div>
            <div style={{ fontSize: '0.85rem', fontFamily: "'VT323', monospace", background: '#eee', display: 'inline-block', padding: '2px 5px', border: '1px solid #999' }}>React • CSS Avanzado • UX</div>
            <p style={{ margin: '5px 0' }}>Diseño e implementación de una web personal interactiva basada en estética de videojuegos retro.</p>
          </div>
        </section>

      </div>

      {/* Estilos para ocultar cosas al imprimir si fuera necesario */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
        }
      `}</style>
    </div>
  );
};

export default PrintableCV;