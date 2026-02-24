"use client";

import { Easing, motion } from "framer-motion";

const C = "#FDC221";
const CDIM = "rgba(253, 194, 33, 0.3)";
const CFAINT = "rgba(253, 194, 33, 0.07)";

const trace = (delay: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.4, ease: "easeInOut" as Easing, delay },
      opacity: { duration: 0.2, delay },
    },
  },
});

const pop = (delay: number) => ({
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay, type: "spring" as const, stiffness: 400 },
  },
});

const chip = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 1.1, type: "spring" as const, stiffness: 180 },
  },
};

export function CircuitAnimation() {
  const leftPinYs = [168, 184, 200, 216];
  const rightPinYs = [168, 184, 200, 216];
  const topPinXs = [163, 190, 217];
  const bottomPinXs = [163, 190, 217];

  return (
    <motion.svg
      viewBox="0 0 380 380"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", maxWidth: 480 }}
      initial="hidden"
      animate="visible"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dot travel paths */}
        <path id="dp1" d="M 10,200 L 370,200" />
        <path id="dp2" d="M 190,18 L 190,362" />
        <path id="dp3" d="M 20,184 L 20,305 L 92,305" />
        <path id="dp4" d="M 360,216 L 360,75 L 288,75" />

        {/* Background dot grid pattern */}
        <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.6" fill={CDIM} />
        </pattern>
      </defs>

      {/* Faint dot grid */}
      <rect width="380" height="380" fill="url(#dotgrid)" opacity="0.4" />

      {/* ── LEFT TRACES ── */}
      <motion.path d="M 130,168 L 20,168" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.1)} />
      <motion.path d="M 130,184 L 20,184 L 20,305 L 92,305" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.3)} />
      <motion.path d="M 130,200 L 10,200" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.0)} />
      <motion.path d="M 130,216 L 20,216 L 20,75 L 92,75" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.5)} />

      {/* ── RIGHT TRACES ── */}
      <motion.path d="M 250,168 L 360,168" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.2)} />
      <motion.path d="M 250,184 L 360,184 L 360,305 L 288,305" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.4)} />
      <motion.path d="M 250,200 L 370,200" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.1)} />
      <motion.path d="M 250,216 L 360,216 L 360,75 L 288,75" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.6)} />

      {/* ── TOP TRACES ── */}
      <motion.path d="M 163,150 L 163,58 L 190,58" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.7)} />
      <motion.path d="M 190,150 L 190,18" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.8)} />
      <motion.path d="M 217,150 L 217,58 L 190,58" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.7)} />

      {/* ── BOTTOM TRACES ── */}
      <motion.path d="M 163,230 L 163,322 L 190,322" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.7)} />
      <motion.path d="M 190,230 L 190,362" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.8)} />
      <motion.path d="M 217,230 L 217,322 L 190,322" stroke={C} strokeWidth="1.5" fill="none" variants={trace(0.7)} />

      {/* ── VIA HOLES ── */}
      {([
        [20, 305], [20, 75], [360, 305], [360, 75],
        [190, 58], [190, 322],
      ] as [number, number][]).map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r={4.5}
          stroke={C} strokeWidth="1.5" fill="#000"
          filter="url(#glow)"
          variants={pop(1.2 + i * 0.06)}
        />
      ))}

      {/* ── CORNER PADS ── */}
      {([
        [82, 299, 22, 12], [82, 69, 22, 12],
        [276, 299, 22, 12], [276, 69, 22, 12],
      ] as [number, number, number, number][]).map(([x, y, w, h], i) => (
        <motion.rect
          key={i}
          x={x} y={y} width={w} height={h} rx={2}
          stroke={C} strokeWidth="1" fill={CFAINT}
          variants={pop(1.35 + i * 0.05)}
        />
      ))}

      {/* ── END COMPONENTS (resistors/caps) ── */}
      <motion.rect x="3" y="194" width="10" height="12" rx="2" stroke={C} strokeWidth="1" fill={CFAINT} variants={pop(1.5)} />
      <motion.rect x="367" y="194" width="10" height="12" rx="2" stroke={C} strokeWidth="1" fill={CFAINT} variants={pop(1.5)} />
      <motion.rect x="184" y="11" width="12" height="8" rx="2" stroke={C} strokeWidth="1" fill={CFAINT} variants={pop(1.6)} />
      <motion.rect x="184" y="361" width="12" height="8" rx="2" stroke={C} strokeWidth="1" fill={CFAINT} variants={pop(1.6)} />

      {/* ── CHIP BODY ── */}
      <motion.rect
        x={128} y={148} width={124} height={84} rx={6}
        stroke={C} strokeWidth="2" fill="#000"
        filter="url(#glow)"
        variants={chip}
      />
      <motion.rect
        x={140} y={160} width={100} height={60} rx={3}
        stroke={CDIM} strokeWidth="1" fill={CFAINT}
        variants={pop(1.25)}
      />

      {/* Chip label */}
      <motion.text
        x={190} y={191}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={C}
        fontSize="11"
        fontFamily="'Ethnocentric', monospace"
        fontWeight="bold"
        letterSpacing="1"
        variants={pop(1.3)}
      >
        WM-01
      </motion.text>
      <motion.text
        x={190} y={207}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={CDIM}
        fontSize="7"
        fontFamily="monospace"
        letterSpacing="0.5"
        variants={pop(1.4)}
      >
        WARNING MACHINES
      </motion.text>

      {/* ── CHIP PIN STUBS ── */}
      {leftPinYs.map((y, i) => (
        <motion.rect key={i} x={124} y={y - 3} width={4} height={6} fill={C} variants={pop(1.15)} />
      ))}
      {rightPinYs.map((y, i) => (
        <motion.rect key={i} x={252} y={y - 3} width={4} height={6} fill={C} variants={pop(1.15)} />
      ))}
      {topPinXs.map((x, i) => (
        <motion.rect key={i} x={x - 3} y={144} width={6} height={4} fill={C} variants={pop(1.15)} />
      ))}
      {bottomPinXs.map((x, i) => (
        <motion.rect key={i} x={x - 3} y={232} width={6} height={4} fill={C} variants={pop(1.15)} />
      ))}

      {/* ── ANIMATED DATA DOTS ── */}
      {/* Dot: left → right on center horizontal */}
      <circle r="3.5" fill={C} filter="url(#glow-strong)">
        <animateMotion dur="2.8s" repeatCount="indefinite" begin="1.6s">
          <mpath href="#dp1" />
        </animateMotion>
      </circle>

      {/* Dot: top → bottom on center vertical */}
      <circle r="3.5" fill={C} filter="url(#glow-strong)">
        <animateMotion dur="2.2s" repeatCount="indefinite" begin="2.1s">
          <mpath href="#dp2" />
        </animateMotion>
      </circle>

      {/* Dot: L-shape down-left */}
      <circle r="2.8" fill={C} filter="url(#glow)">
        <animateMotion dur="3.2s" repeatCount="indefinite" begin="1.9s">
          <mpath href="#dp3" />
        </animateMotion>
      </circle>

      {/* Dot: L-shape up-right */}
      <circle r="2.8" fill={C} filter="url(#glow)">
        <animateMotion dur="3.2s" repeatCount="indefinite" begin="2.5s">
          <mpath href="#dp4" />
        </animateMotion>
      </circle>
    </motion.svg>
  );
}
