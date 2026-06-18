import { useEffect } from 'react';
import { Link } from 'react-router';
import { experiments, type ExperimentStatus } from '../../data/experiments';
import { BeakerRating } from './BeakerRating';
import { useGlobalContext } from '../../context/GlobalContext';

const STATUS_CONFIG: Record<
  ExperimentStatus,
  { emoji: string; label: string; className: string }
> = {
  success: { emoji: '✅', label: 'Success', className: 'status-badge--success' },
  failed: { emoji: '💀', label: 'Failed', className: 'status-badge--failed' },
  inconclusive: {
    emoji: '🤷',
    label: 'Inconclusive',
    className: 'status-badge--inconclusive',
  },
  'in-progress': {
    emoji: '🧪',
    label: 'In Progress',
    className: 'status-badge--in-progress',
  },
};

export function ExperimentsPage() {
  const { pauseBackgroundAudio, resumeBackgroundAudio } = useGlobalContext();

  // Pause background music while browsing experiments
  useEffect(() => {
    pauseBackgroundAudio();
    return () => {
      resumeBackgroundAudio();
    };
  }, []);

  return (
    <div className="lab-page" data-nav-theme="light">
      <div className="lab-content px-6 md:px-10 pt-28 pb-24">
        {/* Page header */}
        <header className="max-w-3xl mx-auto mb-16 lab-animate-in">
          <p className="specimen-field-title mb-3" style={{ fontSize: 12 }}>
            Lab Notebook
          </p>
          <h1
            className="font-[Nyght_Serif] text-4xl md:text-5xl tracking-tight font-normal text-[#1a1510] mb-5"
            style={{ lineHeight: 1.1 }}
          >
            AI Experiments
          </h1>
          <p className="text-lg text-[#5a5245] leading-relaxed max-w-xl">
            A log of things I've built, broken, and learned from — mostly with AI.
            Some worked. Some didn't. All taught me something.
          </p>
        </header>

        {/* Experiment cards */}
        <div className="max-w-3xl mx-auto space-y-6 lab-stagger">
          {experiments.map((exp) => {
            const status = STATUS_CONFIG[exp.status];
            return (
              <Link
                key={exp.slug}
                to={`/experiments/${exp.slug}`}
                className="experiment-card block p-6 md:p-8 lab-animate-in no-underline"
                style={{ textDecoration: 'none' }}
              >
                {/* Top row: status + fun rating */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <span className={`status-badge ${status.className}`}>
                    <span>{status.emoji}</span>
                    {status.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="specimen-field-title" style={{ marginRight: 4 }}>
                      Fun
                    </span>
                    <BeakerRating rating={exp.funRating} />
                  </div>
                </div>

                {/* Title */}
                <h2
                  className="font-[Nyght_Serif] text-2xl md:text-3xl tracking-tight font-normal text-[#1a1510] mb-1"
                  style={{ lineHeight: 1.15 }}
                >
                  {exp.title}
                </h2>
                <p
                  className="font-[Nyght_Serif] text-lg text-[#8a7e6e] mb-3"
                  style={{ lineHeight: 1.3 }}
                >
                  {exp.subtitle}
                </p>

                {/* Category + date */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="specimen-field-title">{exp.category}</span>
                  <span className="specimen-field-title">·</span>
                  <span className="specimen-field-title">{exp.date}</span>
                  <span className="specimen-field-title">·</span>
                  <span className="specimen-field-title">{exp.timeSpent}</span>
                </div>

                {/* TL;DR */}
                <p className="text-[15px] text-[#5a5245] leading-relaxed mb-5 line-clamp-3">
                  {exp.tldr}
                </p>

                {/* Tools */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {exp.tools.map((tool) => (
                    <span key={tool} className="tool-pill">
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Verdict */}
                <div
                  className="pt-4 border-t"
                  style={{ borderColor: 'rgba(120,110,95,0.12)' }}
                >
                  <p className="specimen-field-title mb-1">Verdict</p>
                  <p className="text-[14px] text-[#3a3530] leading-relaxed">
                    {exp.verdict}
                  </p>
                </div>

                {/* Read more arrow */}
                <div className="mt-5 flex items-center gap-2 text-[13px] font-medium text-[#8a7e6e] card-read-more transition-colors duration-200">
                  <span>Read the full experiment</span>
                  <span style={{ fontSize: 16 }}>→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Build Together CTA */}
        <div className="max-w-3xl mx-auto mt-16 lab-animate-in" style={{ animationDelay: '0.4s' }}>
          <a
            href="mailto:anmolmaggon40@gmail.com?subject=Let's%20build%20something%20together&body=Hi%20Anmol%2C%0A%0AI%20saw%20your%20AI%20Experiments%20and%20I%20have%20an%20idea%20I'd%20love%20to%20explore%20together.%0A%0A"
            className="build-together-cta block p-8 text-center no-underline"
            style={{ textDecoration: 'none' }}
          >
            <p className="specimen-field-title mb-2" style={{ fontSize: 11 }}>
              Open Invitation
            </p>
            <p
              className="font-[Nyght_Serif] text-2xl text-[#1a1510] mb-3"
              style={{ lineHeight: 1.2 }}
            >
              Want to build something together?
            </p>
            <p className="text-[15px] text-[#5a5245] leading-relaxed max-w-md mx-auto mb-4">
              If any of these experiments sparked an idea — or you have one that
              needs a designer who also codes — I'd love to hear about it.
            </p>
            <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#8a7e6e]">
              Drop me a line
              <span style={{ fontSize: 16 }}>→</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
