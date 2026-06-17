import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab]           = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const [loginForm, setLoginForm]       = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (!loginForm.email || !loginForm.password) { setError('Completa todos los campos.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/') }, 900)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    if (!registerForm.name || !registerForm.email || !registerForm.password) { setError('Completa todos los campos.'); return }
    if (registerForm.password !== registerForm.confirm) { setError('Las contraseñas no coinciden.'); return }
    if (registerForm.password.length < 6) { setError('La contraseña debe tener mínimo 6 caracteres.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/') }, 900)
  }

  const switchTab = (t) => { setTab(t); setError('') }

  return (
    <div className={styles.page}>

      {/* Panel decorativo izquierdo */}
      <div className={styles.panel}>
        <div className={styles.panelOverlay} />
        <div className={styles.panelContent}>
          <span className={styles.panelBrand}>HR Beauty</span>
          <h2 className={styles.panelTitle}>Tu rutina de belleza,<br />en un solo lugar.</h2>
          <p className={styles.panelSub}>Skincare, maquillaje y más. Productos originales con envío a toda Colombia.</p>
          <div className={styles.panelStats}>
            <div className={styles.panelStat}><strong>+10k</strong><span>clientas</span></div>
            <div className={styles.panelStat}><strong>4.9★</strong><span>valoración</span></div>
            <div className={styles.panelStat}><strong>100%</strong><span>originales</span></div>
          </div>
        </div>
      </div>

      {/* Formulario derecho */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>

          <Link to="/" className={styles.logoLink}>HR Beauty</Link>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`} onClick={() => switchTab('login')}>Iniciar sesión</button>
            <button className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`} onClick={() => switchTab('register')}>Crear cuenta</button>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          {tab === 'login' && (
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.field}>
                <label className={styles.label}>Correo electrónico</label>
                <input className={styles.input} type="email" placeholder="tu@correo.com"
                  value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Contraseña</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(v => !v)}>
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div className={styles.forgotRow}>
                <a href="#" className={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
              </div>
              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
              <p className={styles.switchText}>
                ¿No tienes cuenta?{' '}
                <button type="button" className={styles.switchLink} onClick={() => switchTab('register')}>Crear cuenta gratis</button>
              </p>
            </form>
          )}

          {tab === 'register' && (
            <form className={styles.form} onSubmit={handleRegister}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre completo</label>
                <input className={styles.input} type="text" placeholder="Tu nombre"
                  value={registerForm.name} onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Correo electrónico</label>
                <input className={styles.input} type="email" placeholder="tu@correo.com"
                  value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Contraseña</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} type={showPass ? 'text' : 'password'} placeholder="Mínimo 6 caracteres"
                    value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(v => !v)}>
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Confirmar contraseña</label>
                <input className={styles.input} type={showPass ? 'text' : 'password'} placeholder="Repite tu contraseña"
                  value={registerForm.confirm} onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })} />
              </div>
              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
              <p className={styles.switchText}>
                ¿Ya tienes cuenta?{' '}
                <button type="button" className={styles.switchLink} onClick={() => switchTab('login')}>Iniciar sesión</button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
