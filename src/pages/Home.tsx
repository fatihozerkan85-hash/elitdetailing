'use client';
import { useState, useEffect } from 'react';

const announcements = [
  { emoji: '🔥', text: 'Eylül Kampanyası: Seramik Kaplamada %20 İndirim — Kod: ELIT20' },
  { emoji: '⚡', text: 'Yeni Hizmet: Filo Araç Bakım Paketleri — Toplu Randevu Avantajı' },
  { emoji: '🎁', text: 'İç+Dış Yıkama Al 1 Öde — Eylül Sonuna Kadar Geçerli' },
  { emoji: '🏆', text: 'Elite Detailing, 2024 Türkiyenin En İyi Detailing Merkezi Ödülünü Aldı' },
  { emoji: '📱', text: 'Mobil Uygulamamızı İndirin, İlk Randevunuzda %10 İndirim Kazanın' },
];

const campaigns = [
  { id: 1, tag: 'EYLÜL KAMPANYASI', title: 'Seramik Kaplama', highlight: '%20 İndirim', desc: '9H sertliğinde seramik kaplama ile aracınıza 3–5 yıl tam koruma. Sınırlı kontenjan!', cta: 'Hemen Randevu Al', code: 'Kod: ELIT20', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=600&fit=crop&auto=format', accent: '#C9A84C' },
  { id: 2, tag: 'ÖZEL TEKLİF', title: 'Premium İç-Dış Yıkama', highlight: '2 Al 1 Öde', desc: 'El yıkama, buharlı temizlik ve deri bakımı dahil komple detailing paketi.', cta: 'Paketi İncele', code: 'Eylül Sonuna Kadar', image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1400&h=600&fit=crop&auto=format', accent: '#E8C96A' },
  { id: 3, tag: 'YENİ HİZMET', title: 'PPF Film Kaplama', highlight: 'Ücretsiz Kenar Koruma', desc: 'Paint Protection Film ile boyayı çizik ve taş izlerine karşı tam kalkan.', cta: 'Detayları Gör', code: 'Elite Pakete Özel', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&h=600&fit=crop&auto=format', accent: '#C9A84C' },
];

const services = [
  { id: 1, title: 'Premium Oto Yıkama', subtitle: 'PREMIUM · EXCLUSIVE', price: '1.250 ₺', duration: '45 dk', emoji: '🚗' },
  { id: 2, title: 'Lastik Değişimi & Balans', subtitle: '', price: '1.850 ₺', duration: '60 dk', emoji: '🛞' },
  { id: 3, title: 'Aksesuar Montajı', subtitle: '', price: '950 ₺', duration: '30 dk', emoji: '🔧' },
  { id: 4, title: 'Detaylı İç-Dış Bakım', subtitle: 'FULL DETAILING', price: '2.750 ₺', duration: '90 dk', emoji: '✨' },
  { id: 5, title: 'Motor & Mekanik Kontrol', subtitle: '', price: '1.600 ₺', duration: '60 dk', emoji: '⚙️' },
  { id: 6, title: 'Seramik Kaplama', subtitle: 'CERAMIC PRO', price: '8.500 ₺', duration: '240 dk', emoji: '🛡️' },
  { id: 7, title: 'Acil Yol Yardımı', subtitle: '7/24', price: '2.200 ₺', duration: 'Anında', emoji: '🚨' },
  { id: 8, title: 'PPF Film Kaplama', subtitle: 'PAINT PROTECTION', price: '12.000 ₺', duration: '360 dk', emoji: '🎗️' },
];

const navLinks = ['Anasayfa', 'Hizmetler', 'Hakkımızda', 'İletişim'];

export default function Home() {
  const [activeService, setActiveService] = useState<number | null>(null);
  const [activeCampaign, setActiveCampaign] = useState(0);
  const [campaignPaused, setCampaignPaused] = useState(false);

  useEffect(() => {
    if (campaignPaused) return;
    const t = setInterval(() => setActiveCampaign(p => (p + 1) % campaigns.length), 5000);
    return () => clearInterval(t);
  }, [campaignPaused]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f0e6c8' }}>
      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2.5rem', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(8,8,8,0.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,168,76,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, cursor: 'pointer' }} onClick={() => scrollTo('hero')}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#080808', fontFamily: 'Barlow Condensed, sans-serif', boxShadow: '0 0 20px rgba(201,168,76,0.45)' }}>E</div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.22em', lineHeight: 1, fontFamily: 'Barlow Condensed, sans-serif', color: '#C9A84C' }}>ELITE</div>
            <div style={{ fontSize: 13, letterSpacing: '0.32em', color: 'rgba(201,168,76,0.5)', fontFamily: 'Raleway, sans-serif', fontWeight: 600, marginTop: 4 }}>DETAILING</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          {navLinks.map(l => (
            <button key={l} onClick={() => scrollTo(l === 'Anasayfa' ? 'hero' : l === 'Hizmetler' ? 'services' : l === 'Hakkımızda' ? 'about' : 'contact')} style={{ background: 'none', border: 'none', color: 'rgba(240,230,200,0.65)', cursor: 'pointer', fontFamily: 'Raleway, sans-serif', fontWeight: 500, fontSize: 13, letterSpacing: '0.08em', transition: 'color 0.25s', padding: '4px 0' }} onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,230,200,0.65)')}>{l}</button>
          ))}
        </div>
        <button style={{ padding: '10px 26px', fontSize: 12, letterSpacing: '0.1em', borderRadius: 2, fontFamily: 'Raleway, sans-serif', fontWeight: 700, background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)', color: '#080808', border: 'none', cursor: 'pointer' }} onClick={() => scrollTo('contact')}>Randevu Al</button>
      </nav>

      {/* TICKER */}
      <div style={{ position: 'fixed', top: 100, left: 0, right: 0, zIndex: 99, background: 'linear-gradient(90deg, #0d0a04, #1a1205, #0d0a04)', borderBottom: '1px solid rgba(201,168,76,0.3)', height: 38, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, #0d0a04, transparent)', zIndex: 2, pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(270deg, #0d0a04, transparent)', zIndex: 2, pointerEvents: 'none' }}/>
        <div className="ticker-track">
          {[...announcements, ...announcements].map((a, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 64, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 14 }}>{a.emoji}</span>
              <span style={{ fontSize: 12, fontFamily: 'Barlow, sans-serif', fontWeight: 500, color: 'rgba(240,230,200,0.85)', letterSpacing: '0.04em' }}>{a.text}</span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: 10, marginLeft: 16 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* CAMPAIGN SLIDER */}
      <div style={{ marginTop: 138, position: 'relative', height: 'clamp(300px, 42vw, 500px)', overflow: 'hidden', background: '#ffffff' }} onMouseEnter={() => setCampaignPaused(true)} onMouseLeave={() => setCampaignPaused(false)}>
        {campaigns.map((c, i) => (
          <div key={c.id} style={{ position: 'absolute', inset: 0, opacity: activeCampaign === i ? 1 : 0, transition: 'opacity 0.9s ease', pointerEvents: activeCampaign === i ? 'auto' : 'none', background: '#ffffff', display: 'flex' }}>
            <div style={{ flex: '0 0 48%', display: 'flex', alignItems: 'center', padding: 'clamp(28px, 5vw, 72px)', background: '#ffffff', position: 'relative', zIndex: 2 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `linear-gradient(90deg, ${c.accent}, #8B6914)`, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', padding: '5px 14px', borderRadius: 4, fontFamily: 'Barlow Condensed, sans-serif', marginBottom: 18 }}>✦ {c.tag}</div>
                <div style={{ fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', fontWeight: 700, color: '#111', lineHeight: 1.15, marginBottom: 6, fontFamily: 'Barlow Condensed, sans-serif' }}>{c.title}</div>
                <div style={{ fontSize: 'clamp(2rem, 5.5vw, 4.4rem)', fontWeight: 900, lineHeight: 1, marginBottom: 18, background: 'linear-gradient(135deg, #C9A84C, #8B6914)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Barlow Condensed, sans-serif' }}>{c.highlight}</div>
                <p style={{ fontSize: 'clamp(12px, 1.3vw, 14px)', lineHeight: 1.75, color: '#555', marginBottom: 28, fontFamily: 'Barlow, sans-serif', fontWeight: 400, maxWidth: 380 }}>{c.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <button style={{ padding: '12px 28px', fontSize: 13, fontWeight: 700, borderRadius: 8, letterSpacing: '0.06em', fontFamily: 'Barlow Condensed, sans-serif', background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)', color: '#080808', border: 'none', cursor: 'pointer' }} onClick={() => scrollTo('services')}>{c.cta} →</button>
                  <span style={{ fontSize: 11, fontFamily: 'Barlow, sans-serif', color: '#8B6914', letterSpacing: '0.08em', fontWeight: 700, background: 'rgba(201,168,76,0.12)', padding: '5px 12px', borderRadius: 4, border: '1px solid rgba(201,168,76,0.35)' }}>{c.code}</span>
                </div>
              </div>
            </div>
            <div style={{ flex: '0 0 52%', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${c.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.88) saturate(0.9)', transform: activeCampaign === i ? 'scale(1.05)' : 'scale(1)', transition: 'transform 6s ease' }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.15) 35%, transparent 100%)' }}/>
              <div style={{ position: 'absolute', bottom: 20, right: 24, fontSize: 11, fontFamily: 'Barlow Condensed, sans-serif', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: 4 }}>{String(i+1).padStart(2,'0')} / {String(campaigns.length).padStart(2,'0')}</div>
            </div>
          </div>
        ))}
        <button onClick={() => setActiveCampaign(p => (p - 1 + campaigns.length) % campaigns.length)} style={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', width: 38, height: 38, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1.5px solid rgba(201,168,76,0.5)', color: '#8B6914', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, lineHeight: 1 }}>‹</button>
        <button onClick={() => setActiveCampaign(p => (p + 1) % campaigns.length)} style={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', width: 38, height: 38, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1.5px solid rgba(201,168,76,0.5)', color: '#8B6914', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, lineHeight: 1 }}>›</button>
        <div style={{ position: 'absolute', bottom: 18, left: 'clamp(28px, 5vw, 72px)', display: 'flex', gap: 8, alignItems: 'center' }}>
          {campaigns.map((_, i) => (<button key={i} onClick={() => setActiveCampaign(i)} style={{ width: activeCampaign === i ? 26 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', background: activeCampaign === i ? '#C9A84C' : 'rgba(139,105,20,0.25)', transition: 'all 0.35s ease', padding: 0 }}/>))}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #C9A84C 0%, #E8C96A 50%, #8B6914 100%)' }}/>
      </div>

      {/* HERO */}
      <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1493238792000-8113da705763?w=1920&h=1080&fit=crop&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.22)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, rgba(8,8,8,0.65) 70%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 2rem' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.45em', color: 'rgba(201,168,76,0.65)', marginBottom: 32, fontFamily: 'Raleway, sans-serif', fontWeight: 500 }}>✦ &nbsp; PREMİUM OTOMOTİV HİZMETLERİ &nbsp; ✦</div>
          <h1 style={{ fontSize: 'clamp(3.2rem, 8vw, 7rem)', fontWeight: 900, lineHeight: 0.92, marginBottom: 12, background: 'linear-gradient(135deg, #E8C96A 0%, #C9A84C 50%, #9A7420 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Barlow Condensed, sans-serif' }}>Elite Detailing</h1>
          <div style={{ width: 180, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', margin: '0 auto 36px' }} />
          <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(240,230,200,0.62)', maxWidth: 520, margin: '0 auto 48px', fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>Aracınız bir sanat eserine dönüşmeyi hak ediyor. Profesyonel detailing, seramik kaplama ve premium bakım hizmetleriyle fark yaratıyoruz.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ padding: '15px 42px', fontSize: 13, letterSpacing: '0.1em', borderRadius: 2, fontFamily: 'Raleway, sans-serif', fontWeight: 700, background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)', color: '#080808', border: 'none', cursor: 'pointer' }} onClick={() => scrollTo('services')}>Hizmetleri Keşfet</button>
            <button style={{ padding: '15px 42px', fontSize: 13, letterSpacing: '0.1em', borderRadius: 2, fontFamily: 'Raleway, sans-serif', fontWeight: 600, background: 'transparent', color: '#C9A84C', border: '1px solid #C9A84C', cursor: 'pointer' }} onClick={() => scrollTo('contact')}>Randevu Al</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#111111', borderTop: '1px solid rgba(201,168,76,0.18)', borderBottom: '1px solid rgba(201,168,76,0.18)', padding: '32px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center' }}>
          {[{num:'2.500+',label:'Mutlu Müşteri'},{num:'8 Yıl',label:'Deneyim'},{num:'15+',label:'Uzman Teknisyen'},{num:'%100',label:'Memnuniyet'}].map((s,i)=>(
            <div key={s.label} style={{ padding: '16px 8px', borderRight: i<3?'1px solid rgba(201,168,76,0.12)':undefined }}>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 6, color: '#C9A84C', fontFamily: 'Barlow Condensed, sans-serif' }}>{s.num}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(240,230,200,0.45)', fontFamily: 'Raleway, sans-serif', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.6)', marginBottom: 16, fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>✦ &nbsp; HİZMETLERİMİZ &nbsp; ✦</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 700, marginBottom: 16, background: 'linear-gradient(135deg, #E8C96A 0%, #C9A84C 40%, #8B6914 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Barlow Condensed, sans-serif' }}>Premium Bakım Paketleri</h2>
            <div style={{ width: 120, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', margin: '0 auto' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {services.map(svc => (
              <div key={svc.id} onMouseEnter={() => setActiveService(svc.id)} onMouseLeave={() => setActiveService(null)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: activeService === svc.id ? '#181818' : '#141414', border: activeService === svc.id ? '1px solid rgba(201,168,76,0.45)' : '1px solid rgba(201,168,76,0.12)', borderRadius: 14, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: activeService === svc.id ? '0 8px 32px rgba(201,168,76,0.1)' : 'none' }}>
                <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: 14, background: 'linear-gradient(145deg, rgba(201,168,76,0.14) 0%, rgba(201,168,76,0.06) 100%)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{svc.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#f0e6c8', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.01em' }}>{svc.title}</span>
                    {svc.subtitle && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', background: 'linear-gradient(135deg, #C9A84C, #8B6914)', color: '#080808', padding: '2px 8px', borderRadius: 4, fontFamily: 'Barlow Condensed, sans-serif' }}>{svc.subtitle}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#C9A84C', fontFamily: 'Barlow Condensed, sans-serif' }}>{svc.price}</span>
                    <span style={{ fontSize: 12, color: 'rgba(201,168,76,0.55)', fontFamily: 'Barlow, sans-serif' }}>⏱ {svc.duration}</span>
                  </div>
                </div>
                <button onClick={() => scrollTo('contact')} style={{ padding: '11px 22px', fontSize: 13, fontWeight: 700, borderRadius: 10, letterSpacing: '0.04em', fontFamily: 'Barlow Condensed, sans-serif', flexShrink: 0, whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)', color: '#080808', border: 'none', cursor: 'pointer' }}>Seç →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '100px 2rem', background: '#0d0d0d', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.6)', marginBottom: 16, fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>✦ &nbsp; HAKKIMIZDA</div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, marginBottom: 24, lineHeight: 1.15, fontFamily: 'Barlow Condensed, sans-serif' }}><span style={{ background: 'linear-gradient(135deg, #E8C96A 0%, #C9A84C 40%, #8B6914 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Mükemmelliği</span><br /><span style={{ color: '#f0e6c8', fontStyle: 'italic', fontWeight: 400 }}>Tanımlıyoruz</span></h2>
            <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', marginBottom: 28 }} />
            <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(240,230,200,0.6)', marginBottom: 18, fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>8 yılı aşkın deneyimimizle İstanbulun en prestijli araç bakım merkezi olarak hizmet veriyoruz.</p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(240,230,200,0.6)', marginBottom: 36, fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>Ceramic Pro sertifikalı ekibimiz, dünya standartlarında ürünler ve özel tekniklerle aracınıza değer katıyor.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {['Sertifikalı Ürünler','Uzman Teknisyen','Garanti Hizmeti','7/24 Destek'].map(label=>(<div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#C9A84C', fontSize: 8 }}>◆</span><span style={{ fontSize: 13, fontFamily: 'Raleway, sans-serif', fontWeight: 500, color: 'rgba(240,230,200,0.75)', letterSpacing: '0.04em' }}>{label}</span></div>))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&h=700&fit=crop&auto=format" alt="Elite Detailing workshop" style={{ width: '100%', borderRadius: 4, border: '1px solid rgba(201,168,76,0.18)', filter: 'brightness(0.82)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, background: 'linear-gradient(135deg, #C9A84C, #8B6914)', padding: '20px 28px', borderRadius: 4 }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#080808', lineHeight: 1, fontFamily: 'Barlow Condensed, sans-serif' }}>8+</div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(8,8,8,0.65)', fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>YIL DENEYİM</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '88px 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(8,8,8,0) 100%)', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.55)', marginBottom: 20, fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>✦ &nbsp; RANDEVU</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 18, background: 'linear-gradient(135deg, #E8C96A 0%, #C9A84C 40%, #8B6914 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Barlow Condensed, sans-serif' }}>Aracınız için En İyi Bakımı Seçin</h2>
        <p style={{ fontSize: 15, color: 'rgba(240,230,200,0.5)', maxWidth: 460, margin: '0 auto 44px', fontFamily: 'Barlow, sans-serif', fontWeight: 300, lineHeight: 1.8 }}>Online randevu alın, premium detailing deneyimini yaşayın.</p>
        <button style={{ padding: '16px 52px', fontSize: 13, letterSpacing: '0.1em', borderRadius: 2, fontFamily: 'Raleway, sans-serif', fontWeight: 700, background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)', color: '#080808', border: 'none', cursor: 'pointer' }} onClick={() => scrollTo('contact')}>Hemen Randevu Al</button>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '80px 2rem', background: '#0a0a0a', borderTop: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, textAlign: 'center' }}>
          {[{icon:'☎',label:'Telefon',value:'+90 (212) 555 0123'},{icon:'✉',label:'E-Posta',value:'info@elitedetailing.com.tr'},{icon:'⊙',label:'Adres',value:'Levent, İstanbul'}].map(c=>(
            <div key={c.label}>
              <div style={{ fontSize: 22, color: '#C9A84C', marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(201,168,76,0.55)', marginBottom: 8, fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>{c.label.toUpperCase()}</div>
              <div style={{ fontSize: 14, color: 'rgba(240,230,200,0.65)', fontFamily: 'Barlow, sans-serif', fontWeight: 400 }}>{c.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#080808', borderTop: '1px solid rgba(201,168,76,0.12)', padding: '28px 2.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', color: '#C9A84C', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700 }}>ELITE DETAILING</span>
          <div style={{ fontSize: 12, color: 'rgba(240,230,200,0.3)', fontFamily: 'Barlow, sans-serif' }}>© 2026 Elite Detailing. Tüm hakları saklıdır.</div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Raleway:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #080808; color: #f0e6c8; font-family: 'Barlow', sans-serif; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-track { display: inline-flex; align-items: center; white-space: nowrap; animation: ticker 36s linear infinite; padding-left: 40px; }
        .ticker-track:hover { animation-play-state: paused; }
        @media (max-width: 768px) { nav { padding: 0 1rem !important; } }
      `}</style>
    </div>
  );
}
