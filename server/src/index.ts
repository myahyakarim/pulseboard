import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

type ServiceStatus = 'healthy' | 'degraded' | 'down';

type ServicePulse = {
  id: string;
  name: string;
  status: ServiceStatus;
  latencyMs: number;
  region: string;
  updatedAt: string;
};

const services: ServicePulse[] = [
  { id: 'api-gateway', name: 'API Gateway', status: 'healthy', latencyMs: 42, region: 'us-east-1', updatedAt: new Date().toISOString() },
  { id: 'billing-worker', name: 'Billing Worker', status: 'degraded', latencyMs: 310, region: 'us-east-1', updatedAt: new Date().toISOString() },
  { id: 'partner-connector', name: 'Partner Connector', status: 'healthy', latencyMs: 88, region: 'eu-west-1', updatedAt: new Date().toISOString() },
];

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.get('/health', async () => ({ ok: true }));

app.get('/api/services', async () => ({ data: services }));

app.patch('/api/services/:id', async (req, reply) => {
  const params = z.object({ id: z.string() }).parse(req.params);
  const body = z
    .object({
      status: z.enum(['healthy', 'degraded', 'down']).optional(),
      latencyMs: z.number().int().positive().optional(),
    })
    .parse(req.body ?? {});

  const idx = services.findIndex((s) => s.id === params.id);
  if (idx < 0) return reply.code(404).send({ error: 'not_found' });

  services[idx] = {
    ...services[idx],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return { data: services[idx] };
});

app.post('/api/incidents', async (req) => {
  const body = z
    .object({
      service_id: z.string(),
      summary: z.string().min(3),
    })
    .parse(req.body);

  return {
    data: {
      id: randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
      severity: 'sev-2',
    },
  };
});

const port = Number(process.env.PORT ?? 3200);
await app.listen({ port, host: '0.0.0.0' });
