"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navItems = [
  ["Services", "services"],
  ["How I Work", "process"],
  ["Format", "format"],
  ["About", "about"],
  ["Contact", "contact"],
] as const;

const services = [
  {
    title: "Product direction",
    description: "Turning open questions into a focused product path.",
    bullets: ["Product audits", "Opportunity mapping", "Design principles"],
  },
  {
    title: "Experience design",
    description: "Useful, intuitive flows shaped around real behavior.",
    bullets: ["User journeys", "Interface design", "Interactive prototypes"],
  },
  {
    title: "Design systems",
    description:
      "Foundations that make quality easier to repeat at scale.",
    bullets: ["Visual language", "Component libraries", "Documentation"],
  },
  {
    title: "Creative partnership",
    description:
      "Senior design thinking embedded where it matters most.",
    bullets: ["Team facilitation", "Design critique", "Launch support"],
  },
];

const process = [
  [
    "Listen closely",
    "We begin with context: the ambition, constraints, people, and decisions already made.",
  ],
  [
    "Find the signal",
    "Research and working sessions turn a broad challenge into a precise, shared point of view.",
  ],
  [
    "Make it tangible",
    "Ideas become flows, prototypes, and visual directions early enough to invite useful debate.",
  ],
  [
    "Refine together",
    "Frequent reviews keep the work honest, reduce surprises, and sharpen the details that matter.",
  ],
  [
    "Leave it stronger",
    "The outcome includes the tools, logic, and documentation your team needs to carry it forward.",
  ],
];

const focusAreas = [
  "Fintech",
  "AI tools",
  "Future of work",
  "Health platforms",
  "Climate tech",
  "Creator tools",
  "Public services",
  "New ventures",
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: reduced ? 0 : 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`button button-${variant} ${className}`}
    >
      {children}
    </a>
  );
}

function Brand() {
  return (
    <a
      className="brand"
      href="#top"
      aria-label="Ayo Ola, back to top"
    >
      <span>AYO</span>
      <span>OLA</span>
      <span>DIPO</span>
    </a>
  );
}

function Eyebrow({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="eyebrow">{children}</p>;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);

    fn();

    window.addEventListener("scroll", fn, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const ids = [
      "top",
      ...navItems.map(([, id]) => id),
    ];

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) =>
            e.isIntersecting &&
            setActive(e.target.id)
        ),
      {
        rootMargin: "-35% 0px -55%",
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);

      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    const previous =
      document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }

      if (
        e.key === "Tab" &&
        dialogRef.current
      ) {
        const items = [
          ...dialogRef.current.querySelectorAll<HTMLElement>(
            "a,button"
          ),
        ];

        const first = items[0];
        const last = items.at(-1);

        if (
          e.shiftKey &&
          document.activeElement === first
        ) {
          e.preventDefault();
          last?.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === last
        ) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", key);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [open]);

  return (
    <header
      className={`header ${
        scrolled ? "header-scrolled" : ""
      }`}
    >
      <div className="shell header-inner">
        <Brand />

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          {navItems.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className={
                active === id ? "active" : ""
              }
            >
              {label}
            </a>
          ))}
        </nav>

        <Button
          href="#contact"
          className="header-cta"
        >
          Start a project
          <ArrowUpRight size={16} />
        </Button>

        <button
          className="menu-button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialogRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mobile-menu-top">
              <Brand />

              <button
                ref={closeRef}
                className="menu-button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>

            <nav>
              {navItems.map(
                ([label, id], i) => (
                  <motion.a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.04 * i,
                    }}
                  >
                    {label}
                    <span>0{i + 1}</span>
                  </motion.a>
                )
              )}
            </nav>

            <Button
              href="mailto:hello@ayoola.studio"
              className="mobile-menu-cta"
            >
              hello@ayoola.studio
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="section-intro">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>

      <div>
        <Reveal delay={0.08}>
          <h2>{title}</h2>
        </Reveal>

        {body && (
          <Reveal delay={0.16}>
            <p>{body}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function NumberedItem({
  number,
  title,
  description,
  bullets,
  compact = false,
}: {
  number: string;
  title: string;
  description?: string;
  bullets?: string[];
  compact?: boolean;
}) {
  return (
    <article
      className={`numbered-item ${
        compact ? "compact" : ""
      }`}
    >
      <span className="number">{number}</span>

      <h3>{title}</h3>

      {description && <p>{description}</p>}

      {bullets && (
        <ul>
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function Portfolio() {
  return (
    <>
      <Header />

      <main id="top">

        {/* HERO */}
        <section
          className="hero shell"
          aria-labelledby="hero-title"
        >
          <div className="hero-main">

            {/* LEFT SIDE */}
            <div className="hero-content">
              <Reveal>
                <p className="hero-kicker">
                  Accident and Health Claims Adjuster |FastAPI Backend Engineer | Claims Automation 
                </p>
              </Reveal>

              <h1
                id="hero-title"
                aria-label="Clear thinking. Useful design. Built to endure."
              >
                <Reveal>
                  <span>Clear thinking.</span>
                </Reveal>

                <Reveal delay={0.08}>
                  <span>Useful design.</span>
                </Reveal>

                <Reveal delay={0.16}>
                  <span
                    className="gradient-line"
                    aria-hidden="true"
                  >
                    Built to endure.
                  </span>

                  <span className="sr-only">
                    Built to endure.
                  </span>
                </Reveal>
              </h1>
            </div>

            {/* RIGHT SIDE - CIRCULAR IMAGE */}
            <Reveal
              delay={0.12}
              className="hero-image-wrap"
            >
              <div className="hero-image">
                <img
                  src="/images/hero-image.jpg"
                  alt="Ayo Ola"
                />
              </div>
            </Reveal>
          </div>

          <div className="hero-lower">
            <Reveal>
              <div className="hero-pitch">
                <p className="pitch-lead">
                  I help ambitious teams turn complex
                  ideas into products people understand
                  and choose.
                </p>

                <div className="availability">
                  <span
                    className="avatar"
                    aria-hidden="true"
                  >
                    AO
                  </span>

                  <span>
                    <strong>Ayo Ola</strong>
                    Independent design partner
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="hero-copy">
                <p>
                  Strategy, experience design, and
                  scalable systems—brought together with
                  a sharp eye for the idea and the detail.
                </p>

                <a
                  className="arrow-link"
                  href="#services"
                >
                  Explore the work
                  <ArrowDownRight size={19} />
                </a>
              </div>
            </Reveal>
          </div>

          <div className="stats-grid">
            {[
              ["08+", "Years shaping products"],
              ["24", "Products taken to market"],
              ["11", "Long-term partnerships"],
              ["04", "Continents collaborated across"],
            ].map(([n, l], i) => (
              <Reveal
                key={l}
                delay={i * 0.08}
              >
                <div className="stat">
                  <strong>{n}</strong>
                  <span>{l}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* SERVICES */}
        <section
          id="services"
          className="section shell"
        >
          <SectionIntro
            eyebrow="Services"
            title="What I offer"
            body="From first principles to final polish, each engagement is shaped around what the work needs."
          />

          <div className="services-grid">
            {services.map((s, i) => (
              <Reveal
                key={s.title}
                delay={i * 0.08}
              >
                <NumberedItem
                  number={`0${i + 1}`}
                  {...s}
                />
              </Reveal>
            ))}
          </div>
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* PROCESS */}
        <section
          id="process"
          className="section shell"
        >
          <SectionIntro
            eyebrow="How I work"
            title="Clarity at every step"
            body="A direct, collaborative process that keeps decisions visible and momentum high."
          />

          <div className="process-list">
            {process.map(
              ([title, description], i) => (
                <Reveal
                  key={title}
                  delay={i * 0.05}
                >
                  <NumberedItem
                    number={`0${i + 1}`}
                    title={title}
                    description={description}
                  />
                </Reveal>
              )
            )}
          </div>
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* FORMAT */}
        <section
          id="format"
          className="section shell"
        >
          <SectionIntro
            eyebrow="Engagement format"
            title="Built around the brief"
          />

          <div className="format-grid">
            {[
              "A focused sprint to unlock direction.",
              "An embedded partnership for sustained momentum.",
              "A design system to make quality repeatable.",
            ].map((t, i) => (
              <Reveal
                key={t}
                delay={i * 0.08}
              >
                <article>
                  <span>0{i + 1}</span>
                  <h3>{t}</h3>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* FOCUS AREAS */}
        <section
          className="section shell"
          aria-labelledby="focus-title"
        >
          <SectionIntro
            eyebrow="Selected focus areas"
            title="Where I’m curious"
          />

          <div
            id="focus-title"
            className="focus-grid"
          >
            {focusAreas.map((a, i) => (
              <Reveal
                key={a}
                delay={(i % 4) * 0.06}
              >
                <NumberedItem
                  compact
                  number={`${i + 1}`.padStart(2, "0")}
                  title={a}
                />
              </Reveal>
            ))}
          </div>
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* ABOUT */}
        <section
          id="about"
          className="section about shell"
        >
          <Reveal>
            <Eyebrow>About</Eyebrow>
          </Reveal>

          <div className="about-grid">
            <Reveal delay={0.08}>
              <h2>
                Design should make the important thing
                feel obvious.
              </h2>
            </Reveal>

            <div className="about-copy">
              <Reveal delay={0.16}>
                <blockquote>
                  “Less theatre. More truth. The strongest
                  work earns attention by being useful.”
                </blockquote>
              </Reveal>

              <Reveal delay={0.24}>
                <p>
                  I’m Ayo, an independent product designer
                  and creative partner. I work with founders
                  and teams navigating meaningful change—
                  bringing structure to ambiguity, craft to
                  every interaction, and a calm point of
                  view to the room.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="contact-section"
        >
          <div className="shell contact-grid">
            <div>
              <Reveal>
                <Eyebrow>
                  Have something in mind?
                </Eyebrow>
              </Reveal>

              <Reveal delay={0.08}>
                <h2>
                  Let’s make the next thing matter.
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.16}>
              <div className="contact-details">
                <a
                  className="email-link"
                  href="mailto:hello@ayoola.studio"
                >
                  hello@ayoola.studio
                  <ArrowUpRight />
                </a>

                <p>
                  Open to thoughtful product, brand,
                  and digital experience collaborations.
                </p>

                <div className="socials">
                  <a href="#">LinkedIn</a>
                  <a href="#">Behance</a>
                  <a href="#">Instagram</a>
                </div>

                <Button
                  href="mailto:hello@ayoola.studio"
                  variant="secondary"
                >
                  Start a conversation
                  <ArrowUpRight size={17} />
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="shell footer-top">
          <Brand />

          <p>
            Independent design practice for useful,
            enduring digital products.
          </p>

          <div className="footer-links">
            <div>
              <span>Navigate</span>

              {navItems
                .slice(0, 4)
                .map(([l, id]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                  >
                    {l}
                  </a>
                ))}
            </div>

            <div>
              <span>Elsewhere</span>
              <a href="#">LinkedIn</a>
              <a href="#">Behance</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>

        <div className="shell footer-bottom">
          <span>
            © {new Date().getFullYear()} Ayo Ola Studio
          </span>

          <span>
            Designed with intent · Lagos, NG
          </span>

          <a href="#top">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
