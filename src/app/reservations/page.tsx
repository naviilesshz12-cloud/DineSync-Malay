'use client';

import { useState } from 'react';

const timeSlots = [
  '11:30', '12:00', '12:30', '13:00', '13:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    guest_name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    party_size: 2,
    special_requests: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  if (submitted) {
    return (
      <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-16))', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)', animation: 'scaleIn 0.5s ease' }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
            Reservation Confirmed!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
            Thank you, <strong style={{ color: 'var(--color-primary)' }}>{formData.guest_name}</strong>! Your table for{' '}
            <strong>{formData.party_size}</strong> has been reserved on{' '}
            <strong>{new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>{' '}
            at <strong>{formData.time}</strong>.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
            A confirmation has been sent to <strong>{formData.email}</strong>
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => { setSubmitted(false); setFormData({ guest_name: '', email: '', phone: '', date: '', time: '', party_size: 2, special_requests: '' }); }}>
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <section className="res-hero">
        <div className="container">
          <p className="section-eyebrow gold-accent">◆ Reserve Your Experience</p>
          <h1 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Book a Table</h1>
          <div className="gold-line" />
          <p className="section-subtitle">
            Secure your spot for an unforgettable dining experience. Walk-ins welcome, reservations recommended.
          </p>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--space-20)' }}>
        <div className="res-layout">
          <form className="res-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.guest_name}
                  onChange={(e) => updateField('guest_name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@email.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Party Size</label>
                <select
                  className="form-select"
                  value={formData.party_size}
                  onChange={(e) => updateField('party_size', parseInt(e.target.value))}
                >
                  {[1,2,3,4,5,6,7,8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                  <option value={10}>Large Party (9+)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  min={today}
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <select
                  className="form-select"
                  value={formData.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  required
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Requests</label>
              <textarea
                className="form-input"
                placeholder="Birthday celebration, window seat preference, dietary requirements..."
                value={formData.special_requests}
                onChange={(e) => updateField('special_requests', e.target.value)}
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </form>

          <div className="res-info">
            <div className="info-card">
              <h3>📍 Location</h3>
              <p>No. 12, Jalan Telawi 5<br/>Bangsar<br/>59100 Kuala Lumpur</p>
            </div>
            <div className="info-card">
              <h3>🕐 Hours</h3>
              <p>Lunch: 11:30 AM – 2:30 PM<br/>Dinner: 6:00 PM – 10:00 PM<br/>Bar: until 11:30 PM</p>
            </div>
            <div className="info-card">
              <h3>📞 Contact</h3>
              <p>+60 3-2284 3111<br/>reservations@dinesync.com</p>
            </div>
            <div className="info-card">
              <h3>ℹ️ Policy</h3>
              <p>Free cancellation up to 4 hours before. For parties of 8+, please call directly.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .res-hero {
          padding: calc(var(--nav-height) + var(--space-16)) 0 var(--space-12);
          text-align: center;
          background: var(--color-bg-card);
          border-bottom: 1px solid var(--color-border);
        }
        .section-eyebrow {
          font-size: var(--text-sm); font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: var(--space-2);
        }
        .res-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--space-12);
          padding-top: var(--space-10);
        }
        .res-form {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }
        .res-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .info-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
        }
        .info-card h3 {
          font-family: var(--font-display);
          font-size: var(--text-base);
          margin-bottom: var(--space-3);
        }
        .info-card p {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: 1.7;
        }
        @media (max-width: 768px) {
          .res-layout { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
