import { useState } from 'react'

function App() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      
      {/* 1. NAVBAR FLOTANTE (Siempre visible arriba) */}
      <nav className="floating-nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'var(--terminal-green)', fontWeight: 'bold', fontSize: '1.5rem', textShadow: '0 0 5px var(--terminal-green)' }}>
            DEV_RPG.exe
          </div>
          <div>
            {/* Botón que te lleva arriba del todo (al juego) */}
            <button className="retro-btn" onClick={() => scrollTo('game-hero')}>START</button>
            <button className="retro-btn" onClick={() => scrollTo('profile')}>PERFIL</button>
            <button className="retro-btn" onClick={() => scrollTo('projects')}>MISIONES</button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (EL JUEGO) - Ocupa toda la pantalla */}
      <section id="game-hero" className="full-screen-hero">
        
        {/* Aquí es donde Phaser renderizará el juego más adelante */}
        <div id="phaser-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
             {/* Placeholder visual mientras no hay juego */}
             <div style={{ 
                 width: '100%', height: '100%', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 background: 'radial-gradient(circle, rgba(20,20,20,1) 0%, rgba(0,0,0,1) 100%)'
             }}>
                 <h1 style={{ color: '#444', textAlign: 'center' }}>
                     [ GAME LOADING AREA ]<br/>
                     <span style={{ fontSize: '1rem' }}>Insert Coin (or wait for Phaser)</span>
                 </h1>
             </div>
        </div>

        {/* Flecha indicadora para que sepan que hay web abajo */}
        <div className="scroll-indicator" onClick={() => scrollTo('profile')}>
            <p>SCROLL TO EXPLORE</p>
            ▼
        </div>

      </section>


      {/* 3. EL RESTO DEL CONTENIDO (Con márgenes normales) */}
      <div className="container" style={{ position: 'relative', background: 'var(--bg-color)', zIndex: 20 }}>
        
        {/* SECCIÓN PERFIL */}
        <section id="profile" style={{ paddingTop: '100px', minHeight: '80vh' }}>
          <h2 className="section-title"> CARGAR_PERFIL_JUGADOR</h2>
          <div className="retro-box" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ width: '150px', height: '150px', background: '#222', border: '2px dashed var(--terminal-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              [AVATAR]
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: 'var(--retro-gold)', margin: '0 0 10px 0' }}>JUGADOR 1: [TU NOMBRE]</h1>
              <p>LEVEL: Junior Developer</p>
              <p>HP: 100/100 | MANA: 100/100</p>
              <p>BIO: Bienvenido a mi base de operaciones. Scrollea o juega para conocerme.</p>
            </div>
          </div>
        </section>

        {/* SECCIÓN MISIONES */}
        <section id="projects" style={{ paddingBottom: '100px' }}>
          <h2 className="section-title"> MISIONES_COMPLETADAS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            <div className="retro-box">
              <h3 style={{ color: 'var(--retro-gold)' }}>Web App E-Commerce</h3>
              <p>Plataforma de ventas completa.</p>
              <a href="#" className="retro-btn" style={{ fontSize: '1rem' }}>VER CÓDIGO</a>
            </div>

            <div className="retro-box">
              <h3 style={{ color: 'var(--retro-gold)' }}>Gestor de Tareas</h3>
              <p>Dashboard interactivo.</p>
              <a href="#" className="retro-btn" style={{ fontSize: '1rem' }}>VER CÓDIGO</a>
            </div>

          </div>
        </section>

        <footer style={{ textAlign: 'center', padding: '50px 0', opacity: 0.5, borderTop: '1px solid #333' }}>
          <p>© 2024 DEV_RPG SYSTEM | PRESS START</p>
        </footer>

      </div>
    </div>
  )
}

export default App