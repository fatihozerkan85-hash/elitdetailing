'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/elite-logo.png';

const logoSrc = typeof logoImg === 'string' ? logoImg : logoImg.src;

const announcements = [
  { emoji: '🔥', text: 'Eylül Kampanyası: Seramik Kaplamada %20 İndirim — Kod: ELIT20' },
  { emoji: '⚡', text: 'Yeni Hizmet: Filo Araç Bakım Paketleri — Toplu Randevu Avantajı' },
  { emoji: '🎁', text: 'İç+Dış Yıkama Al 1 Öde — Eylül Sonuna Kadar Geçerli' },
  { emoji: '🏆', text: 'Elit Detailing, 2024 Türkiyenin En İyi Detailing Merkezi Ödülünü Aldı' },
  { emoji: '📱', text: 'Mobil Uygulamamızı İndirin, İlk Randevunuzda %10 İndirim Kazanın' },
];

const campaigns = [
  { id: 1, tag: 'EYLÜL KAMPANYASI', title: 'Seramik Kaplama', highlight: '%20 İndirim', desc: '9H sertliğinde seramik kaplama ile aracınıza 3–5 yıl tam koruma. Sınırlı kontenjan!', cta: 'Hemen Randevu Al', code: 'Kod: ELIT20', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=600&fit=crop&auto=format', accent: '#C9A84C' },
  { id: 2, tag: 'ÖZEL TEKLİF', title: 'Premium İç-Dış Yıkama', highlight: '2 Al 1 Öde', desc: 'El yıkama, buharlı temizlik ve deri bakımı dahil komple detailing paketi.', cta: 'Paketi İncele', code: 'Eylül Sonuna Kadar', image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1400&h=600&fit=crop&auto=format', accent: '#E8C96A' },
  { id: 3, tag: 'YENİ HİZMET', title: 'PPF Film Kaplama', highlight: 'Ücretsiz Kenar Koruma', desc: 'Paint Protection Film ile boyayı çizik ve taş izlerine karşı tam kalkan.', cta: 'Detayları Gör', code: 'Elit Pakete Özel', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&h=600&fit=crop&auto=format', accent: '#C9A84C' },
];

const services = [
  { id: 1, title: 'Premium Oto Yıkama', subtitle: 'PREMIUM · EXCLUSIVE', price: '1.250 ₺', duration: '45 dk', tag: 'En Popüler', icon: '/services/premium-oto-yikama.png' },
  { id: 2, title: 'Lastik Değişimi & Balans', subtitle: '', price: '1.850 ₺', duration: '60 dk', tag: '', icon: '/services/lastik-balans.png' },
  { id: 3, title: 'Oto Kuaför & Detailing', subtitle: '', price: '950 ₺', duration: '30 dk', tag: '', icon: '/services/oto-kuafor-detailing.png' },
  { id: 4, title: 'Detaylı İç-Dış Yıkama', subtitle: 'FULL DETAILING', price: '2.750 ₺', duration: '90 dk', tag: 'Premium', icon: '/services/detayli-ic-dis-yikama.png' },
  { id: 6, title: 'Seramik Kaplama', subtitle: 'CERAMIC PRO', price: '8.500 ₺', duration: '240 dk', tag: 'Lüks', icon: '/services/seramik-kaplama.png' },
  { id: 7, title: 'Acil Yol Yardımı', subtitle: '7/24', price: '2.200 ₺', duration: 'Anında', tag: '7/24', icon: '/services/acil-yol-yardim.png' },
  { id: 8, title: 'PPF Film Kaplama', subtitle: 'PAINT PROTECTION', price: '12.000 ₺', duration: '360 dk', tag: 'Elit', icon: '/services/ppf-film-kaplama.png' },
];

const navLinks = ['Anasayfa', 'Hizmetler', 'Hakkımızda', 'İletişim'];

export default function Home() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const { user, logout } = useAuth();
  const [activeService, setActiveService] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(0);
  const [campaignPaused, setCampaignPaused] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (campaignPaused) return;
    const t = setInterval(() => setActiveCampaign(p => (p + 1) % campaigns.length), 5000);
    return () => clearInterval(t);
  }, [campaignPaused]);

  useEffect(() => {
    const close = () => { if (window.innerWidth > 900) setNavOpen(false); };
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  const scrollTo = (id: string) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navTarget = (l: string) => (l === 'Anasayfa' ? 'hero' : l === 'Hizmetler' ? 'services' : l === 'Hakkımızda' ? 'about' : 'contact');

  return (
    <div className="home-page" style={{ background: '#080808', minHeight: '100vh', color: '#f0e6c8' }}>
      <nav className="site-nav">
        <div className="site-nav-brand" onClick={() => scrollTo('hero')}>
          <img src={logoSrc} alt="Elit Detailing" className="site-nav-logo" />
          <div className="site-nav-wordmark">
            <div className="font-cinzel text-gold" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.22em', lineHeight: 1 }}>ELIT</div>
            <div style={{ fontSize: 13, letterSpacing: '0.32em', color: 'rgba(201,168,76,0.5)', fontFamily: 'Raleway, sans-serif', fontWeight: 600, marginTop: 2 }}>DETAILING</div>
          </div>
        </div>
        <div className="site-nav-links">
          {navLinks.map(l => (
            <button key={l} type="button" className="site-nav-link" onClick={() => scrollTo(navTarget(l))}>{l}</button>
          ))}
        </div>
        <div className="site-nav-actions">
          {user ? (
            <div style={{ position: 'relative' }}>
              <button type="button" className="site-nav-user" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="site-nav-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="site-nav-user-copy">
                  <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.55)', fontFamily: 'Raleway, sans-serif', letterSpacing: '0.1em' }}>HOŞGELDİN</div>
                  <div className="font-display text-gold" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{user.name} {user.surname}</div>
                </div>
                <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: 10 }}>{userMenuOpen ? '▲' : '▼'}</span>
              </button>
              {userMenuOpen && (
                <div className="site-nav-dropdown">
                  <button type="button" onClick={() => { setUserMenuOpen(false); navigate('/dashboard'); }}>Hesabım</button>
                  <button type="button" onClick={() => { setUserMenuOpen(false); logout(); }}>Çıkış Yap</button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-gold site-nav-login" type="button" onClick={() => navigate('/login')}>Giriş Yap</button>
          )}
          <button
            type="button"
            className={`site-nav-burger${navOpen ? ' is-open' : ''}`}
            aria-label={navOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={navOpen}
            onClick={() => setNavOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
        {navOpen ? (
          <div className="site-nav-panel">
            {navLinks.map(l => (
              <button key={l} type="button" className="site-nav-panel-link" onClick={() => scrollTo(navTarget(l))}>{l}</button>
            ))}
          </div>
        ) : null}
      </nav>

      <div className="home-ticker">
        <div className="home-ticker-fade home-ticker-fade-l"/>
        <div className="home-ticker-fade home-ticker-fade-r"/>
        <div className="ticker-track">
          {[...announcements, ...announcements].map((a, i) => (
            <span key={i} className="home-ticker-item">
              <span style={{ fontSize: 16 }}>{a.emoji}</span>
              <span className="home-ticker-text">{a.text}</span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: 12, marginLeft: 16 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="campaign-banner" onMouseEnter={() => setCampaignPaused(true)} onMouseLeave={() => setCampaignPaused(false)}>
        {campaigns.map((c, i) => (
          <div key={c.id} className={`campaign-slide${activeCampaign === i ? ' is-active' : ''}`}>
            <div className="campaign-copy">
              <div>
                <div className="campaign-tag" style={{ background: `linear-gradient(90deg, ${c.accent}, #8B6914)` }}>✦ {c.tag}</div>
                <div className="font-display campaign-title">{c.title}</div>
                <div className="font-display campaign-highlight">{c.highlight}</div>
                <p className="campaign-desc">{c.desc}</p>
                <div className="campaign-cta-row">
                  <button className="btn-gold" onClick={() => navigate('/login')} style={{ padding: '12px 28px', fontSize: 13, fontWeight: 700, borderRadius: 8, letterSpacing: '0.06em', fontFamily: 'Barlow Condensed, sans-serif' }}>{c.cta} →</button>
                  <span className="campaign-code">{c.code}</span>
                </div>
                <div style={{ marginTop: 32, height: 3, width: 60, borderRadius: 2, background: `linear-gradient(90deg, ${c.accent}, transparent)` }}/>
              </div>
            </div>
            <div className="campaign-media">
              <div className="campaign-photo" style={{ backgroundImage: `url(${c.image})`, transform: activeCampaign === i ? 'scale(1.05)' : 'scale(1)' }}/>
              <div className="campaign-media-fade"/>
              <div className="campaign-count">{String(i+1).padStart(2,'0')} / {String(campaigns.length).padStart(2,'0')}</div>
            </div>
          </div>
        ))}
        {([{dir:-1,side:'left'},{dir:1,side:'right'}] as const).map(({dir,side}) => (
          <button key={side} className={`campaign-arrow campaign-arrow-${side}`} type="button" onClick={() => setActiveCampaign(p => (p+dir+campaigns.length)%campaigns.length)}>{dir===-1?'‹':'›'}</button>
        ))}
        <div className="campaign-dots">
          {campaigns.map((_,i)=>(<button key={i} type="button" onClick={()=>setActiveCampaign(i)} style={{ width: activeCampaign===i?26:8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', background: activeCampaign===i?'#C9A84C':'rgba(139,105,20,0.25)', transition: 'all 0.35s ease', padding: 0 }}/>))}
        </div>
        <div className="campaign-bar"/>
      </div>

      <section id="hero" className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-veil" />
        <div className="home-hero-inner">
          <div className="home-hero-kicker">✦ &nbsp; PREMİUM OTOMOTİV HİZMETLERİ &nbsp; ✦</div>
          <div className="home-hero-brand">
            <img src={logoSrc} alt="Elit Detailing" className="home-hero-logo" />
            <div className="home-hero-titles">
              <h1 className="font-display home-hero-h1">Elit</h1>
              <h2 className="font-display home-hero-h2">Detailing</h2>
            </div>
          </div>
          <div className="gold-line" style={{ width: 180, margin: '0 auto 36px' }} />
          <p className="home-hero-lead">Aracınız bir sanat eserine dönüşmeyi hak ediyor. Profesyonel detailing, seramik kaplama ve premium bakım hizmetleriyle fark yaratıyoruz.</p>
          <div className="home-hero-actions">
            <button className="btn-gold" onClick={() => scrollTo('services')} style={{ padding: '15px 42px', fontSize: 13, letterSpacing: '0.1em', borderRadius: 2, fontFamily: 'Raleway, sans-serif', fontWeight: 700 }}>Hizmetleri Keşfet</button>
            <button className="btn-outline-gold" onClick={() => user ? scrollTo('services') : navigate('/login')} style={{ padding: '15px 42px', fontSize: 13, letterSpacing: '0.1em', borderRadius: 2, fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>{user ? 'Randevu Al' : 'Giriş Yap'}</button>
          </div>
        </div>
        <div className="home-hero-scroll">
          <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(201,168,76,0.4)', fontFamily: 'Raleway, sans-serif', fontWeight: 500 }}>KAYDIRIN</div>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, rgba(201,168,76,0.55), transparent)', animation: 'pulse 2s ease-in-out infinite' }} />
        </div>
      </section>

      <section className="home-stats">
        <div className="home-stats-grid">
          {[{num:'2.500+',label:'Mutlu Müşteri'},{num:'8 Yıl',label:'Deneyim'},{num:'15+',label:'Uzman Teknisyen'},{num:'%100',label:'Memnuniyet'}].map((s)=>(
            <div key={s.label} className="home-stat">
              <div className="font-display text-gold" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{s.num}</div>
              <div className="home-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="home-services">
        <div className="home-services-inner">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.6)', marginBottom: 16, fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>✦ &nbsp; HİZMETLERİMİZ &nbsp; ✦</div>
            <h2 className="font-display text-gold-gradient" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)', fontWeight: 700, marginBottom: 16 }}>Premium Bakım Paketleri</h2>
            <div className="gold-line" style={{ width: 120, margin: '0 auto' }} />
          </div>
          <div className="home-services-list">
            {services.map(svc => (
              <div key={svc.id} className={`service-row${activeService===svc.id?' is-active':''}`} onMouseEnter={()=>setActiveService(svc.id)} onMouseLeave={()=>setActiveService(null)}>
                <div className="service-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={svc.icon} alt="" width={60} height={60} />
                </div>
                <div className="service-copy">
                  <div className="service-title-row">
                    <span className="font-display service-title">{svc.title}</span>
                    {svc.subtitle && svc.subtitle.split(/[·•]/).map(t=>t.trim()).filter(Boolean).map(t=>(<span key={t} className="service-chip">{t}</span>))}
                  </div>
                  <div className="service-meta">
                    <span className="font-display service-price">{svc.price}</span>
                    <span className="service-duration">⏱ {svc.duration}</span>
                  </div>
                </div>
                <button className="btn-gold service-select" type="button" onClick={()=>navigate(svc.id===7?'/yol-yardim':'/login')}>Seç →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="home-about">
        <div className="home-about-grid">
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.6)', marginBottom: 16, fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>✦ &nbsp; HAKKIMIZDA</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, marginBottom: 24, lineHeight: 1.15 }}><span className="text-gold-gradient">Mükemmelliği</span><br /><span style={{ color: '#f0e6c8', fontStyle: 'italic', fontWeight: 400 }}>Tanımlıyoruz</span></h2>
            <div className="gold-line" style={{ width: 80, marginBottom: 28 }} />
            <p className="home-about-p">8 yılı aşkın deneyimimizle İstanbulun en prestijli araç bakım merkezi olarak hizmet veriyoruz.</p>
            <p className="home-about-p" style={{ marginBottom: 36 }}>Ceramic Pro sertifikalı ekibimiz, dünya standartlarında ürünler ve özel tekniklerle aracınıza değer katıyor.</p>
            <div className="home-about-points">
              {['Sertifikalı Ürünler','Uzman Teknisyen','Garanti Hizmeti','7/24 Destek'].map(label=>(<div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#C9A84C', fontSize: 8 }}>◆</span><span style={{ fontSize: 13, fontFamily: 'Raleway, sans-serif', fontWeight: 500, color: 'rgba(240,230,200,0.75)', letterSpacing: '0.04em' }}>{label}</span></div>))}
            </div>
          </div>
          <div className="home-about-media">
            <img src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&h=700&fit=crop&auto=format" alt="Elit Detailing workshop" />
            <div className="home-about-badge">
              <div className="font-display" style={{ fontSize: 32, fontWeight: 900, color: '#080808', lineHeight: 1 }}>8+</div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(8,8,8,0.65)', fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>YIL DENEYİM</div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div style={{ fontSize: 11, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.55)', marginBottom: 20, fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>✦ &nbsp; RANDEVU</div>
        <h2 className="font-display text-gold-gradient" style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 18 }}>Aracınız için En İyi Bakımı Seçin</h2>
        <p className="home-cta-lead">Online randevu alın, premium detailing deneyimini yaşayın.</p>
        <button className="btn-gold" onClick={()=>user?scrollTo('services'):navigate('/login')} style={{ padding: '16px 52px', fontSize: 13, letterSpacing: '0.1em', borderRadius: 2, fontFamily: 'Raleway, sans-serif', fontWeight: 700 }}>Hemen Randevu Al</button>
      </section>

      <section id="contact" className="home-contact">
        <div className="home-contact-grid">
          {[{icon:'☎',label:'Telefon',value:'+90 (212) 555 0123'},{icon:'✉',label:'E-Posta',value:'info@elitedetailing.com.tr'},{icon:'⊙',label:'Adres',value:'Levent, İstanbul'}].map(c=>(
            <div key={c.label}>
              <div style={{ fontSize: 22, color: '#C9A84C', marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(201,168,76,0.55)', marginBottom: 8, fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>{c.label.toUpperCase()}</div>
              <div style={{ fontSize: 14, color: 'rgba(240,230,200,0.65)', fontFamily: 'Inter, sans-serif', fontWeight: 400, wordBreak: 'break-word' }}>{c.value}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logoSrc} alt="Elit Detailing" style={{ height: 30, filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.3))' }} />
            <span className="font-cinzel text-gold" style={{ fontSize: 11, letterSpacing: '0.2em' }}>ELIT DETAILING</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(240,230,200,0.3)', fontFamily: 'Inter, sans-serif' }}>© 2026 Elit Detailing. Tüm hakları saklıdır.</div>
        </div>
      </footer>

      <style>{`
        .home-page { overflow-x: hidden; }
        .site-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 0 2.5rem; height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 16px; background: rgba(8,8,8,0.94); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(201,168,76,0.18); }
        .site-nav-brand { display: flex; align-items: center; gap: 14px; cursor: pointer; min-width: 0; }
        .site-nav-logo { height: 56px; object-fit: contain; filter: drop-shadow(0 0 12px rgba(201,168,76,0.45)); flex-shrink: 0; }
        .site-nav-links { display: flex; gap: 40px; }
        .site-nav-link { background: none; border: none; color: rgba(240,230,200,0.72); cursor: pointer; font-family: Raleway, sans-serif; font-weight: 600; font-size: 16px; letter-spacing: 0.08em; padding: 4px 0; }
        .site-nav-link:hover { color: #C9A84C; }
        .site-nav-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .site-nav-login { padding: 8px 22px; font-size: 13px; letter-spacing: 0.1em; border-radius: 2px; font-family: Raleway, sans-serif; font-weight: 700; }
        .site-nav-user { display: flex; align-items: center; gap: 10px; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.25); border-radius: 3px; padding: 8px 16px; cursor: pointer; }
        .site-nav-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #C9A84C, #8B6914); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #080808; font-family: Raleway, sans-serif; }
        .site-nav-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #111; border: 1px solid rgba(201,168,76,0.25); border-radius: 3px; min-width: 160px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.6); z-index: 120; }
        .site-nav-dropdown button { display: block; width: 100%; padding: 12px 16px; background: none; border: none; text-align: left; color: rgba(240,230,200,0.75); font-size: 13px; font-family: Inter, sans-serif; cursor: pointer; }
        .site-nav-dropdown button + button { border-top: 1px solid rgba(201,168,76,0.1); color: rgba(201,168,76,0.7); }
        .site-nav-burger { display: none; width: 42px; height: 42px; padding: 10px 9px; background: transparent; border: 1px solid rgba(201,168,76,0.35); border-radius: 4px; cursor: pointer; flex-direction: column; justify-content: center; gap: 6px; }
        .site-nav-burger span { display: block; width: 100%; height: 2px; background: #C9A84C; border-radius: 1px; transition: transform 0.2s, opacity 0.2s; }
        .site-nav-burger.is-open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .site-nav-burger.is-open span:nth-child(2) { opacity: 0; }
        .site-nav-burger.is-open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
        .site-nav-panel { display: none; }

        .home-ticker { position: fixed; top: 76px; left: 0; right: 0; z-index: 99; background: linear-gradient(90deg, #0d0a04, #1a1205, #0d0a04); border-bottom: 1px solid rgba(201,168,76,0.3); height: 48px; overflow: hidden; display: flex; align-items: center; }
        .home-ticker-fade { position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
        .home-ticker-fade-l { left: 0; background: linear-gradient(90deg, #0d0a04, transparent); }
        .home-ticker-fade-r { right: 0; background: linear-gradient(270deg, #0d0a04, transparent); }
        .home-ticker-item { display: inline-flex; align-items: center; gap: 10px; margin-right: 72px; white-space: nowrap; }
        .home-ticker-text { font-size: 15px; font-family: Barlow, sans-serif; font-weight: 500; color: rgba(240,230,200,0.9); letter-spacing: 0.04em; }
        .ticker-track { display: inline-flex; align-items: center; white-space: nowrap; animation: ticker 36s linear infinite; padding-left: 40px; }
        .ticker-track:hover { animation-play-state: paused; }

        .campaign-banner { margin-top: 124px; position: relative; height: clamp(300px, 42vw, 500px); overflow: hidden; background: #fff; }
        .campaign-slide { position: absolute; inset: 0; display: flex; background: #fff; transition: opacity 0.9s ease; opacity: 0; pointer-events: none; }
        .campaign-slide.is-active { opacity: 1; pointer-events: auto; }
        .campaign-copy { flex: 0 0 48%; display: flex; align-items: center; padding: clamp(28px, 5vw, 72px); position: relative; z-index: 2; background: #fff; }
        .campaign-tag { display: inline-flex; align-items: center; gap: 7px; color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 0.18em; padding: 5px 14px; border-radius: 4px; font-family: Barlow Condensed, sans-serif; margin-bottom: 18px; }
        .campaign-title { font-size: clamp(1.4rem, 3vw, 2.4rem); font-weight: 700; color: #111; line-height: 1.15; margin-bottom: 6px; }
        .campaign-highlight { font-size: clamp(2rem, 5.5vw, 4.4rem); font-weight: 900; line-height: 1; margin-bottom: 18px; background: linear-gradient(135deg, #C9A84C, #8B6914); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .campaign-desc { font-size: clamp(12px, 1.3vw, 14px); line-height: 1.75; color: #555; margin-bottom: 28px; font-family: Barlow, sans-serif; max-width: 380px; }
        .campaign-cta-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .campaign-code { font-size: 11px; font-family: Barlow, sans-serif; color: #8B6914; letter-spacing: 0.08em; font-weight: 700; background: rgba(201,168,76,0.12); padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(201,168,76,0.35); }
        .campaign-media { flex: 0 0 52%; position: relative; overflow: hidden; }
        .campaign-photo { position: absolute; inset: 0; background-size: cover; background-position: center; filter: brightness(0.88) saturate(0.9); transition: transform 6s ease; }
        .campaign-media-fade { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.15) 35%, transparent 100%); }
        .campaign-count { position: absolute; bottom: 20px; right: 24px; font-size: 11px; font-family: Barlow Condensed, sans-serif; color: rgba(255,255,255,0.7); letter-spacing: 0.12em; background: rgba(0,0,0,0.35); backdrop-filter: blur(6px); padding: 4px 10px; border-radius: 4px; }
        .campaign-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; border-radius: 50%; background: rgba(201,168,76,0.15); border: 1.5px solid rgba(201,168,76,0.5); color: #8B6914; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; line-height: 1; }
        .campaign-arrow-left { left: 16px; }
        .campaign-arrow-right { right: 16px; }
        .campaign-dots { position: absolute; bottom: 18px; left: clamp(28px, 5vw, 72px); display: flex; gap: 8px; z-index: 10; }
        .campaign-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #C9A84C 0%, #E8C96A 50%, #8B6914 100%); }

        .home-hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .home-hero-bg { position: absolute; inset: 0; background-image: url(https://images.unsplash.com/photo-1493238792000-8113da705763?w=1920&h=1080&fit=crop&auto=format); background-size: cover; background-position: center; filter: brightness(0.22); }
        .home-hero-veil { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, rgba(8,8,8,0.65) 70%); }
        .home-hero-inner { position: relative; text-align: center; padding: 0 1.25rem; }
        .home-hero-kicker { font-size: 11px; letter-spacing: 0.45em; color: rgba(201,168,76,0.65); margin-bottom: 32px; font-family: Raleway, sans-serif; font-weight: 500; }
        .home-hero-brand { display: flex; align-items: center; justify-content: center; gap: 28px; margin-bottom: 12px; flex-wrap: wrap; }
        .home-hero-logo { width: clamp(120px, 17.5vw, 228px); height: clamp(120px, 17.5vw, 228px); object-fit: contain; filter: drop-shadow(0 0 32px rgba(201,168,76,0.65)); }
        .home-hero-titles { text-align: left; }
        .home-hero-h1 { font-size: clamp(2.6rem, 8vw, 7rem); font-weight: 900; line-height: 0.92; margin: 0 0 4px; background: linear-gradient(135deg, #E8C96A 0%, #C9A84C 50%, #9A7420 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .home-hero-h2 { font-size: clamp(1.3rem, 3.8vw, 3.2rem); font-weight: 400; font-style: italic; letter-spacing: 0.22em; color: rgba(240,230,200,0.85); margin: 0; }
        .home-hero-lead { font-size: 15px; line-height: 1.85; color: rgba(240,230,200,0.62); max-width: 520px; margin: 0 auto 48px; font-family: Inter, sans-serif; font-weight: 300; }
        .home-hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .home-hero-scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; }

        .home-stats { background: #111; border-top: 1px solid rgba(201,168,76,0.18); border-bottom: 1px solid rgba(201,168,76,0.18); padding: 32px 1rem; }
        .home-stats-grid { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; }
        .home-stat { padding: 16px 8px; border-right: 1px solid rgba(201,168,76,0.12); }
        .home-stat:last-child { border-right: none; }
        .home-stat-label { font-size: 11px; letter-spacing: 0.2em; color: rgba(240,230,200,0.45); font-family: Raleway, sans-serif; font-weight: 500; }

        .home-services { padding: 100px 2rem; }
        .home-services-inner { max-width: 1100px; margin: 0 auto; }
        .home-services-list { display: flex; flex-direction: column; gap: 12px; }
        .service-row { display: flex; align-items: center; gap: 18px; background: #141414; border: 1px solid rgba(201,168,76,0.12); border-radius: 14px; padding: 18px 20px; cursor: pointer; transition: all 0.25s ease; }
        .service-row.is-active { background: #181818; border-color: rgba(201,168,76,0.45); box-shadow: 0 8px 32px rgba(201,168,76,0.1); }
        .service-icon { width: 60px; height: 60px; flex-shrink: 0; border-radius: 50%; overflow: hidden; }
        .service-icon img { width: 60px; height: 60px; object-fit: cover; }
        .service-copy { flex: 1; min-width: 0; }
        .service-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; }
        .service-title { font-size: 16px; font-weight: 700; color: #f0e6c8; }
        .service-chip { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; background: linear-gradient(135deg, #C9A84C, #8B6914); color: #080808; padding: 2px 8px; border-radius: 4px; font-family: Barlow Condensed, sans-serif; }
        .service-meta { display: flex; align-items: baseline; gap: 12px; }
        .service-price { font-size: 20px; font-weight: 800; color: #C9A84C; }
        .service-duration { font-size: 12px; color: rgba(201,168,76,0.55); font-family: Barlow, sans-serif; }
        .service-select { padding: 11px 22px; font-size: 13px; font-weight: 700; border-radius: 10px; letter-spacing: 0.04em; font-family: Barlow Condensed, sans-serif; flex-shrink: 0; white-space: nowrap; }

        .home-about { padding: 100px 2rem; background: #0d0d0d; border-top: 1px solid rgba(201,168,76,0.1); }
        .home-about-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .home-about-p { font-size: 15px; line-height: 1.9; color: rgba(240,230,200,0.6); margin-bottom: 18px; font-family: Inter, sans-serif; font-weight: 300; }
        .home-about-points { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .home-about-media { position: relative; }
        .home-about-media img { width: 100%; border-radius: 4px; border: 1px solid rgba(201,168,76,0.18); filter: brightness(0.82); }
        .home-about-badge { position: absolute; bottom: -20px; left: -20px; background: linear-gradient(135deg, #C9A84C, #8B6914); padding: 20px 28px; border-radius: 4px; }

        .home-cta { padding: 88px 1.5rem; text-align: center; background: linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(8,8,8,0) 100%); border-top: 1px solid rgba(201,168,76,0.12); }
        .home-cta-lead { font-size: 15px; color: rgba(240,230,200,0.5); max-width: 460px; margin: 0 auto 44px; font-family: Inter, sans-serif; font-weight: 300; line-height: 1.8; }
        .home-contact { padding: 80px 1.5rem; background: #0a0a0a; border-top: 1px solid rgba(201,168,76,0.08); }
        .home-contact-grid { max-width: 840px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; text-align: center; }
        .home-footer { background: #080808; border-top: 1px solid rgba(201,168,76,0.12); padding: 28px 2.5rem; }
        .home-footer-inner { max-width: 1000px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }

        @media (max-width: 900px) {
          .site-nav { padding: 0 1rem; }
          .site-nav-links { display: none; }
          .site-nav-burger { display: flex; }
          .site-nav-panel { display: flex; flex-direction: column; position: absolute; top: 76px; left: 0; right: 0; background: rgba(8,8,8,0.98); border-bottom: 1px solid rgba(201,168,76,0.22); padding: 8px 0 12px; z-index: 101; }
          .site-nav-panel-link { background: none; border: none; color: rgba(240,230,200,0.85); font-family: Raleway, sans-serif; font-weight: 600; font-size: 16px; letter-spacing: 0.08em; text-align: left; padding: 14px 1.25rem; cursor: pointer; width: 100%; }
          .site-nav-panel-link:hover { color: #C9A84C; background: rgba(201,168,76,0.06); }
          .site-nav-wordmark { display: none; }
          .site-nav-logo { height: 48px; }
          .home-ticker { height: 42px; }
          .home-ticker-text { font-size: 13px; }
          .home-ticker-fade { width: 36px; }
          .campaign-banner { height: auto; min-height: 0; }
          .campaign-slide { display: none; position: relative; inset: auto; flex-direction: column; opacity: 1; }
          .campaign-slide.is-active { display: flex; }
          .campaign-copy { flex: none; width: 100%; padding: 28px 20px 20px; }
          .campaign-media { flex: none; width: 100%; height: 220px; }
          .campaign-photo {
            filter: brightness(0.72) saturate(0.78) contrast(0.94);
          }
          .campaign-media-fade {
            background:
              linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.78) 12%, rgba(255,255,255,0.32) 34%, rgba(255,255,255,0.1) 52%, transparent 72%),
              linear-gradient(180deg, transparent 42%, rgba(8,8,8,0.28) 78%, rgba(8,8,8,0.55) 100%),
              linear-gradient(90deg, rgba(255,255,255,0.4) 0%, transparent 38%, rgba(8,8,8,0.22) 100%);
            box-shadow: inset 0 0 80px rgba(8,8,8,0.32);
            pointer-events: none;
          }
          .campaign-arrow { width: 32px; height: 32px; }
          .campaign-arrow-left { left: 8px; }
          .campaign-arrow-right { right: 8px; }
          .campaign-dots { left: 20px; bottom: 12px; }
          .home-hero { min-height: 78vh; }
          .home-hero-kicker { letter-spacing: 0.18em; font-size: 10px; padding: 0 8px; }
          .home-hero-titles { text-align: center; }
          .home-hero-brand { gap: 12px; }
          .home-hero-actions .btn-gold, .home-hero-actions .btn-outline-gold { width: min(100%, 280px); }
          .home-hero-scroll { display: none; }
          .home-stats-grid { grid-template-columns: 1fr 1fr; }
          .home-stat { border-right: none; border-bottom: 1px solid rgba(201,168,76,0.12); }
          .home-stat:nth-child(odd) { border-right: 1px solid rgba(201,168,76,0.12); }
          .home-stat:nth-last-child(-n+2) { border-bottom: none; }
          .home-services { padding: 64px 1rem; }
          .service-row { flex-wrap: wrap; gap: 12px; padding: 14px; }
          .service-icon, .service-icon img { width: 52px; height: 52px; }
          .service-select { margin-left: auto; }
          .home-about { padding: 64px 1.25rem 80px; }
          .home-about-grid { grid-template-columns: 1fr; gap: 40px; }
          .home-about-badge { left: 12px; bottom: 12px; }
          .home-about-points { grid-template-columns: 1fr; }
          .home-cta { padding: 56px 1.25rem; }
          .home-cta .btn-gold { width: min(100%, 280px); }
          .home-contact-grid { grid-template-columns: 1fr; gap: 28px; }
          .home-footer { padding: 24px 1.25rem; }
          .home-footer-inner { justify-content: center; text-align: center; }
        }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
