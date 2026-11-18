import React, { useState, useEffect, useRef } from 'react'

const Typewriter = ({ text, speed = 150 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // 1. Detectar cuándo el elemento entra en pantalla (scroll)
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Solo necesitamos detectarlo una vez
            }
        }, { threshold: 0.5 }); // Se activa cuando el 50% del elemento es visible

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // 2. Lógica de escritura letra por letra
    useEffect(() => {
        if (isVisible && displayedText.length < text.length) {
            typingTimeoutRef.current = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, speed);
        }
        return () => clearTimeout(typingTimeoutRef.current);
    }, [isVisible, displayedText, text, speed]);

    return (
        <span ref={elementRef} style={{ whiteSpace: 'nowrap' }}>
            {displayedText}
            {/* El cursor parpadeante */}
            <span className="cursor-blink"></span>
        </span>
    );
};

// === COMPONENTE BARRA DE HABILIDAD (Espera a ser visible) ===
const SkillBar = ({ name, level, percentage }) => {
    const [isVisible, setIsVisible] = useState(false);
    const barRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Solo se anima una vez
            }
        });

        if (barRef.current) {
            observer.observe(barRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={barRef} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{name}</span>
                <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem', color: '#666', background: '#ddd', padding: '4px', borderRadius: '4px' }}>
                    {level}
                </span>
            </div>
            <div style={{ height: '15px', background: '#e0e0e0', border: '2px solid #000', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    background: 'var(--pkmn-blue)',
                    width: isVisible ? percentage : '0%',
                    transition: 'width 1.5s ease-out'
                }}></div>
            </div>
        </div>
    );
};

// === COMPONENTE APARICIÓN SUAVE ===
const ScrollReveal = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Una vez aparece, se queda
            }
        }, { threshold: 0.2 }); // Se activa al verse el 20%

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(50px)', /* Empieza 50px abajo */
            transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' /* Efecto rebote suave */
        }}>
            {children}
        </div>
    );
};

function App() {
    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const [activeSection, setActiveSection] = useState('game-hero');

    // 2. El Observador que detecta el scroll
    useEffect(() => {
        const sections = document.querySelectorAll('section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // Si la sección es visible al 30% en pantalla, la marcamos como activa
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            threshold: 0.3, // Se activa cuando el 30% de la sección es visible
            rootMargin: "-10% 0px -10% 0px" // Reduce un poco el margen de detección para ser más preciso
        });

        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

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
                        ANGEL_DEV.sav
                    </div>

                    <div style={{ display: 'flex', gap: '5px' }}>

                        <button
                            className={`retro-btn ${activeSection === 'game-hero' ? 'nav-active' : ''}`}
                            onClick={() => scrollTo('game-hero')}>
                            START
                        </button>

                        <button
                            className={`retro-btn ${activeSection === 'profile' ? 'nav-active' : ''}`}
                            onClick={() => scrollTo('profile')}>
                            PERFIL
                        </button>

                        <button
                            /* CAMBIO AQUÍ: Añadimos la condición || activeSection === 'experience' */
                            className={`retro-btn ${(activeSection === 'education' || activeSection === 'experience') ? 'nav-active' : ''}`}
                            onClick={() => scrollTo('education')}>
                            EXP
                        </button>

                        <button
                            className={`retro-btn ${activeSection === 'skills' ? 'nav-active' : ''}`}
                            onClick={() => scrollTo('skills')}>
                            SKILLS
                        </button>

                        <button
                            className={`retro-btn ${activeSection === 'projects' ? 'nav-active' : ''}`}
                            onClick={() => scrollTo('projects')}>
                            MISIONES
                        </button>

                    </div>
                </div>
            </nav>

            {/* 2. HERO SECTION (JUEGO PANTALLA COMPLETA) */}
            {/* <section id="game-hero" className="full-screen-hero">
                <div id="phaser-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'radial-gradient(circle, rgba(20,20,20,1) 0%, rgba(0,0,0,1) 100%)',
                        flexDirection: 'column'
                    }}>
                        <h1 className="crt-text" style={{ color: '#444', textAlign: 'center', marginBottom: '20px' }}>
                            [ SYSTEM READY ]
                        </h1>
                        <p style={{ color: '#666' }}>Waiting for Player Input...</p>
                    </div>
                </div>

                <div className="scroll-indicator" onClick={() => scrollTo('profile')}>
                    <p>SCROLL TO EXPLORE</p>
                    ▼
                </div>
            </section> */}

            <section id="game-hero" className="full-screen-hero" style={{ position: 'relative' }}>
                {/* Fondo con un patrón de rejilla sutil en movimiento */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: '#111',
                    backgroundImage: 'linear-gradient(rgba(50, 255, 50, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(50, 255, 50, 0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    opacity: 0.5,
                    zIndex: 1
                }}></div>

                <div id="phaser-container" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px' }}>

                    {/* Icono de "En Construcción" */}
                    <div style={{ fontSize: '4rem', marginBottom: '20px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}>
                        🚧👾🚧
                    </div>

                    {/* Título con efecto glitch */}
                    <h1 className="crt-text" style={{
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: '30px',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '1.8rem',
                        lineHeight: '1.5',
                        textShadow: '3px 3px 0 #ff0000, -3px -3px 0 #0000ff' /* Efecto 3D anaglifo */
                    }}>
                        [ WORK IN PROGRESS ]
                    </h1>

                    {/* Caja de texto explicativa */}
                    <div className="retro-box" style={{ maxWidth: '600px', background: 'rgba(0,0,0,0.8)', border: '2px solid #fff', color: '#fff', textAlign: 'center' }}>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: '1.4rem', margin: '0 0 15px 0' }}>
                     > SYSTEM MESSAGE:
                        </p>
                        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                            El desarrollador está actualmente farmeando XP y picando código para crear esta zona.
                            <br /><br />
                            <span style={{ color: 'var(--pkmn-yellow)' }}>ETA: PRÓXIMAMENTE™</span>
                        </p>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            Mientras tanto, accede a los datos guardados abajo.
                        </p>
                    </div>
                </div>

                <div className="scroll-indicator" onClick={() => scrollTo('profile')} style={{ zIndex: 3 }}>
                    <p style={{ marginBottom: '10px', background: 'rgba(0,0,0,0.5)', padding: '5px' }}>ACCEDER A LOS DATOS</p>
                    ▼
                </div>
            </section>

            <div style={{
                height: '24px',
                width: '100%',
                /* Patrón de rayas amarillas y negras (Construction Tape) */
                background: 'repeating-linear-gradient(45deg, #ffde00, #ffde00 20px, #111 20px, #111 40px)',
                borderTop: '4px solid #000',
                borderBottom: '4px solid #000',
                position: 'relative',
                zIndex: 25 /* Para que quede por encima de todo */
            }}></div>

            {/* 3. CONTENIDO PRINCIPAL */}
            <div className="container" style={{ position: 'relative', background: 'var(--bg-color)', zIndex: 20, paddingTop: 0 }}>
                {/* --- PERFIL (TRAINER CARD) --- */}
                <section id="profile" style={{ paddingTop: '30px' }}>
                    {/* Contenedor principal sin padding para manejar la cabecera roja */}
                    <ScrollReveal>
                        {/* --- PERFIL (TRAINER CARD) CORREGIDO --- */}
                        <section id="profile" style={{ paddingTop: '100px' }}>
                            <h2 className="section-title" style={{ marginTop: 0 }}>
                               > CARGAR_PERFIL_JUGADOR
                            </h2>

                            <div className="retro-box" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                                {/* CABECERA ROJA */}
                                <div style={{
                                    background: '#cc0000', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #000'
                                }}>
                                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '1rem', textShadow: '2px 2px 0 #000' }}>TRAINER CARD</span>
                                    <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.4rem', fontWeight: 'bold' }}>ID No. 070804</span>
                                </div>

                                {/* CUERPO TARJETA */}
                                <div style={{ display: 'flex', gap: '40px', padding: '30px', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center' }}>

                                    {/* COLUMNA IZQUIERDA: AVATAR */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="sprite-float" style={{
                                            width: '160px', height: '160px', background: '#f0f0f0', border: '4px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', boxShadow: '6px 6px 0 rgba(0,0,0,0.2)'
                                        }}>
                                            <span style={{ fontSize: '4rem' }}>😎</span>
                                        </div>
                                        <div style={{ background: '#222', color: 'white', padding: '8px 15px', fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem', borderRadius: '4px', display: 'inline-block' }}>
                                            JUGADOR 1
                                        </div>
                                    </div>

                                    {/* COLUMNA DERECHA: DATOS + BIO + BOTONES */}
                                    <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>

                                        {/* NOMBRE */}
                                        <h1 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '1.5rem', margin: '0 0 25px 0', color: '#000', lineHeight: '1.5' }}>
                                            <Typewriter text="Ángel García Lopezlira" speed={100} />
                                        </h1>

                                        {/* STATS */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 20px', fontFamily: "'VT323', monospace", fontSize: '1.3rem', marginBottom: '25px' }}>
                                            <strong style={{ color: '#666' }}>CLASE:</strong><span style={{ fontWeight: 'bold' }}>Estudiante de Ingeniería del Software</span>
                                            <strong style={{ color: '#666' }}>NIVEL:</strong><span style={{ color: 'var(--pkmn-blue)', fontWeight: 'bold' }}>Lvl. 21</span>
                                            <strong style={{ color: '#666' }}>SERVER:</strong><span>España (Remote/Hybrid)</span>
                                            <strong style={{ color: '#666' }}>QUEST:</strong>
                                            <span style={{ color: '#28a745', fontWeight: 'bold', animation: 'blink-animation 2s infinite' }}>Open to Work</span>
                                        </div>

                                        {/* BIO BOX */}
                                        <div style={{ background: '#eee', border: '2px dashed #999', padding: '15px', borderRadius: '6px', fontStyle: 'italic', fontSize: '1.1rem', color: '#444', marginBottom: '25px' }}>
                                            "Estudiante de Ingeniería Informática con muchas ganas de aprender y crear soluciones para problemas reales. Apasionado por la tecnología, soy una persona curiosa y dedicada. Capaz de trabajar en equipo y adaptarme a entornos ágiles. Busco un equipo donde desplegar mi código y subir de nivel. 🚀"
                                        </div>

                                        {/* BOTONES (AHORA ABAJO DEL TODO Y ORDENADOS) */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '15px',
                                            flexWrap: 'wrap',
                                            justifyContent: 'flex-start' /* Alineados a la izquierda junto al texto */
                                        }}>
                                            {/* Botón Principal: CV */}
                                            <a href="/cv" style={{ textDecoration: 'none' }}>
                                                <button className="retro-btn" style={{
                                                    background: 'var(--pkmn-yellow)',
                                                    color: '#000',
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    padding: '10px 15px'
                                                }}>
                                                    💾 VER CV
                                                </button>
                                            </a>

                                            {/* LinkedIn */}
                                            <a href="https://linkedin.com/in/TU_USUARIO" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                                <button className="retro-btn" style={{ padding: '10px 15px' }}>LINKEDIN</button>
                                            </a>

                                            {/* GitHub */}
                                            <a href="https://github.com/TU_USUARIO" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                                <button className="retro-btn" style={{ padding: '10px 15px' }}>GITHUB</button>
                                            </a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </section>
                    </ScrollReveal>
                </section>

                {/* --- FORMACIÓN (Logs de Entrenamiento) --- */}
                <section id="education">
                    <h2 className="section-title">> LOGS_DE_ENTRENAMIENTO (FORMACIÓN)</h2>

                    <div style={{ display: 'grid', gap: '25px' }}>

                        {/* ITEM 1: UNIVERSIDAD */}
                        <ScrollReveal>
                            <div className="retro-box" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                                {/* LOGO UCLM */}
                                <div style={{
                                    background: 'var(--pkmn-yellow)',
                                    border: '3px solid #000',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                                    borderRadius: '8px'
                                }}>
                                    <img
                                        src="LogoUCLM.jpg" // Asegúrate que esta imagen existe
                                        alt="Logo UCLM"
                                        style={{
                                            width: '70%',
                                            height: '70%',
                                            objectFit: 'contain',
                                            mixBlendMode: 'multiply',
                                            filter: 'grayscale(100%) contrast(150%)'
                                        }}
                                    />
                                </div>

                                {/* TEXTO UCLM */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'Press Start 2P', cursive" }}>Grado en Ingeniería Informática</h3>
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
                                            2022-2026
                                        </span>
                                    </div>

                                    <h4 style={{ margin: '0 0 10px 0', color: '#444', fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }}>
                                        Universidad de Castilla-La Mancha
                                    </h4>

                                    <ul style={{ paddingLeft: '20px', margin: 0, color: '#222', fontSize: '1rem', listStyleType: 'square' }}>
                                        <li style={{ marginBottom: '5px' }}>Especialidad en Ingeniería del Software.</li>
                                    </ul>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* ITEM 2: INSTITUTO (IES BERNARDO DE BALBUENA) */}
                        <ScrollReveal>
                            <div className="retro-box" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                                {/* LOGO INSTITUTO */}
                                <div style={{
                                    background: 'var(--pkmn-yellow)',
                                    border: '3px solid #000',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                                    borderRadius: '8px'
                                }}>
                                    <img
                                        /* ⚠️ AQUÍ PONES LA RUTA DE TU IMAGEN NUEVA */
                                        src="logo_bernardo_balbuena.jpg"
                                        alt="Logo IES Bernardo de Balbuena"
                                        style={{
                                            width: '75%',
                                            height: '75%',
                                            objectFit: 'contain',
                                            mixBlendMode: 'multiply', /* Esto quita el fondo blanco del cuadrado del logo */
                                            filter: 'grayscale(100%) contrast(150%)' /* Efecto retro */
                                        }}
                                    />
                                </div>

                                {/* TEXTO INSTITUTO */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'Press Start 2P', cursive" }}>Bachillerato de Ciencias</h3>
                                        {/* BADGE DE FECHA (Calculada aprox basada en tu inicio de uni) */}
                                        <span style={{
                                            background: '#222',
                                            color: '#fff',
                                            padding: '5px 10px',
                                            fontFamily: "'VT323', monospace",
                                            fontSize: '1rem',
                                            border: '2px solid #000',
                                            borderRadius: '4px'
                                        }}>
                                            2020-2022
                                        </span>
                                    </div>

                                    <h4 style={{ margin: '0 0 10px 0', color: '#444', fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }}>
                                        I.E.S. Bernardo de Balbuena
                                    </h4>

                                    <ul style={{ paddingLeft: '20px', margin: 0, color: '#222', fontSize: '1rem', listStyleType: 'square' }}>
                                        <li style={{ marginBottom: '5px' }}>Itinerario Tecnológico.</li>
                                        <li style={{ marginBottom: '5px' }}>Nota media: 9.</li>
                                    </ul>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* --- EXPERIENCIA (Quest Log) --- */}
                <section id="experience">
                    <h2 className="section-title"> REGISTRO_DE_MISIONES (EXPERIENCIA)</h2>
                    {/* Caja de texto centrada con toque cómico */}
                    <ScrollReveal>
                        <div className="retro-box" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f0f0f0' }}>

                            {/* Imagen del Dinosaurio Pixelado */}
                            <img
                                src="dino.gif"
                                alt="Gameplay del Dinosaurio"
                                style={{
                                    maxWidth: '100%',
                                    width: '350px',
                                    height: 'auto',
                                    imageRendering: 'pixelated',
                                    marginBottom: '25px',
                                    border: '3px solid #000',
                                    backgroundColor: '#fff', /* El fondo blanco del contenedor tapará cualquier imperfección */
                                    display: 'block',        /* Asegura que no tenga márgenes extraños */
                                    margin: '0 auto 25px auto' /* Centrado horizontal */
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
                    </ScrollReveal>
                </section>


                {/* --- COMPETENCIAS DIGITALES (Skill Tree) --- */}
                {/* --- COMPETENCIAS DIGITALES (Skill Tree) --- */}
                <section id="skills">
                    <h2 className="section-title"> ÁRBOL_DE_HABILIDADES</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>

                        {/* Hard Skills (Tech) */}
                        <ScrollReveal>
                            <div className="retro-box">
                                <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginTop: 0, fontFamily: "'Press Start 2P', cursive", fontSize: '1rem' }}>
                                    ACTIVE SKILLS (Tech)
                                </h3>

                                {/* Usamos el nuevo componente inteligente */}
                                <SkillBar name="JavaScript (ES6+)" level="INTERMEDIO" percentage="75%" />
                                <SkillBar name="React / Vite" level="INTERMEDIO" percentage="65%" />
                                <SkillBar name="Node.js / Express" level="BÁSICO" percentage="40%" />
                                <SkillBar name="SQL / Bases de Datos" level="INTERMEDIO" percentage="60%" />

                            </div>
                        </ScrollReveal>

                        {/* Soft Skills (Passive Buffs) */}
                        <ScrollReveal>
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
                        </ScrollReveal>

                    </div>
                </section>

                {/* --- PROYECTOS (Missions) --- */}
                <section id="projects" style={{ paddingBottom: '80px' }}>
                    <h2 className="section-title"> MISIONES_COMPLETADAS (PROYECTOS)</h2>

                    {/* Usamos 'alignItems: start' para que si una tarjeta es más alta, no estire las demás */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>

                        {/* === PROYECTO 1 === */}
                        <ScrollReveal>
                            <div className="retro-box project-card">

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
                        </ScrollReveal>

                        {/* === PROYECTO 2 === */}
                        <ScrollReveal>
                            <div className="retro-box project-card">
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
                        </ScrollReveal>

                        {/* === PROYECTO 3 === */}
                        <ScrollReveal>
                            <div className="retro-box project-card">
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
                        </ScrollReveal>

                        <ScrollReveal>
                            <div className="retro-box project-card">

                                {/* PANTALLA TIPO TERMINAL (BACKEND FOCUS) */}
                                <div style={{
                                    border: '3px solid #000',
                                    background: '#1a1a1a', /* Fondo casi negro */
                                    height: '180px',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    padding: '20px',
                                    position: 'relative',
                                    borderRadius: '4px',
                                    boxShadow: 'inset 0 0 15px rgba(0,255,0,0.1)', /* Resplandor verde hacker sutil */
                                    fontFamily: "'VT323', monospace"
                                }}>
                                    {/* Etiqueta de Arquitectura */}
                                    <div style={{
                                        position: 'absolute', bottom: '10px', right: '10px',
                                        background: '#fff', color: 'black',
                                        padding: '2px 6px',
                                        border: '2px solid black', fontSize: '0.7rem',
                                        fontFamily: "'Press Start 2P', cursive"
                                    }}>
                                        BACKEND ARCH
                                    </div>
                                </div>

                                {/* TÍTULO Y DESCRIPCIÓN */}
                                <h3 style={{ color: '#000', marginTop: 0, fontFamily: "'Press Start 2P', cursive", fontSize: '1rem', lineHeight: '1.5' }}>
                                    ESIMEDIA: Microservices
                                </h3>

                                <p style={{ fontSize: '0.95rem' }}>
                                    Plataforma VOD escalable diseñada con arquitectura de microservicios. Enfoque total en seguridad (RBAC, OWASP), calidad (TDD) y despliegue automatizado.
                                </p>

                                {/* STACK TECNOLÓGICO (DESTACANDO JAVA 21) */}
                                <div style={{ marginBottom: '20px', borderTop: '2px dashed #ccc', paddingTop: '10px' }}>
                                    <span style={{ fontWeight: 'bold', fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem' }}>CORE STACK:</span>
                                    <div style={{ fontSize: '1.1rem', color: '#000', fontFamily: "'VT323', monospace", marginTop: '5px', fontWeight: 'bold' }}>
                                        Java 21 • Spring Boot 3 • Security • Docker • CI/CD
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <a href="ENLACE_AL_REPO_BACKEND" target="_blank" rel="noreferrer" className="retro-btn" style={{ flex: 1, fontSize: '0.8rem', textAlign: 'center' }}>
                                        VER REPO
                                    </a>
                                    {/* Si tienes documentación pública o Swagger, este botón es genial */}
                                    <a href="ENLACE_DOCS_O_SWAGGER" target="_blank" rel="noreferrer" className="retro-btn" style={{ flex: 1, fontSize: '0.8rem', textAlign: 'center', background: '#ddd' }}>
                                        DOCS
                                    </a>
                                </div>

                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer style={{ textAlign: 'center', padding: '40px 0', background: '#cc0000', borderTop: '4px solid #8b0000', color: 'white', marginTop: '60px' }}>

                    <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.9rem', marginBottom: '25px', textShadow: '2px 2px 0 #000' }}>
                        ¿QUIERES GUARDAR LA PARTIDA?
                    </p>

                    <div style={{ background: '#f8f9fa', color: '#000', display: 'inline-block', padding: '10px 20px', border: '4px solid #222', borderRadius: '8px', marginBottom: '25px', boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.5rem', fontWeight: 'bold' }}>
                            ✉️ contacto@email.com
                        </span>
                    </div>

                    {/* LISTA DE ENLACES ACTUALIZADA */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>

                        {/* Añadimos aquí también el CV */}
                        <a href="/cv" className="retro-btn" style={{ textDecoration: 'none', fontSize: '0.7rem', background: '#ffde00', color: '#000' }}>
                            💾 VER CV
                        </a>

                        <a href="https://www.linkedin.com/in/TU_USUARIO" target="_blank" rel="noreferrer" className="retro-btn" style={{ textDecoration: 'none', fontSize: '0.7rem' }}>
                            LINKEDIN
                        </a>

                        <a href="https://github.com/TU_USUARIO" target="_blank" rel="noreferrer" className="retro-btn" style={{ textDecoration: 'none', fontSize: '0.7rem' }}>
                            GITHUB
                        </a>
                    </div>

                    <p style={{ fontSize: '0.7rem', opacity: 0.8, fontFamily: "'VT323', monospace" }}>
                        © 2025 PKMN_DEV SYSTEM
                    </p>
                </footer>
            </div>
        </div>
    )
}

export default App