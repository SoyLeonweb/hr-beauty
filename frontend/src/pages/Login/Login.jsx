import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Login.module.css'
import logo from '@assets/images/Logo/logofinal.png'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
  </svg>
)

export default function Login() {
  const [tab, setTab] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ nombre: '', email: '', password: '', confirmar: '' })

  const handleLoginSubmit = (e) => { e.preventDefault() /* TODO: backend */ }
  const handleRegisterSubmit = (e) => { e.preventDefault() /* TODO: backend */ }

  return (
    <div className={styles.page}>

      {/* ── Panel izquierdo ── */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <Link to="/">
            <img src={logo} alt="HR Beauty" className={styles.logo} />
          </Link>
          <p className={styles.tagline}>Belleza que cuida de ti.</p>
          <div className={styles.heroCard} />
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "Más de 10.000 mujeres ya cuidan su piel con HR Beauty."
            </p>
            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.ratingVal}>4.9/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel derecho ── */}
      <div className={styles.right}>
        <div className={styles.formBox}>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
              onClick={() => setTab('login')}
            >
              Iniciar sesión
            </button>
            <button
              className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
              onClick={() => setTab('register')}
            >
              Crear cuenta
            </button>
          </div>

          {tab === 'login' ? (
            <>
              <h1 className={styles.heading}>Bienvenida de vuelta</h1>
              <p className={styles.sub}>Accede a tu cuenta para ver tus pedidos y favoritos.</p>

              <button className={styles.googleBtn} type="button">
                <GoogleIcon />
                Continuar con Google
              </button>

              <div className={styles.divider}><span>o</span></div>

              <form onSubmit={handleLoginSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="hola@hrbeauty.com"
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Contraseña</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••••"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.forgotRow}>
                  <button type="button" className={styles.forgot}>¿Olvidaste tu contraseña?</button>
                </div>
                <button type="submit" className={styles.submitBtn}>Iniciar Sesión</button>
              </form>

              <p className={styles.switchText}>
                ¿No tienes cuenta?{' '}
                <button className={styles.switchLink} onClick={() => setTab('register')}>
                  Crear cuenta gratis
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.heading}>Crea tu cuenta</h1>
              <p className={styles.sub}>Únete y descubre productos pensados para ti.</p>

              <button className={styles.googleBtn} type="button">
                <GoogleIcon />
                Continuar con Google
              </button>

              <div className={styles.divider}><span>o</span></div>

              <form onSubmit={handleRegisterSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Tu nombre"
                    value={registerData.nombre}
                    onChange={e => setRegisterData({ ...registerData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="hola@hrbeauty.com"
                    value={registerData.email}
                    onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Contraseña</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="Mínimo 8 caracteres"
                    value={registerData.password}
                    onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Confirmar contraseña</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="Repite tu contraseña"
                    value={registerData.confirmar}
                    onChange={e => setRegisterData({ ...registerData, confirmar: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>Crear Cuenta</button>
              </form>

              <p className={styles.switchText}>
                ¿Ya tienes cuenta?{' '}
                <button className={styles.switchLink} onClick={() => setTab('login')}>
                  Iniciar sesión
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
