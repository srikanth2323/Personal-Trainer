import React, { useState, useEffect, useRef } from 'react';
import {
  Dumbbell, Check, ChevronRight, ChevronLeft, RotateCcw, Info,
  X, SkipForward, Flame, Calendar, TrendingUp, Play, Loader2,
  ChevronDown, ChevronUp, Trophy, ClipboardList, Activity, Minus, Plus,
  Youtube
} from 'lucide-react';


// ===========================================================================
// THEME
// ===========================================================================

const COLORS = {
  bg: '#000000',
  surface: '#1C1E25',
  surface2: '#262932',
  border: '#31343E',
  text: '#F2F1ED',
  textMute: '#8E94A1',
  grayWhite: '#D6D8DC',
  upper: '#FF6A3D',
  lower: '#4C8DFF',
  success: '#3DDC97',
  warn: '#FFB03D',
};

const FONTS = {
  // System stacks only — no web fonts. Roboto on Android, SF on iOS, Segoe on
  // Windows. This is deliberate: the condensed display face (Oswald) read as
  // heavy and cramped on device, and system fonts render cleaner and load
  // instantly with no network dependency.
  display: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  body: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  mono: "ui-monospace, 'Roboto Mono', SFMono-Regular, Menlo, Consolas, monospace",
};


// ===========================================================================
// WORKOUT & FINISHER DATA
// ===========================================================================

const WORKOUTS = {
  A: [
    { name: 'Barbell Back Squat', equip: 'Straight bar + plates', region: 'Lower', muscle: 'Quads / Glutes', reps: '12–15', targets: ['quads', 'glutes'],
      cues: ['Bar rests on upper traps, feet shoulder-width, toes slightly out', 'Brace core, break at hips and knees together, chest up', 'Descend until thighs at least parallel, knees track over toes', 'Drive through mid-foot to stand, avoid letting knees cave in'] },
    { name: 'Flat DB Bench Press', equip: 'Dumbbells + bench', region: 'Upper', muscle: 'Chest (mid) / Triceps', reps: '12–15', targets: ['chest', 'triceps'],
      cues: ['Lie on bench, feet flat on floor, natural arch in lower back', 'Dumbbells start at chest level, elbows ~45° from torso', 'Press up and slightly in until arms extend, avoid locking out hard', 'Lower under control back to chest level'] },
    { name: 'Bent-Over Barbell Row', equip: 'Straight bar + plates', region: 'Upper', muscle: 'Back / Biceps', reps: '12–15', targets: ['back', 'biceps'],
      cues: ['Hinge forward ~45°, knees soft, back flat, core braced', 'Let bar hang at arm\u2019s length, grip just outside hips', 'Pull bar to lower ribs, elbows drive back', 'Lower under control, avoid jerking with the lower back'] },
    { name: 'Barbell Romanian Deadlift', equip: 'Straight bar + plates', region: 'Lower', muscle: 'Hamstrings / Glutes', reps: '12–15', targets: ['hamstrings', 'glutes'],
      cues: ['Stand tall, bar close to thighs, soft knee bend', 'Hinge at hips, push hips back, bar slides down thighs', 'Lower until you feel a hamstring stretch, keep back flat', 'Drive hips forward to stand, squeeze glutes at top'] },
    { name: 'Standing Barbell Overhead Press', equip: 'Straight bar + plates', region: 'Upper', muscle: 'Shoulders (front) / Triceps', reps: '12–15', targets: ['shoulders', 'triceps'],
      cues: ['Feet hip-width, bar at collarbone, grip just outside shoulders', 'Brace core and glutes, avoid leaning back excessively', 'Press bar straight up, head moves back then through at top', 'Lower under control back to collarbone'] },
    { name: 'EZ Bar Bicep Curl', equip: 'EZ bar + plates (inner grips)', region: 'Upper', muscle: 'Biceps (long head)', reps: '12–15', targets: ['biceps'],
      cues: ['Grip the angled inner grips, elbows tucked to sides', 'Curl up without swinging the torso or flaring elbows forward', 'Squeeze at the top, lower under control to full extension', 'Keep wrists neutral, following the bar\u2019s angle'] },
    { name: 'Bulgarian Split Squat', equip: 'Dumbbells + bench', region: 'Lower', muscle: 'Quad / Glute (unilateral)', reps: '10–12/side', targets: ['quads', 'glutes'],
      cues: ['Rear foot up on bench, front foot far enough forward', 'Torso upright, dumbbells at sides', 'Lower straight down until front thigh nears parallel', 'Push through front heel, keep knee tracking over toes'] },
    { name: 'DB Lateral Raise', equip: 'Dumbbells', region: 'Upper', muscle: 'Side Delts', reps: '12–15', targets: ['shoulders'],
      cues: ['Stand tall, dumbbells at sides, slight bend in the elbows', 'Raise arms out to the sides to roughly shoulder height, leading with elbows', 'Avoid shrugging shoulders up toward your ears as you lift', 'Lower slowly under control back to your sides'] },
    { name: 'Lateral Lunge', equip: 'Bodyweight or light DBs', region: 'Lower', muscle: 'Inner thigh / Glutes (medius)', reps: '10–12/side', targets: ['adductors', 'glutes', 'quads'],
      cues: ['Stand tall, step wide to one side, keeping the trailing leg straight', 'Push hips back and bend the stepping knee, keeping that foot flat', 'Feel a stretch along the inner thigh of the straight leg', 'Push off the bent leg to return to standing — keep the torso upright'] },
    { name: 'Push-Ups (feet elevated on bench)', equip: 'Bodyweight + bench', region: 'Upper', muscle: 'Chest (upper) / Triceps', reps: 'To near-failure', targets: ['chest', 'triceps'],
      cues: ['Hands slightly wider than shoulders, body in a straight line', 'Feet on bench for added load, core and glutes braced', 'Lower chest toward the floor, elbows ~45° from torso', 'Press back up without letting hips sag or pike'] },
    { name: 'Standing Calf Raise', equip: 'Dumbbells (or bar on back)', region: 'Lower', muscle: 'Calves', reps: '15–20', targets: ['calves'],
      cues: ['Stand tall, weight at sides or on back, feet hip-width', 'Rise onto toes as high as possible, pause briefly', 'Lower slowly past the start position for a full stretch', 'Keep knees soft, not locked out'] },
    { name: 'Push-Ups (hands elevated on bench)', equip: 'Bodyweight + bench', region: 'Upper', muscle: 'Chest (lower) / Triceps', reps: 'To near-failure', targets: ['chest', 'triceps'],
      cues: ['Hands on the bench edge, feet on the floor — opposite setup to your other push-up variant', 'Body forms a straight line, core braced', 'Lower your chest toward the bench, elbows at ~45°', 'Press back up — this angle biases lower chest, where the feet-elevated version biases upper chest'] },
    { name: 'Bent-Over DB Reverse Fly', equip: 'Dumbbells', region: 'Upper', muscle: 'Rear delts / Upper back', reps: '12–15', targets: ['rearDelts', 'back'],
      cues: ['Hinge forward ~45°, flat back, dumbbells hanging below shoulders', 'Slight bend in elbows, raise arms out to the sides in a wide arc', 'Squeeze shoulder blades together at the top', 'Lower under control, avoid using momentum'] },
  ],
  B: [
    { name: 'Barbell Deadlift', equip: 'Straight bar + plates', region: 'Lower', muscle: 'Posterior chain / Back', reps: '10–12', targets: ['hamstrings', 'glutes', 'back'],
      cues: ['Bar over mid-foot, shins close, grip just outside legs', 'Flat back, chest up, hips low enough to load the legs', 'Drive through the floor, bar stays close to shins/thighs', 'Stand tall with hips through, avoid hyperextending at top'] },
    { name: 'Pike Push-Up', equip: 'Bodyweight (+ bench for progression)', region: 'Upper', muscle: 'Chest (upper) / Shoulders (front)', reps: 'To near-failure', targets: ['chest', 'shoulders'],
      cues: ['Start in a downward-dog position, hands shoulder-width, hips high', 'Bend elbows to lower the top of your head toward the floor', 'Keep hips high — a steeper hip angle shifts work to the shoulders', 'Press back up; elevate feet on the bench later to progress'] },
    { name: 'Front-Foot-Elevated Split Squat', equip: 'Straight bar + small plate', region: 'Lower', muscle: 'Quads / Glutes', reps: '10–12/side', targets: ['quads', 'glutes'],
      cues: ['Front foot slightly elevated (or standard lunge stance), bar on back', 'Lower straight down, back knee toward the floor', 'Front knee tracks over toes, torso stays upright', 'Push through the front heel to return to start'] },
    { name: 'Single-Arm DB Row', equip: 'Dumbbell + bench', region: 'Upper', muscle: 'Back / Lats', reps: '12–15/side', targets: ['back', 'biceps'],
      cues: ['One knee and hand on bench, flat back, other foot on floor', 'Dumbbell hangs straight down, pull to hip, elbow drives back', 'Squeeze at the top, lower under full control', 'Avoid rotating the torso to cheat the weight up'] },
    { name: 'Bench Dips', equip: 'Bodyweight + bench', region: 'Upper', muscle: 'Triceps / Chest (lower)', reps: 'To near-failure', targets: ['triceps', 'chest'],
      cues: ['Hands on bench edge, fingers forward, feet out on the floor', 'Lower body by bending elbows to ~90°, elbows point back', 'Keep hips close to the bench, shoulders shouldn\u2019t roll forward', 'Press through the palms to return to start'] },
    { name: 'Barbell Hip Thrust', equip: 'Straight bar + plates + bench', region: 'Lower', muscle: 'Glutes (max) / Hamstrings', reps: '12–15', targets: ['glutes', 'hamstrings'],
      cues: ['Upper back on bench, bar across hips (pad for comfort), feet flat', 'Drive through heels, hips up until torso lines up with thighs', 'Squeeze glutes hard at the top, avoid over-arching the back', 'Lower under control, don\u2019t let hips fully drop between reps'] },
    { name: 'Barbell Shrugs', equip: 'Straight bar + plates', region: 'Upper', muscle: 'Traps / Grip', reps: '15–20', targets: ['traps', 'forearms'],
      cues: ['Stand tall, bar at arm\u2019s length in front of thighs', 'Shrug shoulders straight up toward your ears — no rolling motion', 'Pause briefly at the top and squeeze', 'Lower under control; let the grip work rather than using the arms to lift'] },
    { name: 'Wide-Grip EZ Bar Curl', equip: 'EZ bar + plates (outer grips)', region: 'Upper', muscle: 'Biceps (short head)', reps: '12–15', targets: ['biceps'],
      cues: ['Grip the wide outer bends of the same EZ bar', 'Elbows tucked to sides, curl up under control', 'Squeeze at the top, focusing on the inner/short head', 'Lower slowly — same bar as your other curl, just the outer grips'] },
    { name: 'Standing Calf Raise', equip: 'Dumbbells (or bar on back)', region: 'Lower', muscle: 'Calves', reps: '15–20', targets: ['calves'],
      cues: ['Stand tall, weight at sides or on back, feet hip-width', 'Rise onto toes as high as possible, pause briefly', 'Lower slowly past the start position for a full stretch', 'Keep knees soft, not locked out'] },
    { name: 'DB Standing Shoulder Press', equip: 'Dumbbells', region: 'Upper', muscle: 'Shoulders (front/side)', reps: '10–12', targets: ['shoulders'],
      cues: ['Stand tall, dumbbells at shoulder height, palms facing forward', 'Brace core, avoid leaning back excessively as you press', 'Press dumbbells straight overhead until arms extend', 'Lower under control back to shoulder height'] },
    { name: 'Bent-Over Wide-Grip DB Row', equip: 'Dumbbells', region: 'Upper', muscle: 'Rear delts / Upper back', reps: '12–15', targets: ['rearDelts', 'back'],
      cues: ['Hinge forward ~45°, flat back, dumbbells hanging below shoulders', 'Pull elbows out wide and up toward shoulder height, like drawing a bow', 'Squeeze shoulder blades together at the top', 'Lower under control, avoid using momentum'] },
    { name: 'Barbell Good Morning (light load)', equip: 'Straight bar + light plates', region: 'Lower', muscle: 'Hamstrings / Lower back', reps: '12–15', targets: ['hamstrings', 'lowerBack'],
      cues: ['Bar on upper back like a squat, feet hip-width, soft knees', 'Hinge at the hips, pushing them back, flat back throughout', 'Lower torso until you feel a hamstring stretch', 'Drive hips forward to return upright — keep this one light'] },
    { name: 'Bent-Over DB Reverse Fly', equip: 'Dumbbells', region: 'Upper', muscle: 'Rear delts / Upper back', reps: '12–15', targets: ['rearDelts', 'back'],
      cues: ['Hinge forward ~45°, flat back, dumbbells hanging below shoulders', 'Slight bend in elbows, raise arms out to the sides in a wide arc', 'Squeeze shoulder blades together at the top', 'Lower under control, avoid using momentum'] },
  ],
};

const FINISHERS = {
  A: { label: 'Core Finisher', items: [
      { name: 'Plank', target: '3 x 30–45 sec', targets: ['abs'], cues: ['Forearms on floor, elbows under shoulders, straight line head-to-heel', 'Brace core and glutes, don\u2019t let hips sag or pike', 'Breathe steadily, hold position'] },
      { name: 'Bodyweight Leg Raises', target: '2 x 15', targets: ['abs'], cues: ['Lie flat, hands under lower back or at sides', 'Legs straight, lift to ~90°, lower slowly without touching floor', 'Keep lower back pressed toward the floor throughout'] },
    ]},
  B: { label: 'Core Finisher', items: [
      { name: 'Side Plank', target: '3 x 20–30 sec/side', targets: ['obliques'], cues: ['Forearm on floor under shoulder, straight line, feet stacked', 'Lift hips, no sagging, hold and breathe steadily'] },
      { name: 'DB Russian Twists', target: '2 x 15/side', targets: ['obliques'], cues: ['Sit with knees bent, lean back slightly, feet on floor or lifted', 'Rotate torso side to side, tapping near the floor', 'Keep chest up, move from the core not just the arms'] },
      { name: 'Superman', target: '2 x 15', targets: ['lowerBack'], cues: ['Lie face down, arms extended forward', 'Lift chest, arms and legs off the floor together', 'Hold briefly, squeeze lower back and glutes, lower with control'] },
    ]},
};


// ===========================================================================
// FORMATTING & GENERAL HELPERS
// ===========================================================================

function pad2(n) { return n.toString().padStart(2, '0'); }
function fmtTime(s) { return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`; }
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function isWithinDays(iso, days) {
  return (Date.now() - new Date(iso).getTime()) <= days * 86400000;
}
function ytSearchUrl(name) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' correct form tutorial')}`;
}
const WEIGHT_OPTIONS = ['Bodyweight', ...Array.from({ length: 41 }, (_, i) => i * 2.5)];
function formatWeight(w) {
  if (w === undefined || w === null || w === '') return '—';
  return w === 'Bodyweight' ? 'Bodyweight' : `${w} kg`;
}
function isBodyweightExercise(ex) {
  return ex.reps === 'To near-failure';
}

function RegionTag({ region }) {
  const color = region === 'Upper' ? COLORS.upper : COLORS.lower;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: color + '20', color, fontFamily: FONTS.mono, letterSpacing: '0.03em' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {region === 'Upper' ? 'UPPER' : 'LOWER'}
    </span>
  );
}

// Simplified anatomical points on a 100x220 mannequin viewBox, split front/back

// ===========================================================================
// MUSCLE DIAGRAMS
// ===========================================================================

const MUSCLE_POINTS = {
  // Front view — pecs and delts split into left/right so the shape reads as
  // a body, not one centered blob. Limb muscles are rotated ellipses angled
  // along the actual arm/leg line rather than sitting axis-aligned.
  chest:      { view: 'front', label: 'Chest',      points: [{ cx: 41, cy: 39, rx: 9, ry: 7 }, { cx: 59, cy: 39, rx: 9, ry: 7 }] },
  shoulders:  { view: 'front', label: 'Shoulders',   points: [{ cx: 26, cy: 34, rx: 6, ry: 6 }, { cx: 74, cy: 34, rx: 6, ry: 6 }] },
  biceps:     { view: 'front', label: 'Biceps',      points: [{ cx: 22, cy: 50, rx: 5, ry: 13, rot: -10 }, { cx: 78, cy: 50, rx: 5, ry: 13, rot: 10 }] },
  forearms:   { view: 'front', label: 'Forearms',    points: [{ cx: 17, cy: 78, rx: 4, ry: 13, rot: -6 }, { cx: 83, cy: 78, rx: 4, ry: 13, rot: 6 }] },
  abs:        { view: 'front', label: 'Abs',         points: [{ cx: 50, cy: 61, rx: 7, ry: 12 }] },
  obliques:   { view: 'front', label: 'Obliques',    points: [{ cx: 38, cy: 63, rx: 4, ry: 10 }, { cx: 62, cy: 63, rx: 4, ry: 10 }] },
  quads:      { view: 'front', label: 'Quads',       points: [{ cx: 37, cy: 108, rx: 8, ry: 24 }, { cx: 63, cy: 108, rx: 8, ry: 24 }] },
  adductors:  { view: 'front', label: 'Inner thigh', points: [{ cx: 44, cy: 110, rx: 3, ry: 19 }, { cx: 56, cy: 110, rx: 3, ry: 19 }] },

  // Back view
  traps:      { view: 'back',  label: 'Traps',       points: [{ cx: 50, cy: 35, rx: 13, ry: 7 }] },
  rearDelts:  { view: 'back',  label: 'Rear delts',  points: [{ cx: 26, cy: 34, rx: 6, ry: 6 }, { cx: 74, cy: 34, rx: 6, ry: 6 }] },
  back:       { view: 'back',  label: 'Back / Lats', points: [
                 { shape: 'path', d: 'M33,41 Q26,56 33,70 L45,66 Q40,52 42,41 Z' },
                 { shape: 'path', d: 'M67,41 Q74,56 67,70 L55,66 Q60,52 58,41 Z' },
               ] },
  triceps:    { view: 'back',  label: 'Triceps',     points: [{ cx: 22, cy: 50, rx: 5, ry: 13, rot: -10 }, { cx: 78, cy: 50, rx: 5, ry: 13, rot: 10 }] },
  lowerBack:  { view: 'back',  label: 'Lower back',  points: [{ cx: 50, cy: 75, rx: 9, ry: 7 }] },
  glutes:     { view: 'back',  label: 'Glutes',      points: [{ cx: 50, cy: 86, rx: 13, ry: 9 }] },
  hamstrings: { view: 'back',  label: 'Hamstrings',  points: [{ cx: 37, cy: 112, rx: 8, ry: 22 }, { cx: 63, cy: 112, rx: 8, ry: 22 }] },
  calves:     { view: 'back',  label: 'Calves',      points: [{ cx: 37, cy: 156, rx: 6, ry: 18 }, { cx: 63, cy: 156, rx: 6, ry: 18 }] },
};

// A single muscle "point" is either a rotated ellipse or a hand-drawn path
// (used for the lat wings, which don't read well as an ellipse). Both callers
// (single-highlight card, multi-color heat map) share this renderer so the
// body only needs to be described once.
function renderMusclePoint(pt, key, color, opacity, strokeWidth) {
  if (pt.shape === 'path') {
    return <path d={pt.d} fill={color} fillOpacity={opacity} stroke={color} strokeWidth={strokeWidth} />;
  }
  const el = <ellipse cx={pt.cx} cy={pt.cy} rx={pt.rx} ry={pt.ry} fill={color} fillOpacity={opacity} stroke={color} strokeWidth={strokeWidth} />;
  return pt.rot ? <g transform={`rotate(${pt.rot} ${pt.cx} ${pt.cy})`}>{el}</g> : el;
}

// Shared body outline: defined shoulders, a tapered waist, and limbs angled
// slightly away from the torso so muscle overlays don't sit on top of each
// other. Used by both the single-highlight card and the heat map.
function BodySilhouette({ fill, stroke, strokeWidth = 0.8 }) {
  return (
    <g fill={fill} stroke={stroke} strokeWidth={strokeWidth}>
      <circle cx="50" cy="16" r="10.5" />
      <rect x="46" y="24" width="8" height="7" rx="2" />
      <path d="M28,33 Q50,26 72,33 L67,80 Q50,86 33,80 Z" />
      <ellipse cx="22" cy="50" rx="7" ry="17" transform="rotate(-10 22 50)" />
      <ellipse cx="17" cy="80" rx="5.5" ry="15" transform="rotate(-6 17 80)" />
      <ellipse cx="78" cy="50" rx="7" ry="17" transform="rotate(10 78 50)" />
      <ellipse cx="83" cy="80" rx="5.5" ry="15" transform="rotate(6 83 80)" />
      <ellipse cx="37" cy="108" rx="9.5" ry="27" />
      <ellipse cx="63" cy="108" rx="9.5" ry="27" />
      <ellipse cx="37" cy="158" rx="7" ry="20" />
      <ellipse cx="63" cy="158" rx="7" ry="20" />
      <rect x="30" y="174" width="15" height="7" rx="3" />
      <rect x="55" y="174" width="15" height="7" rx="3" />
    </g>
  );
}

function MannequinSVG({ view, highlightKeys }) {
  const active = highlightKeys.filter(k => MUSCLE_POINTS[k] && MUSCLE_POINTS[k].view === view);
  return (
    <svg viewBox="0 0 100 220" width="100%" height="100%">
      <BodySilhouette fill={COLORS.surface2} stroke={COLORS.surface2} />
      {active.map((k, i) => {
        const m = MUSCLE_POINTS[k];
        const LOWER_KEYS = ['quads', 'hamstrings', 'glutes', 'calves', 'adductors'];
        const color = LOWER_KEYS.includes(k) ? COLORS.lower : COLORS.upper;
        return m.points.map((p, j) => (
          <g key={`${i}-${j}`}>{renderMusclePoint(p, k, color, 0.55, 1)}</g>
        ));
      })}
    </svg>
  );
}

function MuscleDiagram({ targets }) {
  if (!targets || targets.length === 0) return null;
  const views = Array.from(new Set(targets.map(k => MUSCLE_POINTS[k] && MUSCLE_POINTS[k].view).filter(Boolean)));
  const labels = targets.map(k => MUSCLE_POINTS[k] && MUSCLE_POINTS[k].label).filter(Boolean);
  return (
    <div className="flex items-center gap-3 mt-3 mb-1">
      {views.map(v => (
        <div key={v} className="flex flex-col items-center" style={{ width: 64 }}>
          <div style={{ width: 56, height: 122 }}>
            <MannequinSVG view={v} highlightKeys={targets} />
          </div>
          <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: COLORS.textMute }}>{v}</div>
        </div>
      ))}
      <div className="flex flex-wrap gap-1.5">
        {labels.map((l, i) => (
          <span key={i} className="text-[10px] rounded-full px-2 py-0.5" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function StationTrack({ stations, day, currentRound, status }) {
  return (
    <div className="flex items-center gap-1.5 w-full">
      {stations.map((ex, i) => {
        const key = `${currentRound}-${i}`;
        const st = status[key];
        const color = ex.region === 'Upper' ? COLORS.upper : COLORS.lower;
        return (
          <div key={i} className="flex-1 h-2 rounded-full" style={{
            backgroundColor: st === 'done' ? color : st === 'skipped' ? COLORS.border : COLORS.surface2,
            border: st === 'skipped' ? `1px solid ${COLORS.textMute}` : 'none',
          }} title={ex.name} />
        );
      })}
    </div>
  );
}


// ===========================================================================
// APP ROOT
// ===========================================================================

export default function PHATracker() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('home'); // home | workout | walking | medical | planner
  const [detail, setDetail] = useState(null); // {kind:'medical'|'workout'|'walking', title}
  const [historyTab, setHistoryTab] = useState('log');
  const [walkTab, setWalkTab] = useState('log');
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [notifyPrefs, setNotifyPrefs] = useState(NOTIFY_DEFAULTS);
  const [workoutView, setWorkoutView] = useState('train'); // train | history
  const [day, setDay] = useState('A');
  const [roundsTarget, setRoundsTarget] = useState(3);
  const [phase, setPhase] = useState('setup'); // setup | active | rest | finisher | done
  const [currentRound, setCurrentRound] = useState(1);
  const [stationIdx, setStationIdx] = useState(0);
  const [status, setStatus] = useState({});
  const [weights, setWeights] = useState({});
  const [weightInput, setWeightInput] = useState('');
  const [pendingAdvance, setPendingAdvance] = useState(null);
  const [restSeconds, setRestSeconds] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [finisherIdx, setFinisherIdx] = useState(0);
  const [finisherStatus, setFinisherStatus] = useState({});
  const [sessions, setSessions] = useState([]);
  const [circuitLogs, setCircuitLogs] = useState([]);
  const [walkLogs, setWalkLogs] = useState([]);
  const [medicalEntries, setMedicalEntries] = useState([]);
  const [medicalSchedule, setMedicalSchedule] = useState([]);
  const [people, setPeople] = useState([DEFAULT_PERSON]);
  const [customTypes, setCustomTypes] = useState({ cardio: [], activity: [] });
  const [fitnessSub, setFitnessSub] = useState('workout');
  const [activityTab, setActivityTab] = useState('log');
  const [hiddenMarkers, setHiddenMarkers] = useState([]);
  const [profile, setProfile] = useState({ age: '', sex: '', heightCm: '' });
  const [startTime, setStartTime] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const [saveError, setSaveError] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      let loadedSessions = [];
      let loadedSettings = null;
      let loadedCircuitLogs = [];
      let loadedWalkLogs = [];
      let loadedMedicalEntries = [];
      let loadedProfile = null;
      try {
        const r = await window.storage.get('pha-sessions', false);
        if (r && r.value) loadedSessions = JSON.parse(r.value);
      } catch (e) { /* no sessions yet */ }
      try {
        const r = await window.storage.get('pha-settings', false);
        if (r && r.value) loadedSettings = JSON.parse(r.value);
      } catch (e) { /* no settings yet */ }
      try {
        const r = await window.storage.get('sh-circuit-logs', false);
        if (r && r.value) loadedCircuitLogs = JSON.parse(r.value);
      } catch (e) { /* none yet */ }
      try {
        const r = await window.storage.get('sh-walk-logs', false);
        if (r && r.value) loadedWalkLogs = JSON.parse(r.value);
      } catch (e) { /* none yet */ }
      try {
        const r = await window.storage.get('medical-entries', false);
        if (r && r.value) loadedMedicalEntries = JSON.parse(r.value);
      } catch (e) { /* none yet */ }
      try {
        const r = await window.storage.get('pha-profile', false);
        if (r && r.value) loadedProfile = JSON.parse(r.value);
      } catch (e) { /* none yet */ }
      let loadedSchedule = [];
      try {
        const r = await window.storage.get('medical-schedule', false);
        if (r && r.value) loadedSchedule = JSON.parse(r.value);
      } catch (e) { /* none yet */ }
      setMedicalSchedule(Array.isArray(loadedSchedule) ? loadedSchedule : []);
      let loadedPeople = null;
      try {
        const r = await window.storage.get('medical-people', false);
        if (r && r.value) loadedPeople = JSON.parse(r.value);
      } catch (e) { /* none yet */ }
      if (Array.isArray(loadedPeople) && loadedPeople.length) setPeople(loadedPeople);

      try {
        const r = await window.storage.get('fitness-types', false);
        if (r && r.value) {
          const t = JSON.parse(r.value);
          setCustomTypes({ cardio: t.cardio || [], activity: t.activity || [] });
        }
      } catch (e) { /* none yet */ }

      let loadedHidden = [];
      try {
        const r = await window.storage.get('medical-hidden', false);
        if (r && r.value) loadedHidden = JSON.parse(r.value);
      } catch (e) { /* none yet */ }
      setHiddenMarkers(Array.isArray(loadedHidden) ? loadedHidden : []);
      let loadedTasks = [];
      try {
        const r = await window.storage.get('planner-tasks', false);
        if (r && r.value) loadedTasks = JSON.parse(r.value);
      } catch (e) { /* none yet */ }
      const cleanTasks = pruneOldTasks(Array.isArray(loadedTasks) ? loadedTasks : []);
      setTasks(cleanTasks);
      if (Array.isArray(loadedTasks) && cleanTasks.length !== loadedTasks.length) {
        window.storage.set('planner-tasks', JSON.stringify(cleanTasks), false).catch(() => {});
      }
      let loadedContacts = [];
      try {
        const r = await window.storage.get('planner-contacts', false);
        if (r && r.value) loadedContacts = JSON.parse(r.value);
      } catch (e) { /* none yet */ }
      setContacts(Array.isArray(loadedContacts) ? loadedContacts : []);
      try {
        const r = await window.storage.get('planner-notify', false);
        if (r && r.value) setNotifyPrefs({ ...NOTIFY_DEFAULTS, ...JSON.parse(r.value) });
      } catch (e) { /* defaults */ }
      setSessions(Array.isArray(loadedSessions) ? loadedSessions : []);
      setCircuitLogs(Array.isArray(loadedCircuitLogs) ? loadedCircuitLogs : []);
      setWalkLogs(Array.isArray(loadedWalkLogs) ? loadedWalkLogs : []);
      setMedicalEntries(Array.isArray(loadedMedicalEntries) ? loadedMedicalEntries : []);
      if (loadedProfile) setProfile(loadedProfile);
      if (loadedSettings) {
        if (loadedSettings.day) setDay(loadedSettings.day);
        if (loadedSettings.rounds) setRoundsTarget(loadedSettings.rounds);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    window.storage.set('pha-settings', JSON.stringify({ day, rounds: roundsTarget }), false).catch(() => {});
  }, [day, roundsTarget, loading]);

  const stations = WORKOUTS[day];

  function lastWeightFor(name) {
    for (const s of sessions) {
      const found = s.exercises && s.exercises.find(e => e.name === name);
      if (found && found.weight) return found.weight;
    }
    return '';
  }

  useEffect(() => {
    if (phase !== 'active') return;
    const ex = stations[stationIdx];
    const prior = weights[ex.name] ?? lastWeightFor(ex.name);
    if (prior !== undefined && prior !== '') {
      setWeightInput(prior);
    } else if (isBodyweightExercise(ex)) {
      setWeightInput('Bodyweight');
    } else {
      setWeightInput('');
    }
  }, [stationIdx, day, phase]);

  useEffect(() => {
    if (phase !== 'rest') return;
    if (restSeconds <= 0) {
      advanceAfterRest();
      return;
    }
    timerRef.current = setTimeout(() => setRestSeconds(s => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [phase, restSeconds]);

  function startSession() {
    setStatus({});
    setWeights({});
    setCurrentRound(1);
    setStationIdx(0);
    setFinisherIdx(0);
    setFinisherStatus({});
    setStartTime(Date.now());
    setPhase('active');
  }

  function advance(result) {
    const ex = stations[stationIdx];
    const updatedWeights = { ...weights };
    if (result === 'done' && weightInput !== '') updatedWeights[ex.name] = weightInput;
    setWeights(updatedWeights);
    const key = `${currentRound}-${stationIdx}`;
    setStatus(s => ({ ...s, [key]: result }));

    const isLastStation = stationIdx === stations.length - 1;
    const isLastRound = currentRound === roundsTarget;

    if (isLastStation && isLastRound) {
      setPhase('finisher');
      setFinisherIdx(0);
      setFinisherStatus({});
    } else if (isLastStation) {
      setPendingAdvance('round');
      setPhase('rest');
      setRestSeconds(75);
    } else {
      setPendingAdvance('station');
      setPhase('rest');
      setRestSeconds(20);
    }
  }

  function advanceAfterRest() {
    if (pendingAdvance === 'round') {
      setCurrentRound(r => r + 1);
      setStationIdx(0);
    } else {
      setStationIdx(i => i + 1);
    }
    setPendingAdvance(null);
    setPhase('active');
  }

  function skipRest() {
    clearTimeout(timerRef.current);
    setRestSeconds(0);
  }

  function finishSession(finalWeights, finalFinisherStatus) {
    const finisherItems = FINISHERS[day].items;
    const finisherCompleted = Object.values(finalFinisherStatus || {}).filter(v => v === 'done').length;
    const durationMin = startTime ? Math.max(1, Math.round((Date.now() - startTime) / 60000)) : null;
    const record = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      day,
      rounds: roundsTarget,
      durationMin,
      exercises: [
        ...stations.map(ex => ({ name: ex.name, weight: finalWeights[ex.name] || '' })),
        // Core finishers are part of the session's work, so record them as
        // exercises too — otherwise abs/obliques never show in any analysis.
        ...finisherItems
          .filter(it => (finalFinisherStatus || {})[it.name] === 'done')
          .map(it => ({ name: it.name, weight: 'Bodyweight', finisher: true })),
      ],
      finisherCompleted,
      finisherTotal: finisherItems.length,
    };
    const newSessions = [record, ...sessions];
    setSessions(newSessions);
    setPhase('done');
    window.storage.set('pha-sessions', JSON.stringify(newSessions), false)
      .then(res => { if (!res) setSaveError(true); })
      .catch(() => setSaveError(true));
  }

  function finisherAdvance(result) {
    const items = FINISHERS[day].items;
    const updatedFinisherStatus = { ...finisherStatus, [finisherIdx]: result };
    setFinisherStatus(updatedFinisherStatus);
    if (finisherIdx === items.length - 1) {
      finishSession(weights, updatedFinisherStatus);
    } else {
      setFinisherIdx(i => i + 1);
    }
  }

  function quitSession() {
    setPhase('setup');
    clearTimeout(timerRef.current);
  }

  function endSessionEarly() {
    clearTimeout(timerRef.current);
    const durationMin = startTime ? Math.max(1, Math.round((Date.now() - startTime) / 60000)) : null;

    if (phase === 'finisher') {
      const finisherItems = FINISHERS[day].items;
      const finisherCompleted = Object.values(finisherStatus).filter(v => v === 'done').length;
      const record = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        day,
        rounds: roundsTarget,
        roundsTarget,
        partial: finisherCompleted < finisherItems.length,
        durationMin,
        exercises: [
          ...stations.map(ex => ({ name: ex.name, weight: weights[ex.name] || '' })),
          ...finisherItems
            .filter(it => finisherStatus[it.name] === 'done')
            .map(it => ({ name: it.name, weight: 'Bodyweight', finisher: true })),
        ],
        finisherCompleted,
        finisherTotal: finisherItems.length,
      };
      const newSessions = [record, ...sessions];
      setSessions(newSessions);
      setPhase('done');
      window.storage.set('pha-sessions', JSON.stringify(newSessions), false)
        .then(res => { if (!res) setSaveError(true); })
        .catch(() => setSaveError(true));
      return;
    }

    const reachedIdx = new Set(Object.keys(status).map(k => parseInt(k.split('-')[1], 10)));
    if (reachedIdx.size === 0) {
      // nothing logged yet — nothing meaningful to save
      quitSession();
      return;
    }
    const exList = stations
      .filter((ex, i) => reachedIdx.has(i))
      .map(ex => ({ name: ex.name, weight: weights[ex.name] || '' }));
    const record = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      day,
      rounds: currentRound,
      roundsTarget,
      partial: true,
      durationMin,
      exercises: exList,
      finisherCompleted: 0,
      finisherTotal: FINISHERS[day].items.length,
    };
    const newSessions = [record, ...sessions];
    setSessions(newSessions);
    setPhase('done');
    window.storage.set('pha-sessions', JSON.stringify(newSessions), false)
      .then(res => { if (!res) setSaveError(true); })
      .catch(() => setSaveError(true));
  }

  function saveCircuitLog(entry, sessionId) {
    // A session has at most one Samsung Health record — update in place rather
    // than stacking duplicates when it's edited.
    const existing = sessionId ? circuitLogs.find(c => c.sessionId === sessionId) : null;
    let updated;
    if (existing) {
      updated = circuitLogs.map(c => c.id === existing.id ? { ...c, ...entry } : c);
    } else {
      const record = { id: Date.now().toString(), date: new Date().toISOString(), sessionId: sessionId || null, ...entry };
      updated = [record, ...circuitLogs];
    }
    setCircuitLogs(updated);
    window.storage.set('sh-circuit-logs', JSON.stringify(updated), false).catch(() => {});
  }

  function saveWalkLog(entry) {
    const record = {
      id: entry.id || Date.now().toString(),
      date: entry.date || new Date().toISOString(),
      mode: entry.mode || 'cardio',
      type: entry.type || DEFAULT_CARDIO,
      ...entry,
    };
    if (entry.id) {
      const updated = walkLogs.map(w => w.id === entry.id ? { ...w, ...record } : w);
      setWalkLogs(updated);
      window.storage.set('sh-walk-logs', JSON.stringify(updated), false).catch(() => {});
      return;
    }
    const updated = [record, ...walkLogs];
    setWalkLogs(updated);
    window.storage.set('sh-walk-logs', JSON.stringify(updated), false).catch(() => {});
  }

  function updateMedicalEntry(entry) {
    const updated = medicalEntries.map(e => e.id === entry.id ? { ...e, ...entry } : e);
    setMedicalEntries(updated);
    window.storage.set('medical-entries', JSON.stringify(updated), false).catch(() => {});
  }

  function saveMedicalEntry(entry) {
    if (entry.id) { updateMedicalEntry(entry); return; }
    const record = { id: Date.now().toString(), date: entry.date || new Date().toISOString(), ...entry };
    const updated = [record, ...medicalEntries];
    setMedicalEntries(updated);
    window.storage.set('medical-entries', JSON.stringify(updated), false).catch(() => {});
  }

  function saveProfile(p) {
    setProfile(p);
    window.storage.set('pha-profile', JSON.stringify(p), false).catch(() => {});
  }

  function updateSession(updated) {
    const list = sessions.map(x => x.id === updated.id ? { ...x, ...updated } : x);
    setSessions(list);
    window.storage.set('pha-sessions', JSON.stringify(list), false).catch(() => {});
  }

  function deleteSession(id) {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    window.storage.set('pha-sessions', JSON.stringify(updated), false).catch(() => {});
    // also drop any Samsung Health circuit log tied to that session
    const updatedCircuit = circuitLogs.filter(c => c.sessionId !== id);
    if (updatedCircuit.length !== circuitLogs.length) {
      setCircuitLogs(updatedCircuit);
      window.storage.set('sh-circuit-logs', JSON.stringify(updatedCircuit), false).catch(() => {});
    }
  }

  function deleteWalk(id) {
    const updated = walkLogs.filter(w => w.id !== id);
    setWalkLogs(updated);
    window.storage.set('sh-walk-logs', JSON.stringify(updated), false).catch(() => {});
  }

  function deleteMarkerSeries(title) {
    const updated = medicalEntries.filter(e => e.title !== title);
    setMedicalEntries(updated);
    window.storage.set('medical-entries', JSON.stringify(updated), false).catch(() => {});
    const h = hiddenMarkers.filter(t => t !== title);
    if (h.length !== hiddenMarkers.length) {
      setHiddenMarkers(h);
      window.storage.set('medical-hidden', JSON.stringify(h), false).catch(() => {});
    }
  }

  function persistTasks(list) {
    setTasks(list);
    window.storage.set('planner-tasks', JSON.stringify(list), false).catch(() => {});
  }
  function saveTask(task) {
    const existing = tasks.find(t => t.id === task.id);
    if (existing) {
      persistTasks(tasks.map(t => t.id === task.id ? { ...existing, ...task, history: existing.history || [] } : t));
      return;
    }
    const created = {
      ...task,
      id: task.id || Date.now().toString(),
      status: 'open',
      done: false,
      history: [{ at: new Date().toISOString(), action: 'created' }],
    };
    persistTasks([created, ...tasks]);
  }
  function deleteTask(id) { persistTasks(tasks.filter(t => t.id !== id)); }
  function completeTask(id) {
    persistTasks(tasks.map(t => {
      if (t.id !== id) return t;
      if (t.repeat && t.repeat.freq !== 'none') {
        // a repeating task rolls forward instead of closing
        const rolled = withHistory(t, 'done', `Occurrence on ${fmtDate(t.targetDate)} completed`);
        return { ...rolled, prevTargetDate: t.targetDate, targetDate: nextOccurrence(t.targetDate, t.repeat), status: 'open', done: false };
      }
      return { ...withHistory(t, 'done'), status: 'done', done: true };
    }));
  }

  function undoTask(id) {
    persistTasks(tasks.map(t => {
      if (t.id !== id) return t;
      const restored = withHistory(t, 'reopened');
      const base = { ...restored, status: 'open', done: false, cancelReason: '' };
      // if a repeat had rolled forward, put it back where it was
      if (t.prevTargetDate) {
        return { ...base, targetDate: t.prevTargetDate, prevTargetDate: undefined };
      }
      return base;
    }));
  }

  function postponeTask(id, newDateIso, note) {
    persistTasks(tasks.map(t => {
      if (t.id !== id) return t;
      const h = withHistory(t, 'postponed', `${fmtDate(t.targetDate)} → ${fmtDate(newDateIso)}${note ? ' · ' + note : ''}`);
      return { ...h, targetDate: newDateIso, status: 'postponed', done: false, postponeCount: (t.postponeCount || 0) + 1 };
    }));
  }

  function cancelTask(id, reason) {
    if (!reason || !reason.trim()) return;
    persistTasks(tasks.map(t => {
      if (t.id !== id) return t;
      return { ...withHistory(t, 'cancelled', reason.trim()), status: 'cancelled', done: false, cancelReason: reason.trim() };
    }));
  }

  function saveNotifyPrefs(next) {
    setNotifyPrefs(next);
    window.storage.set('planner-notify', JSON.stringify(next), false).catch(() => {});
  }

  function rememberContact(c) {
    if (!c || !c.name) return;
    const exists = contacts.find(x => x.name === c.name && x.phone === c.phone && x.email === c.email);
    if (exists) return;
    const list = [{ name: c.name, phone: c.phone || '', email: c.email || '' }, ...contacts].slice(0, 200);
    setContacts(list);
    window.storage.set('planner-contacts', JSON.stringify(list), false).catch(() => {});
  }

  function toggleHiddenMarker(title) {
    const updated = hiddenMarkers.includes(title)
      ? hiddenMarkers.filter(t => t !== title)
      : [...hiddenMarkers, title];
    setHiddenMarkers(updated);
    window.storage.set('medical-hidden', JSON.stringify(updated), false).catch(() => {});
  }

  function updateMedicalEntriesDate(ids, newDateIso) {
    const set = new Set(ids);
    const updated = medicalEntries.map(e => set.has(e.id) ? { ...e, date: newDateIso } : e);
    setMedicalEntries(updated);
    window.storage.set('medical-entries', JSON.stringify(updated), false).catch(() => {});
  }

  function persistSchedule(list) {
    setMedicalSchedule(list);
    window.storage.set('medical-schedule', JSON.stringify(list), false).catch(() => {});
  }
  function saveScheduleItem(item) {
    const existing = medicalSchedule.find(x => x.id === item.id);
    if (existing) {
      persistSchedule(medicalSchedule.map(x => x.id === item.id ? { ...existing, ...item } : x));
      return;
    }
    persistSchedule([{ ...item, id: item.id || Date.now().toString(), done: false }, ...medicalSchedule]);
  }
  function deleteScheduleItem(id) {
    persistSchedule(medicalSchedule.filter(x => x.id !== id));
  }
  function toggleScheduleDone(id) {
    persistSchedule(medicalSchedule.map(x => {
      if (x.id !== id) return x;
      // repeating items (e.g. a quarterly test) roll forward rather than close
      if (!x.done && x.repeat && x.repeat.freq !== 'none') {
        return { ...x, dueDate: nextOccurrence(x.dueDate, x.repeat), lastDone: new Date().toISOString() };
      }
      return { ...x, done: !x.done };
    }));
  }
  function addCustomType(mode, name) {
    const clean = String(name || '').trim();
    if (!clean) return;
    const list = customTypes[mode] || [];
    if (list.includes(clean)) return;
    const next = { ...customTypes, [mode]: [...list, clean] };
    setCustomTypes(next);
    window.storage.set('fitness-types', JSON.stringify(next), false).catch(() => {});
  }

  function savePeople(list) {
    const clean = Array.from(new Set(list.map(x => x.trim()).filter(Boolean)));
    const next = clean.length ? clean : [DEFAULT_PERSON];
    setPeople(next);
    window.storage.set('medical-people', JSON.stringify(next), false).catch(() => {});
  }

  function deleteMedicalEntries(ids) {
    const set = new Set(ids);
    const updated = medicalEntries.filter(e => !set.has(e.id));
    setMedicalEntries(updated);
    window.storage.set('medical-entries', JSON.stringify(updated), false).catch(() => {});
  }

  function deleteMedicalEntry(id) {
    const updated = medicalEntries.filter(e => e.id !== id);
    setMedicalEntries(updated);
    window.storage.set('medical-entries', JSON.stringify(updated), false).catch(() => {});
  }

  function saveMedicalEntriesBatch(entries) {
    const records = entries.map((e, i) => ({
      id: (Date.now() + i).toString(),
      date: e.date || new Date().toISOString(),
      ...e,
    }));
    const updated = [...records, ...medicalEntries];
    setMedicalEntries(updated);
    window.storage.set('medical-entries', JSON.stringify(updated), false).catch(() => {});
  }

  function saveRpe(sessionId, rpe) {
    const updated = sessions.map(s => s.id === sessionId ? { ...s, rpe } : s);
    setSessions(updated);
    window.storage.set('pha-sessions', JSON.stringify(updated), false).catch(() => {});
  }

  function goBack() {
    if (phase === 'finisher') {
      if (finisherIdx > 0) {
        setFinisherIdx(i => i - 1);
      } else {
        setPhase('active');
        setCurrentRound(roundsTarget);
        setStationIdx(stations.length - 1);
      }
      return;
    }
    if (phase !== 'active') return;
    if (stationIdx > 0) {
      setStationIdx(i => i - 1);
    } else if (currentRound > 1) {
      setCurrentRound(r => r - 1);
      setStationIdx(stations.length - 1);
    }
  }

  const canGoBack = phase === 'finisher' ? true : !(currentRound === 1 && stationIdx === 0);

  // --- Shared text from another app (Web Share Target) ---
  const [sharedDraft, setSharedDraft] = useState(null);
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const shared = [q.get('title'), q.get('text'), q.get('url')].filter(Boolean).join('\n');
      if (shared) {
        const draft = parseSharedMessage(shared);
        if (draft) {
          setSharedDraft(draft);
          setScreen('planner');
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    } catch (e) { /* ignore malformed share params */ }
  }, []);

  useEffect(() => { registerServiceWorker(); }, []);

  // --- Notification scheduler (foreground + catch-up on open) ---
  const notifyStateRef = useRef({ lastSummary: null, fired: {} });
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get('planner-notify-state', false);
        if (r && r.value) notifyStateRef.current = JSON.parse(r.value);
      } catch (e) { /* fresh state */ }
    })();
  }, []);

  useEffect(() => {
    if (loading || !notifyPrefs.enabled || notifyPermission() !== 'granted') return;

    function persistState() {
      window.storage.set('planner-notify-state', JSON.stringify(notifyStateRef.current), false).catch(() => {});
    }

    function tick() {
      const now = new Date();
      const st = notifyStateRef.current;
      let changed = false;

      // Morning summary — fires at/after the chosen hour, once per day.
      // If the app was closed at 8am, this catches up the next time it opens.
      if (notifyPrefs.morningSummary) {
        const today = dayKey(now);
        if (st.lastSummary !== today && now.getHours() >= (notifyPrefs.summaryHour ?? 8)) {
          const summary = buildMorningSummary(tasks, medicalSchedule);
          if (summary) showNotification(summary.title, summary.body, 'daily-summary');
          st.lastSummary = today;
          changed = true;
        }
      }

      // One hour before a timed task
      if (notifyPrefs.hourBefore) {
        tasks.filter(t => !isClosed(t) && taskHasTime(t)).forEach(t => {
          const start = taskStart(t).getTime();
          const lead = start - 60 * 60000;
          const key = `${t.id}:${dayKey(taskStart(t))}:${t.targetTime}`;
          if (st.fired[key]) return;
          if (now.getTime() >= lead && now.getTime() < start) {
            const mins = Math.max(1, Math.round((start - now.getTime()) / 60000));
            const bits = [`In ${mins} min`];
            if (t.location && !isMapsUrl(t.location)) bits.push(t.location);
            if (t.contactName) bits.push(`with ${t.contactName}`);
            showNotification(t.title, bits.join(' · '), `task-${t.id}`);
            st.fired[key] = true;
            changed = true;
          }
        });
        // keep the fired-map from growing forever
        const keys = Object.keys(st.fired);
        if (keys.length > 300) {
          st.fired = {};
          changed = true;
        }
      }

      // Medical items: a heads-up the day before, and again on the day
      (medicalSchedule || []).filter(x => !x.done).forEach(x => {
        const diff = daysBetween(now, x.dueDate);
        if (diff !== 0 && diff !== 1) return;
        if (now.getHours() < (notifyPrefs.summaryHour ?? 8)) return;
        const key = `med:${x.id}:${dayKey(x.dueDate)}:${diff}`;
        if (st.fired[key]) return;
        const meta = kindMeta(x.kind);
        const when = diff === 1 ? 'Tomorrow' : 'Today';
        const bits = [`${when} · ${meta.label}`, x.person];
        if (x.time) bits.push(scheduleStart(x).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }));
        showNotification(x.title, bits.join(' · '), `med-${x.id}-${diff}`);
        st.fired[key] = true;
        changed = true;
      });

      if (changed) persistState();
    }

    tick();
    const id = setInterval(tick, 60000);
    const onVisible = () => { if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible); };
  }, [loading, notifyPrefs, tasks, medicalSchedule]);

  // --- Hardware / OS back button ---
  const navBackRef = useRef(() => false);
  navBackRef.current = () => {
    if (detail) { setDetail(null); return true; }
    if (screen === 'fitness' && fitnessSub === 'workout' && workoutView === 'history') { setWorkoutView('train'); return true; }
    if (screen === 'fitness' && fitnessSub !== 'workout') { setFitnessSub('workout'); return true; }
    if (screen !== 'home') { setScreen('home'); return true; }
    return false;
  };
  useEffect(() => {
    // Keep one spare history entry so Back is delivered to us rather than exiting
    window.history.pushState({ app: true }, '');
    const onPop = () => {
      const handled = navBackRef.current();
      if (handled) window.history.pushState({ app: true }, '');
      // if not handled we're at home — let the OS close the app
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const totalStations = roundsTarget * stations.length + FINISHERS[day].items.length;
  const progressedCount = Object.keys(status).length + Object.keys(finisherStatus).length;
  const overallPct = phase === 'setup' ? 0 : Math.round((progressedCount / totalStations) * 100);

  const thisWeekCount = sessions.filter(s => isWithinDays(s.date, 7)).length;
  const latestBodyweightKg = (() => {
    const bwEntries = medicalEntries.filter(e => e.title === 'Bodyweight' && e.value != null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return bwEntries[0]?.value ?? null;
  })();

  const latestRestingHR = (() => {
    const rows = medicalEntries.filter(e => e.title === 'Resting Heart Rate' && e.value != null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return rows[0]?.value ?? null;
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <Loader2 className="animate-spin" color={COLORS.upper} size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: COLORS.bg, color: COLORS.text, fontFamily: FONTS.body }}>

      {/* Header */}
      <div className="px-4 pt-6 pb-3 sticky top-0 z-10" style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {screen === 'home' ? (
            <div className="text-lg font-semibold" style={{ fontFamily: FONTS.display }}>{greeting()}</div>
          ) : (
            <button onClick={() => { setScreen('home'); setWorkoutView('train'); }} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: COLORS.textMute }}>
              <ChevronLeft size={16} /> Home
            </button>
          )}
          {screen === 'fitness' && fitnessSub === 'workout' && phase === 'setup' && (
            <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
              <button onClick={() => setWorkoutView('train')} className="px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                style={{ backgroundColor: workoutView === 'train' ? COLORS.surface2 : 'transparent', color: workoutView === 'train' ? COLORS.text : COLORS.textMute }}>
                <Dumbbell size={13} /> Train
              </button>
              <button onClick={() => setWorkoutView('history')} className="px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                style={{ backgroundColor: workoutView === 'history' ? COLORS.surface2 : 'transparent', color: workoutView === 'history' ? COLORS.text : COLORS.textMute }}>
                <ClipboardList size={13} /> History
              </button>
            </div>
          )}
        </div>
        {screen === 'fitness' && fitnessSub === 'workout' && phase !== 'setup' && workoutView === 'train' && (
          <div className="max-w-lg mx-auto mt-3 h-1 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.surface2 }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${overallPct}%`, backgroundColor: COLORS.success }} />
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4 pb-10">
        {screen === 'home' && (
          <HomeScreen onSelect={s => setScreen(s)} sessions={sessions} walkLogs={walkLogs} tasks={tasks} medicalSchedule={medicalSchedule} />
        )}

        {screen === 'fitness' && (
          <FitnessScreen sub={fitnessSub} onSelectSub={k => { setFitnessSub(k); setDetail(null); }}>

        {fitnessSub === 'workout' && workoutView === 'train' && (
          <>
            {phase === 'setup' && (
              <SetupScreen day={day} setDay={setDay} roundsTarget={roundsTarget} setRoundsTarget={setRoundsTarget}
                onStart={startSession} lastSession={sessions[0]} stationsCount={stations.length} />
            )}

            {(phase === 'active' || phase === 'rest') && (
              <ActiveScreen
                day={day} stations={stations} stationIdx={stationIdx} currentRound={currentRound}
                roundsTarget={roundsTarget} status={status} phase={phase} restSeconds={restSeconds}
                pendingAdvance={pendingAdvance} weightInput={weightInput} setWeightInput={setWeightInput}
                showInfo={showInfo} setShowInfo={setShowInfo}
                onComplete={() => advance('done')} onSkip={() => advance('skipped')}
                onSkipRest={skipRest} onQuit={quitSession} onEndSession={endSessionEarly}
                onBack={goBack} canGoBack={canGoBack}
              />
            )}

            {phase === 'finisher' && (
              <FinisherScreen
                key={finisherIdx} day={day} items={FINISHERS[day].items} finisherIdx={finisherIdx}
                onComplete={() => finisherAdvance('done')} onSkip={() => finisherAdvance('skipped')}
                onQuit={quitSession} onEndSession={endSessionEarly}
                onBack={goBack} canGoBack={canGoBack}
              />
            )}

            {phase === 'done' && (
              <DoneScreen day={day} roundsTarget={roundsTarget} session={sessions[0]}
                onNewSession={() => setPhase('setup')}
                onViewHistory={() => setWorkoutView('history')} saveError={saveError}
                onSaveRpe={saveRpe} onSaveCircuitLog={saveCircuitLog}
                circuitLog={sessions[0] ? circuitLogs.find(c => c.sessionId === sessions[0].id) : null}
                profile={profile} latestRestingHR={latestRestingHR}
              />
            )}
          </>
        )}
        {fitnessSub === 'workout' && workoutView === 'history' && (
          detail && detail.kind === 'workout' ? (
            <SeriesDetailScreen
              title={detail.metric.title}
              readings={detail.metric.points.map((pt, i) => ({ id: i, value: pt.v, date: pt.date }))}
              unit={detail.metric.unit}
              onBack={() => setDetail(null)}
              note="Lower heart rate for the same load and duration over time generally points to improving cardiovascular fitness. A sustained rise at your usual weights is worth mentioning to your cardiologist." />
          ) : (
            <HistoryScreen sessions={sessions} thisWeekCount={thisWeekCount}
              expandedSession={expandedSession} setExpandedSession={setExpandedSession}
              circuitLogs={circuitLogs} onDeleteSession={deleteSession} onUpdateSession={updateSession}
              onSaveCircuitLog={saveCircuitLog}
              onOpenTrend={m => setDetail({ kind: 'workout', metric: m })}
              tab={historyTab} setTab={setHistoryTab}
              profile={profile} restingHR={latestRestingHR} weightKg={latestBodyweightKg}
              medicalEntries={medicalEntries} walkLogs={walkLogs} people={people} />
          )
        )}

        {(fitnessSub === 'cardio' || fitnessSub === 'activity') && (
          detail && detail.kind === fitnessSub ? (
            <SeriesDetailScreen
              title={detail.metric.title}
              readings={detail.metric.points.map((pt, i) => ({ id: i, value: pt.v, date: pt.date }))}
              unit={detail.metric.unit}
              onBack={() => setDetail(null)}
              note={fitnessSub === 'cardio'
                ? 'Covering a similar distance or pace at a lower average heart rate over time is one of the clearest signs of improving aerobic fitness.'
                : 'Steady activity adds up — these are your own readings over time, not a clinical measure.'} />
          ) : (
            <CardioScreen
              key={fitnessSub}
              logs={walkLogs}
              mode={fitnessSub}
              types={fitnessSub === 'cardio'
                ? [...CARDIO_TYPES, ...customTypes.cardio]
                : [...ACTIVITY_TYPES, ...customTypes.activity]}
              onAddType={addCustomType}
              profile={profile} onSaveProfile={saveProfile} onSaveLog={saveWalkLog}
              latestWeightKg={latestBodyweightKg} onDeleteLog={deleteWalk}
              onOpenTrend={m => setDetail({ kind: fitnessSub, metric: m })}
              tab={fitnessSub === 'cardio' ? walkTab : activityTab}
              setTab={fitnessSub === 'cardio' ? setWalkTab : setActivityTab}
              medicalEntries={medicalEntries} sessions={sessions} circuitLogs={circuitLogs} people={people} />
          )
        )}
          </FitnessScreen>
        )}

        {screen === 'planner' && (
          <PlannerScreen tasks={tasks} contacts={contacts} onSaveTask={saveTask}
            onDeleteTask={deleteTask} onCompleteTask={completeTask} onUndoTask={undoTask}
            onPostponeTask={postponeTask} onCancelTask={cancelTask} onRememberContact={rememberContact}
            sharedDraft={sharedDraft} onClearShared={() => setSharedDraft(null)}
            notifyPrefs={notifyPrefs} onSaveNotifyPrefs={saveNotifyPrefs} />
        )}

        {screen === 'medical' && (
          <MedicalScreen entries={medicalEntries} profile={profile} sessions={sessions} walkLogs={walkLogs} circuitLogs={circuitLogs} onSaveEntry={saveMedicalEntry}
            onSaveBatch={saveMedicalEntriesBatch} onDeleteEntry={deleteMedicalEntry}
            onDeleteEntries={deleteMedicalEntries} onUpdateEntriesDate={updateMedicalEntriesDate}
            onDeleteSeries={deleteMarkerSeries} hidden={hiddenMarkers} onToggleHidden={toggleHiddenMarker}
            schedule={medicalSchedule} people={people}
            onSaveSchedule={saveScheduleItem} onDeleteSchedule={deleteScheduleItem}
            onToggleSchedule={toggleScheduleDone} onSavePeople={savePeople} />
        )}
      </div>
    </div>
  );
}

// ---------- Day Planner helpers ----------

// ===========================================================================
// DAY PLANNER: DATES, RECURRENCE, CALENDAR & MESSAGING
// ===========================================================================

const REPEAT_FREQS = [
  { key: 'none', label: 'Does not repeat' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

function dateOnly(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function daysBetween(a, b) {
  return Math.round((dateOnly(b) - dateOnly(a)) / 86400000);
}
function addInterval(iso, freq, interval) {
  const d = new Date(iso);
  const n = Math.max(1, Number(interval) || 1);
  if (freq === 'daily') d.setDate(d.getDate() + n);
  else if (freq === 'weekly') d.setDate(d.getDate() + 7 * n);
  else if (freq === 'monthly') d.setMonth(d.getMonth() + n);
  else if (freq === 'yearly') d.setFullYear(d.getFullYear() + n);
  return d.toISOString();
}
function nextOccurrence(iso, repeat) {
  if (!repeat || repeat.freq === 'none') return iso;
  let next = addInterval(iso, repeat.freq, repeat.interval);
  // if the task was overdue, roll forward until it lands in the future
  let guard = 0;
  while (daysBetween(new Date(), next) < 0 && guard++ < 500) {
    next = addInterval(next, repeat.freq, repeat.interval);
  }
  return next;
}
function repeatLabel(repeat) {
  if (!repeat || repeat.freq === 'none') return '';
  const n = Math.max(1, Number(repeat.interval) || 1);
  const unit = { daily: 'day', weekly: 'week', monthly: 'month', yearly: 'year' }[repeat.freq];
  if (!unit) return '';
  return n === 1 ? `Every ${unit}` : `Every ${n} ${unit}s`;
}
function toRRule(repeat) {
  if (!repeat || repeat.freq === 'none') return '';
  const n = Math.max(1, Number(repeat.interval) || 1);
  const f = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY', yearly: 'YEARLY' }[repeat.freq];
  if (!f) return '';
  return `RRULE:FREQ=${f}${n > 1 ? `;INTERVAL=${n}` : ''}`;
}
function icsStamp(d) {
  return new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
function icsDateTimeUTC(d) {
  return new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
function taskHasTime(task) {
  return !!(task && task.targetTime);
}
function taskStart(task) {
  if (!taskHasTime(task)) return new Date(task.targetDate);
  const d = new Date(task.targetDate);
  const [h, m] = String(task.targetTime).split(':').map(Number);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}
function taskEnd(task) {
  const start = taskStart(task);
  const mins = Math.max(5, Number(task.durationMin) || 60);
  return new Date(start.getTime() + mins * 60000);
}
function parseEmails(raw) {
  return String(raw || '')
    .split(/[,;\s]+/)
    .map(e => e.trim())
    .filter(e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));
}
function mapsSearchUrl(q) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q || '')}`;
}
function isMapsUrl(v) {
  return /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(String(v || '').trim());
}
function locationMapUrl(loc) {
  const v = String(loc || '').trim();
  if (!v) return '';
  return isMapsUrl(v) ? v : mapsSearchUrl(v);
}
function fmtTimeLabel(task) {
  if (!taskHasTime(task)) return '';
  const s = taskStart(task);
  return s.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
function icsDateOnly(d) {
  const x = new Date(d);
  return `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, '0')}${String(x.getDate()).padStart(2, '0')}`;
}
function icsEscape(t) {
  return String(t || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}
function buildIcs(task) {
  const timed = taskHasTime(task);
  const rrule = toRRule(task.repeat);
  const emails = parseEmails(task.emails);
  const desc = [
    task.details ? `Meeting details:\n${task.details}` : '',
    task.contactName ? `Contact:\n${task.contactName}${task.contactPhone ? ' (' + task.contactPhone + ')' : ''}` : '',
  ].filter(Boolean).join('\n\n');

  let dtStart, dtEnd;
  if (timed) {
    dtStart = `DTSTART:${icsDateTimeUTC(taskStart(task))}`;
    dtEnd = `DTEND:${icsDateTimeUTC(taskEnd(task))}`;
  } else {
    const endD = new Date(task.targetDate); endD.setDate(endD.getDate() + 1);
    dtStart = `DTSTART;VALUE=DATE:${icsDateOnly(task.targetDate)}`;
    dtEnd = `DTEND;VALUE=DATE:${icsDateOnly(endD)}`;
  }

  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Training Tracker//Day Planner//EN', 'CALSCALE:GREGORIAN',
    emails.length ? 'METHOD:REQUEST' : '',
    'BEGIN:VEVENT',
    `UID:${task.id}@training-tracker`,
    `DTSTAMP:${icsDateTimeUTC(new Date())}`,
    dtStart,
    dtEnd,
    `SUMMARY:${icsEscape(task.title)}`,
    task.location ? `LOCATION:${icsEscape(task.location)}` : '',
    desc ? `DESCRIPTION:${icsEscape(desc)}` : '',
    rrule,
    ...emails.map(e => `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${e}`),
    // Reminder the day before, and on the day itself
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape('Tomorrow: ' + task.title)}`, 'END:VALARM',
    'BEGIN:VALARM', timed ? 'TRIGGER:-PT1H' : 'TRIGGER:PT8H', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape('Today: ' + task.title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n');
}

function downloadIcs(task) {
  const blob = new Blob([buildIcs(task)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(task.title || 'task').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function googleCalendarUrl(task) {
  const timed = taskHasTime(task);
  let dates;
  if (timed) {
    dates = `${icsDateTimeUTC(taskStart(task))}/${icsDateTimeUTC(taskEnd(task))}`;
  } else {
    const endD = new Date(task.targetDate); endD.setDate(endD.getDate() + 1);
    dates = `${icsDateOnly(task.targetDate)}/${icsDateOnly(endD)}`;
  }
  const desc = [
    task.details ? `Meeting details:\n${task.details}` : '',
    task.contactName ? `Contact:\n${task.contactName}${task.contactPhone ? ' (' + task.contactPhone + ')' : ''}` : '',
  ].filter(Boolean).join('\n\n');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: task.title || 'Task',
    dates,
  });
  if (desc) params.set('details', desc);
  if (task.location) params.set('location', task.location);
  const emails = parseEmails(task.emails);
  if (emails.length) params.set('add', emails.join(','));
  const rrule = toRRule(task.repeat);
  let url = `https://calendar.google.com/calendar/render?${params.toString()}`;
  if (rrule) url += `&recur=${encodeURIComponent(rrule)}`;
  return url;
}
function mailtoInviteUrl(task) {
  const emails = parseEmails(task.emails);
  const body = taskMessageSections(task).join('\n\n');
  // mailto needs percent-encoding: URLSearchParams would turn spaces into "+" literals
  const subject = encodeURIComponent(`Invite: ${task.title}`);
  return `mailto:${emails.join(',')}?subject=${subject}&body=${encodeURIComponent(body)}`;
}

function whatsappUrl(phone, text) {
  const digits = String(phone || '').replace(/[^0-9]/g, '');
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}
function taskWhenText(task) {
  if (!task.targetDate) return '';
  const d = fmtDate(task.targetDate);
  if (!taskHasTime(task)) return d;
  const end = taskEnd(task).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${d}, ${fmtTimeLabel(task)} – ${end}`;
}

// Sections are joined with a blank line between them so the message is readable
// in WhatsApp and email rather than one dense block.
function taskMessageSections(task) {
  // No greeting: these are sent into an existing conversation, so the message
  // opens with a header rather than "Hi <name>,".
  const sections = ['Meeting details -'];
  if (task.title) sections.push(task.title);
  const when = taskWhenText(task);
  if (when) sections.push(`When:\n${when}`);
  if (task.location) sections.push(`Where:\n${task.location}`);
  if (task.details) sections.push(`Details:\n${task.details}`);
  const guests = parseEmails(task.emails);
  if (guests.length) sections.push(`Attendees:\n${guests.join('\n')}`);
  if (task.repeat && task.repeat.freq !== 'none') sections.push(`Repeats:\n${repeatLabel(task.repeat)}`);
  return sections;
}

function defaultWhatsappText(task) {
  return taskMessageSections(task).join('\n\n');
}

// ===========================================================================
// NOTIFICATIONS
// A static web app cannot wake itself once closed — there is no reliable
// scheduled-notification API without a push server. So this fires alerts while
// the app is open (or backgrounded but alive) and catches up on missed ones
// when you next open it. Calendar entries remain the dependable reminder.
// ===========================================================================

const NOTIFY_DEFAULTS = { enabled: false, morningSummary: true, hourBefore: true, summaryHour: 8 };

function notifySupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}
function notifyPermission() {
  return notifySupported() ? Notification.permission : 'unsupported';
}
async function requestNotifyPermission() {
  if (!notifySupported()) return 'unsupported';
  try { return await Notification.requestPermission(); } catch (e) { return 'denied'; }
}
// Android Chrome forbids `new Notification()` and only permits notifications
// shown from a service worker registration, so prefer the worker and fall back
// to the constructor (desktop) only if no worker is available.
let swRegistration = null;
function registerServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./sw.js')
    .then(reg => { swRegistration = reg; return navigator.serviceWorker.ready; })
    .then(reg => { swRegistration = reg || swRegistration; })
    .catch(() => { /* notifications will fall back or be unavailable */ });
}

function showNotification(title, body, tag) {
  if (!notifySupported() || Notification.permission !== 'granted') return false;
  const reg = swRegistration || (navigator.serviceWorker && navigator.serviceWorker.controller ? swRegistration : null);
  if (reg && reg.showNotification) {
    try {
      reg.showNotification(title, { body, tag, icon: './icon-192.png', badge: './icon-192.png' });
      return true;
    } catch (e) { /* fall through */ }
  }
  // Ask the active worker to do it (covers the case where we have a controller
  // but not a resolved registration object yet).
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({ type: 'show-notification', title, body, tag });
      return true;
    } catch (e) { /* fall through */ }
  }
  try {
    new Notification(title, { body, tag, icon: './icon-192.png', badge: './icon-192.png' });
    return true;
  } catch (e) {
    return false;
  }
}
function dayKey(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}
function buildMorningSummary(tasks, schedule) {
  const open = (tasks || []).filter(t => !isClosed(t));
  const overdue = open.filter(t => daysBetween(new Date(), t.targetDate) < 0);
  const today = open.filter(t => daysBetween(new Date(), t.targetDate) === 0);
  const doneToday = (tasks || []).filter(t => taskStatus(t) === 'done'
    && (t.history || []).some(h => h.action === 'done' && daysBetween(new Date(), h.at) === 0));

  const med = (schedule || []).filter(x => !x.done);
  const medToday = med.filter(x => daysBetween(new Date(), x.dueDate) === 0);
  const medTomorrow = med.filter(x => daysBetween(new Date(), x.dueDate) === 1);
  const medOverdue = med.filter(x => daysBetween(new Date(), x.dueDate) < 0);

  if (!overdue.length && !today.length && !medToday.length && !medTomorrow.length && !medOverdue.length) return null;

  const headline = [];
  const totalToday = today.length + doneToday.length;
  if (totalToday) headline.push(`${doneToday.length}/${totalToday} tasks done`);
  else if (today.length) headline.push(`${today.length} due today`);
  if (overdue.length) headline.push(`${overdue.length} overdue`);

  const lines = [];
  if (headline.length) lines.push(headline.join(' · '));

  const timed = today.filter(taskHasTime).sort((a, b) => taskStart(a) - taskStart(b));
  timed.slice(0, 2).forEach(t => lines.push(`${fmtTimeLabel(t)} — ${t.title}`));
  today.filter(t => !taskHasTime(t)).slice(0, 2 - Math.min(timed.length, 2)).forEach(t => lines.push(t.title));

  if (medOverdue.length) lines.push(`Medical overdue: ${medOverdue[0].title} (${medOverdue[0].person})`);
  medToday.slice(0, 2).forEach(x => lines.push(`Today: ${x.title} — ${x.person}`));
  medTomorrow.slice(0, 2).forEach(x => lines.push(`Tomorrow: ${x.title} — ${x.person}`));

  return { title: 'Today\u2019s plan', body: lines.join('\n') };
}

// Recurring daily calendar event, for a summary nudge that survives the app being closed
function morningSummaryCalendarUrl(hour = 8) {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(hour, 0, 0, 0);
  const end = new Date(start.getTime() + 15 * 60000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Review today\u2019s plan',
    dates: `${icsDateTimeUTC(start)}/${icsDateTimeUTC(end)}`,
    details: 'Open Training Tracker to see what is overdue and due today.',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}&recur=${encodeURIComponent('RRULE:FREQ=DAILY')}`;
}


// ===========================================================================
// FITNESS ANALYSIS: per-muscle volume, balance, effort estimation
// ===========================================================================

// Fraction of bodyweight an exercise loads onto its working muscles.
// Without this, any muscle trained only by bodyweight movements reads as
// "not logged" forever, however hard it is actually worked.
const BODYWEIGHT_LOAD = {
  'Push-Ups (feet elevated on bench)': 0.70,
  'Pike Push-Up': 0.65,
  'Bench Dips': 0.50,
  'Lateral Lunge': 0.55,
  'Bulgarian Split Squat': 0.60,
  'Front-Foot-Elevated Split Squat': 0.60,
};

function normaliseExerciseName(n) {
  return String(n || '').toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

let _exerciseIndex = null;
function exerciseIndex() {
  if (_exerciseIndex) return _exerciseIndex;
  _exerciseIndex = {};
  const add = (item) => {
    if (!item || !item.name) return;
    _exerciseIndex[normaliseExerciseName(item.name)] = item;
  };
  ['A', 'B'].forEach(d => (WORKOUTS[d] || []).forEach(add));
  ['A', 'B'].forEach(d => ((FINISHERS[d] && FINISHERS[d].items) || []).forEach(add));
  return _exerciseIndex;
}

// Look up by normalised name so exercises renamed between app versions (e.g.
// gaining a "(light load)" suffix) still resolve for previously logged sessions.
function findExercise(exerciseName) {
  const idx = exerciseIndex();
  const key = normaliseExerciseName(exerciseName);
  if (idx[key]) return idx[key];
  // fall back to a containment match for larger renames
  const keys = Object.keys(idx);
  const hit = keys.find(k => k.includes(key) || key.includes(k));
  return hit ? idx[hit] : null;
}

// Sessions logged before core finishers were recorded as exercises store only
// a completed count. Reconstruct the finisher items so their core work isn't
// invisible in every analysis.
function sessionExercises(session) {
  const listed = session.exercises || [];
  const hasFinisher = listed.some(e => e.finisher);
  if (hasFinisher || !session.finisherCompleted) return listed;
  const items = (FINISHERS[session.day] && FINISHERS[session.day].items) || [];
  const done = items.slice(0, session.finisherCompleted)
    .map(it => ({ name: it.name, weight: 'Bodyweight', finisher: true, backfilled: true }));
  return [...listed, ...done];
}

function muscleTargetsFor(exerciseName) {
  const ex = findExercise(exerciseName);
  return ex ? (ex.targets || []) : [];
}

// The load an exercise put on its muscles: the logged weight, or an estimate
// from bodyweight for unloaded movements.
function effectiveLoadKg(exerciseName, weight, bodyweightKg) {
  const kg = Number(weight);
  if (kg && !isNaN(kg)) return { kg, estimated: false };
  const isBodyweight = typeof weight === 'string' && /bodyweight/i.test(weight);
  if (!isBodyweight || !bodyweightKg) return null;
  const ex = findExercise(exerciseName);
  const frac = (ex && BODYWEIGHT_LOAD[ex.name]) || null;
  if (!frac) return null;
  return { kg: +(bodyweightKg * frac).toFixed(1), estimated: true };
}

// How much of a lift's load an assisting muscle is credited with. 0 makes
// never-primary muscles invisible; 1 makes every compound lift look like an
// isolation lift for its helpers.
const SECONDARY_CREDIT = 0.5;

const MUSCLE_LABELS = {
  chest: 'Chest', back: 'Back / Lats', shoulders: 'Shoulders', rearDelts: 'Rear delts',
  traps: 'Traps', biceps: 'Biceps', triceps: 'Triceps', forearms: 'Forearms / grip',
  abs: 'Abs', obliques: 'Obliques', lowerBack: 'Lower back', quads: 'Quads',
  hamstrings: 'Hamstrings', glutes: 'Glutes', calves: 'Calves', adductors: 'Inner thigh',
};
function muscleLabel(k) { return MUSCLE_LABELS[k] || k; }

// Heaviest load logged per muscle, and how it's trending.
// A muscle's "load" is the best weight used on any exercise that targets it.
function muscleLoadHistory(sessions, bodyweightKg) {
  const byMuscle = {}; // muscle -> [{date, kg}]
  const asc = [...(sessions || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  asc.forEach(s => {
    const best = {};
    const est = {};
    const via = {};
    sessionExercises(s).forEach(e => {
      const eff = effectiveLoadKg(e.name, e.weight, bodyweightKg);
      if (!eff) return;
      const kg = eff.kg;
      // Credit the primary mover in full and assisting muscles at a discount.
      // Crediting only the primary was too strict: triceps, glutes and forearms
      // are never the primary mover in this plan, so they read as "not logged"
      // however hard they were actually worked. Crediting everything in full is
      // the opposite error — it would call a 60kg deadlift a 60kg biceps lift.
      const targets = muscleTargetsFor(e.name);
      targets.forEach((m, idx) => {
        const credited = +((idx === 0 ? kg : kg * SECONDARY_CREDIT)).toFixed(1);
        const viaName = e.name;
        // A real logged weight always wins over a bodyweight estimate, whatever
        // the numbers say — otherwise a push-up estimate would overwrite the
        // bench press figure and destroy a valid comparison.
        const haveReal = best[m] !== undefined && !est[m];
        if (haveReal && eff.estimated) return;
        const better = best[m] === undefined
          || (!eff.estimated && est[m])            // real beats existing estimate
          || credited > best[m];
        if (better) { best[m] = credited; est[m] = eff.estimated; via[m] = viaName; }
      });
    });
    Object.entries(best).forEach(([m, kg]) => {
      (byMuscle[m] = byMuscle[m] || []).push({ date: s.date, v: kg, estimated: !!est[m], via: via[m] });
    });
  });
  return byMuscle;
}

// Weekly working volume per muscle = sets x reps-ish proxy (stations touched),
// used for the soreness/impact map rather than for prescribing anything.
function muscleVolumeRecent(sessions, days = 7) {
  const counts = {};
  (sessions || []).filter(s => isWithinDays(s.date, days)).forEach(s => {
    const rounds = Number(s.rounds) || 1;
    sessionExercises(s).forEach(e => {
      muscleTargetsFor(e.name).forEach((m, idx) => {
        // assisting muscles take real but lesser work than the primary mover
        counts[m] = +((counts[m] || 0) + rounds * (idx === 0 ? 1 : SECONDARY_CREDIT)).toFixed(1);
      });
    });
  });
  return counts;
}

// --- Relative balance -------------------------------------------------------
// Typical strength relationships between lifts are far more stable across people
// than absolute loads are. These are rough proportions of a lower-body hinge
// (deadlift/RDL) load, used ONLY to flag disproportion — never to prescribe.
const MUSCLE_PROPORTIONS = {
  hamstrings: 1.00,
  glutes: 1.00,
  quads: 0.85,
  back: 0.60,
  traps: 0.55,
  chest: 0.45,
  shoulders: 0.28,
  rearDelts: 0.14,
  biceps: 0.22,
  triceps: 0.22,
  calves: 0.35,
  adductors: 0.20,
  forearms: 0.55,
  // Core work in this plan is bodyweight, so these are held for coverage
  // reporting rather than load comparison.
  abs: 0.15,
  obliques: 0.15,
  lowerBack: 0.30,
};

// Muscles trained only by unloaded core work — a load ratio would be meaningless
const COVERAGE_ONLY = ['abs', 'obliques'];

// Compare each muscle's best load against the expected proportion of the
// heaviest hinge load the person has actually logged.
function balanceReport(sessions, bodyweightKg) {
  const hist = muscleLoadHistory(sessions, bodyweightKg);
  // A real logged weight always beats a bodyweight estimate, across the whole
  // history — not just within one session. Otherwise a single push-up session
  // overwrites months of barbell data and the comparison disappears.
  const bestEntry = m => {
    const list = hist[m] || [];
    if (!list.length) return null;
    const real = list.filter(x => !x.estimated);
    const pool = real.length ? real : list;
    return pool.reduce((a, b) => (b.v > a.v ? b : a));
  };
  const bestOf = m => { const e = bestEntry(m); return e ? e.v : null; };
  // anchor on the strongest posterior-chain load, since that's the biggest lift
  const anchor = Math.max(bestOf('hamstrings') || 0, bestOf('glutes') || 0);
  if (!anchor) return { anchor: null, rows: [] };

  // Muscles actually trained in the logged sessions, regardless of load.
  // Core work carries no weight, so a load-history check would wrongly report
  // it as never trained.
  const everTrained = new Set();
  (sessions || []).forEach(sn => sessionExercises(sn).forEach(e => {
    muscleTargetsFor(e.name).forEach(m => everTrained.add(m));
  }));

  // Which muscles the plan can train at all, so "not logged" can be explained
  const trainedBy = {};
  ['A', 'B'].forEach(d => (WORKOUTS[d] || []).forEach(ex => {
    (ex.targets || []).forEach(m => { (trainedBy[m] = trainedBy[m] || []).push({ day: d, name: ex.name }); });
  }));
  ['A', 'B'].forEach(d => ((FINISHERS[d] && FINISHERS[d].items) || []).forEach(it => {
    (it.targets || []).forEach(m => { (trainedBy[m] = trainedBy[m] || []).push({ day: d, name: it.name }); });
  }));

  const rows = Object.keys(MUSCLE_PROPORTIONS).map(m => {
    const expected = +(anchor * MUSCLE_PROPORTIONS[m]).toFixed(1);
    const entry = bestEntry(m);
    const actual = entry ? entry.v : null;
    const sources = trainedBy[m] || [];
    const estimated = entry ? !!entry.estimated : false;
    const via = entry ? entry.via : null;
    if (COVERAGE_ONLY.includes(m)) {
      const trained = everTrained.has(m);
      const via = sources.map(x => x.name).join(', ');
      return { muscle: m, actual: null, expected, ratio: null, coverageOnly: true,
        reason: trained ? `core work via ${via} — tracked for coverage, not load` : 'no core work logged yet', sources };
    }
    if (!actual) {
      let reason;
      if (!sources.length) {
        reason = 'not in the plan';
      } else if (everTrained.has(m)) {
        // Trained, but nothing to measure: the movement carries no external
        // weight and we have no bodyweight on file to estimate from.
        const bwOnly = sources.map(x => x.name).filter(n => BODYWEIGHT_LOAD[n]);
        reason = bodyweightKg
          ? `trained via ${sources.map(x => x.name).join(', ')} — no external weight to measure`
          : `trained via ${sources.map(x => x.name).join(', ')} — log your bodyweight in Health to estimate this load`;
      } else {
        const days = Array.from(new Set(sources.map(x => x.day))).join(' & ');
        reason = `only in Workout ${days} — log one to see this`;
      }
      return { muscle: m, actual: null, expected, ratio: null, reason, sources };
    }
    // Bodyweight-derived loads are real work but not on the same scale as
    // barbell loads, so they'd read as wildly "ahead" if ratioed against the
    // hinge anchor. Show the figure, withhold the comparison.
    if (estimated) {
      return { muscle: m, actual, expected, ratio: null, estimated: true, via,
        reason: `${via || 'bodyweight movement'} — bodyweight load, not comparable to barbell work`, sources };
    }
    return { muscle: m, actual, expected, ratio: expected ? +(actual / expected).toFixed(2) : null, estimated: false, via, sources };
  });
  rows.sort((a, b) => (a.ratio ?? 99) - (b.ratio ?? 99));
  return { anchor, rows };
}

// --- Effort estimation from heart-rate data ---------------------------------
// Uses heart-rate reserve (Karvonen): %HRR = (HR - rest) / (max - rest).
// Mapped onto the 1-10 RPE scale, which is a well-established relationship.
function estimateRpeFromHR({ avgHR, maxHR, restingHR, age }) {
  if (!avgHR || !age) return null;
  // Age-predicted ceiling. Using the session's own max HR here would be wrong:
  // an easy walk's peak is nowhere near true HRmax, and treating it as such
  // inflates every estimate.
  const predicted = 220 - Number(age);
  const hrMax = Math.max(predicted, maxHR || 0);
  const rest = restingHR || 65;
  if (hrMax <= rest) return null;
  const pct = Math.max(0, Math.min(1, (avgHR - rest) / (hrMax - rest)));
  // %HRR -> RPE, following the standard ACSM intensity bands
  const rpe = Math.max(1, Math.min(10, Math.round(1 + pct * 9)));
  return {
    rpe,
    pctHRR: Math.round(pct * 100),
    basis: (maxHR && maxHR > predicted) ? 'your recorded peak HR' : 'age-predicted max HR',
    usedRest: !!restingHR,
  };
}

// Volume for a single session, for the per-session heat map.
// Compare one session's loads against the best you've logged for the same
// exercise, so a single session can be read on its own terms.
function sessionLoadReview(session, allSessions, bodyweightKg) {
  const prior = (allSessions || []).filter(s => s.id !== session.id && new Date(s.date) < new Date(session.date));
  const bestPrior = {};
  prior.forEach(s => (s.exercises || []).forEach(e => {
    const eff = effectiveLoadKg(e.name, e.weight, bodyweightKg);
    if (!eff || eff.estimated) return;
    if (!bestPrior[e.name] || eff.kg > bestPrior[e.name]) bestPrior[e.name] = eff.kg;
  }));

  const rows = (session.exercises || []).map(e => {
    const eff = effectiveLoadKg(e.name, e.weight, bodyweightKg);
    const best = bestPrior[e.name] ?? null;
    const kg = eff && !eff.estimated ? eff.kg : null;
    let status = 'flat';
    if (kg === null) status = 'bodyweight';
    else if (best === null) status = 'first';
    else if (kg > best) status = 'up';
    else if (kg < best) status = 'down';
    return { name: e.name, kg, best, status, estimated: eff ? eff.estimated : false, finisher: !!e.finisher };
  });

  const progressed = rows.filter(r => r.status === 'up');
  const dropped = rows.filter(r => r.status === 'down');
  const stalled = rows.filter(r => r.status === 'flat' && r.best !== null);

  // Suggest where to add next — only exercises that have been flat for a while
  const flatCount = {};
  rows.filter(r => r.status === 'flat').forEach(r => {
    const sameLoad = prior.filter(s => (s.exercises || []).some(x =>
      x.name === r.name && Number(x.weight) === r.kg)).length;
    flatCount[r.name] = sameLoad;
  });
  const readyToAdd = rows
    .filter(r => r.status === 'flat' && (flatCount[r.name] || 0) >= 2)
    .map(r => ({ ...r, sessionsAtLoad: flatCount[r.name] + 1 }));

  return { rows, progressed, dropped, stalled, readyToAdd };
}

function sessionVolume(session) {
  const counts = {};
  const rounds = Number(session.rounds) || 1;
  sessionExercises(session).forEach(e => {
    muscleTargetsFor(e.name).forEach((m, idx) => {
      counts[m] = +((counts[m] || 0) + rounds * (idx === 0 ? 1 : SECONDARY_CREDIT)).toFixed(1);
    });
  });
  return counts;
}

// Composite effort estimate for one session.
// Heart rate is the primary signal; calorie burn rate and duration act as
// cross-checks so a session with no HR data still gets an estimate.
function sessionEffort({ session, circuitLog, restingHR, age, weightKg }) {
  const parts = [];
  const log = circuitLog || {};
  const durationMin = log.durationMin || session.durationMin || null;

  const hr = estimateRpeFromHR({ avgHR: log.avgHR, maxHR: log.maxHR, restingHR, age });
  if (hr) parts.push({ source: 'Heart rate', rpe: hr.rpe, detail: `${hr.pctHRR}% of heart-rate reserve`, weight: 3 });

  // Calorie burn rate -> METs -> rough intensity. kcal/min / (3.5 * kg / 200)
  if (log.kcal && durationMin && weightKg) {
    const kcalPerMin = log.kcal / durationMin;
    const mets = kcalPerMin / (3.5 * weightKg / 200);
    // 3 METs light, 6 moderate, 9 vigorous, 12+ very hard
    const rpe = Math.max(1, Math.min(10, Math.round((mets / 12) * 10)));
    parts.push({ source: 'Calorie burn rate', rpe, detail: `${mets.toFixed(1)} METs`, weight: 2 });
  }

  // Duration alone is a weak signal, used only to avoid having nothing.
  if (durationMin) {
    const rpe = Math.max(1, Math.min(10, Math.round(durationMin / 6)));
    parts.push({ source: 'Duration', rpe, detail: `${durationMin} min`, weight: 1 });
  }

  if (!parts.length) return null;
  const totalW = parts.reduce((a, x) => a + x.weight, 0);
  const combined = Math.round(parts.reduce((a, x) => a + x.rpe * x.weight, 0) / totalW);
  return {
    rpe: Math.max(1, Math.min(10, combined)),
    parts,
    // flag when the signals disagree materially — worth the user knowing
    spread: Math.max(...parts.map(x => x.rpe)) - Math.min(...parts.map(x => x.rpe)),
  };
}

// How far a reading sits outside its reference band, as a 0..1 severity.
// Used to colour health charts green -> yellow -> red.
function rangeDeviation(value, band) {
  if (!band || value == null) return null;
  const [lo, hi] = band;
  if (value >= lo && value <= hi) return 0;
  const span = (hi - lo) || Math.abs(hi) || 1;
  const dist = value < lo ? (lo - value) : (value - hi);
  return Math.max(0, Math.min(1, dist / span));
}
function deviationColor(dev) {
  if (dev === null || dev === undefined) return COLORS.success;
  if (dev <= 0) return COLORS.success;                     // inside range
  return heatColor(Math.max(0.15, Math.min(1, dev)));      // yellow -> red
}
function deviationLabel(dev) {
  if (dev === null || dev === undefined) return '';
  if (dev <= 0) return 'within typical range';
  if (dev < 0.25) return 'just outside typical range';
  if (dev < 0.6) return 'outside typical range';
  return 'well outside typical range';
}

// --- Muscle impact heat map -------------------------------------------------
// Colours the mannequin yellow -> red by how much work a muscle has taken
// recently. This reflects logged training volume, not actual measured soreness.
function heatColor(intensity) {
  // 0 -> unworked (grey), then yellow -> orange -> red
  if (intensity <= 0) return null;
  const stops = [
    [0.01, [250, 204, 21]],   // yellow
    [0.45, [251, 146, 60]],   // orange
    [0.75, [239, 68, 68]],    // red
    [1.00, [185, 28, 28]],    // deep red
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (intensity >= stops[i][0] && intensity <= stops[i + 1][0]) { lo = stops[i]; hi = stops[i + 1]; break; }
  }
  const span = hi[0] - lo[0] || 1;
  const t = Math.max(0, Math.min(1, (intensity - lo[0]) / span));
  const rgb = lo[1].map((c, i) => Math.round(c + (hi[1][i] - c) * t));
  return `rgb(${rgb.join(',')})`;
}

// Fixed silhouette colours so the figure stays visible on any card background.
const BODY_FILL = '#20242C';
const BODY_STROKE = '#333A45';

function MuscleHeatMap({ volumes, days = 7, sessionMode }) {
  const entries = Object.entries(volumes || {});
  const peak = entries.length ? Math.max(...entries.map(([, v]) => v)) : 0;
  const views = ['front', 'back'];

  return (
    <div>
      <div className="flex gap-3 justify-center">
        {views.map(view => (
          <div key={view} className="flex flex-col items-center" style={{ width: 96 }}>
            <svg viewBox="0 0 100 220" width="100%" height="190">
              <BodySilhouette fill={BODY_FILL} stroke={BODY_STROKE} />
              {Object.keys(MUSCLE_POINTS).filter(k => MUSCLE_POINTS[k].view === view).map(k => {
                const vol = volumes[k] || 0;
                const c = heatColor(peak ? vol / peak : 0);
                if (!c) return null;
                return MUSCLE_POINTS[k].points.map((pt, j) => (
                  <g key={`${k}-${j}`}>{renderMusclePoint(pt, k, c, 0.8, 0.5)}</g>
                ));
              })}
            </svg>
            <div className="text-[9px] uppercase tracking-widest" style={{ color: COLORS.textMute }}>{view}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2 justify-center">
        <span className="text-[9px]" style={{ color: COLORS.textMute }}>less</span>
        <div className="flex rounded-full overflow-hidden" style={{ width: 100, height: 6 }}>
          {[0.05, 0.3, 0.55, 0.8, 1].map(v => (
            <div key={v} style={{ flex: 1, backgroundColor: heatColor(v) }} />
          ))}
        </div>
        <span className="text-[9px]" style={{ color: COLORS.textMute }}>more</span>
      </div>
      <div className="text-[10px] text-center mt-1.5" style={{ color: COLORS.textMute }}>
        {sessionMode
          ? 'Muscles trained in this session, shaded by how much of the work each took — an indication of load, not measured soreness.'
          : `Work taken over the last ${days} days, from your logged sessions — an indication of load, not measured soreness.`}
      </div>
    </div>
  );
}

// --- Health reference ranges ------------------------------------------------
// General adult reference intervals, shown as a shaded band on the chart for
// context. Laboratories differ, and ranges vary by age, sex and method, so the
// range printed on your own report is the one that counts.
const REFERENCE_RANGES = {
  'Hemoglobin': { male: [13.5, 17.5], female: [12.0, 15.5], unit: 'g/dL' },
  'RBC Count': { male: [4.5, 5.9], female: [4.1, 5.1] },
  'WBC Count': { any: [4.0, 11.0] },
  'Platelet Count': { any: [150, 410] },
  'Hematocrit': { male: [38.8, 50.0], female: [34.9, 44.5] },
  'MCV': { any: [80, 100] },
  'hs-CRP': { any: [0, 1.0] },
  'CRP': { any: [0, 5] },
  'Homocysteine': { any: [5, 15] },
  'Lipoprotein(a)': { any: [0, 30] },
  'Apolipoprotein B': { any: [0, 90] },
  'NT-proBNP': { any: [0, 125] },
  'ESR': { any: [0, 20] },
  'Cholesterol - Total': { any: [0, 200] },
  'Cholesterol - LDL': { any: [0, 100] },
  'Cholesterol - HDL': { male: [40, 100], female: [50, 100] },
  'Cholesterol - Non-HDL': { any: [0, 130] },
  'Triglycerides': { any: [0, 150] },
  'HbA1c': { any: [4.0, 5.7] },
  'Blood Glucose (fasting)': { any: [70, 100] },
  'Blood Glucose': { any: [70, 140] },
  'Creatinine': { male: [0.74, 1.35], female: [0.59, 1.04] },
  'eGFR': { any: [90, 120] },
  'Urea': { any: [7, 20] },
  'Uric Acid': { male: [3.4, 7.0], female: [2.4, 6.0] },
  'Sodium': { any: [135, 145] },
  'Potassium': { any: [3.5, 5.2] },
  'Calcium': { any: [8.6, 10.3] },
  'ALT (SGPT)': { any: [7, 55] },
  'AST (SGOT)': { any: [8, 48] },
  'ALP': { any: [40, 129] },
  'GGT': { any: [8, 61] },
  'Bilirubin - Total': { any: [0.1, 1.2] },
  'Albumin': { any: [3.5, 5.0] },
  'Vitamin B12': { any: [200, 900] },
  'Vitamin D': { any: [30, 100] },
  'Folate': { any: [2.7, 17.0] },
  'Ferritin': { male: [24, 336], female: [11, 307] },
  'TSH': { any: [0.4, 4.0] },
  'Free T4': { any: [0.8, 1.8] },
  'AFP': { any: [0, 10] },
  'Beta hCG': { any: [0, 2] },
  'LDH': { any: [140, 280] },
  'PSA': { any: [0, 4] },
  'Resting Heart Rate': { any: [60, 100] },
  'Blood Pressure - Systolic': { any: [90, 120] },
  'Blood Pressure - Diastolic': { any: [60, 80] },
};
// General educational notes for common markers. Deliberately descriptive:
// what the marker is, what commonly moves it, and the lifestyle factors that
// are usually discussed — never a diagnosis or a treatment instruction.
const MARKER_INFO = {
  'hs-CRP': {
    what: 'A high-sensitivity measure of C-reactive protein, a general marker of inflammation in the body.',
    raised: 'Rises with infection, injury and any active inflammation, and can also be higher with excess body fat, smoking, poor sleep and inactivity. A recent cold or a hard training session can lift it temporarily.',
    manage: 'Usually discussed alongside cardiovascular risk. The factors commonly raised are regular aerobic activity, weight management, sleep, not smoking, and treating any underlying inflammatory condition.',
  },
  'Homocysteine': {
    what: 'An amino acid in the blood. It is cleared using B vitamins, so levels reflect both metabolism and B-vitamin status.',
    raised: 'Commonly higher with low B12, folate or B6, reduced kidney function, hypothyroidism, smoking, and certain genetic variants (such as MTHFR).',
    manage: 'Typically addressed by correcting any B12 or folate deficiency and treating underlying causes. Because it is closely tied to B12, the two are often reviewed together.',
  },
  'Cholesterol - LDL': {
    what: 'Low-density lipoprotein cholesterol — the fraction most consistently linked with build-up in artery walls.',
    raised: 'Influenced by saturated and trans fat intake, genetics (including familial hypercholesterolaemia), body weight, low thyroid function, and some medications.',
    manage: 'Commonly approached with dietary fat quality, soluble fibre, regular activity, weight management, and where indicated, medication. Targets differ considerably depending on overall cardiovascular risk, which is a discussion for your doctor.',
  },
  'Cholesterol - HDL': {
    what: 'High-density lipoprotein cholesterol, which helps transport cholesterol back to the liver. Higher is generally viewed favourably.',
    raised: 'Tends to be higher with regular aerobic exercise. Lower levels are associated with inactivity, smoking, excess weight and high triglycerides.',
    manage: 'Aerobic activity and smoking cessation are the factors most consistently associated with improvement.',
  },
  'Triglycerides': {
    what: 'A fat carried in the blood, used for energy storage.',
    raised: 'Strongly affected by recent food and alcohol — a non-fasting sample reads higher. Also rises with excess refined carbohydrate, excess weight, poorly controlled diabetes and some medications.',
    manage: 'Usually responds to reduced alcohol and refined sugar, weight management and regular activity. Fasting status matters when comparing results.',
  },
  'Lipoprotein(a)': {
    what: 'A lipoprotein particle whose level is largely genetically determined and fairly stable through life.',
    raised: 'Mostly inherited. Unlike LDL, it changes little with diet or exercise.',
    manage: 'Because it is genetic, it is generally used to refine overall risk assessment rather than treated directly. Usually measured once rather than tracked frequently.',
  },
  'Apolipoprotein B': {
    what: 'Counts the number of atherogenic particles rather than the cholesterol they carry, so it can add information beyond LDL.',
    raised: 'Broadly tracks the same factors as LDL and triglycerides.',
    manage: 'Managed with the same measures used for LDL.',
  },
  'HbA1c': {
    what: 'Reflects average blood glucose over roughly the previous two to three months.',
    raised: 'Rises with sustained high blood glucose. Can also read differently with anaemia, recent blood loss, or conditions affecting red-cell lifespan.',
    manage: 'Commonly discussed in terms of carbohydrate quality and quantity, regular activity, weight, and sleep. Because it is an average, it moves slowly — retesting sooner than about three months rarely shows much.',
  },
  'Blood Glucose (fasting)': {
    what: 'Blood sugar after an overnight fast.',
    raised: 'Affected by carbohydrate intake, stress hormones, poor sleep, illness, some medications (including steroids), and insufficient fasting before the test.',
    manage: 'Usually reviewed together with HbA1c, since a single fasting value varies day to day.',
  },
  'Uric Acid': {
    what: 'A by-product of purine breakdown, cleared by the kidneys. High levels can crystallise in joints and cause gout.',
    raised: 'Higher with alcohol (especially beer), purine-rich foods such as red meat and shellfish, fructose-sweetened drinks, dehydration, reduced kidney function and some diuretics.',
    manage: 'Commonly addressed with hydration, reduced alcohol and fructose, weight management, and medication where gout is recurrent.',
  },
  'Vitamin B12': {
    what: 'A vitamin needed for red blood cell formation and nerve function. Stored in the liver, so deficiency develops slowly.',
    raised: 'Low levels are common with vegetarian and vegan diets, reduced stomach acid, metformin use, and absorption problems. High readings are usually from supplementation.',
    manage: 'Deficiency is typically corrected with oral or injected B12 depending on the cause. Worth reviewing alongside homocysteine, which rises when B12 is low.',
  },
  'Vitamin D': {
    what: 'Measured as 25-hydroxyvitamin D. Involved in calcium absorption, bone health and muscle function.',
    raised: 'Low levels are very common with limited sun exposure, darker skin, indoor work, and higher body fat. Levels usually fall over winter.',
    manage: 'Commonly addressed with sensible sun exposure and supplementation. Dose and duration are worth confirming with your doctor rather than guessing.',
  },
  'Ferritin': {
    what: 'Reflects stored iron — usually the earliest marker to fall when iron is depleted.',
    raised: 'Also an acute-phase reactant, so it rises with inflammation, infection and liver disease. That means a normal ferritin alongside inflammation can still hide low iron.',
    manage: 'Low ferritin is generally investigated for a cause rather than just supplemented. High ferritin with normal inflammation may prompt further tests.',
  },
  'Hemoglobin': {
    what: 'The oxygen-carrying protein in red blood cells.',
    raised: 'Low with iron, B12 or folate deficiency, blood loss, chronic disease and kidney disease. Higher with dehydration, smoking and altitude.',
    manage: 'A falling trend usually matters more than a single value near the edge of the range, and prompts looking for a cause.',
  },
  'Creatinine': {
    what: 'A waste product from muscle metabolism, cleared by the kidneys — used to estimate kidney function.',
    raised: 'Rises with reduced kidney function, but also with higher muscle mass, dehydration, high protein or creatine intake, and recent intense exercise.',
    manage: 'Usually interpreted through eGFR rather than alone. Because muscular people run higher naturally, trend matters more than a single reading.',
  },
  'eGFR': {
    what: 'Estimated glomerular filtration rate — a calculated measure of how well the kidneys filter, derived from creatinine, age and sex.',
    raised: 'Falls with reduced kidney function, dehydration, some medications (including NSAIDs), and naturally with age.',
    manage: 'Commonly discussed in terms of blood pressure control, hydration, avoiding routine NSAID use, and reviewing medication doses.',
  },
  'TSH': {
    what: 'Thyroid-stimulating hormone. It rises when the thyroid is underactive and falls when overactive, so it moves opposite to thyroid output.',
    raised: 'Higher in hypothyroidism, and transiently after illness. Affected by biotin supplements, which can distort the assay.',
    manage: 'Usually interpreted with Free T4. Levels shift slowly, so retesting is typically spaced by six to eight weeks after any change.',
  },
  'ALT (SGPT)': {
    what: 'A liver enzyme released when liver cells are stressed or damaged.',
    raised: 'Commonly raised with fatty liver, alcohol, some medications and supplements, viral hepatitis, and occasionally after intense exercise.',
    manage: 'Mild elevations are often reviewed with alcohol intake, weight, medication and a repeat test before further investigation.',
  },
  'AST (SGOT)': {
    what: 'An enzyme found in liver and also in muscle, so it is less liver-specific than ALT.',
    raised: 'Rises with liver conditions but also after muscle damage or hard training, which is worth mentioning if you tested soon after a heavy session.',
    manage: 'Usually interpreted alongside ALT — the ratio between them carries information.',
  },
  'AFP': {
    what: 'Alpha-fetoprotein, a tumour marker used in monitoring certain cancers including some testicular tumours, and also in liver disease.',
    raised: 'Can be raised by liver conditions as well as by tumour activity, so an elevated result is not specific on its own.',
    manage: 'In surveillance, the trend across serial measurements is what is followed. Any change should go to your oncology team rather than being interpreted alone.',
  },
  'Beta hCG': {
    what: 'A hormone used as a tumour marker in the monitoring of certain testicular tumours.',
    raised: 'Can be raised by tumour activity and, less commonly, by other causes including some medications and hypogonadism.',
    manage: 'Followed as a trend during surveillance. Discuss any rise with your oncology team promptly rather than waiting for the next scheduled review.',
  },
  'LDH': {
    what: 'Lactate dehydrogenase, an enzyme present in most tissues. Used alongside other markers in tumour surveillance.',
    raised: 'Very non-specific — rises with muscle damage, intense exercise, haemolysis, infection and many other conditions, as well as tumour activity.',
    manage: 'Because it is so non-specific, it is interpreted alongside AFP and beta-hCG and the wider clinical picture, not alone.',
  },
  'Resting Heart Rate': {
    what: 'Heart rate at complete rest — a broad indicator of cardiovascular fitness and autonomic state.',
    raised: 'Higher with poor sleep, stress, illness, dehydration, alcohol, caffeine and overtraining. Falls with improving aerobic fitness.',
    manage: 'A gradual downward trend with consistent training is generally viewed favourably. A sustained rise without explanation is worth mentioning to your cardiologist.',
  },
  'Blood Pressure - Systolic': {
    what: 'The pressure in the arteries during a heartbeat — the upper number.',
    raised: 'Rises with salt intake, excess weight, alcohol, stress, poor sleep, inactivity and some medications. Readings are also higher when measured soon after activity or caffeine.',
    manage: 'Commonly addressed through salt reduction, activity, weight, alcohol and sleep, plus medication where indicated. Single readings vary a lot — a home average over several days is more informative.',
  },
  'Blood Pressure - Diastolic': {
    what: 'The pressure in the arteries between heartbeats — the lower number.',
    raised: 'Influenced by the same factors as systolic pressure.',
    manage: 'Interpreted together with the systolic value rather than alone.',
  },
};
function markerInfo(title) { return MARKER_INFO[title] || null; }

function referenceRange(title, sex) {
  const r = REFERENCE_RANGES[title];
  if (!r) return null;
  const band = (sex === 'female' && r.female) ? r.female : (sex === 'male' && r.male) ? r.male : r.any;
  return band || r.any || null;
}

// ===========================================================================
// REPORT EXPORT: minimal dependency-free XLSX writer
// No xlsx/SheetJS package is bundled (no network access to install one at
// build time), so this hand-writes CRC32 -> ZIP (STORE) -> OOXML
// SpreadsheetML. Verified against openpyxl and pandas during development;
// produces a standard, unmodified-looking .xlsx any spreadsheet app opens.
// ===========================================================================

// ---------------------------------------------------------------------------
// Minimal, dependency-free XLSX writer.
// No npm xlsx/SheetJS package is available in this build (no network to
// install one), so this hand-writes: CRC32 -> ZIP (STORE, uncompressed) ->
// OOXML SpreadsheetML parts. Uncompressed ZIP entries avoid needing a
// deflate implementation while still producing a fully valid .xlsx that
// Excel, Google Sheets, and Numbers all open correctly.
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function strToBytes(str) {
  return new TextEncoder().encode(str);
}
function u16(n) { return [n & 0xff, (n >> 8) & 0xff]; }
function u32(n) { return [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff]; }

// DOS date/time for zip headers - fixed timestamp is fine, nothing reads it meaningfully
const DOS_TIME = 0, DOS_DATE = ((2024 - 1980) << 9) | (1 << 5) | 1;

function buildZip(files) {
  // files: [{name, data: Uint8Array}]
  const localParts = [];
  const central = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = strToBytes(f.name);
    const data = f.data;
    const crc = crc32(data);
    const local = [
      ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0),
      ...u16(DOS_TIME), ...u16(DOS_DATE),
      ...u32(crc), ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), ...u16(0),
      ...nameBytes, ...data,
    ];
    localParts.push(new Uint8Array(local));

    central.push(new Uint8Array([
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0),
      ...u16(DOS_TIME), ...u16(DOS_DATE),
      ...u32(crc), ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(0), ...u32(offset),
      ...nameBytes,
    ]));
    offset += local.length;
  }

  const centralStart = offset;
  let centralSize = 0;
  for (const c of central) centralSize += c.length;

  const eocd = new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0),
    ...u16(files.length), ...u16(files.length),
    ...u32(centralSize), ...u32(centralStart), ...u16(0),
  ]);

  const total = offset + centralSize + eocd.length;
  const out = new Uint8Array(total);
  let p = 0;
  for (const part of localParts) { out.set(part, p); p += part.length; }
  for (const part of central) { out.set(part, p); p += part.length; }
  out.set(eocd, p);
  return out;
}

function xmlEscape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
}
function colName(n) {
  // 0-indexed column -> "A", "B", ... "AA"
  let s = '', num = n + 1;
  while (num > 0) { const rem = (num - 1) % 26; s = String.fromCharCode(65 + rem) + s; num = Math.floor((num - 1) / 26); }
  return s;
}
function safeSheetName(name) {
  return String(name).replace(/[:\\/?*\[\]]/g, ' ').slice(0, 31) || 'Sheet';
}

function buildSheetXml(rows) {
  const lines = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>',
    '<sheetData>'];
  rows.forEach((row, rIdx) => {
    const rNum = rIdx + 1;
    const isHeader = rIdx === 0;
    let rowXml = `<row r="${rNum}">`;
    row.forEach((cell, cIdx) => {
      const ref = `${colName(cIdx)}${rNum}`;
      const styleAttr = isHeader ? ' s="1"' : '';
      if (cell === null || cell === undefined || cell === '') {
        // omit empty cell entirely - valid and keeps the file smaller
      } else if (typeof cell === 'number' && isFinite(cell)) {
        rowXml += `<c r="${ref}"${styleAttr}><v>${cell}</v></c>`;
      } else {
        rowXml += `<c r="${ref}" t="inlineStr"${styleAttr}><is><t xml:space="preserve">${xmlEscape(cell)}</t></is></c>`;
      }
    });
    rowXml += '</row>';
    lines.push(rowXml);
  });
  lines.push('</sheetData></worksheet>');
  return lines.join('');
}

function buildWorkbookXlsx(sheets) {
  // sheets: [{ name, rows: [[...header], [...row], ...] }]
  const files = [];
  const add = (name, xml) => files.push({ name, data: strToBytes(xml) });

  add('[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
    sheets.map((s, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('') +
    '</Types>');

  add('_rels/.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
    '</Relationships>');

  add('xl/workbook.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<sheets>' +
    sheets.map((s, i) => `<sheet name="${xmlEscape(safeSheetName(s.name))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('') +
    '</sheets></workbook>');

  add('xl/_rels/workbook.xml.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('') +
    '</Relationships>');

  add('xl/styles.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '<cellXfs count="2">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>');

  sheets.forEach((s, i) => add(`xl/worksheets/sheet${i + 1}.xml`, buildSheetXml(s.rows)));

  const zipBytes = buildZip(files);
  return zipBytes;
}


// ===========================================================================
// REPORT EXPORT: data selection and sheet building
// ===========================================================================

const REPORT_DATE_PRESETS = [
  { key: '7d', label: 'Last 7 days', days: 7 },
  { key: '30d', label: 'Last 30 days', days: 30 },
  { key: '90d', label: 'Last 90 days', days: 90 },
  { key: 'ytd', label: 'This year', days: null },
  { key: 'all', label: 'All time', days: null },
  { key: 'custom', label: 'Custom range', days: null },
];

function inRange(dateIso, startIso, endIso) {
  const t = new Date(dateIso).getTime();
  if (startIso && t < new Date(startIso + 'T00:00:00').getTime()) return false;
  if (endIso && t > new Date(endIso + 'T23:59:59').getTime()) return false;
  return true;
}

function downloadBytes(bytes, filename, mime) {
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function buildHealthReport({ startIso, endIso, presetLabel, medicalEntries, sessions, walkLogs, circuitLogs, people, profile }) {
  const person = (nm) => nm || 'Me';

  // --- Summary sheet ---
  const summaryRows = [
    ['Field', 'Value'],
    ['Report', 'Training Tracker export'],
    ['Date range', presetLabel],
    ['From', startIso || '(no start)'],
    ['To', endIso || '(no end)'],
    ['Generated', new Date().toLocaleString()],
    ['People included', (people && people.length ? people.join(', ') : 'Me')],
    ['', ''],
    ['Note', 'This data is self-reported by the user via a personal tracking app, not a clinical measurement. Reference ranges vary by lab, age and sex — the range on the original lab report is authoritative.'],
  ];

  // --- Health records ---
  const healthRows = [['Date', 'Person', 'Marker', 'Value', 'Unit', 'Category', 'Notes']];
  (medicalEntries || [])
    .filter(e => inRange(e.date, startIso, endIso))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(e => {
      healthRows.push([fmtDate(e.date), person(e.person), e.title, e.value ?? '', e.unit || '', e.category || '', e.notes || '']);
    });

  // --- Workout sessions (summary level) ---
  const sessionRows = [['Date', 'Workout', 'Rounds', 'Duration (min)', 'RPE', 'Circuit avg HR', 'Circuit max HR', 'Circuit kcal']];
  const inRangeSessions = (sessions || []).filter(s => inRange(s.date, startIso, endIso)).sort((a, b) => new Date(a.date) - new Date(b.date));
  inRangeSessions.forEach(s => {
    const log = (circuitLogs || []).find(c => c.sessionId === s.id);
    sessionRows.push([
      fmtDate(s.date), s.day || '', s.rounds ?? '', s.durationMin ?? (log ? log.durationMin : '') ?? '',
      s.rpe ?? '', log ? log.avgHR ?? '' : '', log ? log.maxHR ?? '' : '', log ? log.kcal ?? '' : '',
    ]);
  });

  // --- Workout exercises (detail level) ---
  const exerciseRows = [['Date', 'Workout', 'Exercise', 'Weight', 'Primary target']];
  inRangeSessions.forEach(s => {
    sessionExercises(s).forEach(e => {
      const targets = muscleTargetsFor(e.name);
      exerciseRows.push([fmtDate(s.date), s.day || '', e.name, e.weight || '', targets[0] ? muscleLabel(targets[0]) : '']);
    });
  });

  // --- Cardio & activity ---
  const cardioRows = [['Date', 'Mode', 'Type', 'Duration (min)', 'Kcal', 'Avg HR', 'Max HR', 'Steps', 'VO2max']];
  (walkLogs || [])
    .filter(w => inRange(w.date, startIso, endIso))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(w => {
      cardioRows.push([
        fmtDate(w.date), logMode(w) === 'activity' ? 'Activity' : 'Cardio', logType(w),
        w.durationMin ?? '', w.kcal ?? '', w.avgHR ?? '', w.maxHR ?? '', w.steps ?? '', w.vo2max ?? '',
      ]);
    });

  // --- Profile (context for a doctor) ---
  const profileRows = [['Field', 'Value']];
  if (profile) {
    profileRows.push(['Age', profile.age || '']);
    profileRows.push(['Sex', profile.sex || '']);
    profileRows.push(['Height (cm)', profile.heightCm || '']);
  }
  const bw = (medicalEntries || []).filter(e => e.title === 'Bodyweight' && e.value != null).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  if (bw) profileRows.push(['Latest bodyweight', `${bw.value} kg (${fmtDate(bw.date)})`]);

  const sheets = [{ name: 'Summary', rows: summaryRows }];
  if (healthRows.length > 1) sheets.push({ name: 'Health Records', rows: healthRows });
  if (sessionRows.length > 1) sheets.push({ name: 'Workout Sessions', rows: sessionRows });
  if (exerciseRows.length > 1) sheets.push({ name: 'Workout Exercises', rows: exerciseRows });
  if (cardioRows.length > 1) sheets.push({ name: 'Cardio & Activity', rows: cardioRows });
  if (profileRows.length > 1) sheets.push({ name: 'Profile', rows: profileRows });

  return sheets;
}

// ===========================================================================
// FITNESS: CARDIO & ACTIVITY TYPES
// ===========================================================================

const CARDIO_TYPES = ['Walking', 'Running', 'Jogging', 'Cycling', 'Stairs', 'Swimming', 'Treadmill', 'Elliptical'];
const ACTIVITY_TYPES = ['Gardening', 'Housework', 'Yoga', 'Stretching', 'Sports', 'Hiking', 'Dancing'];
const DEFAULT_CARDIO = 'Walking';
const DEFAULT_ACTIVITY = 'Gardening';

// A cardio log is any session with mode 'cardio'; activities use mode 'activity'.
// Older walk records have neither, so they're treated as Walking cardio.
function logMode(entry) {
  return entry.mode || 'cardio';
}
function logType(entry) {
  return entry.type || (logMode(entry) === 'activity' ? DEFAULT_ACTIVITY : DEFAULT_CARDIO);
}

// ===========================================================================
// MEDICAL: PEOPLE & SCHEDULED ITEMS (appointments, tests due, medication)
// ===========================================================================

const DEFAULT_PERSON = 'Me';
// ===========================================================================
// HEALTH: PRESETS, LAB ANALYTES & REPORT PARSING
// ===========================================================================

const MEDICAL_CATEGORIES = ['Vitals', 'Test Result', 'Medication', 'Appointment', 'Symptom', 'Note'];

const MEDICAL_PRESETS = [
  { title: 'Bodyweight', unit: 'kg', category: 'Vitals' },
  { title: 'Resting Heart Rate', unit: 'bpm', category: 'Vitals' },
  { title: 'Blood Pressure - Systolic', unit: 'mmHg', category: 'Vitals' },
  { title: 'Blood Pressure - Diastolic', unit: 'mmHg', category: 'Vitals' },
  { title: 'hs-CRP', unit: 'mg/L', category: 'Test Result' },
  { title: 'Homocysteine', unit: '\u00b5mol/L', category: 'Test Result' },
  { title: 'Lipoprotein(a)', unit: 'mg/dL', category: 'Test Result' },
  { title: 'Apolipoprotein B', unit: 'mg/dL', category: 'Test Result' },
  { title: 'Cholesterol - LDL', unit: 'mg/dL', category: 'Test Result' },
  { title: 'Cholesterol - HDL', unit: 'mg/dL', category: 'Test Result' },
  { title: 'Triglycerides', unit: 'mg/dL', category: 'Test Result' },
  { title: 'HbA1c', unit: '%', category: 'Test Result' },
  { title: 'Uric Acid', unit: 'mg/dL', category: 'Test Result' },
  { title: 'Vitamin B12', unit: 'pg/mL', category: 'Test Result' },
  { title: 'Vitamin D', unit: 'ng/mL', category: 'Test Result' },
  { title: 'Creatinine', unit: 'mg/dL', category: 'Test Result' },
  { title: 'eGFR', unit: 'mL/min/1.73m\u00b2', category: 'Test Result' },
  { title: 'Hemoglobin', unit: 'g/dL', category: 'Test Result' },
  { title: 'AFP', unit: 'ng/mL', category: 'Test Result' },
  { title: 'Beta hCG', unit: 'mIU/mL', category: 'Test Result' },
  { title: 'LDH', unit: 'U/L', category: 'Test Result' },
];

const ANALYTE_GROUPS = [
  'Heart & inflammation', 'Lipids', 'Blood sugar', 'CBC', 'Kidney & electrolytes',
  'Liver', 'Vitamins & minerals', 'Thyroid', 'Tumour markers', 'Vitals', 'Other',
];

// Order matters: the parser takes the first match on a line, so more specific
// names must come before general ones (hs-CRP before CRP, Free T4 before T4).
const LAB_ANALYTES = [
  { key: 'hs-CRP', group: 'Heart & inflammation', re: /\b(?:hs[\s-]?crp|high[\s-]?sensitivity\s+c[\s-]?reactive)\b/i, unit: 'mg/L', lo: 0, hi: 50 },
  { key: 'CRP', group: 'Heart & inflammation', re: /\b(?:crp|c[\s-]?reactive protein)\b/i, unit: 'mg/L', lo: 0, hi: 300 },
  { key: 'Homocysteine', group: 'Heart & inflammation', re: /\bhomocystein?e?\b/i, unit: '\u00b5mol/L', lo: 1, hi: 100 },
  { key: 'Lipoprotein(a)', group: 'Heart & inflammation', re: /\b(?:lp\s*\(?a\)?|lipoprotein\s*\(?a\)?)\b/i, unit: 'mg/dL', lo: 0, hi: 300 },
  { key: 'Apolipoprotein B', group: 'Heart & inflammation', re: /\b(?:apo\s*b|apolipoprotein\s*b)\b/i, unit: 'mg/dL', lo: 10, hi: 300 },
  { key: 'Apolipoprotein A1', group: 'Heart & inflammation', re: /\b(?:apo\s*a[\s-]?1|apolipoprotein\s*a[\s-]?1)\b/i, unit: 'mg/dL', lo: 10, hi: 300 },
  { key: 'NT-proBNP', group: 'Heart & inflammation', re: /\b(?:nt[\s-]?pro[\s-]?bnp)\b/i, unit: 'pg/mL', lo: 0, hi: 35000 },
  { key: 'BNP', group: 'Heart & inflammation', re: /\bbnp\b/i, unit: 'pg/mL', lo: 0, hi: 5000 },
  { key: 'Troponin', group: 'Heart & inflammation', re: /\btropon(?:in)?[\s-]?[itI]?\b/i, unit: 'ng/L', lo: 0, hi: 50000 },
  { key: 'ESR', group: 'Heart & inflammation', re: /\b(?:esr|erythrocyte sedimentation)\b/i, unit: 'mm/hr', lo: 0, hi: 150 },

  { key: 'Cholesterol - Total', group: 'Lipids', re: /\btotal cholesterol\b|\bcholesterol[,\s]*total\b/i, unit: 'mg/dL', lo: 50, hi: 500 },
  { key: 'Cholesterol - Non-HDL', group: 'Lipids', re: /\bnon[\s-]?hdl\b/i, unit: 'mg/dL', lo: 10, hi: 400 },
  { key: 'Cholesterol - LDL', group: 'Lipids', re: /\bldl\b/i, unit: 'mg/dL', lo: 10, hi: 400 },
  { key: 'Cholesterol - HDL', group: 'Lipids', re: /\bhdl\b/i, unit: 'mg/dL', lo: 5, hi: 150 },
  { key: 'Cholesterol - VLDL', group: 'Lipids', re: /\bvldl\b/i, unit: 'mg/dL', lo: 1, hi: 150 },
  { key: 'Triglycerides', group: 'Lipids', re: /\btriglyceride(?:s)?\b/i, unit: 'mg/dL', lo: 10, hi: 1000 },
  { key: 'Chol/HDL Ratio', group: 'Lipids', re: /\b(?:chol(?:esterol)?\s*[\/:]\s*hdl|cardiac risk ratio)\b/i, unit: '', lo: 0.5, hi: 20 },

  { key: 'HbA1c', group: 'Blood sugar', re: /\b(?:hba1c|a1c|glycated h(?:a)?emoglobin)\b/i, unit: '%', lo: 3, hi: 20 },
  { key: 'Blood Glucose (fasting)', group: 'Blood sugar', re: /\b(?:fasting blood sugar|fbs|fasting glucose|glucose[,\s]*fasting)\b/i, unit: 'mg/dL', lo: 20, hi: 600 },
  { key: 'Blood Glucose (post-prandial)', group: 'Blood sugar', re: /\b(?:post[\s-]?prandial|pp(?:bs)?\b|ppg)\b/i, unit: 'mg/dL', lo: 20, hi: 800 },
  { key: 'Blood Glucose', group: 'Blood sugar', re: /\b(?:glucose|blood sugar)\b/i, unit: 'mg/dL', lo: 20, hi: 600 },
  { key: 'Insulin (fasting)', group: 'Blood sugar', re: /\b(?:fasting insulin|insulin)\b/i, unit: '\u00b5IU/mL', lo: 0.5, hi: 300 },

  { key: 'Hemoglobin', group: 'CBC', re: /\b(?:h(?:a)?emoglobin|hgb|hb)\b/i, unit: 'g/dL', lo: 2, hi: 25 },
  { key: 'RBC Count', group: 'CBC', re: /\b(?:rbc|red blood cell(?:s)?(?:\s*count)?|erythrocyte(?:s)?)\b/i, unit: 'million/\u00b5L', lo: 1, hi: 10 },
  { key: 'WBC Count', group: 'CBC', re: /\b(?:wbc|white blood cell(?:s)?(?:\s*count)?|leu[ck]ocyte(?:s)?|total leu[ck]ocyte count|tlc)\b/i, unit: 'thousand/\u00b5L', lo: 0.5, hi: 100 },
  { key: 'Platelet Count', group: 'CBC', re: /\b(?:platelet(?:s)?(?:\s*count)?|plt)\b/i, unit: 'thousand/\u00b5L', lo: 5, hi: 1500 },
  { key: 'Hematocrit', group: 'CBC', re: /\b(?:h(?:a)?ematocrit|hct|pcv)\b/i, unit: '%', lo: 10, hi: 70 },
  { key: 'MCV', group: 'CBC', re: /\bmcv\b/i, unit: 'fL', lo: 40, hi: 140 },
  { key: 'MCH', group: 'CBC', re: /\bmch\b(?!c)/i, unit: 'pg', lo: 10, hi: 50 },
  { key: 'MCHC', group: 'CBC', re: /\bmchc\b/i, unit: 'g/dL', lo: 20, hi: 45 },
  { key: 'RDW', group: 'CBC', re: /\brdw(?:[\s-]?cv)?\b/i, unit: '%', lo: 5, hi: 40 },
  { key: 'Neutrophils', group: 'CBC', re: /\bneutrophil(?:s)?\b/i, unit: '%', lo: 1, hi: 100 },
  { key: 'Lymphocytes', group: 'CBC', re: /\blymphocyte(?:s)?\b/i, unit: '%', lo: 1, hi: 100 },
  { key: 'Monocytes', group: 'CBC', re: /\bmonocyte(?:s)?\b/i, unit: '%', lo: 0, hi: 100 },
  { key: 'Eosinophils', group: 'CBC', re: /\beosinophil(?:s)?\b/i, unit: '%', lo: 0, hi: 100 },
  { key: 'Basophils', group: 'CBC', re: /\bbasophil(?:s)?\b/i, unit: '%', lo: 0, hi: 100 },

  { key: 'Creatinine', group: 'Kidney & electrolytes', re: /\bcreatinine\b/i, unit: 'mg/dL', lo: 0.1, hi: 15 },
  { key: 'eGFR', group: 'Kidney & electrolytes', re: /\b(?:egfr|gfr)\b/i, unit: 'mL/min/1.73m\u00b2', lo: 1, hi: 200 },
  { key: 'Urea', group: 'Kidney & electrolytes', re: /\b(?:urea|bun|blood urea nitrogen)\b/i, unit: 'mg/dL', lo: 2, hi: 200 },
  { key: 'Uric Acid', group: 'Kidney & electrolytes', re: /\buric acid\b/i, unit: 'mg/dL', lo: 0.5, hi: 20 },
  { key: 'Sodium', group: 'Kidney & electrolytes', re: /\b(?:sodium|na\+?)\b/i, unit: 'mmol/L', lo: 100, hi: 180 },
  { key: 'Potassium', group: 'Kidney & electrolytes', re: /\b(?:potassium|k\+)\b/i, unit: 'mmol/L', lo: 1, hi: 10 },
  { key: 'Chloride', group: 'Kidney & electrolytes', re: /\bchloride\b/i, unit: 'mmol/L', lo: 70, hi: 140 },
  { key: 'Calcium', group: 'Kidney & electrolytes', re: /\bcalcium\b/i, unit: 'mg/dL', lo: 4, hi: 16 },

  { key: 'ALT (SGPT)', group: 'Liver', re: /\b(?:alt|sgpt)\b/i, unit: 'U/L', lo: 1, hi: 2000 },
  { key: 'AST (SGOT)', group: 'Liver', re: /\b(?:ast|sgot)\b/i, unit: 'U/L', lo: 1, hi: 2000 },
  { key: 'ALP', group: 'Liver', re: /\b(?:alp|alkaline phosphatase)\b/i, unit: 'U/L', lo: 5, hi: 1500 },
  { key: 'GGT', group: 'Liver', re: /\b(?:ggt|gamma\s*gt|gamma[\s-]?glutamyl)\b/i, unit: 'U/L', lo: 1, hi: 1500 },
  { key: 'Bilirubin - Direct', group: 'Liver', re: /\b(?:direct bilirubin|bilirubin[,\s]*direct|conjugated bilirubin)\b/i, unit: 'mg/dL', lo: 0, hi: 25 },
  { key: 'Bilirubin - Total', group: 'Liver', re: /\b(?:total bilirubin|bilirubin[,\s]*total|bilirubin)\b/i, unit: 'mg/dL', lo: 0, hi: 40 },
  { key: 'Albumin', group: 'Liver', re: /\balbumin\b/i, unit: 'g/dL', lo: 1, hi: 7 },
  { key: 'Total Protein', group: 'Liver', re: /\btotal protein\b/i, unit: 'g/dL', lo: 2, hi: 12 },

  { key: 'Vitamin B12', group: 'Vitamins & minerals', re: /\b(?:vitamin\s*b\s*12|b12|cobalamin)\b/i, unit: 'pg/mL', lo: 30, hi: 3000 },
  { key: 'Vitamin D', group: 'Vitamins & minerals', re: /\b(?:vitamin\s*d|25[\s-]?oh[\s-]?(?:vit)?\s*d?)\b/i, unit: 'ng/mL', lo: 2, hi: 150 },
  { key: 'Folate', group: 'Vitamins & minerals', re: /\b(?:folate|folic acid)\b/i, unit: 'ng/mL', lo: 0.2, hi: 50 },
  { key: 'Ferritin', group: 'Vitamins & minerals', re: /\bferritin\b/i, unit: 'ng/mL', lo: 1, hi: 3000 },
  { key: 'Iron', group: 'Vitamins & minerals', re: /\b(?:serum iron|iron)\b/i, unit: '\u00b5g/dL', lo: 5, hi: 500 },
  { key: 'Magnesium', group: 'Vitamins & minerals', re: /\bmagnesium\b/i, unit: 'mg/dL', lo: 0.5, hi: 6 },

  { key: 'TSH', group: 'Thyroid', re: /\btsh\b/i, unit: '\u00b5IU/mL', lo: 0.01, hi: 100 },
  { key: 'Free T4', group: 'Thyroid', re: /\b(?:free\s*t4|ft4)\b/i, unit: 'ng/dL', lo: 0.1, hi: 10 },
  { key: 'Free T3', group: 'Thyroid', re: /\b(?:free\s*t3|ft3)\b/i, unit: 'pg/mL', lo: 0.5, hi: 30 },
  { key: 'T4', group: 'Thyroid', re: /\bt4\b/i, unit: '\u00b5g/dL', lo: 1, hi: 30 },
  { key: 'T3', group: 'Thyroid', re: /\bt3\b/i, unit: 'ng/dL', lo: 20, hi: 600 },

  { key: 'AFP', group: 'Tumour markers', re: /\bafp\b|\balpha[\s-]?fetoprotein\b/i, unit: 'ng/mL', lo: 0, hi: 100000 },
  { key: 'Beta hCG', group: 'Tumour markers', re: /\b(?:beta[\s-]?hcg|b[\s-]?hcg|hcg)\b/i, unit: 'mIU/mL', lo: 0, hi: 200000 },
  { key: 'LDH', group: 'Tumour markers', re: /\bldh\b|\blactate dehydrogenase\b/i, unit: 'U/L', lo: 20, hi: 5000 },
  { key: 'PSA', group: 'Tumour markers', re: /\bpsa\b|\bprostate specific antigen\b/i, unit: 'ng/mL', lo: 0, hi: 200 },
];

const ANALYTE_GROUP_BY_KEY = LAB_ANALYTES.reduce((m, a) => { m[a.key] = a.group; return m; }, {});
const VITALS_TITLES = ['Bodyweight', 'Resting Heart Rate', 'Blood Pressure - Systolic', 'Blood Pressure - Diastolic'];
function groupForTitle(title) {
  if (ANALYTE_GROUP_BY_KEY[title]) return ANALYTE_GROUP_BY_KEY[title];
  if (VITALS_TITLES.includes(title)) return 'Vitals';
  const t = String(title || '').toLowerCase();
  const hit = LAB_ANALYTES.find(a => a.re.test(t));
  return hit ? hit.group : 'Other';
}

function parseLabReport(text) {
  const found = [];
  const seen = new Set();
  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    for (const a of LAB_ANALYTES) {
      if (seen.has(a.key)) continue;
      if (!a.re.test(line)) continue;
      const after = line.replace(a.re, ' ');
      const nums = [...after.matchAll(/(\d+(?:\.\d+)?)/g)].map(m => parseFloat(m[1]));
      const val = nums.find(n => n >= a.lo && n <= a.hi);
      if (val !== undefined) {
        const unitMatch = line.match(/(g\/dL|mg\/dL|ng\/mL|pg\/mL|mIU\/mL|[\u00b5u]IU\/mL|U\/L|mg\/L|mm\/hr|mmol\/L|million\/[\u00b5u]L|thousand\/[\u00b5u]L|cells\/[\u00b5u]L|fL|pg|%)/i);
        found.push({ title: a.key, value: val, unit: unitMatch ? unitMatch[1] : a.unit, category: 'Test Result' });
        seen.add(a.key);
      }
      break;
    }
  }
  return found;
}

function extractReportDate(text) {
  const m = text.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b/);
  if (!m) return null;
  let [, d, mo, y] = m;
  y = y.length === 2 ? '20' + y : y;
  const iso = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  const dt = new Date(iso);
  return isNaN(dt.getTime()) ? null : iso;
}

// Rebuild readable lines from pdf.js text items, which arrive as positioned
// fragments. The lab parser is line-based, so this grouping matters.
function pdfItemsToLines(items) {
  const rows = [];
  for (const it of items) {
    const str = it.str;
    if (!str || !str.trim()) continue;
    const y = Math.round(it.transform[5]);
    const x = it.transform[4];
    let row = rows.find(r => Math.abs(r.y - y) <= 2);
    if (!row) { row = { y, parts: [] }; rows.push(row); }
    row.parts.push({ x, str });
  }
  rows.sort((a, b) => b.y - a.y);
  return rows
    .map(r => r.parts.sort((a, b) => a.x - b.x).map(p => p.str).join(' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

const MEDICAL_KINDS = [
  { key: 'appointment', label: 'Appointment', color: '#4C8DFF' },
  { key: 'test', label: 'Test due', color: '#3DDC97' },
  { key: 'medication', label: 'Medication', color: '#FFB03D' },
  { key: 'other', label: 'Other', color: '#8E94A1' },
];
function kindMeta(k) {
  return MEDICAL_KINDS.find(x => x.key === k) || MEDICAL_KINDS[3];
}
function scheduleStart(item) {
  const d = new Date(item.dueDate);
  if (item.time) {
    const [h, m] = String(item.time).split(':').map(Number);
    d.setHours(h || 0, m || 0, 0, 0);
  }
  return d;
}
function upcomingSchedule(list, withinDays = 60) {
  return (list || [])
    .filter(x => !x.done)
    .filter(x => {
      const diff = daysBetween(new Date(), x.dueDate);
      return diff >= -365 && diff <= withinDays;
    })
    .sort((a, b) => scheduleStart(a) - scheduleStart(b));
}

// ===========================================================================
// DAY PLANNER: TASK STATUS, HISTORY & RETENTION
// ===========================================================================

const TASK_RETENTION_DAYS = 730; // rolling 2 years of history

function taskStatus(t) {
  if (t.status) return t.status;
  return t.done ? 'done' : 'open';   // migrate older records
}
function isClosed(t) {
  const st = taskStatus(t);
  return st === 'done' || st === 'cancelled';
}
function withHistory(task, action, note) {
  const entry = { at: new Date().toISOString(), action };
  if (note) entry.note = note;
  return { ...task, history: [...(task.history || []), entry] };
}
function pruneOldTasks(list) {
  const cutoff = Date.now() - TASK_RETENTION_DAYS * 86400000;
  return list.filter(t => {
    if (!isClosed(t)) return true;              // never prune anything still open
    const closedAt = (t.history || []).slice().reverse()
      .find(h => h.action === 'done' || h.action === 'cancelled');
    const when = closedAt ? new Date(closedAt.at).getTime() : new Date(t.targetDate).getTime();
    return when >= cutoff;
  });
}
function statusMeta(st) {
  return {
    open:      { label: 'Open',      color: COLORS.lower },
    done:      { label: 'Completed', color: COLORS.success },
    postponed: { label: 'Postponed', color: COLORS.warn },
    cancelled: { label: 'Cancelled', color: '#E5484D' },
  }[st] || { label: st, color: COLORS.textMute };
}

// Turn a shared/pasted message (e.g. from WhatsApp) into a draft task.
function parseSharedMessage(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  // WhatsApp exports look like: [12/08/2026, 14:32] Name: message
  const wa = text.match(/^\[?\d{1,2}\/\d{1,2}\/\d{2,4},?\s*\d{1,2}:\d{2}[^\]]*\]?\s*([^:]{1,40}):\s*([\s\S]+)$/);
  let who = '', body = text;
  if (wa) { who = wa[1].trim(); body = wa[2].trim(); }
  const bodyLines = body.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const title = (bodyLines[0] || text).slice(0, 90);
  const details = bodyLines.slice(1).join('\n');

  let targetDate = '';
  const dm = body.match(/\b(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?\b/);
  if (dm) {
    const now = new Date();
    const d = parseInt(dm[1], 10), mo = parseInt(dm[2], 10);
    let y = dm[3] ? parseInt(dm[3], 10) : now.getFullYear();
    if (y < 100) y += 2000;
    const cand = new Date(y, mo - 1, d);
    if (!isNaN(cand.getTime())) targetDate = cand.toISOString().slice(0, 10);
  } else if (/\btomorrow\b/i.test(body)) {
    targetDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  } else if (/\btoday\b/i.test(body)) {
    targetDate = new Date().toISOString().slice(0, 10);
  }

  let targetTime = '';
  const tm = body.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i) || body.match(/\b(\d{1,2}):(\d{2})\b/);
  if (tm) {
    let h = parseInt(tm[1], 10);
    const min = tm[2] ? parseInt(tm[2], 10) : 0;
    const ap = tm[3] ? tm[3].toLowerCase() : '';
    if (ap === 'pm' && h < 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
    if (h >= 0 && h <= 23 && min >= 0 && min <= 59) {
      targetTime = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }
  }
  return { title, details, contactName: who, targetDate, targetTime };
}

function dueGroupLabel(iso) {
  const diff = daysBetween(new Date(), iso);
  if (diff < 0) return `Overdue (${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'})`;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff <= 7) return 'This week';
  if (diff <= 30) return 'This month';
  return 'Later';
}
const DUE_GROUP_ORDER = ['Overdue', 'Today', 'Tomorrow', 'This week', 'This month', 'Later'];
function dueGroupRank(label) {
  if (label.startsWith('Overdue')) return 0;
  const i = DUE_GROUP_ORDER.indexOf(label);
  return i === -1 ? 99 : i;
}

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function fmtMonthYear(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}
function fmtShortMonthYear(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short' }) + " '" + String(d.getFullYear()).slice(2);
}


// ---------------------------------------------------------------------------
// Shared UI primitives
// These exist so the same card / label / input styling isn't repeated dozens of
// times inline, which is how the #000 vs #000000 input inconsistency crept in.
// ---------------------------------------------------------------------------


// ===========================================================================
// SHARED UI PRIMITIVES
// ===========================================================================

const INPUT_BG = '#000000';

function cardStyle(accent) {
  return { backgroundColor: COLORS.surface, border: `1px solid ${accent || COLORS.border}` };
}
function inputStyle(extra) {
  return {
    backgroundColor: INPUT_BG,
    color: COLORS.grayWhite,
    border: `1px solid ${COLORS.border}`,
    ...(extra || {}),
  };
}

function Card({ children, accent, className = '', ...rest }) {
  return (
    <div className={`rounded-2xl p-4 ${className}`} style={cardStyle(accent)} {...rest}>
      {children}
    </div>
  );
}

function SectionLabel({ children, color, className = '' }) {
  return (
    <div className={`text-xs font-semibold uppercase tracking-widest ${className}`}
      style={{ color: color || COLORS.textMute }}>
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return <div>{label && <FieldLabel>{label}</FieldLabel>}{children}</div>;
}

function TextInput({ value, onChange, placeholder, type = 'text', inputMode, mono, className = '', inputRef, ...rest }) {
  return (
    <input
      ref={inputRef}
      type={type}
      inputMode={inputMode}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={`w-full rounded-lg px-3 py-2 text-sm outline-none ${className}`}
      style={inputStyle(mono ? { fontFamily: FONTS.mono } : undefined)}
      {...rest}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3, className = '' }) {
  return (
    <textarea rows={rows} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={`w-full rounded-lg px-3 py-2 text-sm outline-none resize-none ${className}`}
      style={inputStyle()} />
  );
}

function SelectInput({ value, onChange, children, disabled }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        className="w-full rounded-lg pl-3 pr-8 py-2 text-sm outline-none appearance-none"
        style={inputStyle(disabled ? { color: COLORS.textMute } : undefined)}>
        {children}
      </select>
      <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" color={COLORS.grayWhite} />
    </div>
  );
}

function TabSwitcher({ tabs, value, onChange }) {
  return (
    <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
      {tabs.map(t => {
        const key = typeof t === 'string' ? t : t.key;
        const label = typeof t === 'string' ? t : t.label;
        return (
          <button key={key} onClick={() => onChange(key)} className="flex-1 py-2 text-xs font-semibold capitalize"
            style={{ backgroundColor: value === key ? COLORS.surface2 : 'transparent', color: value === key ? COLORS.text : COLORS.textMute }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ActionButton({ children, onClick, tone = 'neutral', disabled, className = '' }) {
  const tones = {
    primary: { backgroundColor: COLORS.upper, color: '#1A0D06' },
    success: { backgroundColor: COLORS.success, color: '#06231A' },
    neutral: { backgroundColor: COLORS.surface2, color: COLORS.text },
    muted: { backgroundColor: COLORS.surface2, color: COLORS.textMute },
  };
  const style = disabled ? { backgroundColor: COLORS.surface2, color: COLORS.textMute } : tones[tone];
  return (
    <button onClick={onClick} disabled={disabled}
      className={`rounded-xl py-2.5 text-xs font-semibold ${className}`} style={style}>
      {children}
    </button>
  );
}

function StatTiles({ items }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(x => (
        <div key={x.label} className="rounded-xl p-2.5 text-center" style={cardStyle()}>
          <div className="text-sm font-bold" style={{ fontFamily: FONTS.mono }}>{x.value ?? '\u2014'}</div>
          <div className="text-[9px] uppercase tracking-wide mt-0.5" style={{ color: COLORS.textMute }}>{x.label}</div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, children }) {
  return (
    <div className="rounded-2xl p-8 text-center" style={cardStyle()}>
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-sm" style={{ color: COLORS.textMute }}>{children}</div>
    </div>
  );
}

function InfoNote({ children }) {
  return (
    <div className="rounded-2xl p-3.5" style={{ backgroundColor: COLORS.surface2, border: `1px solid ${COLORS.border}` }}>
      <div className="text-[11px] leading-relaxed" style={{ color: COLORS.textMute }}>{children}</div>
    </div>
  );
}

// Whether a rising value is good, neutral, or bad for a given marker name.
// Single source of truth — this logic used to be copy-pasted in three places.
const LOWER_IS_BETTER = ['resting', 'ldl', 'glucose', 'hba1c', 'triglycer', 'systolic', 'diastolic', 'psa', 'afp', 'creatinine'];
function goodDirectionFor(title) {
  const t = String(title || '').toLowerCase();
  if (LOWER_IS_BETTER.some(k => t.includes(k))) return 'down';
  if (t.includes('hdl')) return 'up';
  return null;
}


// ===========================================================================
// CHARTS
// ===========================================================================

function Sparkline({ points, color = COLORS.success, height = 54, unit = '', showAxis = true, showDates = false }) {
  const clean = points.filter(p => typeof p.v === 'number' && !isNaN(p.v));
  const vals = clean.map(p => p.v);
  if (vals.length === 0) return null;
  if (vals.length === 1) {
    return (
      <div className="flex items-center justify-center text-xs py-3" style={{ color: COLORS.textMute }}>
        Only one reading so far — log another to see a trend
      </div>
    );
  }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 300, H = height, PAD = 4;
  const step = (W - PAD * 2) / (vals.length - 1);
  const coords = vals.map((v, i) => {
    const x = PAD + i * step;
    const y = PAD + (1 - (v - min) / range) * (H - PAD * 2);
    return [x, y];
  });
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(' ');
  const areaPath = `${path} L${coords[coords.length - 1][0].toFixed(1)},${H - PAD} L${coords[0][0].toFixed(1)},${H - PAD} Z`;
  const firstDate = clean[0].date;
  const lastDate = clean[clean.length - 1].date;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} preserveAspectRatio="none">
        <path d={areaPath} fill={color} fillOpacity="0.13" />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {coords.map((c, i) => (
          <circle key={i} cx={c[0]} cy={c[1]} r="2.5" fill={color} />
        ))}
      </svg>
      {showDates && firstDate && lastDate && (
        <div className="flex justify-between text-[9px] mt-0.5" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>
          <span>{fmtShortMonthYear(firstDate)}</span>
          <span>{fmtShortMonthYear(lastDate)}</span>
        </div>
      )}
      {showAxis && (
        <div className="flex justify-between text-[9px] mt-0.5" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>
          <span>{min}{unit}</span>
          <span>{vals.length} readings</span>
          <span>{max}{unit}</span>
        </div>
      )}
    </div>
  );
}

function TrendCard({ label, points, color, unit, goodDirection, onClick, showDates }) {
  const clean = points.filter(p => typeof p.v === 'number' && !isNaN(p.v));
  const vals = clean.map(p => p.v);
  if (vals.length === 0) return null;
  const latest = vals[vals.length - 1];
  const prev = vals.length > 1 ? vals[vals.length - 2] : null;
  const delta = prev !== null ? +(latest - prev).toFixed(1) : null;
  let deltaColor = COLORS.textMute;
  if (delta !== null && delta !== 0 && goodDirection) {
    const good = goodDirection === 'up' ? delta > 0 : delta < 0;
    deltaColor = good ? COLORS.success : COLORS.warn;
  }
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={`rounded-2xl p-4 w-full text-left ${onClick ? 'active:opacity-80' : ''}`}
      style={cardStyle()}>
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest min-w-0 truncate" style={{ color: COLORS.textMute }}>{label}</span>
        <div className="flex items-baseline gap-2 shrink-0">
          <span className="text-lg font-bold" style={{ fontFamily: FONTS.mono }}>{latest}{unit}</span>
          {delta !== null && delta !== 0 && (
            <span className="text-[10px] font-semibold" style={{ color: deltaColor, fontFamily: FONTS.mono }}>
              {delta > 0 ? '+' : ''}{delta}
            </span>
          )}
          {onClick && <ChevronRight size={14} color={COLORS.textMute} />}
        </div>
      </div>
      <Sparkline points={points} color={color} unit={unit} showDates={showDates} />
    </Wrapper>
  );
}

function DeleteButton({ onConfirm, label = 'Delete' }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="flex items-center gap-1.5 shrink-0">
        <button onClick={(e) => { e.stopPropagation(); setConfirming(false); }}
          className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ color: COLORS.textMute }}>Cancel</button>
        <button onClick={(e) => { e.stopPropagation(); onConfirm(); }}
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E5484D', color: '#fff' }}>
          Yes, delete
        </button>
      </span>
    );
  }
  return (
    <button onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
      className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
      style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>
      {label}
    </button>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function DaySummary({ sessions, walkLogs, tasks, medicalSchedule, onSelect }) {
  const today = new Date();
  const isToday = iso => daysBetween(today, iso) === 0;

  const openTasks = (tasks || []).filter(t => !isClosed(t));
  const overdue = openTasks.filter(t => daysBetween(today, t.targetDate) < 0);
  const dueToday = openTasks.filter(t => isToday(t.targetDate));
  const doneToday = (tasks || []).filter(t => taskStatus(t) === 'done'
    && (t.history || []).some(h => h.action === 'done' && isToday(h.at)));
  const cancelledToday = (tasks || []).filter(t => taskStatus(t) === 'cancelled'
    && (t.history || []).some(h => h.action === 'cancelled' && isToday(h.at)));
  const totalToday = dueToday.length + doneToday.length + cancelledToday.length;
  const nextTimed = [...dueToday].filter(taskHasTime).sort((a, b) => taskStart(a) - taskStart(b))[0];

  const medOpen = (medicalSchedule || []).filter(x => !x.done);
  const medOverdue = medOpen.filter(x => daysBetween(today, x.dueDate) < 0);
  const medToday = medOpen.filter(x => isToday(x.dueDate));
  const medSoon = medOpen
    .filter(x => { const d = daysBetween(today, x.dueDate); return d > 0 && d <= 14; })
    .sort((a, b) => scheduleStart(a) - scheduleStart(b));

  const workedOutToday = (sessions || []).some(s => isToday(s.date));
  const walkedToday = (walkLogs || []).some(w => logMode(w) === 'cardio' && isToday(w.date));
  const lastSession = (sessions || [])[0];
  const suggestedDay = lastSession ? (lastSession.day === 'A' ? 'B' : 'A') : 'A';
  const weekSessions = (sessions || []).filter(s => isWithinDays(s.date, 7)).length;
  const weekCardio = (walkLogs || []).filter(w => logMode(w) === 'cardio' && isWithinDays(w.date, 7)).length;
  const weekActivities = (walkLogs || []).filter(w => logMode(w) === 'activity' && isWithinDays(w.date, 7)).length;

  const lines = [];

  // Tasks: lead with progress so a partly-finished day reads as progress, not just what's left
  if (totalToday > 0) {
    const remaining = dueToday.length;
    lines.push({
      text: `${doneToday.length}/${totalToday} tasks done today${remaining ? ` — ${remaining} left` : ''}`,
      color: remaining === 0 ? COLORS.success : COLORS.warn,
      go: 'planner',
    });
    if (nextTimed) {
      lines.push({ text: `Next: ${nextTimed.title} at ${fmtTimeLabel(nextTimed)}`, color: COLORS.textMute, go: 'planner' });
    }
  } else if (openTasks.length === 0) {
    lines.push({ text: 'No tasks outstanding', color: COLORS.textMute, go: 'planner' });
  }
  if (overdue.length) {
    lines.push({ text: `${overdue.length} task${overdue.length === 1 ? '' : 's'} overdue`, color: '#E5484D', go: 'planner' });
  }

  // Medical
  if (medOverdue.length) {
    lines.push({ text: `${medOverdue.length} health item${medOverdue.length === 1 ? '' : 's'} overdue`, color: '#E5484D', go: 'medical' });
  }
  medToday.slice(0, 2).forEach(x => {
    lines.push({ text: `${kindMeta(x.kind).label} today: ${x.title} — ${x.person}`, color: COLORS.warn, go: 'medical' });
  });
  if (!medToday.length && medSoon.length) {
    const x = medSoon[0];
    const d = daysBetween(today, x.dueDate);
    lines.push({
      text: `${kindMeta(x.kind).label} in ${d} day${d === 1 ? '' : 's'}: ${x.title} — ${x.person}`,
      color: COLORS.lower, go: 'medical',
    });
  }

  // Training
  lines.push(workedOutToday
    ? { text: 'Workout done today — nice', color: COLORS.success, go: 'fitness' }
    : { text: `No workout logged yet — Workout ${suggestedDay} is next`, color: COLORS.upper, go: 'fitness' });
  lines.push(walkedToday
    ? { text: 'Cardio logged today', color: COLORS.success, go: 'fitness' }
    : { text: 'No cardio logged today', color: COLORS.textMute, go: 'fitness' });

  const dateLabel = today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Card className="mt-5">
      <div className="flex items-baseline justify-between mb-2.5">
        <SectionLabel>Today</SectionLabel>
        <span className="text-[11px]" style={{ color: COLORS.textMute }}>{dateLabel}</span>
      </div>
      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <button key={i} onClick={() => onSelect(l.go)} className="w-full flex items-start gap-2 text-left">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: l.color }} />
            <span className="text-sm leading-snug" style={{ color: COLORS.text }}>{l.text}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <div>
          <div className="text-sm font-bold" style={{ fontFamily: FONTS.mono }}>{weekSessions}</div>
          <div className="text-[9px] uppercase tracking-wide" style={{ color: COLORS.textMute }}>Workouts / 7d</div>
        </div>
        <div>
          <div className="text-sm font-bold" style={{ fontFamily: FONTS.mono }}>{weekCardio}</div>
          <div className="text-[9px] uppercase tracking-wide" style={{ color: COLORS.textMute }}>Cardio / 7d</div>
        </div>
        <div>
          <div className="text-sm font-bold" style={{ fontFamily: FONTS.mono }}>{openTasks.length}</div>
          <div className="text-[9px] uppercase tracking-wide" style={{ color: COLORS.textMute }}>Open tasks</div>
        </div>
        <div>
          <div className="text-sm font-bold" style={{ fontFamily: FONTS.mono }}>{medOpen.length}</div>
          <div className="text-[9px] uppercase tracking-wide" style={{ color: COLORS.textMute }}>Health due</div>
        </div>
      </div>
    </Card>
  );
}

function HomeScreen({ onSelect, sessions, walkLogs, tasks, medicalSchedule }) {
  const lastSession = (sessions || [])[0];
  const openTasks = (tasks || []).filter(t => !isClosed(t));
  const dueNow = openTasks.filter(t => daysBetween(new Date(), t.targetDate) <= 0).length;
  const cards = [
    {
      key: 'fitness', label: 'Fitness', icon: <Dumbbell size={22} />, color: COLORS.upper,
      sub: (() => {
        const bits = [];
        if (lastSession) bits.push(`Last: Workout ${lastSession.day} · ${fmtDate(lastSession.date).split(',')[0]}`);
        const lastCardio = (walkLogs || []).filter(l => logMode(l) === 'cardio')[0];
        if (lastCardio) bits.push(`${logType(lastCardio)} ${fmtDate(lastCardio.date).split(',')[0]}`);
        return bits.length ? bits.join(' · ') : 'Workouts, cardio & activities';
      })(),
    },
    {
      key: 'medical', label: 'Health', icon: <ClipboardList size={22} />, color: COLORS.success,
      sub: (() => {
        const open = (medicalSchedule || []).filter(x => !x.done);
        const next = upcomingSchedule(open)[0];
        if (!next) return 'Records, vitals & trends';
        const d = daysBetween(new Date(), next.dueDate);
        const when = d < 0 ? 'overdue' : d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`;
        return `${next.title} ${when} · ${next.person}`;
      })(),
    },
    {
      key: 'planner', label: 'Day Planner', icon: <Calendar size={22} />, color: COLORS.warn,
      sub: openTasks.length
        ? `${openTasks.length} open${dueNow ? ` · ${dueNow} due now` : ''}`
        : 'No tasks yet',
    },
  ];


  return (
    <div>
      <DaySummary sessions={sessions} walkLogs={walkLogs} tasks={tasks} medicalSchedule={medicalSchedule} onSelect={onSelect} />
      <div className="mt-4 space-y-3.5">
      {cards.map(c => (
        <button key={c.key} onClick={() => onSelect(c.key)} className="w-full rounded-2xl p-5 flex items-center gap-4 text-left"
          style={cardStyle()}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: c.color + '20', color: c.color }}>
            {c.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold" style={{ fontFamily: FONTS.display }}>{c.label}</div>
            <div className="text-xs mt-0.5 truncate" style={{ color: COLORS.textMute }}>{c.sub}</div>
          </div>
          <ChevronRight size={18} color={COLORS.textMute} />
        </button>
      ))}
      </div>
    </div>
  );
}

function SetupScreen({ day, setDay, roundsTarget, setRoundsTarget, onStart, lastSession, stationsCount }) {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-2xl p-4" style={cardStyle()}>
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.textMute }}>Choose workout</div>
        <div className="flex gap-2">
          {['A', 'B'].map(d => (
            <button key={d} onClick={() => setDay(d)} className="flex-1 rounded-xl py-3 text-left px-3.5"
              style={{ backgroundColor: day === d ? COLORS.surface2 : 'transparent', border: `1.5px solid ${day === d ? COLORS.upper : COLORS.border}` }}>
              <div className="font-semibold text-base" style={{ fontFamily: FONTS.display }}>Workout {d}</div>
              <div className="text-[11px] mt-0.5" style={{ color: COLORS.textMute }}>{stationsCount} stations</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={cardStyle()}>
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.textMute }}>Rounds</div>
        <div className="flex items-center justify-between">
          <button onClick={() => setRoundsTarget(r => Math.max(1, r - 1))} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.surface2 }}>
            <Minus size={16} />
          </button>
          <div className="text-3xl font-bold tabular-nums" style={{ fontFamily: FONTS.mono }}>{roundsTarget}</div>
          <button onClick={() => setRoundsTarget(r => Math.min(4, r + 1))} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.surface2 }}>
            <Plus size={16} />
          </button>
        </div>
        <div className="text-[11px] mt-2 text-center" style={{ color: COLORS.textMute }}>Start at 3 rounds, build toward 4 as it gets easier</div>
      </div>

      {lastSession && (
        <div className="rounded-2xl p-3.5 flex items-center gap-3" style={{ backgroundColor: COLORS.surface2, border: `1px solid ${COLORS.border}` }}>
          <Calendar size={16} color={COLORS.textMute} />
          <div className="text-xs" style={{ color: COLORS.textMute }}>
            Last session: <span style={{ color: COLORS.text }}>Workout {lastSession.day}</span> · {fmtDate(lastSession.date)}
          </div>
        </div>
      )}

      <button onClick={onStart} className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 font-semibold text-base"
        style={{ backgroundColor: COLORS.upper, color: '#1A0D06', fontFamily: FONTS.display }}>
        <Play size={18} fill="#1A0D06" /> START SESSION
      </button>

      <div className="text-[11px] leading-relaxed text-center px-2" style={{ color: COLORS.textMute }}>
        Unusual breathlessness, chest discomfort, or dizziness beyond normal exertion? Stop and check in with your cardiologist.
      </div>
    </div>
  );
}

function WeightPicker({ value, onChange }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg pl-3 pr-8 py-2 text-lg font-bold outline-none appearance-none"
        style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, fontFamily: FONTS.mono, border: `1px solid ${COLORS.border}` }}>
        <option value="" disabled style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite }}>Select…</option>
        {WEIGHT_OPTIONS.map(w => (
          <option key={w} value={w} style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite }}>
            {w === 'Bodyweight' ? 'Bodyweight' : `${w} kg`}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" color={COLORS.grayWhite} />
    </div>
  );
}

function ActiveScreen({ day, stations, stationIdx, currentRound, roundsTarget, status, phase, restSeconds,
  pendingAdvance, weightInput, setWeightInput, showInfo, setShowInfo, onComplete, onSkip, onSkipRest, onQuit, onEndSession,
  onBack, canGoBack }) {
  const ex = stations[stationIdx];
  const color = ex.region === 'Upper' ? COLORS.upper : COLORS.lower;

  if (phase === 'rest') {
    const label = pendingAdvance === 'round' ? 'Round complete — rest before next round' : 'Nice work — brief rest';
    const total = pendingAdvance === 'round' ? 75 : 20;
    return (
      <div className="mt-4 space-y-4">
        <TopBar currentRound={currentRound} roundsTarget={roundsTarget} onQuit={onQuit} onEndSession={onEndSession} />
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center" style={cardStyle()}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: COLORS.textMute }}>{label}</div>
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg width="128" height="128" className="absolute top-0 left-0 -rotate-90">
              <circle cx="64" cy="64" r="56" stroke={COLORS.surface2} strokeWidth="8" fill="none" />
              <circle cx="64" cy="64" r="56" stroke={COLORS.success} strokeWidth="8" fill="none"
                strokeDasharray={2 * Math.PI * 56} strokeDashoffset={2 * Math.PI * 56 * (1 - restSeconds / total)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="text-3xl font-bold tabular-nums" style={{ fontFamily: FONTS.mono }}>{fmtTime(restSeconds)}</div>
          </div>
          <div className="text-sm mb-5" style={{ color: COLORS.textMute }}>
            Up next: <span style={{ color: COLORS.text, fontWeight: 600 }}>
              {pendingAdvance === 'round' ? stations[0].name : stations[stationIdx + 1].name}
            </span>
          </div>
          <button onClick={onSkipRest} className="rounded-full px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
            style={{ backgroundColor: COLORS.surface2, color: COLORS.text }}>
            <SkipForward size={13} /> Skip rest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <TopBar currentRound={currentRound} roundsTarget={roundsTarget} onQuit={onQuit} onEndSession={onEndSession} />
      <StationTrack stations={stations} day={day} currentRound={currentRound} status={status} />
      <div className="text-center text-[11px]" style={{ color: COLORS.textMute }}>
        {(() => {
          // Counting down what's left is more motivating than counting up
          const left = stations.length - stationIdx;
          if (left === 1) return <span style={{ color: COLORS.success, fontWeight: 600 }}>Last one — finish strong</span>;
          if (left === 2) return <span style={{ color: COLORS.success }}>2 to go</span>;
          if (left <= 5) return <span style={{ color: COLORS.upper }}>{left} to go</span>;
          return <span>{left} to go · station {stationIdx + 1} of {stations.length}</span>;
        })()}
      </div>

      <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.surface, border: `1.5px solid ${color}55` }}>
        <div className="flex items-center justify-between mb-2">
          <RegionTag region={ex.region} />
          <span className="text-[11px]" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>{ex.equip}</span>
        </div>
        <div className="text-2xl font-semibold leading-tight mt-2" style={{ fontFamily: FONTS.display }}>{ex.name}</div>
        <div className="text-sm mt-1" style={{ color: COLORS.textMute }}>{ex.muscle}</div>
        <MuscleDiagram targets={ex.targets} />

        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Target reps</div>
            <div className="text-lg font-bold" style={{ fontFamily: FONTS.mono }}>{ex.reps}</div>
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Weight</div>
            <WeightPicker value={weightInput} onChange={setWeightInput} />
            {weightInput === '' && (
              <div className="text-[10px] mt-1" style={{ color: COLORS.warn }}>Select a weight to continue</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button onClick={() => setShowInfo(v => !v)} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: color }}>
            <Info size={14} /> How to do this correctly {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <a href={ytSearchUrl(ex.name)} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLORS.textMute }}>
            <Youtube size={14} /> Watch form videos
          </a>
        </div>
        {showInfo && (
          <ul className="mt-2.5 space-y-1.5">
            {ex.cues.map((c, i) => (
              <li key={i} className="text-sm leading-snug flex gap-2" style={{ color: COLORS.text }}>
                <span style={{ color }}>·</span> {c}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2.5">
        {canGoBack && (
          <button onClick={onBack} className="rounded-2xl py-3.5 px-4 flex items-center justify-center" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>
            <ChevronLeft size={18} />
          </button>
        )}
        <button onClick={onSkip} className="rounded-2xl py-3.5 px-5 text-sm font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>
          Skip
        </button>
        <button onClick={onComplete} disabled={weightInput === ''} className="flex-1 rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-base"
          style={{ backgroundColor: weightInput === '' ? COLORS.surface2 : COLORS.success, color: weightInput === '' ? COLORS.textMute : '#06231A', fontFamily: FONTS.display, opacity: weightInput === '' ? 0.7 : 1, cursor: weightInput === '' ? 'not-allowed' : 'pointer' }}>
          <Check size={19} strokeWidth={3} /> MARK COMPLETE
        </button>
      </div>
    </div>
  );
}

function FinisherScreen({ day, items, finisherIdx, onComplete, onSkip, onQuit, onEndSession, onBack, canGoBack }) {
  const [showInfo, setShowInfo] = useState(false);
  const item = items[finisherIdx];
  const isLast = finisherIdx === items.length - 1;

  return (
    <div className="mt-4 space-y-4">
      <FinisherBar idx={finisherIdx} total={items.length} onQuit={onQuit} onEndSession={onEndSession} />
      <div className="text-center text-[11px]" style={{ color: COLORS.textMute }}>
        Core finisher · {finisherIdx + 1} of {items.length}
      </div>

      <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.surface, border: `1.5px solid ${COLORS.success}55` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: COLORS.success + '20', color: COLORS.success, fontFamily: FONTS.mono, letterSpacing: '0.03em' }}>
            CORE
          </span>
          <span className="text-[11px]" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>Bodyweight</span>
        </div>
        <div className="text-2xl font-semibold leading-tight mt-2" style={{ fontFamily: FONTS.display }}>{item.name}</div>
        <div className="text-sm mt-1" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>{item.target}</div>
        <MuscleDiagram targets={item.targets} />

        <div className="flex items-center gap-4 mt-4">
          <button onClick={() => setShowInfo(v => !v)} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLORS.success }}>
            <Info size={14} /> How to do this correctly {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <a href={ytSearchUrl(item.name)} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLORS.textMute }}>
            <Youtube size={14} /> Watch form videos
          </a>
        </div>
        {showInfo && (
          <ul className="mt-2.5 space-y-1.5">
            {item.cues.map((c, i) => (
              <li key={i} className="text-sm leading-snug flex gap-2" style={{ color: COLORS.text }}>
                <span style={{ color: COLORS.success }}>·</span> {c}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2.5">
        {canGoBack && (
          <button onClick={onBack} className="rounded-2xl py-3.5 px-4 flex items-center justify-center" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>
            <ChevronLeft size={18} />
          </button>
        )}
        <button onClick={onSkip} className="rounded-2xl py-3.5 px-5 text-sm font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>
          Skip
        </button>
        <button onClick={onComplete} className="flex-1 rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-base"
          style={{ backgroundColor: COLORS.success, color: '#06231A', fontFamily: FONTS.display }}>
          <Check size={19} strokeWidth={3} /> {isLast ? 'FINISH SESSION' : 'MARK COMPLETE'}
        </button>
      </div>
    </div>
  );
}

function SessionControlBar({ progress, onQuit, onEndSession }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="rounded-xl p-3 flex items-center justify-between gap-2" style={{ backgroundColor: COLORS.surface2, border: `1px solid ${COLORS.warn}` }}>
        <span className="text-xs font-semibold" style={{ color: COLORS.text }}>End session &amp; save progress so far?</span>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setConfirming(false)} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: COLORS.textMute }}>
            Cancel
          </button>
          <button onClick={onEndSession} className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: COLORS.warn, color: '#2A1B00' }}>
            Yes, end
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {progress}
      <div className="flex items-center gap-3">
        <button onClick={() => setConfirming(true)} className="rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1"
          style={{ backgroundColor: COLORS.surface2, color: COLORS.warn }}>
          <Check size={12} /> End session
        </button>
        <button onClick={onQuit} className="text-xs flex items-center gap-1" style={{ color: COLORS.textMute }}>
          <X size={13} /> Discard
        </button>
      </div>
    </div>
  );
}

function TopBar({ currentRound, roundsTarget, onQuit, onEndSession }) {
  const progress = (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: roundsTarget }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i + 1 < currentRound ? COLORS.success : i + 1 === currentRound ? COLORS.upper : COLORS.surface2 }} />
      ))}
      <span className="ml-2 text-xs font-semibold" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>ROUND {currentRound}/{roundsTarget}</span>
    </div>
  );
  return <SessionControlBar progress={progress} onQuit={onQuit} onEndSession={onEndSession} />;
}

function FinisherBar({ idx, total, onQuit, onEndSession }) {
  const progress = (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i < idx ? COLORS.success : i === idx ? COLORS.success : COLORS.surface2 }} />
      ))}
      <span className="ml-2 text-xs font-semibold" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>FINISHER {idx + 1}/{total}</span>
    </div>
  );
  return <SessionControlBar progress={progress} onQuit={onQuit} onEndSession={onEndSession} />;
}

function RPEPicker({ value, onChange }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: COLORS.textMute }}>How hard did that feel? (RPE)</span>
        {value && <span className="text-xs font-bold" style={{ color: COLORS.success, fontFamily: FONTS.mono }}>{value}/10</span>}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => onChange(n)} className="flex-1 h-8 rounded-md text-xs font-bold"
            style={{
              backgroundColor: value === n ? COLORS.success : COLORS.surface2,
              color: value === n ? '#06231A' : COLORS.textMute,
            }}>
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[9px]" style={{ color: COLORS.textMute }}>
        <span>Easy</span><span>Max effort</span>
      </div>
    </div>
  );
}

// ---- OCR: parse Samsung Health screenshot text into structured fields ----
// Heuristic-based — always shown as editable, pre-filled values, never auto-saved without review.
function parseSamsungHealthText(text) {
  const result = { durationMin: null, kcal: null, avgHR: null, maxHR: null, steps: null, vo2max: null };
  // Strip clock times (e.g. "11:50 am") so they aren't mistaken for a duration
  const cleaned = text.replace(/\b\d{1,2}:[0-5]\d\s*(?:am|pm|AM|PM)\b/g, ' ');
  const durMatches = [...cleaned.matchAll(/\b(\d{1,3}):([0-5]\d)\b/g)];
  if (durMatches.length) {
    let maxSec = -1;
    for (const m of durMatches) {
      const total = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
      if (total > maxSec) maxSec = total;
    }
    if (maxSec >= 0) result.durationMin = Math.round(maxSec / 60);
  }
  const kcalMatch = text.match(/(\d{1,4}(?:\.\d+)?)\s*kcal/i);
  if (kcalMatch) result.kcal = Math.round(parseFloat(kcalMatch[1]));
  const bpmMatches = [...text.matchAll(/(\d{2,3})\s*bpm/gi)];
  if (bpmMatches.length >= 1) result.avgHR = parseInt(bpmMatches[0][1], 10);
  if (bpmMatches.length >= 2) result.maxHR = parseInt(bpmMatches[1][1], 10);
  const vo2Match = text.match(/VO.?2?\s*max\D{0,15}?(\d{1,2}\.\d)/i);
  if (vo2Match) {
    result.vo2max = parseFloat(vo2Match[1]);
  } else {
    const decMatches = [...text.matchAll(/\b(\d{2}\.\d)\b/g)].map(m => parseFloat(m[1])).filter(v => v >= 10 && v <= 80);
    if (decMatches.length) result.vo2max = decMatches[0];
  }
  const stepsMatch = text.match(/\b(\d{1,3},\d{3})\b/);
  if (stepsMatch) result.steps = parseInt(stepsMatch[1].replace(',', ''), 10);
  return result;
}

function ScreenshotScanner({ onDetected }) {
  const [status, setStatus] = useState('idle'); // idle | loading-lib | reading | done | error
  const fileRef = useRef(null);

  async function ensureTesseract() {
    if (window.Tesseract) return window.Tesseract;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      s.onload = resolve;
      s.onerror = () => reject(new Error('load failed'));
      document.head.appendChild(s);
    });
    return window.Tesseract;
  }

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setStatus('loading-lib');
      try {
        const Tesseract = await ensureTesseract();
        setStatus('reading');
        const { data } = await Tesseract.recognize(reader.result, 'eng');
        const parsed = parseSamsungHealthText(data.text || '');
        setStatus('done');
        onDetected(parsed);
      } catch (err) {
        setStatus('error');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div className="rounded-xl p-3 mb-1" style={{ backgroundColor: COLORS.surface2, border: `1px dashed ${COLORS.border}` }}>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button onClick={() => fileRef.current && fileRef.current.click()} className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-1.5"
        style={{ color: COLORS.upper }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        Scan a screenshot instead
      </button>
      {status === 'loading-lib' && <div className="text-[10px] text-center mt-1" style={{ color: COLORS.textMute }}>Loading scanner…</div>}
      {status === 'reading' && <div className="text-[10px] text-center mt-1" style={{ color: COLORS.textMute }}>Reading screenshot…</div>}
      {status === 'done' && <div className="text-[10px] text-center mt-1" style={{ color: COLORS.success }}>Detected values filled in below — check them before saving</div>}
      {status === 'error' && <div className="text-[10px] text-center mt-1" style={{ color: COLORS.warn }}>Couldn't read that image — enter the values manually below</div>}
    </div>
  );
}

function NumField({ label, value, onChange, placeholder, suffix }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>{label}</div>
      <div className="relative">
        <input type="number" inputMode="decimal" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className="w-full rounded-lg px-3 py-2 text-sm font-bold outline-none"
          style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, fontFamily: FONTS.mono, border: `1px solid ${COLORS.border}` }} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: COLORS.textMute }}>{suffix}</span>}
      </div>
    </div>
  );
}

function HealthLogForm({ mode, initial, logMode: lm, types, onAddType, onSave, onClose }) {
  const isCircuit = mode === 'circuit';
  const isEdit = !!initial;
  const activityMode = lm || 'cardio';
  const [duration, setDuration] = useState(initial?.durationMin != null ? String(initial.durationMin) : '');
  const [kcal, setKcal] = useState(initial?.kcal != null ? String(initial.kcal) : '');
  const [avgHR, setAvgHR] = useState(initial?.avgHR != null ? String(initial.avgHR) : '');
  const [maxHR, setMaxHR] = useState(initial?.maxHR != null ? String(initial.maxHR) : '');
  const [steps, setSteps] = useState(initial?.steps != null ? String(initial.steps) : '');
  const [vo2max, setVo2max] = useState(initial?.vo2max != null ? String(initial.vo2max) : '');
  const [type, setType] = useState(initial?.type || (activityMode === 'activity' ? DEFAULT_ACTIVITY : DEFAULT_CARDIO));
  const [dateStr, setDateStr] = useState(initial?.date ? new Date(initial.date).toISOString().slice(0, 10) : todayInputValue());
  const [newType, setNewType] = useState('');
  const [addingType, setAddingType] = useState(false);

  const canSave = duration || kcal || avgHR || maxHR || steps || vo2max;

  function handleDetected(parsed) {
    if (parsed.durationMin != null) setDuration(String(parsed.durationMin));
    if (parsed.kcal != null) setKcal(String(parsed.kcal));
    if (parsed.avgHR != null) setAvgHR(String(parsed.avgHR));
    if (parsed.maxHR != null) setMaxHR(String(parsed.maxHR));
    if (!isCircuit && parsed.steps != null) setSteps(String(parsed.steps));
    if (!isCircuit && parsed.vo2max != null) setVo2max(String(parsed.vo2max));
  }

  function handleSave() {
    onSave({
      durationMin: duration ? Number(duration) : null,
      kcal: kcal ? Number(kcal) : null,
      avgHR: avgHR ? Number(avgHR) : null,
      maxHR: maxHR ? Number(maxHR) : null,
      ...(isCircuit ? {} : {
        steps: steps ? Number(steps) : null,
        vo2max: vo2max ? Number(vo2max) : null,
        mode: activityMode,
        type,
        date: new Date(dateStr + 'T12:00:00').toISOString(),
        ...(isEdit ? { id: initial.id } : {}),
      }),
    });
    onClose();
  }

  return (
    <div className="rounded-2xl p-4 space-y-3" style={cardStyle()}>
      <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: isCircuit ? COLORS.upper : COLORS.lower }}>
        {isCircuit ? 'Circuit Training' : isEdit ? `Edit ${activityMode === 'activity' ? 'activity' : 'cardio'}` : (activityMode === 'activity' ? 'Log an activity' : 'Log cardio')}
      </div>

      {!isCircuit && (
        <>
          <Field label={activityMode === 'activity' ? 'Activity' : 'Type'}>
            <SelectInput value={type} onChange={v => { if (v === '__add') { setAddingType(true); } else { setType(v); } }}>
              {(types || []).map(t => <option key={t} value={t} style={{ backgroundColor: INPUT_BG }}>{t}</option>)}
              <option value="__add" style={{ backgroundColor: INPUT_BG }}>+ Add a new type…</option>
            </SelectInput>
          </Field>
          {addingType && (
            <div className="flex gap-2">
              <TextInput value={newType} onChange={setNewType}
                placeholder={activityMode === 'activity' ? 'e.g. Badminton' : 'e.g. Rowing'} className="flex-1" />
              <button onClick={() => { const v = newType.trim(); if (v) { onAddType(activityMode, v); setType(v); setNewType(''); setAddingType(false); } }}
                className="rounded-lg px-3 text-xs font-semibold shrink-0" style={{ backgroundColor: COLORS.success, color: '#06231A' }}>
                Add
              </button>
            </div>
          )}
          <Field label="Date">
            <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle()} />
          </Field>
        </>
      )}

      <ScreenshotScanner onDetected={handleDetected} />
      <div className="text-[10px] text-center" style={{ color: COLORS.textMute }}>— or enter manually —</div>

      <div className="grid grid-cols-2 gap-2.5">
        <NumField label="Duration" value={duration} onChange={setDuration} placeholder={isCircuit ? '39' : '22'} suffix="min" />
        <NumField label="Calories" value={kcal} onChange={setKcal} placeholder={isCircuit ? '313' : '141'} suffix="kcal" />
        <NumField label="Avg HR" value={avgHR} onChange={setAvgHR} placeholder={isCircuit ? '114' : '103'} suffix="bpm" />
        <NumField label="Max HR" value={maxHR} onChange={setMaxHR} placeholder={isCircuit ? '149' : '118'} suffix="bpm" />
        {!isCircuit && <NumField label="Steps" value={steps} onChange={setSteps} placeholder="2276" />}
        {!isCircuit && <NumField label="VO2max" value={vo2max} onChange={setVo2max} placeholder="40.8" />}
      </div>

      <div className="flex gap-2.5">
        <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={!canSave} className="flex-1 rounded-xl py-2.5 text-xs font-semibold"
          style={{ backgroundColor: canSave ? COLORS.success : COLORS.surface2, color: canSave ? '#06231A' : COLORS.textMute, opacity: canSave ? 1 : 0.6 }}>
          {isEdit ? (isCircuit ? 'Save health data' : 'Save changes') : 'Save'}
        </button>
      </div>
    </div>
  );
}

function DoneScreen({ day, roundsTarget, session, onNewSession, onViewHistory, saveError, onSaveRpe, onSaveCircuitLog, circuitLog, profile, latestRestingHR }) {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(!!circuitLog);

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-2xl p-6 text-center" style={cardStyle()}>
        <Trophy className="mx-auto mb-3" size={32} color={session?.partial ? COLORS.textMute : COLORS.warn} />
        <div className="text-xl font-bold" style={{ fontFamily: FONTS.display }}>{session?.partial ? 'Session ended early' : 'Session complete'}</div>
        <div className="text-sm mt-1" style={{ color: COLORS.textMute }}>
          Workout {day} · {session?.partial ? `${session.rounds}/${session.roundsTarget} rounds reached · ${session.exercises.length} exercises logged` : `${roundsTarget} rounds`}{session?.durationMin ? ` · ${session.durationMin} min` : ''}
        </div>
        {session && typeof session.finisherTotal === 'number' && (
          <div className="text-xs mt-2" style={{ color: session.finisherCompleted === session.finisherTotal ? COLORS.success : COLORS.textMute }}>
            Core finisher: {session.finisherCompleted}/{session.finisherTotal} completed
          </div>
        )}
        {saveError && <div className="text-[11px] mt-2" style={{ color: COLORS.warn }}>Could not save this session — your results won't appear in History.</div>}
      </div>

      {session && (
        <div className="rounded-2xl p-4" style={cardStyle()}>
          <RPEPicker value={session.rpe} onChange={n => onSaveRpe(session.id, n)} />
          {(() => {
            const est = estimateRpeFromHR({
              avgHR: circuitLog && circuitLog.avgHR,
              maxHR: circuitLog && circuitLog.maxHR,
              restingHR: latestRestingHR,
              age: profile && profile.age,
            });
            if (!est) return null;
            return (
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <span className="text-[11px]" style={{ color: COLORS.textMute }}>
                  From your heart rate: about {est.rpe}/10 ({est.pctHRR}% of heart-rate reserve)
                </span>
                {session.rpe !== est.rpe && (
                  <button onClick={() => onSaveRpe(session.id, est.rpe)}
                    className="text-[10px] font-semibold px-2 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                    Use {est.rpe}
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {session && (
        showForm ? (
          <HealthLogForm
            mode="circuit"
            onSave={(entry) => { onSaveCircuitLog(entry, session.id); setSaved(true); }}
            onClose={() => setShowForm(false)}
          />
        ) : (
          <div className="rounded-2xl p-4 flex items-center justify-between" style={cardStyle()}>
            {saved && circuitLog ? (
              <div className="text-xs" style={{ color: COLORS.success }}>
                ✓ Samsung Health data added — {circuitLog.durationMin ? `${circuitLog.durationMin} min · ` : ''}{circuitLog.kcal ? `${circuitLog.kcal} kcal` : ''}
              </div>
            ) : (
              <div className="text-xs" style={{ color: COLORS.textMute }}>Turned on Circuit Training on your watch?</div>
            )}
            <button onClick={() => setShowForm(true)} className="text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ml-3"
              style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
              {saved ? 'Edit' : '+ Add Samsung Health data'}
            </button>
          </div>
        )
      )}

      {session && (
        <div className="rounded-2xl p-4" style={cardStyle()}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: COLORS.textMute }}>Loads used</div>
          <div className="space-y-1">
            {session.exercises.map((e, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span style={{ color: COLORS.text }}>{e.name}</span>
                <span style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>{formatWeight(e.weight)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2.5">
        <button onClick={onViewHistory} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.text }}>
          View history
        </button>
        <button onClick={onNewSession} className="flex-1 rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm font-semibold"
          style={{ backgroundColor: COLORS.upper, color: '#1A0D06' }}>
          <RotateCcw size={15} /> New session
        </button>
      </div>
    </div>
  );
}

function MuscleBalancePanel({ sessions, onOpenTrend, weightKg }) {
  const [showAll, setShowAll] = useState(false);
  const report = balanceReport(sessions, weightKg);
  const hist = muscleLoadHistory(sessions, weightKg);

  if (!report.anchor) {
    return (
      <EmptyState icon={<TrendingUp size={24} color={COLORS.textMute} />}>
        Log a few sessions with weights and this will show how each muscle group is progressing and whether anything is falling behind.
      </EmptyState>
    );
  }

  const lagging = report.rows.filter(r => r.ratio !== null && r.ratio < 0.75);
  const compared = report.rows.filter(r => r.ratio !== null);
  const ahead = compared.filter(r => r.ratio > 1.35);
  // When almost everything reads "ahead", the hinge anchor is the outlier —
  // saying so is more useful than implying ten muscles are overdeveloped.
  const anchorLooksLow = compared.length >= 5 && ahead.length / compared.length >= 0.5;
  // "no comparison available" covers both never-loaded and bodyweight-only
  const untracked = report.rows.filter(r => r.ratio === null);
  const shown = showAll ? report.rows : report.rows.filter(r => r.ratio !== null);

  return (
    <div className="space-y-3">
      {lagging.length > 0 && (
        <Card accent={COLORS.warn}>
          <SectionLabel color={COLORS.warn}>Worth emphasising</SectionLabel>
          <div className="text-[11px] mt-1.5" style={{ color: COLORS.text }}>
            Relative to your heaviest hinge load ({report.anchor} kg), these are further behind than the usual proportion:
          </div>
          <div className="mt-2 space-y-2">
            {lagging.map(r => (
              <div key={r.muscle}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs" style={{ color: COLORS.text }}>{muscleLabel(r.muscle)}</span>
                  <span className="text-[11px] shrink-0" style={{ color: COLORS.warn, fontFamily: FONTS.mono }}>
                    {r.actual} kg · ~{Math.round(r.ratio * 100)}% of typical
                  </span>
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: COLORS.textMute }}>
                  {r.via ? `Currently from ${r.via}.` : ''}
                  {r.sources && r.sources.length
                    ? ` Trained by ${Array.from(new Set(r.sources.map(x => `${x.name} (${x.day})`))).join(', ')}.`
                    : ''}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[10px] mt-2" style={{ color: COLORS.textMute }}>
            A suggestion for where to add attention, not a target to chase. Add load only when your form holds and the session still feels manageable.
          </div>
        </Card>
      )}

      {anchorLooksLow && (
        <Card accent={COLORS.lower}>
          <SectionLabel color={COLORS.lower}>About these comparisons</SectionLabel>
          <div className="text-[11px] mt-1.5 leading-relaxed" style={{ color: COLORS.text }}>
            {ahead.length} of {compared.length} muscles read as ahead of the usual proportion. That
            normally means the hinge lift used as the anchor ({report.anchor} kg) is light relative to
            the rest of your training, rather than everything else being excessive.
          </div>
          <div className="text-[10px] mt-1.5" style={{ color: COLORS.textMute }}>
            Deadlifts and Romanian deadlifts are the lifts most likely to be kept deliberately light
            on cardiology advice, so this may be exactly as intended. Treat the bars below as showing
            which lifts are furthest from each other, not as an instruction to load the hinge.
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-baseline justify-between">
          <SectionLabel>Load balance</SectionLabel>
          <span className="text-[10px]" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>
            anchor {report.anchor} kg
          </span>
        </div>
        <div className="text-[11px] mt-1 mb-3" style={{ color: COLORS.textMute }}>
          Each bar compares your best load against the proportion usually seen relative to a hinge lift. The main mover of an exercise is credited in full, assisting muscles at half.
        </div>
        <div className="space-y-2">
          {shown.map(r => {
            const pct = r.ratio === null ? 0 : Math.min(1.6, r.ratio) / 1.6;
            const col = r.ratio === null ? COLORS.border
              : r.ratio < 0.75 ? COLORS.warn
              : r.ratio > 1.35 ? COLORS.lower
              : COLORS.success;
            return (
              <button key={r.muscle}
                onClick={() => {
                  const pts = (hist[r.muscle] || []).map(x => ({ v: x.v, date: x.date }));
                  if (pts.length) onOpenTrend({ title: `${muscleLabel(r.muscle)} load`, points: pts, unit: ' kg', goodDirection: 'up' });
                }}
                className="w-full text-left">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px]" style={{ color: COLORS.text }}>{muscleLabel(r.muscle)}</span>
                  <span className="text-[10px]" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>
                    {r.actual === null ? '—' : `${r.actual} kg${r.estimated ? '*' : ''}`}
                  </span>
                </div>
                {r.actual !== null && r.via && (
                  <div className="text-[9px]" style={{ color: COLORS.textMute }}>{r.via}</div>
                )}
                <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: COLORS.surface2 }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.max(2, pct * 100)}%`, backgroundColor: col }} />
                </div>
                {r.reason && (
                  <div className="text-[9px] mt-0.5" style={{ color: COLORS.textMute }}>{r.reason}</div>
                )}
              </button>
            );
          })}
        </div>
        {untracked.length > 0 && (
          <button onClick={() => setShowAll(v => !v)} className="text-[11px] font-semibold mt-3"
            style={{ color: COLORS.upper }}>
            {showAll ? 'Hide' : `Show ${untracked.length} without a comparison`}
          </button>
        )}
        <div className="text-[10px] mt-2" style={{ color: COLORS.textMute }}>
          * estimated from your bodyweight for unloaded movements like push-ups and lunges.
        </div>
        <div className="text-[10px] mt-1 italic" style={{ color: COLORS.textMute }}>
          These are relative proportions between your own lifts, not targets from a population table. What load is right for you is a question for your cardiologist and how you feel in the session.
        </div>
      </Card>
    </div>
  );
}

function MuscleProgressPanel({ sessions, onOpenTrend, weightKg }) {
  const hist = muscleLoadHistory(sessions, weightKg);
  const rows = Object.entries(hist)
    .map(([m, list]) => {
      const asc = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
      const first = asc[0].v, last = asc[asc.length - 1].v;
      return { muscle: m, points: asc.map(x => ({ v: x.v, date: x.date })), first, last, change: +(last - first).toFixed(1), n: asc.length };
    })
    .sort((a, b) => b.change - a.change);

  if (!rows.length) return null;

  return (
    <Card>
      <SectionLabel>Weight progression by muscle</SectionLabel>
      <div className="text-[11px] mt-1 mb-3" style={{ color: COLORS.textMute }}>
        Heaviest load logged for each muscle group over time. Tap for the full chart.
      </div>
      <div className="space-y-3">
        {rows.map(r => (
          <button key={r.muscle} onClick={() => onOpenTrend({ title: `${muscleLabel(r.muscle)} load`, points: r.points, unit: ' kg', goodDirection: 'up' })}
            className="w-full text-left">
            <div className="flex items-baseline justify-between mb-0.5">
              <span className="text-xs" style={{ color: COLORS.text }}>{muscleLabel(r.muscle)}</span>
              <span className="text-[11px] font-bold" style={{ fontFamily: FONTS.mono }}>
                {r.last} kg
                {r.change !== 0 && (
                  <span className="ml-1.5 text-[10px] font-semibold" style={{ color: r.change > 0 ? COLORS.success : COLORS.warn }}>
                    {r.change > 0 ? '+' : ''}{r.change}
                  </span>
                )}
              </span>
            </div>
            {r.points.length > 1
              ? <Sparkline points={r.points} color={COLORS.success} height={26} showAxis={false} />
              : <div className="text-[10px]" style={{ color: COLORS.textMute }}>one session so far</div>}
          </button>
        ))}
      </div>
    </Card>
  );
}

function WorkoutTrends({ sessions, circuitLogs, onOpen, weightKg, medicalEntries, walkLogs, people, profile }) {
  const [reporting, setReporting] = useState(false);
  const asc = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const circuitAsc = [...circuitLogs].sort((a, b) => new Date(a.date) - new Date(b.date));

  const durationPts = asc.filter(s => s.durationMin).map(s => ({ v: s.durationMin, date: s.date }));
  const rpePts = asc.filter(s => s.rpe).map(s => ({ v: s.rpe, date: s.date }));
  const avgHRPts = circuitAsc.filter(c => c.avgHR).map(c => ({ v: c.avgHR, date: c.date }));
  const maxHRPts = circuitAsc.filter(c => c.maxHR).map(c => ({ v: c.maxHR, date: c.date }));
  const kcalPts = circuitAsc.filter(c => c.kcal).map(c => ({ v: c.kcal, date: c.date }));

  // Total volume per session = sum of numeric weights logged
  const volumePts = asc.map(s => {
    const total = (s.exercises || []).reduce((sum, e) => {
      const n = Number(e.weight);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
    return { v: total, date: s.date };
  }).filter(p => p.v > 0);

  // Per-exercise weight progression
  const exNames = [];
  asc.forEach(s => (s.exercises || []).forEach(e => {
    if (!isNaN(Number(e.weight)) && e.weight !== '' && e.weight !== 'Bodyweight' && !exNames.includes(e.name)) exNames.push(e.name);
  }));
  const exSeries = exNames.map(name => {
    const pts = asc.map(s => {
      const found = (s.exercises || []).find(e => e.name === name);
      const n = found ? Number(found.weight) : NaN;
      return isNaN(n) ? null : { v: n, date: s.date };
    }).filter(Boolean);
    return { name, pts };
  }).filter(x => x.pts.length >= 2);

  const anything = durationPts.length || avgHRPts.length || volumePts.length || rpePts.length;
  if (!anything) {
    return (
      <div className="rounded-2xl p-8 text-center mt-4" style={cardStyle()}>
        <TrendingUp className="mx-auto mb-2" size={24} color={COLORS.textMute} />
        <div className="text-sm" style={{ color: COLORS.textMute }}>
          Complete a couple of sessions — and add Samsung Health data — and your trends will show up here.
        </div>
      </div>
    );
  }

  const [windowDays, setWindowDays] = useState(30);
  const volumes = muscleVolumeRecent(sessions, windowDays);
  const anyVolume = Object.keys(volumes).length > 0;
  const sessionsInWindow = sessions.filter(s => isWithinDays(s.date, windowDays)).length;

  return (
    <div className="space-y-3 mt-4">
      {reporting ? (
        <ReportGenerator onClose={() => setReporting(false)}
          medicalEntries={medicalEntries} sessions={sessions} walkLogs={walkLogs} circuitLogs={circuitLogs}
          people={people} profile={profile} />
      ) : (
        <button onClick={() => setReporting(true)} className="w-full rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
          style={{ backgroundColor: COLORS.surface2, color: COLORS.upper, border: `1px dashed ${COLORS.border}` }}>
          Generate report (.xlsx)
        </button>
      )}

      {anyVolume && (
        <Card>
          <div className="flex items-center justify-between">
            <SectionLabel>Muscle impact</SectionLabel>
            <div className="flex gap-1">
              {[7, 30, 90].map(dW => (
                <button key={dW} onClick={() => setWindowDays(dW)}
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: windowDays === dW ? COLORS.upper + '25' : 'transparent',
                    color: windowDays === dW ? COLORS.upper : COLORS.textMute,
                    border: `1px solid ${windowDays === dW ? COLORS.upper + '55' : COLORS.border}`,
                  }}>
                  {dW}d
                </button>
              ))}
            </div>
          </div>
          <div className="text-[10px] mt-1" style={{ color: COLORS.textMute }}>
            {sessionsInWindow} session{sessionsInWindow === 1 ? '' : 's'} in the last {windowDays} days
          </div>
          <div className="mt-3">
            <MuscleHeatMap volumes={volumes} days={windowDays} />
          </div>
        </Card>
      )}

      <MuscleBalancePanel sessions={sessions} onOpenTrend={onOpen} weightKg={weightKg} />
      <MuscleProgressPanel sessions={sessions} onOpenTrend={onOpen} weightKg={weightKg} />

      {avgHRPts.length > 0 && <TrendCard label="Circuit avg HR" points={avgHRPts} color={COLORS.upper} unit=" bpm" goodDirection="down" showDates onClick={() => onOpen({ title: "Circuit avg HR", points: avgHRPts, unit: " bpm", goodDirection: "down" })} />}
      {maxHRPts.length > 0 && <TrendCard label="Circuit max HR" points={maxHRPts} color="#E5484D" unit=" bpm" goodDirection="down" showDates onClick={() => onOpen({ title: "Circuit max HR", points: maxHRPts, unit: " bpm", goodDirection: "down" })} />}
      {kcalPts.length > 0 && <TrendCard label="Calories burned" points={kcalPts} color={COLORS.warn} unit=" kcal" goodDirection="up" showDates onClick={() => onOpen({ title: "Calories burned", points: kcalPts, unit: " kcal", goodDirection: "up" })} />}
      {durationPts.length > 0 && <TrendCard label="Session duration" points={durationPts} color={COLORS.lower} unit=" min" showDates onClick={() => onOpen({ title: "Session duration", points: durationPts, unit: " min", goodDirection: null })} />}
      {volumePts.length > 0 && <TrendCard label="Total load per session" points={volumePts} color={COLORS.success} unit=" kg" goodDirection="up" showDates onClick={() => onOpen({ title: "Total load per session", points: volumePts, unit: " kg", goodDirection: "up" })} />}
      {rpePts.length > 0 && <TrendCard label="Perceived effort (RPE)" points={rpePts} color={COLORS.grayWhite} unit="/10" />}

      {avgHRPts.length > 1 && (
        <div className="rounded-2xl p-3.5" style={{ backgroundColor: COLORS.surface2, border: `1px solid ${COLORS.border}` }}>
          <div className="text-[11px] leading-relaxed" style={{ color: COLORS.textMute }}>
            If your average heart rate drifts down over time while your load and duration hold steady or rise, that generally points to improving cardiovascular fitness. A sudden jump in heart rate or RPE at your usual weights is worth noting — and worth mentioning to your cardiologist if it persists.
          </div>
        </div>
      )}

      {exSeries.length > 0 && (
        <div className="rounded-2xl p-4" style={cardStyle()}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.textMute }}>Weight progression by exercise</div>
          <div className="space-y-4">
            {exSeries.map(x => (
              <div key={x.name}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs" style={{ color: COLORS.text }}>{x.name}</span>
                  <span className="text-xs font-bold" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>{x.pts[x.pts.length - 1].v} kg</span>
                </div>
                <Sparkline points={x.pts} color={COLORS.success} height={34} showAxis={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SessionInsightPanel({ session, circuitLog, restingHR, profile, weightKg, allSessions }) {
  const volumes = sessionVolume(session);
  const review = sessionLoadReview(session, allSessions || [], weightKg);
  const effort = sessionEffort({
    session, circuitLog, restingHR,
    age: profile && profile.age, weightKg,
  });
  const hasVolume = Object.keys(volumes).length > 0;

  return (
    <div className="mt-3 space-y-3">
      {effort && (
        <div className="rounded-xl p-3" style={{ backgroundColor: COLORS.surface2 }}>
          <div className="flex items-baseline justify-between">
            <SectionLabel>Estimated effort</SectionLabel>
            <span className="text-lg font-bold" style={{ fontFamily: FONTS.mono, color: COLORS.upper }}>
              {effort.rpe}/10
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {effort.parts.map(pt => (
              <div key={pt.source} className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: COLORS.textMute }}>
                  {pt.source} <span style={{ opacity: 0.7 }}>· {pt.detail}</span>
                </span>
                <span className="text-[11px] font-semibold" style={{ fontFamily: FONTS.mono, color: COLORS.text }}>
                  {pt.rpe}
                </span>
              </div>
            ))}
          </div>
          {session.rpe && (
            <div className="text-[10px] mt-2 pt-2" style={{ color: COLORS.textMute, borderTop: `1px solid ${COLORS.border}` }}>
              You rated this {session.rpe}/10.
              {Math.abs(session.rpe - effort.rpe) >= 2
                ? ' Your own rating differs from the estimate by 2 or more — trust how it felt over the numbers.'
                : ' That lines up with the estimate.'}
            </div>
          )}
          {effort.spread >= 3 && (
            <div className="text-[10px] mt-1.5" style={{ color: COLORS.warn }}>
              These signals disagree noticeably, so treat the combined figure loosely.
            </div>
          )}
          {!effort.parts.some(pt => pt.source === 'Heart rate') && (
            <div className="text-[10px] mt-1.5" style={{ color: COLORS.textMute }}>
              No heart-rate data on this session — add Samsung Health data for a better estimate.
            </div>
          )}
        </div>
      )}

      {review.rows.length > 0 && (
        <div className="rounded-xl p-3" style={{ backgroundColor: COLORS.surface2 }}>
          <SectionLabel>Load vs your previous best</SectionLabel>
          <div className="mt-2 space-y-1">
            {review.rows.filter(r => !r.finisher).map(r => {
              const col = r.status === 'up' ? COLORS.success
                : r.status === 'down' ? COLORS.warn
                : r.status === 'first' ? COLORS.lower : COLORS.textMute;
              const note = r.status === 'up' ? `+${(r.kg - r.best).toFixed(1)}`
                : r.status === 'down' ? `${(r.kg - r.best).toFixed(1)}`
                : r.status === 'first' ? 'first time'
                : r.status === 'bodyweight' ? 'bodyweight'
                : 'same';
              return (
                <div key={r.name} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] min-w-0 truncate" style={{ color: COLORS.text }}>{r.name}</span>
                  <span className="text-[11px] shrink-0" style={{ fontFamily: FONTS.mono, color: col }}>
                    {r.kg !== null ? `${r.kg} kg` : '—'} <span style={{ opacity: 0.8 }}>{note}</span>
                  </span>
                </div>
              );
            })}
          </div>

          {(review.progressed.length > 0 || review.readyToAdd.length > 0 || review.dropped.length > 0) && (
            <div className="mt-3 pt-2.5 space-y-1.5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
              {review.progressed.length > 0 && (
                <div className="text-[11px]" style={{ color: COLORS.success }}>
                  Went up on {review.progressed.length} exercise{review.progressed.length === 1 ? '' : 's'} this session.
                </div>
              )}
              {review.readyToAdd.length > 0 && (
                <div className="text-[11px]" style={{ color: COLORS.upper }}>
                  Same load for {review.readyToAdd[0].sessionsAtLoad} sessions on {review.readyToAdd.slice(0, 2).map(r => r.name).join(' and ')}
                  {review.readyToAdd.length > 2 ? ` (+${review.readyToAdd.length - 2} more)` : ''} — a small increase may be due, if form and effort still feel comfortable.
                </div>
              )}
              {review.dropped.length > 0 && (
                <div className="text-[11px]" style={{ color: COLORS.textMute }}>
                  Lighter than your best on {review.dropped.length} exercise{review.dropped.length === 1 ? '' : 's'} — normal after a break, illness or a hard week.
                </div>
              )}
              <div className="text-[10px] italic" style={{ color: COLORS.textMute }}>
                Progression suggestions are based only on your own logged history. How much to add, and whether to add at all, depends on how the session felt and your cardiologist's guidance.
              </div>
            </div>
          )}
        </div>
      )}

      {hasVolume && (
        <div className="rounded-xl p-3" style={{ backgroundColor: COLORS.surface2 }}>
          <SectionLabel>Muscles worked this session</SectionLabel>
          <div className="mt-2">
            <MuscleHeatMap volumes={volumes} days={0} sessionMode />
          </div>
        </div>
      )}
    </div>
  );
}

function SessionEditor({ session, circuitLog, onSave, onSaveCircuitLog, onClose }) {
  const [dateStr, setDateStr] = useState(new Date(session.date).toISOString().slice(0, 10));
  const [rounds, setRounds] = useState(String(session.rounds ?? ''));
  const [durationMin, setDurationMin] = useState(session.durationMin != null ? String(session.durationMin) : '');
  const [rpe, setRpe] = useState(session.rpe || null);
  const [exercises, setExercises] = useState((session.exercises || []).map(e => ({ ...e })));
  const [showHealth, setShowHealth] = useState(false);

  function setWeight(i, v) {
    setExercises(list => list.map((e, idx) => idx === i ? { ...e, weight: v } : e));
  }

  return (
    <Card>
      <SectionLabel>Edit session</SectionLabel>

      <div className="mt-3 space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Date">
            <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle()} />
          </Field>
          <Field label="Duration">
            <input type="number" inputMode="numeric" value={durationMin} onChange={e => setDurationMin(e.target.value)}
              placeholder="38" className="w-full rounded-lg px-3 py-2 text-sm font-bold outline-none"
              style={inputStyle({ fontFamily: FONTS.mono })} />
          </Field>
        </div>

        <Field label="Rounds completed">
          <input type="number" inputMode="numeric" min="1" max="6" value={rounds} onChange={e => setRounds(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm font-bold outline-none"
            style={inputStyle({ fontFamily: FONTS.mono })} />
        </Field>

        <div>
          <FieldLabel>Perceived effort (RPE)</FieldLabel>
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setRpe(rpe === n ? null : n)}
                className="flex-1 h-8 rounded-md text-xs font-bold"
                style={{ backgroundColor: rpe === n ? COLORS.success : COLORS.surface2, color: rpe === n ? '#06231A' : COLORS.textMute }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Weights used</FieldLabel>
          <div className="space-y-1.5">
            {exercises.map((e, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs flex-1 min-w-0 truncate" style={{ color: COLORS.text }}>{e.name}</span>
                <div className="w-32 shrink-0">
                  <WeightPicker value={e.weight} onChange={v => setWeight(i, v)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {showHealth ? (
          <HealthLogForm
            mode="circuit"
            initial={circuitLog}
            onSave={entry => { onSaveCircuitLog(entry, session.id); setShowHealth(false); }}
            onClose={() => setShowHealth(false)}
          />
        ) : (
          <button onClick={() => setShowHealth(true)} className="w-full rounded-xl py-2.5 text-xs font-semibold"
            style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
            {circuitLog ? 'Edit Samsung Health data' : '+ Add Samsung Health data'}
          </button>
        )}

        <div className="flex gap-2.5">
          <ActionButton tone="muted" className="flex-1" onClick={onClose}>Cancel</ActionButton>
          <ActionButton tone="success" className="flex-1"
            onClick={() => {
              onSave({
                id: session.id,
                date: new Date(dateStr + 'T12:00:00').toISOString(),
                rounds: Number(rounds) || session.rounds,
                durationMin: durationMin ? Number(durationMin) : null,
                rpe: rpe || null,
                exercises,
              });
              onClose();
            }}>
            Save changes
          </ActionButton>
        </div>
      </div>
    </Card>
  );
}

function HistoryScreen({ sessions, thisWeekCount, expandedSession, setExpandedSession, circuitLogs,
  onDeleteSession, onUpdateSession, onSaveCircuitLog, onOpenTrend, tab, setTab,
  profile, restingHR, weightKg, medicalEntries, walkLogs, people }) {
  const [editingSession, setEditingSession] = useState(null);
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard icon={<Flame size={15} color={COLORS.upper} />} label="This week" value={thisWeekCount} />
        <StatCard icon={<Activity size={15} color={COLORS.lower} />} label="Total sessions" value={sessions.length} />
        <StatCard icon={<TrendingUp size={15} color={COLORS.success} />} label="Last session" value={sessions[0] ? fmtDate(sessions[0].date).split(',')[0] : '—'} small />
      </div>

      {editingSession && (
        <SessionEditor
          key={editingSession.id}
          session={editingSession}
          circuitLog={circuitLogs.find(c => c.sessionId === editingSession.id)}
          onSave={onUpdateSession}
          onSaveCircuitLog={onSaveCircuitLog}
          onClose={() => setEditingSession(null)}
        />
      )}

      <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
        {['log', 'trends'].map(t => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-2 text-xs font-semibold capitalize"
            style={{ backgroundColor: tab === t ? COLORS.surface2 : 'transparent', color: tab === t ? COLORS.text : COLORS.textMute }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'trends' ? <WorkoutTrends sessions={sessions} circuitLogs={circuitLogs} onOpen={onOpenTrend} weightKg={weightKg} medicalEntries={medicalEntries} walkLogs={walkLogs} people={people} profile={profile} /> : (
      <>
      {sessions.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={cardStyle()}>
          <ClipboardList className="mx-auto mb-2" size={24} color={COLORS.textMute} />
          <div className="text-sm" style={{ color: COLORS.textMute }}>No sessions logged yet. Complete a workout to see it here.</div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sessions.map(s => {
            const open = expandedSession === s.id;
            const color = s.day === 'A' ? COLORS.upper : COLORS.lower;
            const linkedLog = circuitLogs && circuitLogs.find(c => c.sessionId === s.id);
            return (
              <div key={s.id} className="rounded-2xl overflow-hidden" style={cardStyle()}>
                <button onClick={() => setExpandedSession(open ? null : s.id)} className="w-full flex items-center justify-between p-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: color + '20', color, fontFamily: FONTS.display }}>
                      {s.day}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{fmtDate(s.date)}</div>
                      <div className="text-[11px]" style={{ color: COLORS.textMute }}>
                        {s.rounds} rounds{s.durationMin ? ` · ${s.durationMin} min` : ''}
                        {s.partial && <span style={{ color: COLORS.warn }}> · ended early</span>}
                        {s.rpe && <span> · RPE {s.rpe}/10</span>}
                      </div>
                    </div>
                  </div>
                  {open ? <ChevronUp size={16} color={COLORS.textMute} /> : <ChevronDown size={16} color={COLORS.textMute} />}
                </button>
                {open && (
                  <div className="px-4 pb-4 space-y-1" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    {linkedLog && (
                      <div className="text-xs pt-2 pb-1" style={{ color: COLORS.success }}>
                        Samsung Health: {linkedLog.durationMin ? `${linkedLog.durationMin} min · ` : ''}{linkedLog.kcal ? `${linkedLog.kcal} kcal · ` : ''}{linkedLog.avgHR ? `avg HR ${linkedLog.avgHR} · ` : ''}{linkedLog.maxHR ? `max HR ${linkedLog.maxHR}` : ''}
                      </div>
                    )}
                    {s.exercises.map((e, i) => (
                      <div key={i} className="flex justify-between text-sm pt-2">
                        <span>{e.name}</span>
                        <span style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>{formatWeight(e.weight)}</span>
                      </div>
                    ))}
                    <SessionInsightPanel
                      session={s}
                      circuitLog={linkedLog}
                      restingHR={restingHR}
                      profile={profile}
                      weightKg={weightKg}
                      allSessions={sessions}
                    />

                    <div className="flex justify-end pt-3">
                      <button onClick={() => setEditingSession(s)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full mr-2"
                        style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                        Edit session
                      </button>
                      <DeleteButton label="Delete session" onConfirm={() => onDeleteSession(s.id)} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </>
      )}
    </div>
  );
}

// ---- Public-reference metric helpers ----
// Rough decade medians (ml/kg/min), aggregated from published general-population
// reference sources (FRIEND registry-style data, ACSM/Cooper Institute norms).
// These are APPROXIMATE general-population reference points, not clinical cutoffs.
const VO2_MEDIANS = {
  male: { '20s': 47, '30s': 40, '40s': 35, '50s': 29, '60s': 25, '70s': 21 },
  female: { '20s': 37, '30s': 28, '40s': 26, '50s': 23, '60s': 20, '70s': 17 },
};
function decadeKey(age) {
  const a = Number(age);
  if (a < 30) return '20s';
  if (a < 40) return '30s';
  if (a < 50) return '40s';
  if (a < 60) return '50s';
  if (a < 70) return '60s';
  return '70s';
}
function categorizeVO2max(vo2max, age, sex) {
  if (!age || !sex || !vo2max) return null;
  const table = VO2_MEDIANS[sex] || VO2_MEDIANS.male;
  const median = table[decadeKey(age)];
  if (!median) return null;
  const ratio = vo2max / median;
  let label, color;
  if (ratio < 0.8) { label = 'Below average'; color = COLORS.warn; }
  else if (ratio < 1.15) { label = 'Average'; color = COLORS.grayWhite; }
  else if (ratio < 1.4) { label = 'Above average'; color = COLORS.success; }
  else { label = 'Excellent'; color = COLORS.success; }
  return { label, median, color };
}
function estimateKcalRange(metLow, metHigh, durationMin, weightKg) {
  if (!durationMin || !weightKg) return null;
  const low = Math.round((metLow * 3.5 * weightKg / 200) * durationMin);
  const high = Math.round((metHigh * 3.5 * weightKg / 200) * durationMin);
  return [low, high];
}

function ProfileForm({ profile, onSave, latestWeightKg, onLogWeight }) {
  const [age, setAge] = useState(profile.age || '');
  const [sex, setSex] = useState(profile.sex || '');
  const [heightCm, setHeightCm] = useState(profile.heightCm || '');
  const bmi = (latestWeightKg && heightCm)
    ? +(latestWeightKg / Math.pow(Number(heightCm) / 100, 2)).toFixed(1) : null;
  return (
    <div className="rounded-2xl p-4 space-y-3" style={cardStyle()}>
      <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.textMute }}>
        About you
      </div>
      <div className="text-[11px]" style={{ color: COLORS.textMute }}>
        Age, height and sex are set once and used for reference comparisons.
        Bodyweight changes, so it's logged over time — not stored here.
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <NumField label="Age" value={age} onChange={setAge} placeholder="45" />
        <NumField label="Height" value={heightCm} onChange={setHeightCm} placeholder="175" suffix="cm" />
        <div>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Sex</div>
          <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
            {['male', 'female'].map(s => (
              <button key={s} onClick={() => setSex(s)} className="flex-1 py-2 text-xs font-semibold capitalize"
                style={{ backgroundColor: sex === s ? COLORS.surface2 : 'transparent', color: sex === s ? COLORS.text : COLORS.textMute }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: COLORS.surface2 }}>
        <div>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: COLORS.textMute }}>Current bodyweight</div>
          <div className="text-sm font-bold" style={{ fontFamily: FONTS.mono }}>
            {latestWeightKg ? `${latestWeightKg} kg` : 'not logged'}
            {bmi && <span className="text-[11px] font-normal ml-2" style={{ color: COLORS.textMute }}>BMI {bmi}</span>}
          </div>
        </div>
        {onLogWeight && (
          <button onClick={onLogWeight} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: COLORS.surface, color: COLORS.upper }}>
            Log weight
          </button>
        )}
      </div>
      <button onClick={() => onSave({ age, sex, heightCm })} disabled={!age || !sex} className="w-full rounded-xl py-2.5 text-xs font-semibold"
        style={{ backgroundColor: (age && sex) ? COLORS.success : COLORS.surface2, color: (age && sex) ? '#06231A' : COLORS.textMute }}>
        Save
      </button>
    </div>
  );
}

function TrendRow({ label, value, unit, delta, deltaGoodDirection }) {
  let deltaColor = COLORS.textMute;
  let deltaText = '';
  if (delta !== null && delta !== undefined && !isNaN(delta) && delta !== 0) {
    const isGood = deltaGoodDirection === 'up' ? delta > 0 : deltaGoodDirection === 'down' ? delta < 0 : null;
    deltaColor = isGood === null ? COLORS.textMute : isGood ? COLORS.success : COLORS.warn;
    deltaText = `${delta > 0 ? '+' : ''}${delta}`;
  }
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm" style={{ color: COLORS.textMute }}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold" style={{ fontFamily: FONTS.mono }}>{value}{unit}</span>
        {deltaText && <span className="text-[10px] font-semibold" style={{ color: deltaColor, fontFamily: FONTS.mono }}>{deltaText}</span>}
      </div>
    </div>
  );
}

function FitnessScreen({ sub, onSelectSub, children }) {
  return (
    <div className="mt-4">
      <div className="flex gap-1.5">
        {[['workout', 'Workout'], ['cardio', 'Cardio'], ['activity', 'Activities']].map(([k, l]) => (
          <button key={k} onClick={() => onSelectSub(k)}
            className="flex-1 rounded-xl py-2.5 text-xs font-semibold"
            style={{
              backgroundColor: sub === k ? COLORS.upper + '25' : COLORS.surface,
              color: sub === k ? COLORS.upper : COLORS.textMute,
              border: `1px solid ${sub === k ? COLORS.upper + '55' : COLORS.border}`,
            }}>
            {l}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

function CardioScreen({ logs, mode, types, onAddType, profile, onSaveProfile, onSaveLog, latestWeightKg, restingHR,
  onDeleteLog, onOpenTrend, tab, setTab, medicalEntries, sessions, circuitLogs, people }) {
  const [showForm, setShowForm] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');

  const mine = logs.filter(l => logMode(l) === mode);
  const filtered = typeFilter ? mine.filter(l => logType(l) === typeFilter) : mine;
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  const byDateAsc = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
  const latest = sorted[0];
  const usedTypes = Array.from(new Set(mine.map(logType))).sort();

  const isCardio = mode === 'cardio';
  const vo2Cat = isCardio && latest?.vo2max ? categorizeVO2max(latest.vo2max, profile.age, profile.sex) : null;
  const kcalRange = latest?.durationMin && latestWeightKg
    ? estimateKcalRange(isCardio ? 3 : 2.5, isCardio ? 4.5 : 4, latest.durationMin, latestWeightKg) : null;

  return (
    <div className="mt-4 space-y-4">
      {(!profile.age || !profile.sex) && isCardio ? (
        <ProfileForm profile={profile} onSave={onSaveProfile} latestWeightKg={latestWeightKg} />
      ) : null}

      {usedTypes.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button onClick={() => setTypeFilter('')}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold shrink-0"
            style={{ backgroundColor: !typeFilter ? COLORS.upper + '25' : 'transparent', color: !typeFilter ? COLORS.upper : COLORS.textMute, border: `1px solid ${!typeFilter ? COLORS.upper + '55' : COLORS.border}` }}>
            All
          </button>
          {usedTypes.map(t => (
            <button key={t} onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
              className="rounded-full px-3 py-1.5 text-[11px] font-semibold shrink-0"
              style={{ backgroundColor: typeFilter === t ? COLORS.upper + '25' : 'transparent', color: typeFilter === t ? COLORS.upper : COLORS.textMute, border: `1px solid ${typeFilter === t ? COLORS.upper + '55' : COLORS.border}` }}>
              {t}
            </button>
          ))}
        </div>
      )}

      {showForm || editing ? (
        <HealthLogForm
          key={editing ? editing.id : 'new'}
          initial={editing}
          logMode={mode}
          types={types}
          onAddType={onAddType}
          onSave={onSaveLog}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      ) : (
        <button onClick={() => setShowForm(true)} className="w-full rounded-2xl py-3.5 text-sm font-semibold"
          style={{ backgroundColor: COLORS.upper, color: '#1A0D06' }}>
          + Log {isCardio ? 'cardio' : 'an activity'}
        </button>
      )}

      <TabSwitcher tabs={['log', 'trends']} value={tab} onChange={setTab} />

      {tab === 'trends' && (
        reporting ? (
          <ReportGenerator onClose={() => setReporting(false)}
            medicalEntries={medicalEntries} sessions={sessions} walkLogs={logs} circuitLogs={circuitLogs}
            people={people} profile={profile} />
        ) : (
          <button onClick={() => setReporting(true)} className="w-full rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 mb-3"
            style={{ backgroundColor: COLORS.surface2, color: COLORS.upper, border: `1px dashed ${COLORS.border}` }}>
            Generate report (.xlsx)
          </button>
        )
      )}
      {tab === 'trends' && (() => {
        const pts = k => byDateAsc.filter(w => w[k] != null).map(w => ({ v: w[k], date: w.date }));
        const vo2Pts = pts('vo2max'), avgHRPts = pts('avgHR'), stepsPts = pts('steps');
        const durPts = pts('durationMin'), kcalPts = pts('kcal');
        const pacePts = byDateAsc.filter(w => w.steps && w.durationMin)
          .map(w => ({ v: +(w.steps / w.durationMin).toFixed(0), date: w.date }));
        if (!vo2Pts.length && !avgHRPts.length && !durPts.length && !kcalPts.length) {
          return <EmptyState icon={<TrendingUp size={24} color={COLORS.textMute} />}>Log a couple of sessions to see trends here.</EmptyState>;
        }
        return (
          <div className="space-y-3">
            {vo2Pts.length > 0 && <TrendCard label="VO2max" points={vo2Pts} color={COLORS.success} unit="" goodDirection="up" showDates onClick={() => onOpenTrend({ title: 'VO2max', points: vo2Pts, unit: '', goodDirection: 'up' })} />}
            {avgHRPts.length > 0 && <TrendCard label="Average HR" points={avgHRPts} color={COLORS.upper} unit=" bpm" goodDirection="down" showDates onClick={() => onOpenTrend({ title: 'Average HR', points: avgHRPts, unit: ' bpm', goodDirection: 'down' })} />}
            {pacePts.length > 0 && <TrendCard label="Steps per minute" points={pacePts} color={COLORS.lower} unit=" spm" goodDirection="up" showDates onClick={() => onOpenTrend({ title: 'Steps per minute', points: pacePts, unit: ' spm', goodDirection: 'up' })} />}
            {stepsPts.length > 0 && <TrendCard label="Steps" points={stepsPts} color={COLORS.lower} unit="" goodDirection="up" showDates onClick={() => onOpenTrend({ title: 'Steps', points: stepsPts, unit: '', goodDirection: 'up' })} />}
            {durPts.length > 0 && <TrendCard label="Duration" points={durPts} color={COLORS.grayWhite} unit=" min" goodDirection="up" showDates onClick={() => onOpenTrend({ title: 'Duration', points: durPts, unit: ' min', goodDirection: 'up' })} />}
            {kcalPts.length > 0 && <TrendCard label="Calories" points={kcalPts} color={COLORS.warn} unit=" kcal" goodDirection="up" showDates onClick={() => onOpenTrend({ title: 'Calories', points: kcalPts, unit: ' kcal', goodDirection: 'up' })} />}
            {avgHRPts.length > 1 && isCardio && (
              <InfoNote>
                Covering a similar distance or pace at a lower average heart rate over time is one of the clearest signs of improving aerobic fitness.
              </InfoNote>
            )}
          </div>
        );
      })()}

      {tab === 'log' && latest && isCardio && (vo2Cat || kcalRange) && (
        <Card>
          <SectionLabel>How this compares</SectionLabel>
          {vo2Cat && (
            <div className="text-sm mt-2">
              <span style={{ color: COLORS.text }}>VO2max {latest.vo2max}: </span>
              <span style={{ color: vo2Cat.color, fontWeight: 600 }}>{vo2Cat.label}</span>
              <span style={{ color: COLORS.textMute }}> for your age/sex bracket (population median ≈ {vo2Cat.median})</span>
            </div>
          )}
          {kcalRange && (
            <div className="text-xs mt-1.5" style={{ color: COLORS.textMute }}>
              Samsung Health reported {latest.kcal ?? '—'} kcal; a MET-based estimate for that duration and your bodyweight is roughly {kcalRange[0]}–{kcalRange[1]} kcal.
            </div>
          )}
          <div className="text-[10px] mt-2 italic" style={{ color: COLORS.textMute }}>
            General reference points for context, not clinical assessments. Wearable VO2max and calorie figures carry real margins of error — treat them as trends, not precise numbers.
          </div>
        </Card>
      )}

      {tab === 'log' && (
        <div className="space-y-2">
          {sorted.length === 0 ? (
            <EmptyState icon={<Activity size={24} color={COLORS.textMute} />}>
              No {isCardio ? 'cardio' : 'activities'} logged yet.
            </EmptyState>
          ) : sorted.map(w => (
            <div key={w.id} className="rounded-2xl p-3.5 flex items-start justify-between gap-3" style={cardStyle()}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: COLORS.lower + '25', color: COLORS.lower }}>
                    {logType(w)}
                  </span>
                  <span className="text-sm font-semibold">{fmtDate(w.date)}</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: COLORS.textMute }}>
                  {[
                    w.durationMin ? `${w.durationMin} min` : null,
                    w.kcal ? `${w.kcal} kcal` : null,
                    w.avgHR ? `avg HR ${w.avgHR}` : null,
                    w.steps ? `${w.steps.toLocaleString()} steps` : null,
                    w.vo2max ? `VO2max ${w.vo2max}` : null,
                  ].filter(Boolean).join(' · ')}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => { setEditing(w); setShowForm(false); }}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                  Edit
                </button>
                <DeleteButton onConfirm={() => onDeleteLog(w.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// One detail screen serves both health markers and fitness metrics.
function DetailChart({ readings, color, unit, refRange }) {
  const clean = readings.filter(r => typeof r.value === 'number' && !isNaN(r.value));
  if (clean.length === 0) return null;
  const vals = clean.map(r => r.value);
  const times = clean.map(r => new Date(r.date).getTime());
  let min = Math.min(...vals), max = Math.max(...vals);
  // widen the axis so the reference band is visible even if all readings sit outside it
  if (refRange) { min = Math.min(min, refRange[0]); max = Math.max(max, refRange[1]); }
  const pad = (max - min) * 0.15 || Math.abs(max * 0.1) || 1;
  const yMin = min - pad, yMax = max + pad, yRange = yMax - yMin || 1;
  const tMin = Math.min(...times), tMax = Math.max(...times);
  const tRange = (tMax - tMin) || 1;

  const W = 320, H = 170, L = 40, R = 10, T = 12, B = 30;
  const plotW = W - L - R, plotH = H - T - B;

  // Position points by real elapsed time, so gaps between tests show honestly
  const coords = clean.map(r => {
    const x = clean.length === 1 ? L + plotW / 2
      : L + ((new Date(r.date).getTime() - tMin) / tRange) * plotW;
    const y = T + (1 - (r.value - yMin) / yRange) * plotH;
    return [x, y, r];
  });
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(' ');
  const area = `${path} L${coords[coords.length - 1][0].toFixed(1)},${T + plotH} L${coords[0][0].toFixed(1)},${T + plotH} Z`;

  // the line takes the colour of the most recent reading's status
  const latestDev = refRange ? rangeDeviation(clean[clean.length - 1].value, refRange) : null;
  const lineColor = refRange ? deviationColor(latestDev) : color;

  const yTicks = [yMax, (yMax + yMin) / 2, yMin];
  const idxs = clean.length <= 2 ? clean.map((_, i) => i)
    : [0, Math.floor((clean.length - 1) / 2), clean.length - 1];
  const xTicks = [...new Set(idxs)].map(i => ({ x: coords[i][0], label: fmtShortMonthYear(clean[i].date) }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {yTicks.map((v, i) => {
        const y = T + (1 - (v - yMin) / yRange) * plotH;
        return (
          <g key={i}>
            <line x1={L} y1={y} x2={W - R} y2={y} stroke={COLORS.border} strokeWidth="1" strokeDasharray="3 3" />
            <text x={L - 6} y={y + 3} textAnchor="end" fontSize="8" fill={COLORS.textMute} fontFamily="monospace">
              {(+v.toFixed(1))}
            </text>
          </g>
        );
      })}
      {refRange && (() => {
        const yTop = T + (1 - (refRange[1] - yMin) / yRange) * plotH;
        const yBot = T + (1 - (refRange[0] - yMin) / yRange) * plotH;
        return (
          <g>
            <rect x={L} y={Math.min(yTop, yBot)} width={plotW} height={Math.abs(yBot - yTop)}
              fill={COLORS.success} fillOpacity="0.10" />
            <line x1={L} y1={yTop} x2={W - R} y2={yTop} stroke={COLORS.success} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
            <line x1={L} y1={yBot} x2={W - R} y2={yBot} stroke={COLORS.success} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
          </g>
        );
      })()}
      <path d={area} fill={lineColor} fillOpacity="0.14" />
      <path d={path} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c, i) => {
        // each reading is tinted by how far outside the reference band it sits
        const dev = refRange ? rangeDeviation(c[2].value, refRange) : null;
        const dot = refRange ? deviationColor(dev) : lineColor;
        return <circle key={i} cx={c[0]} cy={c[1]} r="3.5" fill={COLORS.bg} stroke={dot} strokeWidth="2" />;
      })}
      {xTicks.map((tk, i) => (
        <text key={i} x={tk.x} y={H - 10}
          textAnchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'}
          fontSize="8" fill={COLORS.textMute} fontFamily="monospace">
          {tk.label}
        </text>
      ))}
    </svg>
  );
}

function SeriesDetailScreen({ title, readings, unit = '', onBack, onDeleteReading, onDeleteSeries, note, refRange }) {
  const asc = readings
    .filter(r => typeof r.value === 'number' && !isNaN(r.value))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const desc = [...asc].reverse();
  const vals = asc.map(r => r.value);

  const latest = vals[vals.length - 1];
  const first = vals[0];
  const change = vals.length > 1 ? +(latest - first).toFixed(2) : null;
  const pct = vals.length > 1 && first !== 0 ? +(((latest - first) / Math.abs(first)) * 100).toFixed(1) : null;
  const avg = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null;
  const lo = vals.length ? Math.min(...vals) : null;
  const hi = vals.length ? Math.max(...vals) : null;

  const goodDir = goodDirectionFor(title);
  let changeColor = COLORS.textMute;
  if (change !== null && change !== 0 && goodDir) {
    changeColor = (goodDir === 'up' ? change > 0 : change < 0) ? COLORS.success : COLORS.warn;
  }
  const span = asc.length > 1
    ? `${fmtMonthYear(asc[0].date)} \u2013 ${fmtMonthYear(asc[asc.length - 1].date)}`
    : asc.length === 1 ? fmtMonthYear(asc[0].date) : '';

  return (
    <div className="mt-4 space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLORS.textMute }}>
        <ChevronLeft size={15} /> Back to trends
      </button>

      <div>
        <div className="text-xl font-semibold" style={{ fontFamily: FONTS.display }}>{title}</div>
        <div className="text-xs mt-0.5" style={{ color: COLORS.textMute }}>
          {asc.length} reading{asc.length === 1 ? '' : 's'}{span ? ` \u00b7 ${span}` : ''}
        </div>
      </div>

      <Card>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: COLORS.textMute }}>Latest</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold"
              style={{ fontFamily: FONTS.mono, color: refRange ? deviationColor(rangeDeviation(latest, refRange)) : COLORS.text }}>
              {latest}{unit}
            </span>
            {change !== null && change !== 0 && (
              <span className="text-xs font-semibold" style={{ color: changeColor, fontFamily: FONTS.mono }}>
                {change > 0 ? '+' : ''}{change}{pct !== null ? ` (${pct > 0 ? '+' : ''}${pct}%)` : ''}
              </span>
            )}
          </div>
        </div>
        {asc.length > 1 ? (
          <DetailChart readings={asc} color={COLORS.success} unit={unit} refRange={refRange} />
        ) : (
          <div className="text-xs text-center py-6" style={{ color: COLORS.textMute }}>
            Only one reading so far — log another to see this charted over time.
          </div>
        )}
      </Card>

      {refRange && (() => {
        const dev = rangeDeviation(latest, refRange);
        const col = deviationColor(dev);
        return (
          <div className="rounded-xl px-3 py-2" style={{ backgroundColor: COLORS.surface2, border: `1px solid ${col}55` }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: COLORS.textMute }}>Typical adult range</span>
              <span className="text-[11px] font-bold" style={{ color: COLORS.success, fontFamily: FONTS.mono }}>
                {refRange[0]}–{refRange[1]}{unit}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col }} />
              <span className="text-[11px]" style={{ color: col }}>Latest reading {deviationLabel(dev)}</span>
            </div>
            <div className="text-[10px] mt-1.5" style={{ color: COLORS.textMute }}>
              Ranges differ between laboratories and by age and sex — the range printed on your own report is the one that counts, and what a value means is a question for your doctor.
            </div>
          </div>
        );
      })()}

      <StatTiles items={[
        { label: 'First', value: first },
        { label: 'Average', value: avg },
        { label: 'Lowest', value: lo },
        { label: 'Highest', value: hi },
      ]} />

      <div className="space-y-2">
        <SectionLabel className="px-1">All readings</SectionLabel>
        {desc.map((r, i) => {
          const prev = desc[i + 1]?.value;
          const d = typeof prev === 'number' ? +(r.value - prev).toFixed(2) : null;
          let dc = COLORS.textMute;
          if (d !== null && d !== 0 && goodDir) dc = (goodDir === 'up' ? d > 0 : d < 0) ? COLORS.success : COLORS.warn;
          return (
            <div key={r.id ?? i} className="rounded-xl p-3 flex items-center justify-between gap-2" style={cardStyle()}>
              <div className="min-w-0">
                <div className="text-sm font-bold" style={{ fontFamily: FONTS.mono }}>
                  {r.value}{r.unit ? ` ${r.unit}` : unit}
                  {d !== null && d !== 0 && (
                    <span className="text-[10px] ml-2 font-semibold" style={{ color: dc }}>{d > 0 ? '+' : ''}{d}</span>
                  )}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: COLORS.textMute }}>{fmtDate(r.date)}</div>
                {r.notes && <div className="text-[11px] mt-1" style={{ color: COLORS.text }}>{r.notes}</div>}
              </div>
              {onDeleteReading && <DeleteButton onConfirm={() => onDeleteReading(r.id)} />}
            </div>
          );
        })}
      </div>

      {(() => {
        const info = markerInfo(title);
        if (!info) return null;
        return (
          <Card>
            <SectionLabel>About {title}</SectionLabel>
            <div className="mt-2.5 space-y-2.5">
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: COLORS.textMute }}>What it measures</div>
                <div className="text-[12px] leading-relaxed" style={{ color: COLORS.text }}>{info.what}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: COLORS.warn }}>What commonly moves it</div>
                <div className="text-[12px] leading-relaxed" style={{ color: COLORS.text }}>{info.raised}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: COLORS.success }}>What's usually discussed</div>
                <div className="text-[12px] leading-relaxed" style={{ color: COLORS.text }}>{info.manage}</div>
              </div>
            </div>
            <div className="text-[10px] mt-3 pt-2.5 italic" style={{ color: COLORS.textMute, borderTop: `1px solid ${COLORS.border}` }}>
              General information to help you follow your own results and ask better questions — not advice about your situation. What any value means for you, and what to do about it, is for your doctor to judge.
            </div>
          </Card>
        );
      })()}

      {note && <InfoNote>{note}</InfoNote>}

      {onDeleteSeries && (
        <button onClick={() => { onDeleteSeries(title); onBack(); }}
          className="w-full rounded-2xl py-3 text-xs font-semibold"
          style={{ backgroundColor: 'transparent', border: `1px solid #E5484D55`, color: '#E5484D' }}>
          Remove "{title}" and all {asc.length} reading{asc.length === 1 ? '' : 's'}
        </button>
      )}
    </div>
  );
}

function WeightLogForm({ onSave, onClose }) {
  const [weightKg, setWeightKg] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const canSave = weightKg || restingHR;
  return (
    <Card>
      <SectionLabel>Log body data</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        <NumField label="Bodyweight" value={weightKg} onChange={setWeightKg} placeholder="78" suffix="kg" />
        <NumField label="Resting HR" value={restingHR} onChange={setRestingHR} placeholder="62" suffix="bpm" />
      </div>
      <div className="flex gap-2.5 mt-3">
        <ActionButton tone="muted" className="flex-1" onClick={onClose}>Cancel</ActionButton>
        <ActionButton tone="success" className="flex-1" disabled={!canSave}
          onClick={() => { onSave({ weightKg: weightKg ? Number(weightKg) : null, restingHR: restingHR ? Number(restingHR) : null }); onClose(); }}>
          Save
        </ActionButton>
      </div>
    </Card>
  );
}

function PersonChips({ people, value, onChange, allowAll, onManage }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {allowAll && (
        <button onClick={() => onChange('')}
          className="rounded-full px-3 py-1.5 text-[11px] font-semibold shrink-0"
          style={{ backgroundColor: !value ? COLORS.upper + '25' : 'transparent', color: !value ? COLORS.upper : COLORS.textMute, border: `1px solid ${!value ? COLORS.upper + '55' : COLORS.border}` }}>
          Everyone
        </button>
      )}
      {people.map(nm => (
        <button key={nm} onClick={() => onChange(nm)}
          className="rounded-full px-3 py-1.5 text-[11px] font-semibold shrink-0"
          style={{ backgroundColor: value === nm ? COLORS.upper + '25' : 'transparent', color: value === nm ? COLORS.upper : COLORS.textMute, border: `1px solid ${value === nm ? COLORS.upper + '55' : COLORS.border}` }}>
          {nm}
        </button>
      ))}
      {onManage && (
        <button onClick={onManage} className="rounded-full px-3 py-1.5 text-[11px] font-semibold shrink-0"
          style={{ backgroundColor: 'transparent', color: COLORS.lower, border: `1px dashed ${COLORS.border}` }}>
          + People
        </button>
      )}
    </div>
  );
}

function PeopleManager({ people, onSave, onClose }) {
  const [list, setList] = useState(people);
  const [name, setName] = useState('');
  return (
    <Card>
      <SectionLabel>Family members</SectionLabel>
      <div className="text-[11px] mt-1 mb-3" style={{ color: COLORS.textMute }}>
        Records and appointments are kept per person, so you can track family alongside your own.
      </div>
      <div className="space-y-2">
        {list.map((nm, i) => (
          <div key={i} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: COLORS.surface2 }}>
            <span className="text-xs" style={{ color: COLORS.text }}>{nm}</span>
            {list.length > 1 && (
              <button onClick={() => setList(list.filter((_, j) => j !== i))}
                className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ color: COLORS.textMute }}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <TextInput value={name} onChange={setName} placeholder="Add a person (e.g. Amma)" className="flex-1" />
        <button onClick={() => { if (name.trim()) { setList([...list, name.trim()]); setName(''); } }}
          className="rounded-lg px-3 text-xs font-semibold shrink-0" style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
          Add
        </button>
      </div>
      <div className="text-[10px] mt-2" style={{ color: COLORS.textMute }}>
        Removing a person here doesn't delete their records — those stay under their name.
      </div>
      <div className="flex gap-2.5 mt-3">
        <ActionButton tone="muted" className="flex-1" onClick={onClose}>Cancel</ActionButton>
        <ActionButton tone="success" className="flex-1" onClick={() => { onSave(list); onClose(); }}>Save</ActionButton>
      </div>
    </Card>
  );
}

function ScheduleForm({ initial, people, defaultPerson, onSave, onClose }) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title || '');
  const [kind, setKind] = useState(initial?.kind || 'appointment');
  const [person, setPerson] = useState(initial?.person || defaultPerson || DEFAULT_PERSON);
  const [dueDate, setDueDate] = useState(initial?.dueDate ? new Date(initial.dueDate).toISOString().slice(0, 10) : todayInputValue());
  const [time, setTime] = useState(initial?.time || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [freq, setFreq] = useState(initial?.repeat?.freq || 'none');
  const [interval, setIntervalVal] = useState(initial?.repeat?.interval || 1);
  const canSave = title.trim() && dueDate;

  return (
    <Card>
      <SectionLabel>{isEdit ? 'Edit item' : 'Add appointment, test or medicine'}</SectionLabel>
      <div className="mt-3 space-y-3">
        <div className="grid grid-cols-4 gap-1.5">
          {MEDICAL_KINDS.map(k => (
            <button key={k.key} onClick={() => setKind(k.key)}
              className="rounded-lg py-2 text-[10px] font-semibold"
              style={{ backgroundColor: kind === k.key ? k.color + '25' : COLORS.surface2, color: kind === k.key ? k.color : COLORS.textMute }}>
              {k.label}
            </button>
          ))}
        </div>

        <Field label={kind === 'medication' ? 'Medicine' : 'What'}>
          <TextInput value={title} onChange={setTitle}
            placeholder={kind === 'medication' ? 'e.g. Atorvastatin 20mg' : kind === 'test' ? 'e.g. Lipid profile' : 'e.g. Cardiology review'} />
        </Field>

        <Field label="For">
          <SelectInput value={person} onChange={setPerson}>
            {people.map(nm => <option key={nm} value={nm} style={{ backgroundColor: INPUT_BG }}>{nm}</option>)}
          </SelectInput>
        </Field>

        <div className="grid grid-cols-2 gap-2.5">
          <Field label={kind === 'medication' ? 'Start / next date' : 'Date'}>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle()} />
          </Field>
          <Field label="Time (optional)">
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle()} />
          </Field>
        </div>

        {kind !== 'medication' && (
          <Field label="Where (optional)">
            <TextInput value={location} onChange={setLocation} placeholder="Clinic, lab, or a Maps link" />
          </Field>
        )}

        <Field label="Notes (optional)">
          <TextArea rows={2} value={notes} onChange={setNotes} placeholder="Fasting required, doctor's name, dosage…" />
        </Field>

        <Field label="Repeat">
          <SelectInput value={freq} onChange={setFreq}>
            {REPEAT_FREQS.map(f => <option key={f.key} value={f.key} style={{ backgroundColor: INPUT_BG }}>{f.label}</option>)}
          </SelectInput>
          {freq !== 'none' && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs" style={{ color: COLORS.textMute }}>Every</span>
              <input type="number" min="1" value={interval} onChange={e => setIntervalVal(e.target.value)}
                className="w-16 rounded-lg px-2 py-1.5 text-sm font-bold outline-none text-center"
                style={inputStyle({ fontFamily: FONTS.mono })} />
              <span className="text-xs" style={{ color: COLORS.textMute }}>
                {{ daily: 'day(s)', weekly: 'week(s)', monthly: 'month(s)', yearly: 'year(s)' }[freq]}
              </span>
            </div>
          )}
        </Field>

        <div className="text-[10px]" style={{ color: COLORS.textMute }}>
          You'll get a reminder the day before, and on the day if reminders are switched on in the Day Planner.
        </div>

        <div className="flex gap-2.5">
          <ActionButton tone="muted" className="flex-1" onClick={onClose}>Cancel</ActionButton>
          <ActionButton tone="success" className="flex-1" disabled={!canSave}
            onClick={() => {
              onSave({
                ...(isEdit ? { id: initial.id } : {}),
                title: title.trim(), kind, person,
                dueDate: new Date(dueDate + 'T09:00:00').toISOString(),
                time, location: location.trim(), notes: notes.trim(),
                repeat: { freq, interval: Number(interval) || 1 },
              });
              onClose();
            }}>
            {isEdit ? 'Save changes' : 'Add'}
          </ActionButton>
        </div>
      </div>
    </Card>
  );
}

function ScheduleCard({ item, onToggle, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const diff = daysBetween(new Date(), item.dueDate);
  const overdue = diff < 0 && !item.done;
  const soon = diff >= 0 && diff <= 1 && !item.done;
  const meta = kindMeta(item.kind);
  const when = diff < 0 ? `${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} overdue`
    : diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `in ${diff} days`;

  return (
    <div className="rounded-2xl p-3.5" style={cardStyle(overdue ? '#E5484D' : soon ? COLORS.warn : COLORS.border)}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(item.id)} className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: item.done ? COLORS.success : 'transparent', border: `1.5px solid ${item.done ? COLORS.success : COLORS.border}` }}>
          {item.done && <Check size={13} strokeWidth={3} color="#06231A" />}
        </button>
        <button onClick={() => setOpen(v => !v)} className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: meta.color + '25', color: meta.color }}>
              {meta.label}
            </span>
            <span className="text-sm font-semibold" style={{ color: item.done ? COLORS.textMute : COLORS.text, textDecoration: item.done ? 'line-through' : 'none' }}>
              {item.title}
            </span>
          </div>
          <div className="text-[11px] mt-0.5 flex flex-wrap gap-x-2" style={{ color: COLORS.textMute }}>
            <span style={{ color: overdue ? '#E5484D' : soon ? COLORS.warn : COLORS.textMute }}>
              {fmtDate(item.dueDate)}{item.time ? ` \u00b7 ${scheduleStart(item).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}` : ''}
            </span>
            {!item.done && <span>· {when}</span>}
            <span>· {item.person}</span>
            {item.repeat && item.repeat.freq !== 'none' && <span>· {repeatLabel(item.repeat)}</span>}
          </div>
          {item.location && <div className="text-[11px] mt-0.5 truncate" style={{ color: COLORS.textMute }}>📍 {isMapsUrl(item.location) ? 'Maps location' : item.location}</div>}
          {item.notes && <div className="text-[11px] mt-1" style={{ color: COLORS.textMute }}>{item.notes}</div>}
        </button>
      </div>

      {open && (
        <div className="mt-3 pt-3 space-y-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div className="flex gap-2">
            <a href={googleCalendarUrl({ title: `${item.title} (${item.person})`, details: item.notes, targetDate: item.dueDate, targetTime: item.time, durationMin: 30, location: item.location, repeat: item.repeat, emails: '' })}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.lower }}>
              Google Calendar
            </a>
            <button onClick={() => downloadIcs({ id: item.id, title: `${item.title} (${item.person})`, details: item.notes, targetDate: item.dueDate, targetTime: item.time, durationMin: 30, location: item.location, repeat: item.repeat, emails: '' })}
              className="flex-1 rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.text }}>
              Calendar file
            </button>
          </div>
          {item.location && (
            <a href={locationMapUrl(item.location)} target="_blank" rel="noopener noreferrer"
              className="block text-center rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.lower }}>
              Open in Google Maps
            </a>
          )}
          <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="flex-1 rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>Edit</button>
            <div className="flex-1 flex justify-center items-center"><DeleteButton onConfirm={() => onDelete(item.id)} /></div>
          </div>
        </div>
      )}
    </div>
  );
}

function BundleDateEditor({ dayKey, count, onSave, onClose }) {
  const [value, setValue] = useState(dayKey);
  return (
    <div className="space-y-2">
      <div className="text-[11px]" style={{ color: COLORS.upper }}>
        Change the date for all {count} value{count === 1 ? '' : 's'} in this record
      </div>
      <div className="flex gap-2">
        <input type="date" value={value} onChange={e => setValue(e.target.value)}
          className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle()} />
        <button onClick={onClose} className="rounded-lg px-3 text-xs font-semibold"
          style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>Cancel</button>
        <button onClick={() => onSave(new Date(value + 'T12:00:00').toISOString())} disabled={!value}
          className="rounded-lg px-3 text-xs font-semibold"
          style={{ backgroundColor: value ? COLORS.success : COLORS.surface2, color: value ? '#06231A' : COLORS.textMute }}>
          Save
        </button>
      </div>
    </div>
  );
}

function MedicalEntryForm({ initial, people, defaultPerson, onSave, onClose }) {
  const isEdit = !!initial;
  const [person, setPerson] = useState(initial?.person || defaultPerson || DEFAULT_PERSON);
  const formRef = useRef(null);
  useEffect(() => {
    if (isEdit && formRef.current) formRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [isEdit]);
  const [title, setTitle] = useState(initial?.title || '');
  const [unit, setUnit] = useState(initial?.unit || '');
  const [category, setCategory] = useState(initial?.category || 'Vitals');
  const [value, setValue] = useState(initial?.value !== null && initial?.value !== undefined ? String(initial.value) : '');
  const [dateStr, setDateStr] = useState(initial?.date ? new Date(initial.date).toISOString().slice(0, 10) : todayInputValue());
  const [notes, setNotes] = useState(initial?.notes || '');

  const needsValue = category === 'Vitals' || category === 'Test Result';
  const canSave = title.trim() && (!needsValue || value !== '');

  function handleSave() {
    onSave({
      ...(isEdit ? { id: initial.id } : {}),
      title: title.trim(),
      person,
      unit: unit.trim(),
      category,
      value: value !== '' ? Number(value) : null,
      notes: notes.trim(),
      date: new Date(dateStr).toISOString(),
    });
    onClose();
  }

  return (
    <Card>
      <div ref={formRef} className="text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.textMute }}>
        {isEdit ? 'Edit record' : 'Add health entry'}
      </div>
      {people && people.length > 1 && (
        <div className="mt-3">
          <Field label="For">
            <SelectInput value={person} onChange={setPerson}>
              {people.map(nm => <option key={nm} value={nm} style={{ backgroundColor: INPUT_BG }}>{nm}</option>)}
            </SelectInput>
          </Field>
        </div>
      )}

      <div className="mt-3">
        <FieldLabel>Quick pick</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {MEDICAL_PRESETS.map(pr => (
            <button key={pr.title}
              onClick={() => { setTitle(pr.title); setUnit(pr.unit); setCategory(pr.category); }}
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{ backgroundColor: title === pr.title ? COLORS.success + '25' : COLORS.surface2, color: title === pr.title ? COLORS.success : COLORS.textMute }}>
              {pr.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <Field label="What"><TextInput value={title} onChange={setTitle} placeholder="e.g. Oncology follow-up" /></Field>

        <Field label="Category">
          <SelectInput value={category} onChange={setCategory}>
            {MEDICAL_CATEGORIES.map(c => <option key={c} value={c} style={{ backgroundColor: INPUT_BG }}>{c}</option>)}
          </SelectInput>
        </Field>

        <Field label="Date">
          <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle()} />
        </Field>

        <div className="grid grid-cols-2 gap-2.5">
          <Field label={needsValue ? 'Value' : 'Value (optional)'}>
            <input type="number" inputMode="decimal" value={value} onChange={e => setValue(e.target.value)}
              placeholder="120" className="w-full rounded-lg px-3 py-2 text-sm font-bold outline-none"
              style={inputStyle({ fontFamily: FONTS.mono })} />
          </Field>
          <Field label="Unit"><TextInput value={unit} onChange={setUnit} placeholder="mmHg" /></Field>
        </div>

        <Field label="Notes"><TextArea rows={2} value={notes} onChange={setNotes} placeholder="Any details worth remembering" /></Field>

        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>Cancel</button>
          <button onClick={handleSave} disabled={!canSave} className="flex-1 rounded-xl py-2.5 text-xs font-semibold"
            style={{ backgroundColor: canSave ? COLORS.success : COLORS.surface2, color: canSave ? '#06231A' : COLORS.textMute }}>
            {isEdit ? 'Save changes' : 'Save'}
          </button>
        </div>
      </div>
    </Card>
  );
}

function LabReportScanner({ knownTitles, people, defaultPerson, onSaveBatch, onClose }) {
  const [person, setPerson] = useState(defaultPerson || DEFAULT_PERSON);
  const [status, setStatus] = useState('idle'); // idle | loading-lib | reading | review | error
  const [progress, setProgress] = useState('');
  const [rows, setRows] = useState([]);
  const [dateStr, setDateStr] = useState(todayInputValue());
  const [rawText, setRawText] = useState('');
  const [sourceNote, setSourceNote] = useState('');
  const [focusIdx, setFocusIdx] = useState(null);
  const fileRef = useRef(null);

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src; el.onload = resolve; el.onerror = () => reject(new Error('load failed'));
      document.head.appendChild(el);
    });
  }
  async function ensureTesseract() {
    if (window.Tesseract) return window.Tesseract;
    await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    return window.Tesseract;
  }
  async function ensurePdfJs() {
    if (window.pdfjsLib) return window.pdfjsLib;
    await loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    }
    return window.pdfjsLib;
  }

  async function readPdf(arrayBuffer) {
    const pdfjsLib = await ensurePdfJs();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    let text = '';
    for (let i = 1; i <= pageCount; i++) {
      setProgress(`Reading page ${i} of ${pageCount}…`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = pdfItemsToLines(content.items);
      if (pageText) text += (text ? '\n' : '') + pageText;
    }
    if (text.replace(/\s/g, '').length >= 40) {
      setSourceNote(`Read text directly from the PDF (${pageCount} page${pageCount === 1 ? '' : 's'}).`);
      return text;
    }
    const Tesseract = await ensureTesseract();
    let ocrText = '';
    for (let i = 1; i <= pageCount; i++) {
      setProgress(`Scanning page ${i} of ${pageCount}…`);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      const { data } = await Tesseract.recognize(canvas.toDataURL('image/png'), 'eng');
      ocrText += (ocrText ? '\n' : '') + (data.text || '');
    }
    setSourceNote(`Scanned PDF — read with OCR (${pageCount} page${pageCount === 1 ? '' : 's'}). Please check values carefully.`);
    return ocrText;
  }

  function ingestText(text, note) {
    setRawText(text);
    if (note !== undefined) setSourceNote(note);
    const parsed = parseLabReport(text);
    const d = extractReportDate(text);
    if (d) setDateStr(d);
    setRows(parsed.map(p => ({ ...p, include: true })));
    setProgress('');
    setStatus('review');
  }

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    setStatus('loading-lib');
    setProgress(isPdf ? 'Opening PDF…' : 'Loading scanner…');
    try {
      if (isPdf) {
        const buf = await file.arrayBuffer();
        setStatus('reading');
        ingestText(await readPdf(buf));
      } else {
        const dataUrl = await new Promise((res, rej) => {
          const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file);
        });
        const Tesseract = await ensureTesseract();
        setStatus('reading'); setProgress('Reading image…');
        const { data } = await Tesseract.recognize(dataUrl, 'eng');
        ingestText(data.text || '', 'Read from image with OCR. Please check values carefully.');
      }
    } catch (err) {
      setProgress(''); setStatus('error');
    }
  }

  function updateRow(i, patch) { setRows(rs => rs.map((r, idx) => idx === i ? { ...r, ...patch } : r)); }
  function addBlankRow() {
    setRows(rs => {
      const next = [...rs, { title: '', value: '', unit: '', category: 'Test Result', include: true, manual: true }];
      setFocusIdx(next.length - 1);
      return next;
    });
  }

  const newTitles = rows.filter(r => r.include && r.title && !knownTitles.includes(r.title)).map(r => r.title);
  const included = rows.filter(r => r.include && r.title && String(r.title).trim() && r.value !== '' && r.value !== null);

  function handleSave() {
    onSaveBatch(included.map(r => ({
      title: r.title, person, value: Number(r.value), unit: r.unit,
      category: 'Test Result', date: new Date(dateStr).toISOString(), notes: '',
    })));
    onClose();
  }

  return (
    <Card>
      <SectionLabel>Scan a test result</SectionLabel>

      {status !== 'review' && (
        <div className="mt-3 space-y-3">
          <input ref={fileRef} type="file" accept="image/*,application/pdf,.pdf" className="hidden" onChange={handleFile} />
          <button onClick={() => fileRef.current && fileRef.current.click()}
            className="w-full rounded-xl py-6 flex flex-col items-center justify-center gap-1.5"
            style={{ backgroundColor: COLORS.surface2, border: `1px dashed ${COLORS.border}`, color: COLORS.upper }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-xs font-semibold">Upload a PDF or photo of your report</span>
            <span className="text-[10px]" style={{ color: COLORS.textMute }}>PDF, JPG or PNG</span>
          </button>
          {(status === 'loading-lib' || status === 'reading') && (
            <div className="text-[11px] text-center" style={{ color: COLORS.textMute }}>{progress || 'Working…'}</div>
          )}
          {status === 'error' && <div className="text-[11px] text-center" style={{ color: COLORS.warn }}>Couldn't read that file. You can paste the report text below instead.</div>}
          <div>
            <FieldLabel>Or paste report text</FieldLabel>
            <TextArea rows={4} value={rawText} onChange={setRawText} placeholder="Paste the text from your lab report here" />
            <button onClick={() => ingestText(rawText)} disabled={!rawText.trim()}
              className="w-full mt-2 rounded-xl py-2.5 text-xs font-semibold"
              style={{ backgroundColor: rawText.trim() ? COLORS.success : COLORS.surface2, color: rawText.trim() ? '#06231A' : COLORS.textMute }}>
              Extract values
            </button>
          </div>
          <ActionButton tone="muted" className="w-full" onClick={onClose}>Cancel</ActionButton>
        </div>
      )}

      {status === 'review' && (
        <div className="mt-3 space-y-3">
          {rows.length === 0 && (
            <div className="text-xs py-2" style={{ color: COLORS.warn }}>
              No values were recognised automatically{sourceNote ? ` — ${sourceNote.toLowerCase()}` : ''}. You can add them by hand below, try a sharper photo, or paste the report text.
            </div>
          )}
          {rows.length > 0 && (
            <div className="text-[11px]" style={{ color: COLORS.success }}>
              Found {rows.length} value{rows.length === 1 ? '' : 's'}. Check each one against your report before saving — untick anything wrong.
            </div>
          )}
          {sourceNote && <div className="text-[10px]" style={{ color: COLORS.textMute }}>{sourceNote}</div>}

          {newTitles.length > 0 && (
            <div className="rounded-xl p-3" style={{ backgroundColor: COLORS.upper + '18', border: `1px solid ${COLORS.upper}55` }}>
              <div className="text-[11px] font-semibold mb-1" style={{ color: COLORS.upper }}>New markers found</div>
              <div className="text-[11px]" style={{ color: COLORS.textMute }}>
                You haven't tracked {newTitles.slice(0, 6).join(', ')}{newTitles.length > 6 ? ` and ${newTitles.length - 6} more` : ''} before. Saving these starts a new trend you can follow over time.
              </div>
            </div>
          )}

          {people && people.length > 1 && (
            <Field label="Whose report is this?">
              <SelectInput value={person} onChange={setPerson}>
                {people.map(nm => <option key={nm} value={nm} style={{ backgroundColor: INPUT_BG }}>{nm}</option>)}
              </SelectInput>
            </Field>
          )}

          <Field label="Report date">
            <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle()} />
          </Field>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {rows.map((r, i) => {
              const isNew = !knownTitles.includes(r.title);
              return (
                <div key={i} className="rounded-xl p-2.5"
                  style={{ backgroundColor: COLORS.surface2, border: `1px solid ${r.manual && !String(r.title).trim() ? COLORS.upper : r.include ? COLORS.border : 'transparent'}`, opacity: r.include ? 1 : 0.5 }}>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateRow(i, { include: !r.include })}
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                      style={{ backgroundColor: r.include ? COLORS.success : 'transparent', border: `1px solid ${r.include ? COLORS.success : COLORS.border}` }}>
                      {r.include && <Check size={12} strokeWidth={3} color="#06231A" />}
                    </button>
                    {r.manual ? (
                      <input value={r.title} onChange={e => updateRow(i, { title: e.target.value })}
                        placeholder="Parameter name (e.g. Ferritin)"
                        ref={el => { if (el && focusIdx === i) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.focus(); setFocusIdx(null); } }}
                        className="flex-1 min-w-0 rounded-lg px-2 py-1 text-xs outline-none"
                        style={inputStyle({ border: `1.5px solid ${COLORS.upper}` })} />
                    ) : (
                      <span className="text-xs flex-1 min-w-0 truncate" style={{ color: COLORS.text }}>{r.title}</span>
                    )}
                    {isNew && r.title && <span className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: COLORS.upper + '25', color: COLORS.upper }}>NEW</span>}
                  </div>
                  <div className="flex gap-2 mt-1.5 pl-7">
                    <input type="number" inputMode="decimal" value={r.value} onChange={e => updateRow(i, { value: e.target.value })}
                      className="flex-1 min-w-0 rounded-lg px-2 py-1.5 text-xs font-bold outline-none"
                      style={inputStyle({ fontFamily: FONTS.mono })} />
                    <input type="text" value={r.unit} onChange={e => updateRow(i, { unit: e.target.value })} placeholder="unit"
                      className="w-24 rounded-lg px-2 py-1.5 text-xs outline-none"
                      style={inputStyle({ color: COLORS.textMute })} />
                  </div>
                  {r.manual && !String(r.title).trim() && (
                    <div className="text-[10px] mt-1 pl-7" style={{ color: COLORS.upper }}>
                      Enter a name, value and unit — this row won't be saved until it has a name.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={addBlankRow} className="w-full rounded-xl py-2.5 text-xs font-semibold"
            style={{ backgroundColor: COLORS.surface2, color: COLORS.upper, border: `1px dashed ${COLORS.border}` }}>
            + Add a parameter the scan missed
          </button>

          <div className="text-[10px] italic" style={{ color: COLORS.textMute }}>
            Scanned values are a convenience, not a verified reading. Always check them against the original report — and take any concerns about the results themselves to your doctor.
          </div>

          <div className="flex gap-2.5">
            <ActionButton tone="muted" className="flex-1" onClick={onClose}>Cancel</ActionButton>
            <button onClick={handleSave} disabled={included.length === 0} className="flex-1 rounded-xl py-2.5 text-xs font-semibold"
              style={{ backgroundColor: included.length ? COLORS.success : COLORS.surface2, color: included.length ? '#06231A' : COLORS.textMute }}>
              Save {included.length || ''} value{included.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

function ReportGenerator({ onClose, medicalEntries, sessions, walkLogs, circuitLogs, people, profile }) {
  const [preset, setPreset] = useState('30d');
  const [customStart, setCustomStart] = useState(todayInputValue());
  const [customEnd, setCustomEnd] = useState(todayInputValue());
  const [status, setStatus] = useState('idle'); // idle | done | error

  function resolveRange() {
    const today = todayInputValue();
    const cfg = REPORT_DATE_PRESETS.find(p => p.key === preset);
    if (preset === 'custom') return { startIso: customStart, endIso: customEnd, label: `${fmtDate(customStart)} \u2013 ${fmtDate(customEnd)}` };
    if (preset === 'all') return { startIso: null, endIso: null, label: 'All time' };
    if (preset === 'ytd') {
      const start = `${new Date().getFullYear()}-01-01`;
      return { startIso: start, endIso: today, label: `${fmtDate(start)} \u2013 ${fmtDate(today)}` };
    }
    const start = new Date(Date.now() - cfg.days * 86400000).toISOString().slice(0, 10);
    return { startIso: start, endIso: today, label: cfg.label };
  }

  // A quick preview count so the person can see there's something worth
  // downloading before they commit to it.
  const { startIso, endIso, label } = resolveRange();
  const previewCount =
    (medicalEntries || []).filter(e => inRange(e.date, startIso, endIso)).length +
    (sessions || []).filter(s => inRange(s.date, startIso, endIso)).length +
    (walkLogs || []).filter(w => inRange(w.date, startIso, endIso)).length;

  function generate() {
    try {
      const sheets = buildHealthReport({ startIso, endIso, presetLabel: label, medicalEntries, sessions, walkLogs, circuitLogs, people, profile });
      const bytes = buildWorkbookXlsx(sheets);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBytes(bytes, `training-tracker-report-${stamp}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      setStatus('done');
    } catch (e) {
      setStatus('error');
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <SectionLabel>Generate report</SectionLabel>
        <button onClick={onClose} className="text-[11px] font-semibold" style={{ color: COLORS.textMute }}>Close</button>
      </div>
      <div className="text-[11px] mt-1.5 mb-3" style={{ color: COLORS.textMute }}>
        Builds an Excel file from your logged data — health records, workout sessions, and cardio/activity logs — for your own analysis or to share with a doctor.
      </div>

      <FieldLabel>Date range</FieldLabel>
      <div className="grid grid-cols-3 gap-1.5 mb-1">
        {REPORT_DATE_PRESETS.map(p => (
          <button key={p.key} onClick={() => setPreset(p.key)}
            className="rounded-lg py-2 text-[11px] font-semibold"
            style={{ backgroundColor: preset === p.key ? COLORS.upper + '25' : COLORS.surface2, color: preset === p.key ? COLORS.upper : COLORS.textMute }}>
            {p.label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="grid grid-cols-2 gap-2.5 mt-2">
          <Field label="From">
            <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle()} />
          </Field>
          <Field label="To">
            <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle()} />
          </Field>
        </div>
      )}

      <div className="rounded-lg px-3 py-2.5 mt-3" style={{ backgroundColor: COLORS.surface2 }}>
        <div className="text-[11px]" style={{ color: COLORS.textMute }}>
          {label} · <span style={{ color: previewCount ? COLORS.text : COLORS.warn, fontFamily: FONTS.mono }}>{previewCount}</span> record{previewCount === 1 ? '' : 's'} found
        </div>
      </div>

      <ActionButton tone={previewCount ? 'success' : 'muted'} className="w-full mt-3" disabled={!previewCount} onClick={generate}>
        Download Excel (.xlsx)
      </ActionButton>

      {status === 'done' && (
        <div className="text-[11px] mt-2" style={{ color: COLORS.success }}>
          Downloaded. You can attach this file here, or share it directly with your doctor.
        </div>
      )}
      {status === 'error' && (
        <div className="text-[11px] mt-2" style={{ color: COLORS.warn }}>
          Something went wrong generating the file — try a narrower date range.
        </div>
      )}

      <div className="text-[10px] mt-2.5 italic" style={{ color: COLORS.textMute }}>
        Generated entirely on this device — nothing is uploaded anywhere to build this file.
      </div>
    </Card>
  );
}

function MedicalScreen({ entries, schedule, people, profile, sessions, walkLogs, circuitLogs, onSaveEntry, onSaveBatch, onDeleteEntry, onDeleteEntries,
  onUpdateEntriesDate, onDeleteSeries, hidden, onToggleHidden,
  onSaveSchedule, onDeleteSchedule, onToggleSchedule, onSavePeople }) {
  const [mode, setMode] = useState(null); // null | 'manual' | 'scan' | 'schedule' | 'people'
  const [editingEntry, setEditingEntry] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingDateKey, setEditingDateKey] = useState(null);
  const [openDates, setOpenDates] = useState({});
  const [openGroups, setOpenGroups] = useState({});

  // After saving, jump to Records and open the group the entry landed in,
  // otherwise a new reading disappears into a collapsed date and looks lost.
  function revealSaved(dateIso) {
    const k = new Date(dateIso || Date.now()).toISOString().slice(0, 10);
    setTab('log');
    setOpenDates(o => ({ ...o, [k]: true }));
  }
  const [tab, setTab] = useState('upcoming');
  const [selected, setSelected] = useState(null);
  const [managing, setManaging] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [person, setPerson] = useState('');

  const personEntries = person ? entries.filter(e => (e.person || DEFAULT_PERSON) === person) : entries;
  const personSchedule = person ? schedule.filter(x => (x.person || DEFAULT_PERSON) === person) : schedule;
  const upcoming = upcomingSchedule(personSchedule);
  const doneSchedule = personSchedule.filter(x => x.done);

  const groups = {};
  personEntries.forEach(e => {
    if (e.value !== null && e.value !== undefined) {
      if (!groups[e.title]) groups[e.title] = [];
      groups[e.title].push(e);
    }
  });
  Object.keys(groups).forEach(k => groups[k].sort((a, b) => new Date(a.date) - new Date(b.date)));

  const allTitles = Object.keys(groups).sort();
  const knownTitles = allTitles;
  const chronological = [...personEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  const dateBuckets = {};
  chronological.forEach(e => {
    const k = new Date(e.date).toISOString().slice(0, 10);
    if (!dateBuckets[k]) dateBuckets[k] = [];
    dateBuckets[k].push(e);
  });
  const byDate = Object.entries(dateBuckets).sort((a, b) => b[0].localeCompare(a[0]));
  const visibleTitles = allTitles.filter(t => !hidden.includes(t));

  if (selected && groups[selected]) {
    return (
      <SeriesDetailScreen
        title={selected}
        readings={groups[selected]}
        refRange={referenceRange(selected, profile && profile.sex)}
        onBack={() => setSelected(null)}
        onDeleteReading={onDeleteEntry}
        onDeleteSeries={onDeleteSeries}
        note="This is a record of your own readings, not an interpretation of them. Reference ranges differ between labs and between people, and a single result outside a range often isn't meaningful on its own. Bring this history to your appointments."
      />
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <PersonChips people={people} value={person} onChange={setPerson} allowAll onManage={() => setMode('people')} />

      {mode === 'people' ? (
        <PeopleManager people={people} onSave={onSavePeople} onClose={() => setMode(null)} />
      ) : editingSchedule ? (
        <ScheduleForm initial={editingSchedule} people={people} defaultPerson={person || DEFAULT_PERSON}
          onSave={onSaveSchedule} onClose={() => setEditingSchedule(null)} />
      ) : mode === 'schedule' ? (
        <ScheduleForm people={people} defaultPerson={person || DEFAULT_PERSON}
          onSave={it => { onSaveSchedule(it); setTab('upcoming'); }} onClose={() => setMode(null)} />
      ) : editingEntry ? (
        <MedicalEntryForm initial={editingEntry} people={people}
          onSave={e => { onSaveEntry(e); revealSaved(e.date); }} onClose={() => setEditingEntry(null)} />
      ) : mode === 'manual' ? (
        <MedicalEntryForm people={people} defaultPerson={person || DEFAULT_PERSON}
          onSave={e => { onSaveEntry(e); revealSaved(e.date); }} onClose={() => setMode(null)} />
      ) : mode === 'scan' ? (
        <LabReportScanner knownTitles={knownTitles} people={people} defaultPerson={person || DEFAULT_PERSON}
          onSaveBatch={b => { onSaveBatch(b); revealSaved(b[0] && b[0].date); }} onClose={() => setMode(null)} />
      ) : (
        <>
          <button onClick={() => setMode('schedule')} className="w-full rounded-2xl py-3.5 text-sm font-semibold"
            style={{ backgroundColor: COLORS.upper, color: '#1A0D06' }}>
            + Appointment, test or medicine
          </button>
          <div className="flex gap-2.5">
            <button onClick={() => setMode('scan')} className="flex-1 rounded-2xl py-3 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.text }}>
              Scan test result
            </button>
            <button onClick={() => setMode('manual')} className="flex-1 rounded-2xl py-3 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.text }}>
              + Add reading
            </button>
          </div>
        </>
      )}

      <TabSwitcher
        tabs={[{ key: 'upcoming', label: `Upcoming${upcoming.length ? ` (${upcoming.length})` : ''}` }, { key: 'log', label: 'Records' }, { key: 'trends', label: 'Trends' }]}
        value={tab} onChange={setTab} />

      {tab === 'trends' && (
        reporting ? (
          <ReportGenerator onClose={() => setReporting(false)}
            medicalEntries={entries} sessions={sessions} walkLogs={walkLogs} circuitLogs={circuitLogs}
            people={people} profile={profile} />
        ) : (
          <button onClick={() => setReporting(true)} className="w-full rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
            style={{ backgroundColor: COLORS.surface2, color: COLORS.upper, border: `1px dashed ${COLORS.border}` }}>
            Generate report (.xlsx)
          </button>
        )
      )}

      {tab === 'upcoming' && (
        upcoming.length === 0 && doneSchedule.length === 0 ? (
          <EmptyState icon={<Calendar size={24} color={COLORS.textMute} />}>
            Nothing scheduled{person ? ` for ${person}` : ''}. Add an appointment, an upcoming test, or a medicine reminder.
          </EmptyState>
        ) : (
          <div className="space-y-2">
            {upcoming.map(it => (
              <ScheduleCard key={it.id} item={it} onToggle={onToggleSchedule} onEdit={setEditingSchedule} onDelete={onDeleteSchedule} />
            ))}
            {doneSchedule.length > 0 && (
              <>
                <SectionLabel className="px-1 pt-2">Done ({doneSchedule.length})</SectionLabel>
                {doneSchedule.slice(0, 10).map(it => (
                  <ScheduleCard key={it.id} item={it} onToggle={onToggleSchedule} onEdit={setEditingSchedule} onDelete={onDeleteSchedule} />
                ))}
              </>
            )}
            <InfoNote>
              Reminders arrive the day before and on the day, if they're switched on in the Day Planner. For alerts that reach you even with the app closed, add the item to your calendar from the card.
            </InfoNote>
          </div>
        )
      )}

      {tab === 'trends' && (
        <>
          {allTitles.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: COLORS.textMute }}>
                Showing {visibleTitles.length} of {allTitles.length} parameter{allTitles.length === 1 ? '' : 's'}
              </span>
              <button onClick={() => setManaging(m => !m)} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: managing ? COLORS.success : COLORS.surface2, color: managing ? '#06231A' : COLORS.upper }}>
                {managing ? 'Done' : 'Manage parameters'}
              </button>
            </div>
          )}

          {managing && (
            <div className="rounded-2xl p-4 space-y-2" style={cardStyle()}>
              <div className="text-[11px] mb-1" style={{ color: COLORS.textMute }}>
                Tick the parameters you want charted. Unticking only hides one — your readings are kept. "Remove" deletes that parameter and all its readings.
              </div>
              {allTitles.map(t => {
                const shown = !hidden.includes(t);
                return (
                  <div key={t} className="flex items-center justify-between gap-2 py-1">
                    <button onClick={() => onToggleHidden(t)} className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                        style={{ backgroundColor: shown ? COLORS.success : 'transparent', border: `1px solid ${shown ? COLORS.success : COLORS.border}` }}>
                        {shown && <Check size={12} strokeWidth={3} color="#06231A" />}
                      </span>
                      <span className="text-xs truncate text-left" style={{ color: shown ? COLORS.text : COLORS.textMute }}>{t}</span>
                    </button>
                    <span className="text-[10px] shrink-0" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>
                      {groups[t].length}
                    </span>
                    <DeleteButton label="Remove" onConfirm={() => onDeleteSeries(t)} />
                  </div>
                );
              })}
              <div className="pt-1">
                <button onClick={() => { setManaging(false); setMode('manual'); }}
                  className="w-full rounded-xl py-2.5 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                  + Add a new parameter
                </button>
              </div>
            </div>
          )}

          {visibleTitles.length === 0 ? (
            <EmptyState icon={<TrendingUp size={24} color={COLORS.textMute} />}>
              {allTitles.length > 0
                ? 'All parameters are hidden. Use "Manage parameters" to show some.'
                : 'Add or scan some results to start building trends.'}
            </EmptyState>
          ) : (
            (() => {
              // Group markers into panels (lipids, liver, kidney…) so a long
              // list of results stays readable.
              const buckets = {};
              visibleTitles.forEach(title => {
                const g = groupForTitle(title);
                (buckets[g] = buckets[g] || []).push(title);
              });
              const ordered = ANALYTE_GROUPS.filter(g => buckets[g] && buckets[g].length);
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px]" style={{ color: COLORS.textMute }}>
                      {ordered.length} panel{ordered.length === 1 ? '' : 's'} · {visibleTitles.length} marker{visibleTitles.length === 1 ? '' : 's'}
                    </span>
                    <button
                      onClick={() => {
                        const allOpen = ordered.every(g => openGroups[g]);
                        const next = {};
                        if (!allOpen) ordered.forEach(g => { next[g] = true; });
                        setOpenGroups(next);
                      }}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                      {ordered.every(g => openGroups[g]) ? 'Collapse all' : 'Expand all'}
                    </button>
                  </div>
                  {ordered.map(g => (
                    <div key={g} className="rounded-2xl overflow-hidden" style={cardStyle()}>
                      <button onClick={() => setOpenGroups(o => ({ ...o, [g]: !o[g] }))}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left">
                        <span className="flex items-center gap-2 min-w-0">
                          {openGroups[g] ? <ChevronUp size={15} color={COLORS.textMute} /> : <ChevronDown size={15} color={COLORS.textMute} />}
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">{g}</span>
                            <span className="block text-[11px]" style={{ color: COLORS.textMute }}>
                              {buckets[g].length} marker{buckets[g].length === 1 ? '' : 's'}
                              {!openGroups[g] && ` · ${buckets[g].slice(0, 3).join(', ')}${buckets[g].length > 3 ? '…' : ''}`}
                            </span>
                          </span>
                        </span>
                      </button>
                      {openGroups[g] && (
                        <div className="px-3 pb-3 space-y-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                          <div className="pt-3 space-y-3">
                            {buckets[g].map(title => {
                              const list = groups[title];
                              const pts = list.map(e => ({ v: e.value, date: e.date }));
                              const unit = list[list.length - 1].unit ? ` ${list[list.length - 1].unit}` : '';
                              const band = referenceRange(title, profile && profile.sex);
                              const latest = pts[pts.length - 1].v;
                              return (
                                <div key={title}>
                                  <TrendCard label={title} points={pts} color={COLORS.success} unit={unit}
                                    goodDirection={goodDirectionFor(title)} showDates onClick={() => setSelected(title)} />
                                  {band && (() => {
                                    const dev = rangeDeviation(latest, band);
                                    const col = deviationColor(dev);
                                    return (
                                      <div className="flex items-center justify-between px-4 pt-1">
                                        <span className="text-[9px]" style={{ color: COLORS.textMute }}>
                                          typical {band[0]}–{band[1]}{unit}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col }} />
                                          <span className="text-[9px]" style={{ color: col }}>{deviationLabel(dev)}</span>
                                        </span>
                                      </div>
                                    );
                                  })()}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <InfoNote>
                    Tap any parameter for a detailed chart and its full reading history. These charts record your own readings over time — they don't interpret them. Reference ranges vary by lab and by person, so bring these trends to your appointments.
                  </InfoNote>
                </div>
              );
            })()
          )}
        </>
      )}

      {tab === 'log' && (
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest px-1" style={{ color: COLORS.textMute }}>Records by date</div>
          {chronological.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={cardStyle()}>
              <ClipboardList className="mx-auto mb-2" size={24} color={COLORS.textMute} />
              <div className="text-sm" style={{ color: COLORS.textMute }}>No medical entries yet.</div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px]" style={{ color: COLORS.textMute }}>
                  {byDate.length} record{byDate.length === 1 ? '' : 's'} · {chronological.length} value{chronological.length === 1 ? '' : 's'}
                </span>
                <button
                  onClick={() => {
                    const allOpen = byDate.every(([k]) => openDates[k]);
                    const next = {};
                    if (!allOpen) byDate.forEach(([k]) => { next[k] = true; });
                    setOpenDates(next);
                  }}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                  {byDate.every(([k]) => openDates[k]) ? 'Collapse all' : 'Expand all'}
                </button>
              </div>
              {byDate.map(([dayKey, list]) => (
            <div key={dayKey} className="rounded-2xl overflow-hidden" style={cardStyle()}>
              <div className="px-4 py-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                {editingDateKey === dayKey ? (
                  <BundleDateEditor
                    dayKey={dayKey}
                    count={list.length}
                    onSave={iso => { onUpdateEntriesDate(list.map(x => x.id), iso); setEditingDateKey(null); }}
                    onClose={() => setEditingDateKey(null)}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => setOpenDates(o => ({ ...o, [dayKey]: !o[dayKey] }))}
                      className="min-w-0 flex-1 flex items-center gap-2 text-left">
                      {openDates[dayKey] ? <ChevronUp size={15} color={COLORS.textMute} /> : <ChevronDown size={15} color={COLORS.textMute} />}
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{fmtDate(list[0].date)}</span>
                        <span className="block text-[11px]" style={{ color: COLORS.textMute }}>
                          {list.length} value{list.length === 1 ? '' : 's'}
                          {(() => {
                            const gs = Array.from(new Set(list.map(x => groupForTitle(x.title))));
                            return gs.length ? ` · ${gs.slice(0, 2).join(', ')}${gs.length > 2 ? ` +${gs.length - 2}` : ''}` : '';
                          })()}
                        </span>
                      </span>
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => setEditingDateKey(dayKey)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                        Edit date
                      </button>
                      <DeleteButton label="Delete all" onConfirm={() => onDeleteEntries(list.map(x => x.id))} />
                    </div>
                  </div>
                )}
              </div>
              {openDates[dayKey] && (
              <div className="divide-y" style={{ borderColor: COLORS.border }}>
                {list.map(e => (
                  <div key={e.id} className="flex items-center justify-between gap-2 px-4 py-2.5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <button onClick={() => e.value !== null && e.value !== undefined && setSelected(e.title)}
                      className="min-w-0 flex-1 text-left">
                      <div className="text-sm truncate" style={{ color: COLORS.text }}>{e.title}</div>
                      {e.notes && <div className="text-[11px] mt-0.5" style={{ color: COLORS.textMute }}>{e.notes}</div>}
                    </button>
                    <div className="flex items-center gap-2 shrink-0">
                      {e.value !== null && e.value !== undefined && (
                        <span className="text-sm font-bold" style={{ fontFamily: FONTS.mono, color: COLORS.grayWhite }}>
                          {e.value}{e.unit ? ` ${e.unit}` : ''}
                        </span>
                      )}
                      <button onClick={() => { setEditingEntry(e); setMode(null); }}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                        Edit
                      </button>
                      <DeleteButton onConfirm={() => onDeleteEntry(e.id)} />
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}


function ContactPicker({ value, phone, email, contacts, onPick }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const supported = typeof navigator !== 'undefined' && 'contacts' in navigator && 'ContactsManager' in window;

  async function pickFromPhone() {
    try {
      const picked = await navigator.contacts.select(['name', 'tel', 'email'], { multiple: false });
      if (picked && picked[0]) {
        const c = picked[0];
        onPick({ name: (c.name && c.name[0]) || '', phone: (c.tel && c.tel[0]) || '', email: (c.email && c.email[0]) || '' });
      }
    } catch (e) {
      setManual(true);
    }
  }

  const filtered = contacts.filter(c =>
    !query || c.name.toLowerCase().includes(query.toLowerCase())
    || (c.phone || '').includes(query) || (c.email || '').toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Person (optional)</div>
      {value ? (
        <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: INPUT_BG, border: `1px solid ${COLORS.border}` }}>
          <div className="min-w-0">
            <div className="text-sm truncate" style={{ color: COLORS.grayWhite }}>{value}</div>
            {(phone || email) && <div className="text-[10px] truncate" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>{[phone, email].filter(Boolean).join(' · ')}</div>}
          </div>
          <button onClick={() => onPick({ name: '', phone: '' })} className="text-[10px] font-semibold px-2 py-1 rounded-full shrink-0" style={{ color: COLORS.textMute }}>Clear</button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            {supported && (
              <button onClick={pickFromPhone} className="flex-1 rounded-lg py-2 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                From contacts
              </button>
            )}
            <button onClick={() => setOpen(o => !o)} className="flex-1 rounded-lg py-2 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.text }}>
              {contacts.length ? `Recent (${contacts.length})` : 'Enter manually'}
            </button>
          </div>
          {!supported && (
            <div className="text-[10px] mt-1" style={{ color: COLORS.textMute }}>
              Your phone's contact picker isn't available in this browser — enter a name and number and it'll be saved for next time.
            </div>
          )}
          {(open || manual || !supported) && (
            <div className="mt-2 space-y-2">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search or type a name"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
              {filtered.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-lg" style={{ border: `1px solid ${COLORS.border}` }}>
                  {filtered.map((c, i) => (
                    <button key={i} onClick={() => { onPick(c); setOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs" style={{ color: COLORS.text, borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                      {c.name}{c.phone ? ` · ${c.phone}` : ''}{c.email ? ` · ${c.email}` : ''}
                    </button>
                  ))}
                </div>
              )}
              {query.trim() && (
                <ManualContactRow name={query} onAdd={(nm, ph, em) => { onPick({ name: nm, phone: ph, email: em }); setOpen(false); setQuery(''); }} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ManualContactRow({ name, onAdd }) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div className="space-y-2">
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (for WhatsApp, incl. country code)"
        inputMode="tel" className="w-full rounded-lg px-3 py-2 text-xs outline-none"
        style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}`, fontFamily: FONTS.mono }} />
      <div className="flex gap-2">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (for calendar invites)"
          inputMode="email" className="flex-1 min-w-0 rounded-lg px-3 py-2 text-xs outline-none"
          style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
        <button onClick={() => onAdd(name.trim(), phone.trim(), email.trim())} className="rounded-lg px-3 text-xs font-semibold shrink-0"
          style={{ backgroundColor: COLORS.success, color: '#06231A' }}>Use</button>
      </div>
    </div>
  );
}

function LocationField({ value, onChange }) {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  function useCurrentLocation() {
    if (!navigator.geolocation) { setGeoError('Location isn\u2019t available in this browser.'); return; }
    setLocating(true); setGeoError('');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        onChange(`https://www.google.com/maps/search/?api=1&query=${latitude.toFixed(6)},${longitude.toFixed(6)}`);
        setLocating(false);
      },
      () => { setGeoError('Couldn\u2019t get your location — you can search Maps or type it instead.'); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Location (optional)</div>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder="Place name, address, or paste a Google Maps link"
        className="w-full rounded-lg px-3 py-2 text-sm outline-none"
        style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
      <div className="flex gap-2 mt-2">
        <a href={mapsSearchUrl(value)} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center rounded-lg py-2 text-[11px] font-semibold"
          style={{ backgroundColor: COLORS.surface2, color: COLORS.lower }}>
          Search on Google Maps
        </a>
        <button onClick={useCurrentLocation} disabled={locating}
          className="flex-1 rounded-lg py-2 text-[11px] font-semibold"
          style={{ backgroundColor: COLORS.surface2, color: locating ? COLORS.textMute : COLORS.text }}>
          {locating ? 'Locating…' : 'Use current location'}
        </button>
      </div>
      {isMapsUrl(value) && (
        <div className="text-[10px] mt-1.5 flex items-center justify-between gap-2">
          <span style={{ color: COLORS.success }}>Google Maps link saved</span>
          <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.lower }}>Preview</a>
        </div>
      )}
      {geoError && <div className="text-[10px] mt-1" style={{ color: COLORS.warn }}>{geoError}</div>}
      {!isMapsUrl(value) && (
        <div className="text-[10px] mt-1" style={{ color: COLORS.textMute }}>
          Search Maps, then use its Share option and paste the link here — it will open directly in Maps from the task and the calendar event.
        </div>
      )}
    </div>
  );
}

function TaskForm({ initial, isEdit, contacts, onSave, onClose, onRememberContact }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [details, setDetails] = useState(initial?.details || '');
  const [targetDate, setTargetDate] = useState(
    initial?.targetDate
      ? (/^\d{4}-\d{2}-\d{2}$/.test(initial.targetDate) ? initial.targetDate : new Date(initial.targetDate).toISOString().slice(0, 10))
      : todayInputValue());
  const [contact, setContact] = useState({ name: initial?.contactName || '', phone: initial?.contactPhone || '', email: initial?.contactEmail || '' });
  const [targetTime, setTargetTime] = useState(initial?.targetTime || '');
  const [durationMin, setDurationMin] = useState(initial?.durationMin || 60);
  const [location, setLocation] = useState(initial?.location || '');
  const [emails, setEmails] = useState(initial?.emails || '');
  const [freq, setFreq] = useState(initial?.repeat?.freq || 'none');
  const [interval, setIntervalVal] = useState(initial?.repeat?.interval || 1);

  const canSave = title.trim() && targetDate;

  function handleSave() {
    if (contact.name) onRememberContact(contact);
    onSave({
      id: isEdit ? initial?.id : undefined,
      title: title.trim(),
      details: details.trim(),
      addedDate: initial?.addedDate || new Date().toISOString(),
      targetDate: new Date(targetDate + 'T09:00:00').toISOString(),
      contactName: contact.name,
      contactPhone: contact.phone,
      contactEmail: contact.email,
      targetTime,
      durationMin: Number(durationMin) || 60,
      location: location.trim(),
      emails: emails.trim(),
      repeat: { freq, interval: Number(interval) || 1 },
      done: initial?.done || false,
    });
    onClose();
  }

  return (
    <div className="rounded-2xl p-4 space-y-3" style={cardStyle()}>
      <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.textMute }}>
        {isEdit ? 'Edit task' : initial ? 'New task from message' : 'New task'}
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Task</div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs doing?"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Details</div>
        <textarea rows={2} value={details} onChange={e => setDetails(e.target.value)} placeholder="Any notes"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
          style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Added</div>
          <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute, fontFamily: FONTS.mono }}>
            {fmtDate(initial?.addedDate || new Date().toISOString())}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Target date</div>
          <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Time (optional)</div>
          <input type="time" value={targetTime} onChange={e => setTargetTime(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Duration</div>
          <div className="relative">
            <select value={durationMin} onChange={e => setDurationMin(Number(e.target.value))}
              disabled={!targetTime}
              className="w-full rounded-lg pl-3 pr-8 py-2 text-sm outline-none appearance-none"
              style={{ backgroundColor: INPUT_BG, color: targetTime ? COLORS.grayWhite : COLORS.textMute, border: `1px solid ${COLORS.border}` }}>
              {[15, 30, 45, 60, 90, 120, 180].map(m => (
                <option key={m} value={m} style={{ backgroundColor: INPUT_BG }}>{m >= 60 ? `${m / 60} hr${m > 60 ? 's' : ''}` : `${m} min`}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" color={COLORS.textMute} />
          </div>
        </div>
      </div>
      {!targetTime && (
        <div className="text-[10px] -mt-1" style={{ color: COLORS.textMute }}>
          Leave time blank for an all-day task. Set a time to create a proper timed calendar event.
        </div>
      )}

      <LocationField value={location} onChange={setLocation} />

      <ContactPicker value={contact.name} phone={contact.phone} email={contact.email} contacts={contacts}
        onPick={c => {
          setContact({ name: c.name || '', phone: c.phone || '', email: c.email || '' });
          if (c.email && !emails.includes(c.email)) {
            setEmails(prev => prev ? `${prev}, ${c.email}` : c.email);
          }
        }} />

      <div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Invite by email (optional)</div>
        <input value={emails} onChange={e => setEmails(e.target.value)} inputMode="email"
          placeholder="name@example.com, other@example.com"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
        {parseEmails(emails).length > 0 && (
          <div className="text-[10px] mt-1" style={{ color: COLORS.success }}>
            {parseEmails(emails).length} guest{parseEmails(emails).length === 1 ? '' : 's'} will be invited — they'll get the invite when you add it to Google Calendar, and it will block time on their calendar once they accept.
          </div>
        )}
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.textMute }}>Repeat</div>
        <div className="relative">
          <select value={freq} onChange={e => setFreq(e.target.value)}
            className="w-full rounded-lg pl-3 pr-8 py-2 text-sm outline-none appearance-none"
            style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }}>
            {REPEAT_FREQS.map(f => <option key={f.key} value={f.key} style={{ backgroundColor: INPUT_BG }}>{f.label}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" color={COLORS.grayWhite} />
        </div>
        {freq !== 'none' && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs" style={{ color: COLORS.textMute }}>Every</span>
            <input type="number" min="1" value={interval} onChange={e => setIntervalVal(e.target.value)}
              className="w-16 rounded-lg px-2 py-1.5 text-sm font-bold outline-none text-center"
              style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}`, fontFamily: FONTS.mono }} />
            <span className="text-xs" style={{ color: COLORS.textMute }}>
              {{ daily: 'day(s)', weekly: 'week(s)', monthly: 'month(s)', yearly: 'year(s)' }[freq]}
            </span>
          </div>
        )}
      </div>

      <div className="text-[10px]" style={{ color: COLORS.textMute }}>
        Once saved you can add this to Google Calendar or download it as a calendar file — both carry reminders for the day before and the morning of the target date.
      </div>

      <div className="flex gap-2.5">
        <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>Cancel</button>
        <button onClick={handleSave} disabled={!canSave} className="flex-1 rounded-xl py-2.5 text-xs font-semibold"
          style={{ backgroundColor: canSave ? COLORS.success : COLORS.surface2, color: canSave ? '#06231A' : COLORS.textMute }}>
          {isEdit ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </div>
  );
}

function PostponeRow({ task, onPostpone, onClose }) {
  const [custom, setCustom] = useState(new Date(task.targetDate).toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  function shift(days) {
    const d = new Date(task.targetDate);
    d.setDate(d.getDate() + days);
    onPostpone(task.id, d.toISOString(), note);
    onClose();
  }
  return (
    <div className="rounded-lg p-2.5 space-y-2" style={{ backgroundColor: COLORS.surface2, border: `1px solid ${COLORS.warn}55` }}>
      <div className="text-[11px] font-semibold" style={{ color: COLORS.warn }}>Postpone to…</div>
      <div className="flex gap-1.5">
        {[['+1 day', 1], ['+3 days', 3], ['+1 week', 7]].map(([l, n]) => (
          <button key={l} onClick={() => shift(n)} className="flex-1 rounded-lg py-1.5 text-[11px] font-semibold"
            style={{ backgroundColor: COLORS.surface, color: COLORS.text }}>{l}</button>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input type="date" value={custom} onChange={e => setCustom(e.target.value)}
          className="flex-1 min-w-0 rounded-lg px-2 py-1.5 text-[11px] outline-none"
          style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
        <button onClick={() => { onPostpone(task.id, new Date(custom + 'T09:00:00').toISOString(), note); onClose(); }}
          className="rounded-lg px-3 text-[11px] font-semibold" style={{ backgroundColor: COLORS.warn, color: '#2A1B00' }}>Set</button>
      </div>
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="Reason (optional)"
        className="w-full rounded-lg px-2 py-1.5 text-[11px] outline-none"
        style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
      <button onClick={onClose} className="w-full text-[11px] font-semibold py-1" style={{ color: COLORS.textMute }}>Cancel</button>
    </div>
  );
}

function CancelRow({ task, onCancel, onClose }) {
  const [reason, setReason] = useState('');
  const ok = reason.trim().length > 0;
  return (
    <div className="rounded-lg p-2.5 space-y-2" style={{ backgroundColor: COLORS.surface2, border: `1px solid #E5484D55` }}>
      <div className="text-[11px] font-semibold" style={{ color: '#E5484D' }}>Why is this being cancelled?</div>
      <input value={reason} onChange={e => setReason(e.target.value)} autoFocus
        placeholder="Reason (required)"
        className="w-full rounded-lg px-2 py-1.5 text-[11px] outline-none"
        style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${ok ? COLORS.border : '#E5484D'}` }} />
      <div className="flex gap-1.5">
        <button onClick={onClose} className="flex-1 rounded-lg py-1.5 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface, color: COLORS.textMute }}>Back</button>
        <button onClick={() => { onCancel(task.id, reason); onClose(); }} disabled={!ok}
          className="flex-1 rounded-lg py-1.5 text-[11px] font-semibold"
          style={{ backgroundColor: ok ? '#E5484D' : COLORS.surface, color: ok ? '#fff' : COLORS.textMute }}>
          Cancel task
        </button>
      </div>
    </div>
  );
}

function TaskCard({ task, onComplete, onUndo, onPostpone, onCancel, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const [mode, setMode] = useState(null); // null | 'postpone' | 'cancel' | 'history'
  const st = taskStatus(task);
  const closed = isClosed(task);
  const diff = daysBetween(new Date(), task.targetDate);
  const overdue = diff < 0 && !closed;
  const dueToday = diff === 0 && !closed;
  const accent = overdue ? '#E5484D' : dueToday ? COLORS.warn : COLORS.border;
  const rl = repeatLabel(task.repeat);
  const guestCount = parseEmails(task.emails).length;
  const meta = statusMeta(st);

  return (
    <div className="rounded-2xl p-3.5" style={{ backgroundColor: COLORS.surface, border: `1px solid ${accent}` }}>
      <div className="flex items-start gap-3">
        <button onClick={() => closed ? onUndo(task.id) : onComplete(task.id)}
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{
            backgroundColor: st === 'done' ? COLORS.success : 'transparent',
            border: `1.5px solid ${st === 'done' ? COLORS.success : st === 'cancelled' ? '#E5484D' : COLORS.border}`,
          }}>
          {st === 'done' && <Check size={13} strokeWidth={3} color="#06231A" />}
          {st === 'cancelled' && <X size={12} strokeWidth={3} color="#E5484D" />}
        </button>
        <button onClick={() => setShowActions(v => !v)} className="flex-1 min-w-0 text-left">
          <div className="text-sm font-semibold" style={{ color: closed ? COLORS.textMute : COLORS.text, textDecoration: closed ? 'line-through' : 'none' }}>
            {task.title}
          </div>
          <div className="text-[11px] mt-0.5 flex flex-wrap gap-x-2" style={{ color: COLORS.textMute }}>
            <span style={{ color: overdue ? '#E5484D' : dueToday ? COLORS.warn : COLORS.textMute }}>
              {fmtDate(task.targetDate)}{taskHasTime(task) ? ` · ${fmtTimeLabel(task)}` : ''}
            </span>
            {rl && <span>· {rl}</span>}
            {task.contactName && <span>· {task.contactName}</span>}
            {st !== 'open' && <span style={{ color: meta.color }}>· {meta.label}</span>}
            {task.postponeCount > 0 && <span style={{ color: COLORS.warn }}>· postponed {task.postponeCount}×</span>}
          </div>
          {task.location && (
            <div className="text-[11px] mt-0.5 truncate" style={{ color: COLORS.textMute }}>
              📍 {isMapsUrl(task.location) ? 'Google Maps location' : task.location}
            </div>
          )}
          {st === 'cancelled' && task.cancelReason && (
            <div className="text-[11px] mt-0.5" style={{ color: '#E5484D' }}>Reason: {task.cancelReason}</div>
          )}
          {guestCount > 0 && (
            <div className="text-[11px] mt-0.5" style={{ color: COLORS.lower }}>
              {guestCount} guest{guestCount === 1 ? '' : 's'} invited
            </div>
          )}
          {task.details && <div className="text-[11px] mt-1" style={{ color: COLORS.textMute }}>{task.details}</div>}
        </button>
      </div>

      {showActions && (
        <div className="mt-3 pt-3 space-y-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          {mode === 'postpone' ? (
            <PostponeRow task={task} onPostpone={onPostpone} onClose={() => setMode(null)} />
          ) : mode === 'cancel' ? (
            <CancelRow task={task} onCancel={onCancel} onClose={() => setMode(null)} />
          ) : mode === 'history' ? (
            <div className="rounded-lg p-2.5 space-y-1.5" style={{ backgroundColor: COLORS.surface2 }}>
              <div className="text-[11px] font-semibold" style={{ color: COLORS.textMute }}>History</div>
              {(task.history || []).length === 0 ? (
                <div className="text-[11px]" style={{ color: COLORS.textMute }}>Nothing recorded yet.</div>
              ) : [...(task.history || [])].reverse().map((h, i) => (
                <div key={i} className="text-[11px]" style={{ color: COLORS.textMute }}>
                  <span style={{ color: statusMeta(h.action === 'reopened' ? 'open' : h.action).color }}>
                    {h.action === 'reopened' ? 'Reopened' : statusMeta(h.action).label}
                  </span>
                  {' · '}{fmtDate(h.at)}{h.note ? ` · ${h.note}` : ''}
                </div>
              ))}
              <button onClick={() => setMode(null)} className="text-[11px] font-semibold pt-1" style={{ color: COLORS.textMute }}>Close</button>
            </div>
          ) : (
            <>
              {!closed && (
                <div className="flex gap-2">
                  <button onClick={() => onComplete(task.id)} className="flex-1 rounded-lg py-2 text-[11px] font-semibold"
                    style={{ backgroundColor: COLORS.success, color: '#06231A' }}>Complete</button>
                  <button onClick={() => setMode('postpone')} className="flex-1 rounded-lg py-2 text-[11px] font-semibold"
                    style={{ backgroundColor: COLORS.surface2, color: COLORS.warn }}>Postpone</button>
                  <button onClick={() => setMode('cancel')} className="flex-1 rounded-lg py-2 text-[11px] font-semibold"
                    style={{ backgroundColor: COLORS.surface2, color: '#E5484D' }}>Cancel</button>
                </div>
              )}
              {closed && (
                <button onClick={() => onUndo(task.id)} className="w-full rounded-lg py-2 text-[11px] font-semibold flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: COLORS.surface2, color: COLORS.lower }}>
                  <RotateCcw size={13} /> Undo — reopen this task
                </button>
              )}
              <div className="flex gap-2">
                <a href={googleCalendarUrl(task)} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.lower }}>
                  Google Calendar
                </a>
                <button onClick={() => downloadIcs(task)} className="flex-1 rounded-lg py-2 text-[11px] font-semibold"
                  style={{ backgroundColor: COLORS.surface2, color: COLORS.text }}>
                  Calendar file (.ics)
                </button>
              </div>
              {task.location && (
                <a href={locationMapUrl(task.location)} target="_blank" rel="noopener noreferrer"
                  className="block text-center rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.lower }}>
                  Open in Google Maps
                </a>
              )}
              {guestCount > 0 && (
                <a href={mailtoInviteUrl(task)}
                  className="block text-center rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                  Email the {guestCount} guest{guestCount === 1 ? '' : 's'}
                </a>
              )}
              {task.contactPhone ? (
                <a href={whatsappUrl(task.contactPhone, defaultWhatsappText(task))} target="_blank" rel="noopener noreferrer"
                  className="block text-center rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: '#25D36622', color: '#25D366' }}>
                  WhatsApp {task.contactName || 'contact'}
                </a>
              ) : task.contactName ? (
                <div className="text-[10px] text-center py-1" style={{ color: COLORS.textMute }}>
                  Add a phone number to {task.contactName} to enable WhatsApp
                </div>
              ) : null}
              <div className="flex gap-2">
                <button onClick={() => setMode('history')} className="flex-1 rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>
                  History ({(task.history || []).length})
                </button>
                <button onClick={() => onEdit(task)} className="flex-1 rounded-lg py-2 text-[11px] font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.upper }}>
                  Edit
                </button>
                <div className="flex-1 flex justify-center items-center">
                  <DeleteButton onConfirm={() => onDelete(task.id)} />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, value, active, color, onClick }) {
  return (
    <button onClick={onClick} className="rounded-2xl p-3 flex flex-col gap-1 text-left"
      style={{
        backgroundColor: active ? color + '20' : COLORS.surface,
        border: `1px solid ${active ? color : COLORS.border}`,
      }}>
      <div className="text-xl font-bold" style={{ fontFamily: FONTS.mono, color: active ? color : COLORS.text }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: active ? color : COLORS.textMute }}>{label}</div>
    </button>
  );
}

function ShareIntakeBox({ onDraft, onClose }) {
  const [text, setText] = useState('');
  return (
    <div className="rounded-2xl p-4 space-y-2.5" style={cardStyle()}>
      <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.textMute }}>Create from a message</div>
      <div className="text-[11px]" style={{ color: COLORS.textMute }}>
        Paste a WhatsApp (or any) message here and it will pull out the task, sender, date and time for you to confirm.
      </div>
      <textarea rows={4} value={text} onChange={e => setText(e.target.value)}
        placeholder={'[12/09/2026, 14:32] Dr Rao: Please come for review on 15/09 at 3:30 pm'}
        className="w-full rounded-lg px-3 py-2 text-xs outline-none resize-none"
        style={{ backgroundColor: INPUT_BG, color: COLORS.grayWhite, border: `1px solid ${COLORS.border}` }} />
      <div className="flex gap-2.5">
        <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.textMute }}>Cancel</button>
        <button onClick={() => { const d = parseSharedMessage(text); if (d) onDraft(d); }} disabled={!text.trim()}
          className="flex-1 rounded-xl py-2.5 text-xs font-semibold"
          style={{ backgroundColor: text.trim() ? COLORS.success : COLORS.surface2, color: text.trim() ? '#06231A' : COLORS.textMute }}>
          Build task
        </button>
      </div>
      <div className="text-[10px]" style={{ color: COLORS.textMute }}>
        You can also share straight from WhatsApp: long-press a message → Share → Training Tracker. That works once the app is installed to your home screen.
      </div>
    </div>
  );
}

function NotificationSettings({ prefs, onSave }) {
  const [perm, setPerm] = useState(notifyPermission());
  const [open, setOpen] = useState(false);

  const [testResult, setTestResult] = useState('');

  async function enable() {
    const r = await requestNotifyPermission();
    setPerm(r);
    if (r === 'granted') {
      onSave({ ...prefs, enabled: true });
      // Give the worker a moment to register before the first notification
      setTimeout(() => {
        const ok = showNotification('Reminders on', 'You\u2019ll get a morning summary and a nudge an hour before timed tasks.', 'test');
        setTestResult(ok ? '' : 'could-not-show');
      }, 400);
    }
  }

  function sendTest() {
    const ok = showNotification('Test reminder', 'If you can see this, reminders are working.', 'test');
    setTestResult(ok ? 'sent' : 'could-not-show');
  }

  const unsupported = perm === 'unsupported';
  const blocked = perm === 'denied';
  const active = prefs.enabled && perm === 'granted';

  return (
    <Card>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? COLORS.success : COLORS.textMute }} />
          <SectionLabel>Reminders {active ? '· on' : '· off'}</SectionLabel>
        </div>
        {open ? <ChevronUp size={15} color={COLORS.textMute} /> : <ChevronDown size={15} color={COLORS.textMute} />}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {unsupported ? (
            <div className="text-[11px]" style={{ color: COLORS.warn }}>
              This browser doesn\u2019t support notifications. Use the calendar buttons on each task instead.
            </div>
          ) : blocked ? (
            <div className="text-[11px]" style={{ color: COLORS.warn }}>
              Notifications are blocked for this site. Enable them in your browser\u2019s site settings, then reopen this panel.
            </div>
          ) : !active ? (
            <>
              <div className="text-[11px]" style={{ color: COLORS.textMute }}>
                Turn on a daily summary at {prefs.summaryHour ?? 8}:00 and an alert one hour before any timed task.
              </div>
              <ActionButton tone="success" className="w-full" onClick={enable}>Turn on reminders</ActionButton>
            </>
          ) : (
            <>
              {[
                { key: 'morningSummary', label: `Daily summary at ${prefs.summaryHour ?? 8}:00`, sub: 'Overdue and due-today tasks' },
                { key: 'hourBefore', label: 'One hour before a task', sub: 'Only for tasks that have a time set' },
              ].map(row => (
                <button key={row.key} onClick={() => onSave({ ...prefs, [row.key]: !prefs[row.key] })}
                  className="w-full flex items-center justify-between gap-3 text-left">
                  <div className="min-w-0">
                    <div className="text-xs" style={{ color: COLORS.text }}>{row.label}</div>
                    <div className="text-[10px]" style={{ color: COLORS.textMute }}>{row.sub}</div>
                  </div>
                  <span className="w-9 h-5 rounded-full shrink-0 flex items-center px-0.5"
                    style={{ backgroundColor: prefs[row.key] ? COLORS.success : COLORS.surface2, justifyContent: prefs[row.key] ? 'flex-end' : 'flex-start' }}>
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: prefs[row.key] ? '#06231A' : COLORS.textMute }} />
                  </span>
                </button>
              ))}

              <div>
                <FieldLabel>Summary time</FieldLabel>
                <SelectInput value={String(prefs.summaryHour ?? 8)} onChange={v => onSave({ ...prefs, summaryHour: Number(v) })}>
                  {[5, 6, 7, 8, 9, 10].map(h => (
                    <option key={h} value={h} style={{ backgroundColor: INPUT_BG }}>{String(h).padStart(2, '0')}:00</option>
                  ))}
                </SelectInput>
              </div>

              <ActionButton tone="muted" className="w-full" onClick={() => onSave({ ...prefs, enabled: false })}>
                Turn off reminders
              </ActionButton>
            </>
          )}

          {active && (
            <>
              <ActionButton tone="neutral" className="w-full" onClick={sendTest}>Send a test notification</ActionButton>
              {testResult === 'sent' && (
                <div className="text-[10px]" style={{ color: COLORS.success }}>
                  Sent. If nothing appeared, check that notifications are allowed for this site in your browser and system settings.
                </div>
              )}
              {testResult === 'could-not-show' && (
                <div className="text-[10px]" style={{ color: COLORS.warn }}>
                  Couldn't show a notification. On Android this needs the app served over HTTPS (GitHub Pages is fine) and installed to your home screen — reminders don't work when it's opened as a plain tab from a local file.
                </div>
              )}
            </>
          )}

          <a href={morningSummaryCalendarUrl(prefs.summaryHour ?? 8)} target="_blank" rel="noopener noreferrer"
            className="block text-center rounded-xl py-2.5 text-xs font-semibold" style={{ backgroundColor: COLORS.surface2, color: COLORS.lower }}>
            Add a daily {String(prefs.summaryHour ?? 8).padStart(2, '0')}:00 reminder to Google Calendar
          </a>

          <div className="text-[10px] leading-relaxed" style={{ color: COLORS.textMute }}>
            In-app reminders only fire while the app is running, and catch up when you next open it — a web app can\u2019t wake itself in the background. For alerts that always arrive, use the calendar button above and the calendar options on each task; those carry an alarm a day before and an hour before.
          </div>
        </div>
      )}
    </Card>
  );
}

function PlannerScreen({ tasks, contacts, onSaveTask, onDeleteTask, onCompleteTask, onUndoTask,
  onPostponeTask, onCancelTask, onRememberContact, sharedDraft, onClearShared,
  notifyPrefs, onSaveNotifyPrefs }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [filter, setFilter] = useState('open'); // open | overdue | today | done | postponed | cancelled | all
  const [person, setPerson] = useState('');

  useEffect(() => {
    if (sharedDraft) { setDraft(sharedDraft); setFormOpen(true); onClearShared(); }
  }, [sharedDraft]);

  const withStatus = tasks.map(t => ({ ...t, _st: taskStatus(t) }));
  const openList = withStatus.filter(t => !isClosed(t));
  const overdue = openList.filter(t => daysBetween(new Date(), t.targetDate) < 0);
  const dueToday = openList.filter(t => daysBetween(new Date(), t.targetDate) === 0);

  const people = Array.from(new Set(tasks.map(t => t.contactName).filter(Boolean))).sort();

  let visible;
  if (filter === 'overdue') visible = overdue;
  else if (filter === 'today') visible = dueToday;
  else if (filter === 'open') visible = openList;
  else if (filter === 'all') visible = withStatus;
  else visible = withStatus.filter(t => t._st === filter);
  if (person) visible = visible.filter(t => t.contactName === person);

  const personCounts = person ? {
    open: withStatus.filter(t => t.contactName === person && !isClosed(t) && t._st !== 'postponed').length,
    overdue: withStatus.filter(t => t.contactName === person && !isClosed(t) && daysBetween(new Date(), t.targetDate) < 0).length,
    postponed: withStatus.filter(t => t.contactName === person && t._st === 'postponed').length,
    done: withStatus.filter(t => t.contactName === person && t._st === 'done').length,
    cancelled: withStatus.filter(t => t.contactName === person && t._st === 'cancelled').length,
  } : null;

  // group only the "live" views by due date; closed views read better as a flat recent-first list
  const grouped = ['open', 'overdue', 'today'].includes(filter);
  const groups = {};
  if (grouped) {
    visible.forEach(t => {
      const label = dueGroupLabel(t.targetDate);
      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    });
    Object.keys(groups).forEach(l => groups[l].sort((a, b) => {
      const d = dateOnly(a.targetDate) - dateOnly(b.targetDate);
      if (d !== 0) return d;
      const at = taskHasTime(a), bt = taskHasTime(b);
      if (at && bt) return taskStart(a) - taskStart(b);
      if (at) return -1;
      if (bt) return 1;
      return 0;
    }));
  }
  const orderedLabels = Object.keys(groups).sort((a, b) => {
    const r = dueGroupRank(a) - dueGroupRank(b);
    return r !== 0 ? r : a.localeCompare(b);
  });
  const flat = [...visible].sort((a, b) => new Date(b.targetDate) - new Date(a.targetDate));

  const cardProps = {
    onComplete: onCompleteTask, onUndo: onUndoTask, onPostpone: onPostponeTask,
    onCancel: onCancelTask, onEdit: setEditing, onDelete: onDeleteTask,
  };

  return (
    <div className="mt-4 space-y-4">
      <NotificationSettings prefs={notifyPrefs} onSave={onSaveNotifyPrefs} />

      <div className="grid grid-cols-3 gap-2.5">
        <FilterChip label="Overdue" value={overdue.length} color="#E5484D"
          active={filter === 'overdue'} onClick={() => setFilter(filter === 'overdue' ? 'open' : 'overdue')} />
        <FilterChip label="Due today" value={dueToday.length} color={COLORS.warn}
          active={filter === 'today'} onClick={() => setFilter(filter === 'today' ? 'open' : 'today')} />
        <FilterChip label="Open" value={openList.length} color={COLORS.lower}
          active={filter === 'open'} onClick={() => setFilter('open')} />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {[['open', 'Open'], ['postponed', 'Postponed'], ['done', 'Completed'], ['cancelled', 'Cancelled'], ['all', 'All']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold shrink-0"
            style={{ backgroundColor: filter === k ? COLORS.surface2 : 'transparent', color: filter === k ? COLORS.text : COLORS.textMute, border: `1px solid ${filter === k ? COLORS.border : 'transparent'}` }}>
            {l}
          </button>
        ))}
      </div>

      {people.length > 0 && (
        <div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button onClick={() => setPerson('')}
              className="rounded-full px-3 py-1.5 text-[11px] font-semibold shrink-0"
              style={{ backgroundColor: !person ? COLORS.upper + '25' : 'transparent', color: !person ? COLORS.upper : COLORS.textMute, border: `1px solid ${!person ? COLORS.upper + '55' : COLORS.border}` }}>
              Everyone
            </button>
            {people.map(nm => (
              <button key={nm} onClick={() => setPerson(person === nm ? '' : nm)}
                className="rounded-full px-3 py-1.5 text-[11px] font-semibold shrink-0"
                style={{ backgroundColor: person === nm ? COLORS.upper + '25' : 'transparent', color: person === nm ? COLORS.upper : COLORS.textMute, border: `1px solid ${person === nm ? COLORS.upper + '55' : COLORS.border}` }}>
                {nm}
              </button>
            ))}
          </div>
          {personCounts && (
            <div className="rounded-xl p-3 mt-2 flex flex-wrap gap-x-4 gap-y-1" style={cardStyle()}>
              <span className="text-[11px] font-semibold" style={{ color: COLORS.text }}>{person}:</span>
              <span className="text-[11px]" style={{ color: '#E5484D' }}>{personCounts.overdue} overdue</span>
              <span className="text-[11px]" style={{ color: COLORS.lower }}>{personCounts.open} open</span>
              <span className="text-[11px]" style={{ color: COLORS.warn }}>{personCounts.postponed} postponed</span>
              <span className="text-[11px]" style={{ color: COLORS.success }}>{personCounts.done} completed</span>
              <span className="text-[11px]" style={{ color: COLORS.textMute }}>{personCounts.cancelled} cancelled</span>
            </div>
          )}
        </div>
      )}

      {formOpen || editing ? (
        <TaskForm
          key={editing ? editing.id : draft ? 'draft' : 'new'}
          initial={editing || draft}
          isEdit={!!editing}
          contacts={contacts}
          onSave={onSaveTask}
          onRememberContact={onRememberContact}
          onClose={() => { setFormOpen(false); setEditing(null); setDraft(null); }}
        />
      ) : intakeOpen ? (
        <ShareIntakeBox onDraft={d => { setDraft(d); setIntakeOpen(false); setFormOpen(true); }} onClose={() => setIntakeOpen(false)} />
      ) : (
        <div className="flex gap-2.5">
          <button onClick={() => setFormOpen(true)} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold"
            style={{ backgroundColor: COLORS.upper, color: '#1A0D06' }}>
            + New task
          </button>
          <button onClick={() => setIntakeOpen(true)} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold"
            style={{ backgroundColor: '#25D36622', color: '#25D366' }}>
            From a message
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={cardStyle()}>
          <ClipboardList className="mx-auto mb-2" size={24} color={COLORS.textMute} />
          <div className="text-sm" style={{ color: COLORS.textMute }}>
            {person ? `Nothing here for ${person}.` : 'Nothing in this view.'}
          </div>
        </div>
      ) : grouped ? (
        <div className="space-y-5">
          {orderedLabels.map(label => (
            <div key={label} className="space-y-2">
              <div className="flex items-baseline justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: label.startsWith('Overdue') ? '#E5484D' : label === 'Today' ? COLORS.warn : COLORS.textMute }}>
                  {label}
                </span>
                <span className="text-[10px]" style={{ color: COLORS.textMute, fontFamily: FONTS.mono }}>{groups[label].length}</span>
              </div>
              {groups[label].map(t => <TaskCard key={t.id} task={t} {...cardProps} />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {flat.map(t => <TaskCard key={t.id} task={t} {...cardProps} />)}
        </div>
      )}

      <div className="rounded-2xl p-3.5" style={{ backgroundColor: COLORS.surface2, border: `1px solid ${COLORS.border}` }}>
        <div className="text-[11px] leading-relaxed" style={{ color: COLORS.textMute }}>
          Completed and cancelled tasks are kept for two years, so you can look back at what happened and when. Tap any task for its full history. For reminders that actually reach you, add the task to Google Calendar or import the .ics — a web app can't wake itself in the background.
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, small }) {
  return (
    <div className="rounded-2xl p-3 flex flex-col gap-1.5" style={cardStyle()}>
      {icon}
      <div className={small ? 'text-sm font-bold' : 'text-xl font-bold'} style={{ fontFamily: FONTS.mono }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: COLORS.textMute }}>{label}</div>
    </div>
  );
}
