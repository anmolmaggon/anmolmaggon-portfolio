import { useParams, Link, Navigate } from 'react-router';
import { useEffect } from 'react';
import { experiments } from '../../data/experiments';
import { BeakerRating } from './BeakerRating';
import { StatusBadge } from './StatusBadge';
import { useGlobalContext } from '../../context/GlobalContext';

/**
 * Renders a single narrative section, splitting content at double-newlines
 * into paragraphs and wrapping monospace-looking blocks (with → or ├─) in <pre>.
 */
function NarrativeSection({ title, content }: { title: string; content: string }) {
  // Split on double-newline for paragraph breaks
  const paragraphs = content.split('\n\n');

  return (
    <section>
      <h2>{title}</h2>
      {paragraphs.map((para, i) => {
        // Detect ASCII-art / architecture diagrams (lines with → ├ └ ─)
        const isCodeBlock = /[→←├└─┤┬┴┼]/.test(para) || /^\s{4,}/.test(para);
        if (isCodeBlock) {
          return <pre key={i}>{para}</pre>;
        }
        return <p key={i}>{para}</p>;
      })}
    </section>
  );
}

export function ExperimentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const experiment = experiments.find((e) => e.slug === slug);
  const { pauseBackgroundAudio, resumeBackgroundAudio } = useGlobalContext();

  // Pause background music while reading an experiment
  useEffect(() => {
    pauseBackgroundAudio();
    return () => {
      resumeBackgroundAudio();
    };
  }, []);

  if (!experiment) {
    return <Navigate to="/experiments" replace />;
  }

  return (
    <div className="lab-page" data-nav-theme="light">
      <div className="lab-content px-6 md:px-10 pt-28 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link to="/experiments" className="lab-back-link mb-8 inline-flex lab-animate-in">
            <span>←</span>
            <span>All Experiments</span>
          </Link>

          {/* Specimen label / metadata header */}
          <div className="specimen-label p-6 md:p-8 mb-12 lab-animate-in" style={{ animationDelay: '0.05s' }}>
            {/* Status + Fun rating row */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <StatusBadge status={experiment.status} />
              <div className="flex items-center gap-2">
                <span className="specimen-field-title" style={{ marginRight: 4 }}>
                  Fun Rating
                </span>
                <BeakerRating rating={experiment.funRating} />
              </div>
            </div>

            {/* Title */}
            <h1
              className="font-[Nyght_Serif] text-3xl md:text-4xl tracking-tight font-normal text-[#1a1510] mb-1"
              style={{ lineHeight: 1.1 }}
            >
              {experiment.title}
            </h1>
            <p
              className="font-[Nyght_Serif] text-xl text-[#8a7e6e] mb-6"
              style={{ lineHeight: 1.3 }}
            >
              {experiment.subtitle}
            </p>

            {/* Metadata grid */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t"
              style={{ borderColor: 'rgba(120,110,95,0.15)' }}
            >
              <div>
                <p className="specimen-field-title mb-1">Category</p>
                <p className="specimen-field-value">{experiment.category}</p>
              </div>
              <div>
                <p className="specimen-field-title mb-1">Date</p>
                <p className="specimen-field-value">{experiment.date}</p>
              </div>
              <div>
                <p className="specimen-field-title mb-1">Time Spent</p>
                <p className="specimen-field-value">{experiment.timeSpent}</p>
              </div>
              <div>
                <p className="specimen-field-title mb-1">Status</p>
                <p className="specimen-field-value capitalize">{experiment.status.replace('-', ' ')}</p>
              </div>
            </div>

            {/* Tools */}
            <div className="mt-5">
              <p className="specimen-field-title mb-2">Tools & Technologies</p>
              <div className="flex flex-wrap gap-2">
                {experiment.tools.map((tool) => (
                  <span key={tool} className="tool-pill">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* TL;DR callout */}
          <div
            className="mb-12 p-5 rounded-md lab-animate-in"
            style={{
              animationDelay: '0.1s',
              background: '#f5f0e6',
              borderLeft: '3px solid #c9a84c',
            }}
          >
            <p className="specimen-field-title mb-2">TL;DR</p>
            <p className="text-[15px] text-[#3a3530] leading-relaxed">
              {experiment.tldr}
            </p>
          </div>

          {/* Narrative sections */}
          <div className="experiment-prose lab-stagger">
            {experiment.sections.map((section, i) => (
              <div key={i} className="lab-animate-in">
                <NarrativeSection title={section.title} content={section.content} />
              </div>
            ))}
          </div>

          {/* Verdict */}
          <div
            className="mt-12 p-6 rounded-md lab-animate-in"
            style={{
              animationDelay: '0.2s',
              background: 'rgba(120,110,95,0.05)',
              border: '1.5px solid rgba(120,110,95,0.15)',
            }}
          >
            <p className="specimen-field-title mb-2">Verdict</p>
            <p className="text-[16px] text-[#1a1510] leading-relaxed font-medium">
              {experiment.verdict}
            </p>
          </div>

          {/* Connect CTA */}
          <div className="mt-16 lab-animate-in" style={{ animationDelay: '0.25s' }}>
            <a
              href="mailto:anmolmaggon40@gmail.com?subject=Let's%20build%20something%20together&body=Hi%20Anmol%2C%0A%0AI%20just%20read%20your%20experiment%20and%20I%20have%20something%20I'd%20love%20to%20explore%20together.%0A%0A"
              className="build-together-cta block p-8 text-center"
              style={{ textDecoration: 'none' }}
            >
              <p className="specimen-field-title mb-2" style={{ fontSize: 11 }}>
                Open Invitation
              </p>
              <p
                className="font-[Nyght_Serif] text-2xl text-[#1a1510] mb-3"
                style={{ lineHeight: 1.2 }}
              >
                Liked this experiment? Let's build the next one together.
              </p>
              <p className="text-[15px] text-[#5a5245] leading-relaxed max-w-md mx-auto mb-4">
                I'm always looking for collaborators who enjoy breaking things, learning from failures, and shipping experiments that teach us something new.
              </p>
              <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#8a7e6e] transition-colors duration-200 hover:text-[#1a1510]">
                Drop me a line
                <span style={{ fontSize: 16 }}>→</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
