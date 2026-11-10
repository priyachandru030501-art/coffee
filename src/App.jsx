
import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

/* --------------------------------------------------
   COFFEE IMAGES - PUBLIC FOLDER
-------------------------------------------------- */

const BASE = import.meta.env.BASE_URL;

const HERO_CANDIDATES = [
  `${BASE}Coffe-Beans.png`,
];

const latteImg = `${BASE}Latte.png`;

const PHOTOS = {
  latte: latteImg,
  espresso: `${BASE}Expresso.png`,
  cappuccino: `${BASE}Cappuccino.png`,
};

/* --------------------------------------------------
   SMALL HELPERS
-------------------------------------------------- */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const lerp = (a, b, t) => a + (b - a) * t;

const ease = (t) =>
  t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;

function rng(seed) {
  let s = seed;

  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* --------------------------------------------------
   CUP COLORS
-------------------------------------------------- */

const CUP_THEME = {
  espresso: {
    saucer: "#e9b79a",
    saucerEdge: "#c8643b",
    cup: "#c8643b",
    rim: "#f4d9c3",
  },

  latte: {
    saucer: "#dfe8d8",
    saucerEdge: "#8fa58a",
    cup: "#8fa58a",
    rim: "#f3f7ef",
  },

  cappuccino: {
    saucer: "#d8e2ec",
    saucerEdge: "#6f8ca8",
    cup: "#6f8ca8",
    rim: "#eef3f8",
  },
};

/* --------------------------------------------------
   SVG CUP FALLBACK
-------------------------------------------------- */

function Cup({ type = "latte", className = "" }) {
  const t = CUP_THEME[type];

  return (
    <svg viewBox="0 0 200 200" className={`cup ${className}`}>
      <circle cx="100" cy="100" r="95" fill={t.saucerEdge} />
      <circle cx="100" cy="100" r="91" fill={t.saucer} />

      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke={t.saucerEdge}
        strokeOpacity=".35"
        strokeWidth="1.5"
        strokeDasharray="2 5"
        strokeLinecap="round"
      />

      <path
        d="M162 84 h22 a14 14 0 0 1 0 28 h-22 v-9 h22 a5 5 0 0 0 0 -10 h-22 z"
        fill={t.cup}
      />

      <circle cx="100" cy="100" r="68" fill={t.cup} />
      <circle cx="100" cy="100" r="62" fill={t.rim} />

      {type === "espresso" && (
        <>
          <circle cx="100" cy="100" r="55" fill="#2a140a" />
          <circle cx="100" cy="100" r="49" fill="#5c3017" />
          <circle cx="100" cy="100" r="38" fill="#8a5126" />

          <path
            d="M70 92 C80 70 112 66 128 84"
            fill="none"
            stroke="#c48a56"
            strokeWidth="5"
            strokeLinecap="round"
            opacity=".7"
          />

          <g transform="rotate(-28 100 100)">
            <rect
              x="70"
              y="171"
              width="60"
              height="5"
              rx="2.5"
              fill="#b9b1a8"
            />
            <ellipse
              cx="136"
              cy="173.5"
              rx="9"
              ry="6"
              fill="#cfc8bf"
            />
          </g>

          <rect
            x="30"
            y="140"
            width="14"
            height="14"
            rx="3"
            fill="#fffaf2"
            stroke="#d9cdbd"
            transform="rotate(14 37 147)"
          />
        </>
      )}

      {type === "latte" && (
        <>
          <circle cx="100" cy="100" r="55" fill="#6a3f22" />
          <circle cx="100" cy="100" r="50" fill="#b88a60" />

          <path
            d="M100 138 C80 124 74 104 82 90 C90 98 96 98 100 90 C104 98 110 98 118 90 C126 104 120 124 100 138 Z"
            fill="#f7ead8"
          />

          <path
            d="M100 124 C90 114 88 104 92 98 C96 102 100 102 100 98 C100 102 104 102 108 98 C112 104 110 114 100 124 Z"
            fill="#b88a60"
          />

          <g transform="rotate(32 100 100)">
            <rect
              x="62"
              y="168"
              width="52"
              height="14"
              rx="7"
              fill="#d7a566"
            />
            <circle cx="76" cy="175" r="1.8" fill="#8a5a2c" />
            <circle cx="90" cy="173" r="1.8" fill="#8a5a2c" />
            <circle cx="102" cy="176" r="1.8" fill="#8a5a2c" />
          </g>
        </>
      )}

      {type === "cappuccino" && (
        <>
          <circle cx="100" cy="100" r="55" fill="#5a3320" />
          <circle cx="100" cy="100" r="49" fill="#f0ddc2" />

          <circle
            cx="100"
            cy="100"
            r="36"
            fill="#9a6a45"
            opacity=".55"
          />

          <circle
            cx="100"
            cy="100"
            r="22"
            fill="#7a4a2a"
            opacity=".55"
          />

          <path
            d="M100 74 C92 86 92 98 100 112 C108 98 108 86 100 74 Z"
            fill="#f0ddc2"
            opacity=".9"
          />

          <g transform="rotate(-24 100 100)">
            <rect
              x="66"
              y="170"
              width="68"
              height="9"
              rx="4.5"
              fill="#a5532a"
            />
            <path
              d="M70 174.5 H130"
              stroke="#7d3b1b"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>
        </>
      )}
    </svg>
  );
}

/* --------------------------------------------------
   REAL COFFEE PHOTOS
-------------------------------------------------- */

function Pic({ type, className = "", onStatus }) {
  const [ok, setOk] = useState(true);

  const src = PHOTOS[type];

  if (!src || !ok) {
    return <Cup type={type} className={className} />;
  }

  return (
    <img
      className={`photo ${className}`}
      src={src}
      alt={type}
      draggable="false"
      onLoad={() => onStatus?.(true)}
      onError={() => {
        setOk(false);
        onStatus?.(false);
      }}
    />
  );
}

/* --------------------------------------------------
   COFFEE BEANS SVG
-------------------------------------------------- */

function BeanDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
    >
      <defs>
        <g id="bean">
          <ellipse
            cx="20"
            cy="14"
            rx="18"
            ry="12"
            fill="currentColor"
          />

          <path
            d="M5 15 C14 6 26 22 35 12"
            fill="none"
            stroke="#f3e4d0"
            strokeOpacity=".55"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      </defs>
    </svg>
  );
}

const BEAN_COLORS = [
  "#4a2c19",
  "#66401f",
  "#7d4e29",
  "#955e33",
  "#ac7440",
];

/* --------------------------------------------------
   BEAN PILE
-------------------------------------------------- */

function BeanPile() {
  const beans = useMemo(() => {
    const r = rng(42);
    const out = [];

    for (let i = 0; i < 340; i++) {
      const x = r() * 1440;

      const mound =
        190 * Math.exp(-Math.pow((x - 860) / 340, 2)) + 26;

      const y = 300 - r() * mound - 10;

      out.push({
        x,
        y,
        rot: r() * 360,
        s: 0.8 + r() * 0.55,
        c: BEAN_COLORS[
          Math.floor(r() * BEAN_COLORS.length)
        ],
      });
    }

    return out.sort((a, b) => a.y - b.y);
  }, []);

  return (
    <svg
      className="pile"
      viewBox="0 0 1440 300"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {beans.map((b, i) => (
        <use
          key={i}
          href="#bean"
          style={{ color: b.c }}
          transform={`translate(${b.x} ${b.y}) rotate(${b.rot} 20 14) scale(${b.s})`}
        />
      ))}
    </svg>
  );
}

/* --------------------------------------------------
   FALLING BEANS
-------------------------------------------------- */

function FallingBeans() {
  const beans = useMemo(() => {
    const r = rng(7);

    return Array.from({ length: 26 }, () => ({
      left: r() * 100,
      size: 1.6 + r() * 2.2,
      dur: 7 + r() * 8,
      delay: -r() * 14,
      c: BEAN_COLORS[
        Math.floor(r() * BEAN_COLORS.length)
      ],
    }));
  }, []);

  return (
    <div className="falling" aria-hidden="true">
      {beans.map((b, i) => (
        <svg
          key={i}
          viewBox="0 0 40 28"
          className="fall"
          style={{
            left: `${b.left}%`,
            width: `${b.size}vw`,
            color: b.c,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <use href="#bean" />
        </svg>
      ))}
    </div>
  );
}

/* --------------------------------------------------
   PRODUCTS
-------------------------------------------------- */

const PRODUCTS = [
  {
    name: "Espresso",
    type: "espresso",
    meta: "30 ml · Bold",
    desc: "Dark roast with thick crema and a clean, bold finish.",
    price: 150,
    active: true,
  },
  {
    name: "Latte",
    type: "latte",
    meta: "250 ml · Smooth",
    desc: "Espresso with silky steamed milk and tulip art.",
    price: 220,
    anchor: true,
  },
  {
    name: "Cappuccino",
    type: "cappuccino",
    meta: "180 ml · Balanced",
    desc: "Espresso, milk and foam in equal parts, dusted with cocoa.",
    price: 240,
  },
];

/* --------------------------------------------------
   MAIN APP
-------------------------------------------------- */

export default function App() {
  const flyRef = useRef(null);
  const slotRef = useRef(null);
  const tasteAnchorRef = useRef(null);
  const cardAnchorRef = useRef(null);
  const copyRef = useRef(null);
  const photoRef = useRef(true);

  const [heroIdx, setHeroIdx] = useState(0);

  const photo = heroIdx < HERO_CANDIDATES.length;

  useEffect(() => {
    if (!photo) {
      console.warn("Coffee Beans image not found in public folder.");
    }
  }, [photo]);

  /* -----------------------------------------------
     SCROLL PARALLAX ANIMATION
  ----------------------------------------------- */

  useEffect(() => {
    const fly = flyRef.current;

    let stops = [];

    const centre = (el, restScroll) => {
      const r = el.getBoundingClientRect();

      return {
        x: r.left + r.width / 2,
        y: r.top + scrollY + r.height / 2 - restScroll,
        d: r.width,
      };
    };

    const measure = () => {
      const H = innerHeight;

      stops = [
        centre(slotRef.current, 0),
        centre(tasteAnchorRef.current, H),
        centre(cardAnchorRef.current, 2 * H),
      ];

      update();
    };

    const update = () => {
      if (!stops.length || !fly) return;

      const H = innerHeight;
      const u = scrollY / H;

      let A, B, t;

      if (u <= 1) {
        A = stops[0];
        B = stops[1];
        t = ease(clamp(u, 0, 1));
      } else if (u < 1.34) {
        A = B = stops[1];
        t = 0;
      } else {
        A = stops[1];
        B = stops[2];
        t = ease(clamp((u - 1.34) / 0.66, 0, 1));
      }

      const x = lerp(A.x, B.x, t);
      const y = lerp(A.y, B.y, t);
      const d = lerp(A.d, B.d, t);

      fly.style.width = d + "px";
      fly.style.height = d + "px";

      fly.style.transform = `
        translate(${x - d / 2}px, ${y - d / 2}px)
        rotate(${
          photoRef.current
            ? Math.sin(u * Math.PI * 2) * 9
            : u * 150
        }deg)
      `;

      /* TEXT FADE ANIMATION */

      const top =
        copyRef.current.getBoundingClientRect().top / H;

      copyRef.current.style.opacity =
        clamp(1 - (top - 0.3) / 0.85, 0, 1);
    };

    measure();

    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", measure);
    addEventListener("load", measure);

    document.fonts?.ready.then(measure);

    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", measure);
      removeEventListener("load", measure);
    };
  }, []);

  /* -----------------------------------------------
     RETURN
  ----------------------------------------------- */

  return (
    <>
      <BeanDefs />

      {/* 1. HERO SECTION */}

      <section className="hero">
        {photo && (
          <img
            key={heroIdx}
            className="hero-photo"
            src={HERO_CANDIDATES[heroIdx]}
            alt="Coffee Beans"
            onError={() => setHeroIdx((n) => n + 1)}
          />
        )}

        {!photo && <FallingBeans />}

        <div className="stage">
          <h1 className="coffee-title">
            <span>C</span>

            <span
              className="title-placeholder"
              ref={slotRef}
            />

            <span>FFEE</span>
          </h1>
        </div>

        {!photo && <BeanPile />}
      </section>

      {/* 2. TASTE THE DIFFERENCE */}

      <section className="taste">
        <div
          className="anchor"
          ref={tasteAnchorRef}
        />

        <div
          className="copy"
          ref={copyRef}
        >
          <span className="eyebrow">
            Our Story
          </span>

          <h2>
            From <em>bean</em>
            <br />
            to your cup.
          </h2>

          <p>
            Every batch is roasted in small lots, within days
            of reaching your door. We work directly with farms
            we know by name, so what lands in your cup is fresh,
            traceable and honest, with nothing hidden and nothing
            rushed.
          </p>

          <ul className="stats">
            <li>
              <b>12</b>
              <span>Single origins</span>
            </li>

            <li>
              <b>48h</b>
              <span>Roast to doorstep</span>
            </li>

            <li>
              <b>100%</b>
              <span>Arabica beans</span>
            </li>
          </ul>

          <a className="more" href="#">
            Read our story →
          </a>
        </div>
      </section>

      {/* 3. PRODUCTS SECTION */}

      <section className="products">
        <div className="cards">
          {PRODUCTS.map((p, index) => (
            <div className="card" key={p.name}>

              {/* FIRST CARD - ESPRESSO IMAGE */}
              {index === 0 && (
                <Pic
                  type="espresso"
                  className="pic"
                />
              )}

              {/* SECOND CARD - IMAGE REMOVED */}
              {index === 1 && (
                <div
                  className="pic"
                  ref={cardAnchorRef}
                />
              )}

              {/* THIRD CARD - LATTE CUP IMAGE */}
              {index === 2 && (
                <div className="pic">
                  <Pic
                    type="latte"
                    className="card-photo"
                  />
                </div>
              )}

              <h4>{p.name}</h4>

              <span className="meta">
                {p.meta}
              </span>

              <p className="desc">
                {p.desc}
              </p>

              <div className="buy">
                <span className="price">
                  ₹{p.price}
                </span>

                <button className={p.active ? "on" : ""}>
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLYING LATTE CUP ANIMATION */}

      <div
        className="fly"
        ref={flyRef}
      >
        <Pic
          type="latte"
          onStatus={(ok) => {
            photoRef.current = ok;
          }}
        />
      </div>
    </>
  );
}
