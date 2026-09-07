import React from 'react';
import { Code2, Layers, Database, ArrowLeftRight, Cloud, Activity } from 'lucide-react';
import type { Skill } from '../../types';

interface TechStackProps {
  skills?: Record<string, Skill[]>;
}

export const TechStack: React.FC<TechStackProps> = ({ skills }) => {
  const domains = [
    {
      key: 'languages',
      title: 'Languages & Runtimes',
      badge: 'CORE SYNTAX',
      icon: Code2,
      desc: 'High-concurrency languages and efficient runtime engines.',
      defaultSkills: ['Go (Golang)', 'TypeScript', 'Node.js', 'Bun', 'SQL (ANSI)'],
    },
    {
      key: 'frameworks',
      title: 'Frameworks & Protocols',
      badge: 'FAST EXECUTION',
      icon: Layers,
      desc: 'High-throughput HTTP routers, RPC transports, and microservice foundations.',
      defaultSkills: ['Go Chi', 'Fiber', 'NestJS', 'Fastify', 'Elysia', 'gRPC / Protobuf'],
    },
    {
      key: 'databases',
      title: 'Databases & Storage',
      badge: 'OLTP & MEMORY',
      icon: Database,
      desc: 'ACID relational schemas, distributed in-memory caching, and hybrid stores.',
      defaultSkills: ['PostgreSQL', 'Redis Cluster', 'SQLite', 'MongoDB'],
    },
    {
      key: 'queues',
      title: 'Messaging & Queues',
      badge: 'EVENT-DRIVEN',
      icon: ArrowLeftRight,
      desc: 'Reliable asynchronous brokers providing at-least-once processing guarantees.',
      defaultSkills: ['BullMQ', 'Redis Streams & Pub/Sub', 'Apache Kafka', 'RabbitMQ'],
    },
    {
      key: 'devops',
      title: 'DevOps & Infra',
      badge: 'CONTAINERIZATION',
      icon: Cloud,
      desc: 'Containerized microservices and automated GitOps CI/CD delivery pipelines.',
      defaultSkills: ['Docker', 'Docker Compose', 'Kubernetes', 'GitHub Actions', 'Linux / Bash'],
    },
    {
      key: 'observability',
      title: 'Observability & Testing',
      badge: 'SRE & QUALITY',
      icon: Activity,
      desc: 'Structured telemetry, metric monitors, and automated AAA test suites.',
      defaultSkills: ['Prometheus', 'Grafana', 'Go Test (AAA)', 'Jest / Supertest'],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-brand-200" id="tech-stack">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-200">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            [01] TECH STACK & TECHNICAL EXPERTISE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
            Backend Architecture Specialization
          </h2>
        </div>
        <p className="text-sm text-brand-600 max-w-md mt-2 md:mt-0 font-normal">
          Production-tested frameworks, data stores, and queue architectures engineered under high-concurrency workloads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {domains.map((d) => {
          const Icon = d.icon;
          const items = skills && skills[d.key]
            ? skills[d.key].map((s) => s.name)
            : d.defaultSkills;

          return (
            <div
              key={d.key}
              className="bg-white p-5 border border-brand-200 flex flex-col justify-between h-full space-y-4 hover:border-brand-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-brand-700" />
                    <h3 className="font-bold text-brand-900 text-base">{d.title}</h3>
                  </div>
                  <span className="font-mono text-[10px] text-brand-500 bg-brand-100 px-2 py-0.5 font-medium tracking-wide">
                    {d.badge}
                  </span>
                </div>
                <p className="text-xs text-brand-600 leading-relaxed">{d.desc}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-brand-100">
                {items.map((name) => (
                  <span
                    key={name}
                    className="font-mono text-xs px-2.5 py-1 bg-brand-50 text-brand-900 border border-brand-200 font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
