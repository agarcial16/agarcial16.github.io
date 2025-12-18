import { useState } from 'react'

function App() {
    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="App">

            {/* 1. NAVBAR FLOTANTE */}
            <nav className="floating-nav">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* TÍTULO EN BLANCO Y CON SOMBRA NEGRA */}
                    <div style={{
                        color: '#fff',
                        fontFamily: "'Press Start 2P', cursive", /* Fuente Nintendo */
                        fontSize: '1rem',
                        textShadow: '3px 3px 0 #000'
                    }}>
                        PKMN_DEV.sav
                    </div>

                    <div style={{ display: 'flex', gap: '5px' }}>
                        {/* Botones siguen igual */}
                        <button className="retro-btn" onClick={() => scrollTo('game-hero')}>START</button>
                        <button className="retro-btn" onClick={() => scrollTo('profile')}>PERFIL</button>
                        <button className="retro-btn" onClick={() => scrollTo('education')}>EXP</button>
                        <button className="retro-btn" onClick={() => scrollTo('skills')}>SKILLS</button>
                        <button className="retro-btn" onClick={() => scrollTo('projects')}>MISIONES</button>
                    </div>
                </div>
            </nav>

            {/* 2. HERO SECTION (JUEGO PANTALLA COMPLETA) */}
            <section id="game-hero" className="full-screen-hero">
                <div id="phaser-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'radial-gradient(circle, rgba(20,20,20,1) 0%, rgba(0,0,0,1) 100%)',
                        flexDirection: 'column'
                    }}>
                        <h1 style={{ color: '#444', textAlign: 'center', marginBottom: '20px' }}>
                            [ SYSTEM READY ]
                        </h1>
                        <p style={{ color: '#666' }}>Waiting for Player Input...</p>
                    </div>
                </div>

                <div className="scroll-indicator" onClick={() => scrollTo('profile')}>
                    <p>SCROLL TO EXPLORE</p>
                    ▼
                </div>
            </section>


            {/* 3. CONTENIDO PRINCIPAL */}
            <div className="container" style={{ position: 'relative', background: 'var(--bg-color)', zIndex: 20 }}>

                {/* --- PERFIL (TRAINER CARD) --- */}
                <section id="profile" style={{ paddingTop: '100px' }}>
                    <h2 className="section-title"> CARGAR_PERFIL_JUGADOR</h2>

                    {/* Contenedor principal sin padding para manejar la cabecera roja */}
                    <div className="retro-box" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                        {/* CABECERA ROJA TIPO TARJETA */}
                        <div style={{
                            background: '#cc0000',
                            color: 'white',
                            padding: '15px 25px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '4px solid #000'
                        }}>
                            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '1rem', textShadow: '2px 2px 0 #000' }}>
                                TRAINER CARD
                            </span>
                            <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.4rem', fontWeight: 'bold' }}>
                                ID No. 84920
                            </span>
                        </div>

                        {/* CUERPO DE LA TARJETA */}
                        <div style={{ display: 'flex', gap: '40px', padding: '30px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>

                            {/* IZQUIERDA: AVATAR + NOMBRE JUGADOR */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '160px',
                                    height: '160px',
                                    background: '#f0f0f0',
                                    border: '4px solid #222',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '15px',
                                    boxShadow: '6px 6px 0 rgba(0,0,0,0.2)'
                                }}>
                                    {/* Aquí iría tu foto real: <img src="foto.jpg" ... /> */}
                                    <span style={{ fontSize: '4rem' }}>😎</span>
                                </div>

                                <div style={{
                                    background: '#222',
                                    color: 'white',
                                    padding: '8px 15px',
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '0.7rem',
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                }}>
                                    JUGADOR 1
                                </div>
                            </div>

                            {/* DERECHA: DATOS Y BIO */}
                            <div style={{ flex: 1, minWidth: '280px' }}>

                                <h1 style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '1.5rem',
                                    margin: '0 0 25px 0',
                                    color: '#000',
                                    lineHeight: '1.5'
                                }}>
                                    [TU NOMBRE]
                                </h1>

                                {/* GRID DE ESTADÍSTICAS */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr',
                                    gap: '10px 20px',
                                    fontFamily: "'VT323', monospace",
                                    fontSize: '1.3rem',
                                    marginBottom: '25px'
                                }}>
                                    <strong style={{ color: '#666' }}>CLASE:</strong>
                                    <span style={{ fontWeight: 'bold' }}>Full Stack Developer</span>

                                    <strong style={{ color: '#666' }}>NIVEL:</strong>
                                    <span style={{ color: 'var(--pkmn-blue)', fontWeight: 'bold' }}>Junior Lvl. 1</span>

                                    <strong style={{ color: '#666' }}>SERVER:</strong>
                                    <span>España (Remote/Hybrid)</span>

                                    <strong style={{ color: '#666' }}>DINERO:</strong>
                                    <span>$ 0 (Necesita Empleo)</span>
                                </div>

                                {/* CAJA DE TEXTO PARA BIO */}
                                <div style={{
                                    background: '#eee',
                                    border: '2px dashed #999',
                                    padding: '15px',
                                    borderRadius: '6px',
                                    fontStyle: 'italic',
                                    fontSize: '1.1rem',
                                    color: '#444'
                                }}>
                                    "Desarrollador apasionado por crear soluciones eficientes. Transformo café en código limpio y escalable. ¡Listo para la aventura!"
                                </div>

                            </div>

                        </div>

                    </div>
                </section>

                {/* --- FORMACIÓN (Logs de Entrenamiento) --- */}
                <section id="education">
                    <h2 className="section-title"> LOGS_DE_ENTRENAMIENTO (FORMACIÓN)</h2>

                    <div style={{ display: 'grid', gap: '25px' }}>

                        {/* ITEM 1: UNIVERSIDAD */}
                        <div className="retro-box" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                            {/* ICONO (Logro Desbloqueado) */}
                            <div style={{
                                background: 'var(--pkmn-yellow)',
                                border: '3px solid #000',
                                width: '60px',
                                height: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                flexShrink: 0,
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.2)'
                            }}>
                                🎓
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'Press Start 2P', cursive" }}>Ingeniería Informática</h3>
                                    {/* BADGE DE FECHA */}
                                    <span style={{
                                        background: '#222',
                                        color: '#fff',
                                        padding: '5px 10px',
                                        fontFamily: "'VT323', monospace",
                                        fontSize: '1rem',
                                        border: '2px solid #000',
                                        borderRadius: '4px'
                                    }}>
                                        2019 - 2023
                                    </span>
                                </div>

                                <h4 style={{ margin: '0 0 10px 0', color: '#444', fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }}>
                                    Universidad de Castilla-La Mancha
                                </h4>

                                <ul style={{ paddingLeft: '20px', margin: 0, color: '#222', fontSize: '1rem', listStyleType: 'square' }}>
                                    <li style={{ marginBottom: '5px' }}>Especialidad en Ingeniería del Software.</li>
                                    <li>Mención Honorífica en Trabajo de Fin de Grado.</li>
                                </ul>
                            </div>
                        </div>

                        {/* ITEM 2: CURSO */}
                        <div className="retro-box" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>

                            {/* ICONO */}
                            <div style={{
                                background: 'var(--pkmn-blue)',
                                border: '3px solid #000',
                                width: '60px',
                                height: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                flexShrink: 0,
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.2)'
                            }}>
                                ⚡
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '5px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'Press Start 2P', cursive" }}>React & Node Avanzado</h3>
                                    <span style={{
                                        background: '#ddd',
                                        color: '#000',
                                        padding: '5px 10px',
                                        fontFamily: "'VT323', monospace",
                                        fontSize: '1rem',
                                        border: '2px solid #000',
                                        borderRadius: '4px'
                                    }}>
                                        2024
                                    </span>
                                </div>

                                <h4 style={{ margin: 0, color: '#444', fontFamily: "'VT323', monospace", fontSize: '1.2rem' }}>
                                    Certificación Online (Udemy)
                                </h4>
                            </div>
                        </div>

                    </div>
                </section>

                {/* --- EXPERIENCIA (Quest Log) --- */}
                <section id="experience">
                    <h2 className="section-title"> REGISTRO_DE_MISIONES (EXPERIENCIA)</h2>
                    {/* Caja de texto centrada con toque cómico */}
                    <div className="retro-box" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f0f0f0' }}>

                        {/* Imagen del Dinosaurio Pixelado */}
                        <img
                            src="dino.gif"
                            alt="Gameplay del Dinosaurio"
                            style={{
                                maxWidth: '350px',
                                width: '100%',
                                height: 'auto',
                                imageRendering: 'pixelated',
                                marginBottom: '25px',
                                border: '3px solid #000',
                                backgroundColor: '#fff'
                            }}
                        />

                        {/* Título cómico estilo error */}
                        <h3 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.9rem',
                            color: 'var(--pkmn-red)', /* Rojo de alerta */
                            marginTop: 0
                        }}>
                            ERROR 404: EXPERIENCE NOT FOUND
                        </h3>

                        {/* Texto explicativo gamer */}
                        <p style={{ fontWeight: 'bold', marginTop: '20px' }}>
                            Parece que esta zona del mapa aún no está desbloqueada.
                        </p>
                        {/* Un detalle extra */}
                        <p style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginTop: '30px' }}>
                            * Pulsa la barra espaciadora para saltar cactus (es broma, aquí no funciona).
                        </p>

                    </div>
                </section>


                {/* --- COMPETENCIAS DIGITALES (Skill Tree) --- */}
                {/* --- COMPETENCIAS DIGITALES (Skill Tree) --- */}
                <section id="skills">
                    <h2 className="section-title"> ÁRBOL_DE_HABILIDADES</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>

                        {/* Hard Skills (Tech) */}
                        <div className="retro-box">
                            <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginTop: 0, fontFamily: "'Press Start 2P', cursive", fontSize: '1rem' }}>
                                ACTIVE SKILLS (Tech)
                            </h3>

                            {/* SKILL 1 */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>JavaScript (ES6+)</span>
                                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem', color: '#666', background: '#ddd', padding: '4px', borderRadius: '4px' }}>
                                        INTERMEDIO
                                    </span>
                                </div>
                                {/* Barra de progreso visual (sin porcentajes numéricos) */}
                                <div style={{ height: '15px', background: '#e0e0e0', border: '2px solid #000', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: '75%', height: '100%', background: 'var(--pkmn-blue)' }}></div>
                                </div>
                            </div>

                            {/* SKILL 2 */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>React / Vite</span>
                                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem', color: '#666', background: '#ddd', padding: '4px', borderRadius: '4px' }}>
                                        INTERMEDIO
                                    </span>
                                </div>
                                <div style={{ height: '15px', background: '#e0e0e0', border: '2px solid #000', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: '65%', height: '100%', background: 'var(--pkmn-blue)' }}></div>
                                </div>
                            </div>

                            {/* SKILL 3 */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Node.js / Express</span>
                                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem', color: '#666', background: '#ddd', padding: '4px', borderRadius: '4px' }}>
                                        BÁSICO
                                    </span>
                                </div>
                                <div style={{ height: '15px', background: '#e0e0e0', border: '2px solid #000', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: '40%', height: '100%', background: 'var(--pkmn-blue)' }}></div>
                                </div>
                            </div>

                            {/* SKILL 4 */}
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>SQL / Bases de Datos</span>
                                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem', color: '#666', background: '#ddd', padding: '4px', borderRadius: '4px' }}>
                                        INTERMEDIO
                                    </span>
                                </div>
                                <div style={{ height: '15px', background: '#e0e0e0', border: '2px solid #000', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: '60%', height: '100%', background: 'var(--pkmn-blue)' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Soft Skills (Passive Buffs) */}
                        <div className="retro-box">
                            <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginTop: 0, fontFamily: "'Press Start 2P', cursive", fontSize: '1rem' }}>
                                PASSIVE BUFFS (Soft)
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>

                                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'start', gap: '10px' }}>
                                    <div style={{ background: 'var(--pkmn-yellow)', border: '2px solid black', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>⚡</div>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '1.1rem' }}>Trabajo en Equipo</strong>
                                        <span style={{ fontSize: '0.9rem', color: '#555' }}>Aumenta la productividad del grupo. Adaptabilidad a metodologías Ágiles.</span>
                                    </div>
                                </li>

                                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'start', gap: '10px' }}>
                                    <div style={{ background: 'var(--pkmn-red)', color: 'white', border: '2px solid black', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🔍</div>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '1.1rem' }}>Resolución de Bugs</strong>
                                        <span style={{ fontSize: '0.9rem', color: '#555' }}>Habilidad crítica para depurar errores y encontrar soluciones lógicas bajo presión.</span>
                                    </div>
                                </li>

                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'start', gap: '10px' }}>
                                    <div style={{ background: 'var(--pkmn-blue)', color: 'white', border: '2px solid black', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📚</div>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '1.1rem' }}>Aprendizaje Rápido</strong>
                                        <span style={{ fontSize: '0.9rem', color: '#555' }}>Buff pasivo: Reducción del tiempo necesario para aprender nuevos frameworks.</span>
                                    </div>
                                </li>

                            </ul>
                        </div>

                    </div>
                </section>

                {/* --- PROYECTOS (Missions) --- */}
                <section id="projects" style={{ paddingBottom: '80px' }}>
                    <h2 className="section-title"> MISIONES_COMPLETADAS (PROYECTOS)</h2>

                    {/* Usamos 'alignItems: start' para que si una tarjeta es más alta, no estire las demás */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>

                        {/* === PROYECTO 1 === */}
                        <div className="retro-box">

                            {/* NUEVO: Marco de Pantalla para Video/Imagen */}
                            <div style={{
                                border: '3px solid #000',    /* Borde grueso estilo consola */
                                background: '#222',          /* Fondo de pantalla apagada */
                                height: '180px',             /* Altura fija para uniformidad */
                                marginBottom: '20px',        /* Espacio hasta el título */
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',        /* Necesario para poner el icono de play encima */
                                borderRadius: '4px',
                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' /* Sombra interna para profundidad */
                            }}>
                                {/* Texto placeholder (luego será tu imagen o video real) */}
                                <span style={{ color: '#666', fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem' }}>
                                    [ VIDEO PREVIEW ]
                                </span>
                                {/* Icono de Play decorativo */}
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--pkmn-red)', color: 'white', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid black', fontSize: '0.8rem' }}>▶</div>
                            </div>
                            {/* Fin del marco de pantalla */}


                            <h3 style={{ color: '#000', marginTop: 0, fontFamily: "'Press Start 2P', cursive", fontSize: '1rem' }}>
                                E-Commerce Completo
                            </h3>
                            <p>Tienda online con carrito de compras, gestión de usuarios y pasarela de pagos segura.</p>

                            {/* ESTILOS DEL STACK MEJORADOS */}
                            <div style={{ marginBottom: '20px', borderTop: '2px dashed #ccc', paddingTop: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem' }}>STACK:</span>
                                {/* Aumentamos tamaño, color más oscuro y fuente monoespaciada */}
                                <div style={{ fontSize: '1.2rem', color: '#333', fontFamily: "'VT323', monospace", marginTop: '5px' }}>
                                    React • Stripe API • Firebase
                                </div>
                            </div>

                            <a href="#" className="retro-btn" style={{ fontSize: '0.9rem', display: 'block', textAlign: 'center' }}>VER CÓDIGO</a>
                        </div>

                        {/* === PROYECTO 2 === */}
                        <div className="retro-box">
                            {/* Marco de Pantalla */}
                            <div style={{ border: '3px solid #000', background: '#222', height: '180px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '4px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
                                <span style={{ color: '#666', fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem' }}>[ SNAPSHOTS ]</span>
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--pkmn-blue)', color: 'white', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid black', fontSize: '0.8rem' }}>📷</div>
                            </div>

                            <h3 style={{ color: '#000', marginTop: 0, fontFamily: "'Press Start 2P', cursive", fontSize: '1rem' }}>
                                Portfolio RPG
                            </h3>
                            <p>Esta misma web. Una experiencia interactiva que combina diseño web moderno con nostalgia pixelada.</p>

                            {/* Stack Mejorado */}
                            <div style={{ marginBottom: '20px', borderTop: '2px dashed #ccc', paddingTop: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem' }}>STACK:</span>
                                <div style={{ fontSize: '1.2rem', color: '#333', fontFamily: "'VT323', monospace", marginTop: '5px' }}>
                                    React • Vite • CSS3 • Phaser (WIP)
                                </div>
                            </div>
                            <a href="#" className="retro-btn" style={{ fontSize: '0.9rem', display: 'block', textAlign: 'center' }}>VER CÓDIGO</a>
                        </div>

                        {/* === PROYECTO 3 === */}
                        <div className="retro-box">
                            {/* Marco de Pantalla */}
                            <div style={{ border: '3px solid #000', background: '#222', height: '180px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '4px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
                                <span style={{ color: '#666', fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem' }}>[ LIVE DEMO ]</span>
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--pkmn-yellow)', color: 'black', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid black', fontSize: '0.8rem' }}>⚡</div>
                            </div>

                            <h3 style={{ color: '#000', marginTop: 0, fontFamily: "'Press Start 2P', cursive", fontSize: '1rem' }}>
                                Weather App
                            </h3>
                            <p>Aplicación del clima en tiempo real con geolocalización.</p>

                            {/* Stack Mejorado */}
                            <div style={{ marginBottom: '20px', borderTop: '2px dashed #ccc', paddingTop: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem' }}>STACK:</span>
                                <div style={{ fontSize: '1.2rem', color: '#333', fontFamily: "'VT323', monospace", marginTop: '5px' }}>
                                    JS Vanilla • OpenWeatherMap API
                                </div>
                            </div>
                            <a href="#" className="retro-btn" style={{ fontSize: '0.9rem', display: 'block', textAlign: 'center' }}>VER CÓDIGO</a>
                        </div>

                    </div>
                </section>

                {/* --- FOOTER --- */}
                {/* --- FOOTER ESTILO POKÉDEX --- */}
                <footer style={{
                    textAlign: 'center',
                    padding: '40px 0',
                    background: '#cc0000', /* Rojo Pokédex para cerrar el diseño */
                    borderTop: '4px solid #8b0000', /* Borde oscuro para dar volumen 3D */
                    color: 'white',
                    marginTop: '60px'
                }}>

                    {/* Texto principal estilo pregunta de guardado */}
                    <p style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.9rem',
                        marginBottom: '25px',
                        textShadow: '2px 2px 0 #000' /* Sombra para legibilidad */
                    }}>
                        ¿QUIERES GUARDAR LA PARTIDA?
                    </p>

                    {/* Caja de Email estilo "Item" */}
                    <div style={{
                        background: '#f8f9fa',
                        color: '#000',
                        display: 'inline-block',
                        padding: '10px 20px',
                        border: '4px solid #222',
                        borderRadius: '8px',
                        marginBottom: '25px',
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.3)'
                    }}>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.5rem', fontWeight: 'bold' }}>
                            ✉️ contacto@email.com
                        </span>
                    </div>

                    {/* Links Sociales */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px' }}>
                        <a href="#" className="retro-btn" style={{ textDecoration: 'none', fontSize: '0.7rem' }}>LINKEDIN</a>
                        <a href="#" className="retro-btn" style={{ textDecoration: 'none', fontSize: '0.7rem' }}>GITHUB</a>
                    </div>

                    {/* Copyright discreto */}
                    <p style={{ fontSize: '0.7rem', opacity: 0.8, fontFamily: "'VT323', monospace" }}>
                        © 2024 PKMN_DEV SYSTEM | HECHO CON REACT & VITE
                    </p>
                </footer>

            </div>
        </div>
    )
}

export default App