import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoWithFallback } from "./VideoWithFallback";
import { CaseStudyModal, type CaseStudyDetail } from "./CaseStudyModal";

type Study = CaseStudyDetail & {
  slug: string;
  image: string;
  previewVideo?: string;
  tilt: number;
  oneLiner?: string;
};

// Flip this to false to restore the previous, fuller Notes case-study structure.
const USE_TIGHT_NOTES_CASE_STUDY = false;

const notesStudyFull: Study = {
    slug: "notes",
    number: "01",
    title: "Notes",
    subtitle: "A 24-hour format for the work thoughts that never come out.",
    client: "AmbitionBox Communities",
    year: "2026",
    role: "PM + Designer",
    meta: ["PM + Designer", "2026", "Pre-launch"],
    oneLiner: "Every work thought that dies in your head.",
    image: "/case-studies/notes/preview.svg",
    previewVideo: "/case-studies/notes/preview.mp4",
    cover: "/case-studies/notes/cover.svg",
    coverVideo: "/case-studies/notes/cover.mp4",
    tilt: -6,
    context: "AmbitionBox is one of India's largest company-review and salary-insights platforms. Communities is its pseudonymous space, where professionals discuss work candidly - without real names.",
    problem: "How might we capture the intrusive work thoughts that users currently swallow because the
<truncated 25291 bytes>
    alt={`${s.title} preview`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div
                  data-hover-preview
                  className="hidden md:block pointer-events-none absolute right-[6%] top-1/2 w-[320px] aspect-[4/5] opacity-0 scale-90 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 rounded-none shadow-2xl bg-white"
                  style={{ transform: `translateY(-50%) rotate(${s.tilt}deg)` }}
                >
                  {s.previewVideo ? (
                    <VideoWithFallback
                      className="w-full h-full object-cover"
                      poster={s.image}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    >
                      <source src={s.previewVideo} type="video/mp4" />
                    </VideoWithFallback>
                  ) : (
                    <ImageWithFallback
                      src={s.image}
                      alt={`${s.title} preview`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <CaseStudyModal 
        study={active} 
        prevStudy={prevStudy}
        nextStudy={nextStudy}
        onNavigate={(study) => handleNavigate(study)}
        onClose={() => handleNavigate(null)} 
      />
    </motion.section>
  );
}
