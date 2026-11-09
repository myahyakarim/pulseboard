import { useEffect, useState } from 'react';

type ServiceStatus = 'healthy' | 'degraded' | 'down';

type ServicePulse = {
  id: string;
  name: string;
  status: ServiceStatus;
  latencyMs: number;
  region: string;
  updatedAt: string;
};

export function App() {
  const [services, setServices] = useState<ServicePulse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState('');

  async function load() {
    try {
      const res = await fetch('/api/services');
      const json = await res.json();
      setServices(json.data);
      setError(null);
    } catch {
      setError('API unreachable — start the Node server on :3200');
    }
  }

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 5000);
    return () => clearInterval(id);
  }, []);

  async function fileIncident(serviceId: string) {
    if (!summary.trim()) return;
    await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: serviceId, summary }),
    });
    setSummary('');
    alert('Incident recorded.');
  }

  return (
    <div className="page">
      <header>
        <p className="eyebrow">Northline Platform</p>
        <h1>Pulseboard</h1>
        <p className="lede">Internal service health for on-call engineers.</p>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="grid">
        {services.map((s) => (
          <article key={s.id} className={`card status-${s.status}`}>
            <div className="row">
              <h2>{s.name}</h2>
              <span className="pill">{s.status}</span>
            </div>
            <p>{s.latencyMs} ms · {s.region}</p>
            <p className="muted">Updated {new Date(s.updatedAt).toLocaleTimeString()}</p>
            <button type="button" onClick={() => void fileIncident(s.id)}>
              File incident
            </button>
          </article>
        ))}
      </section>

      <section className="composer">
        <label htmlFor="summary">Incident summary</label>
        <input
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Elevated latency on billing worker"
        />
      </section>
    </div>
  );
}
