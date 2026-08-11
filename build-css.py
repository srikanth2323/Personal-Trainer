"""Generate a minimal static stylesheet for exactly the Tailwind utilities the
app uses, so the built app has no runtime dependency on the Tailwind CDN."""
import re, sys

def rem(n):
    return f"{n/4}rem"

FRACTIONS = {'1/2': '50%', '1/3': '33.333333%', '2/3': '66.666667%', '1/4': '25%', '3/4': '75%', 'full': '100%'}

def spacing(v):
    if v == 'px': return '1px'
    if v == 'full': return '100%'
    if v == 'auto': return 'auto'
    if v in FRACTIONS: return FRACTIONS[v]
    if v == 'screen': return '100vh'
    try: return rem(float(v))
    except ValueError: return None

TEXT_SIZES = {
    'xs': ('0.75rem', '1rem'), 'sm': ('0.875rem', '1.25rem'), 'base': ('1rem', '1.5rem'),
    'lg': ('1.125rem', '1.75rem'), 'xl': ('1.25rem', '1.75rem'), '2xl': ('1.5rem', '2rem'),
    '3xl': ('1.875rem', '2.25rem'),
}
RADII = {'none':'0','sm':'0.125rem','':'0.25rem','md':'0.375rem','lg':'0.5rem','xl':'0.75rem','2xl':'1rem','3xl':'1.5rem','full':'9999px'}
WEIGHTS = {'thin':'100','light':'300','normal':'400','medium':'500','semibold':'600','bold':'700','extrabold':'800'}
TRACKING = {'tighter':'-0.05em','tight':'-0.025em','normal':'0','wide':'0.025em','wider':'0.05em','widest':'0.1em'}
LEADING = {'none':'1','tight':'1.25','snug':'1.375','normal':'1.5','relaxed':'1.625','loose':'2'}

def esc(cls):
    return re.sub(r'([:.\/\[\]%])', r'\\\1', cls)

def rules_for(c):
    """Return the CSS body for one utility class, or None if unsupported."""
    # arbitrary values e.g. text-[10px], text-[9px]
    m = re.fullmatch(r'text-\[(\d+(?:\.\d+)?)(px|rem)\]', c)
    if m: return f"font-size:{m.group(1)}{m.group(2)}"
    m = re.fullmatch(r'max-h-\[(\d+)(px|rem)\]', c)
    if m: return f"max-height:{m.group(1)}{m.group(2)}"

    simple = {
        'block':'display:block','flex':'display:flex','grid':'display:grid','hidden':'display:none',
        'inline-flex':'display:inline-flex','relative':'position:relative','absolute':'position:absolute',
        'sticky':'position:sticky','flex-col':'flex-direction:column','flex-wrap':'flex-wrap:wrap',
        'flex-1':'flex:1 1 0%','shrink-0':'flex-shrink:0','items-center':'align-items:center',
        'items-start':'align-items:flex-start','items-baseline':'align-items:baseline',
        'justify-center':'justify-content:center','justify-between':'justify-content:space-between',
        'justify-end':'justify-content:flex-end','text-center':'text-align:center','text-left':'text-align:left',
        'text-right':'text-align:right','uppercase':'text-transform:uppercase','capitalize':'text-transform:capitalize',
        'italic':'font-style:italic','truncate':'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
        'appearance-none':'-webkit-appearance:none;appearance:none','outline-none':'outline:2px solid transparent;outline-offset:2px',
        'overflow-hidden':'overflow:hidden','overflow-y-auto':'overflow-y:auto','overflow-x-auto':'overflow-x:auto',
        'pointer-events-none':'pointer-events:none','resize-none':'resize:none','tabular-nums':'font-variant-numeric:tabular-nums',
        'mx-auto':'margin-left:auto;margin-right:auto','w-full':'width:100%','h-full':'height:100%',
        'min-w-0':'min-width:0','min-h-screen':'min-height:100vh','-rotate-90':'transform:rotate(-90deg)',
        '-translate-y-1/2':'transform:translateY(-50%)','animate-spin':'animation:spin 1s linear infinite',
        'divide-y':'', 'sr-only':'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)',
        'active:opacity-80':'', 'cursor-pointer':'cursor:pointer',
        'transition-all':'transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms',
    }
    if c in simple: return simple[c]

    m = re.fullmatch(r'(w|h)-(.+)', c)
    if m:
        v = spacing(m.group(2))
        if v: return f"{'width' if m.group(1)=='w' else 'height'}:{v}"
    m = re.fullmatch(r'max-w-(.+)', c)
    if m:
        widths = {'lg':'32rem','md':'28rem','sm':'24rem','xl':'36rem','full':'100%'}
        if m.group(2 if False else 1) in widths: return f"max-width:{widths[m.group(1)]}"
    m = re.fullmatch(r'max-h-(\d+)', c)
    if m: return f"max-height:{rem(float(m.group(1)))}"

    for pre, prop in [('p','padding'),('px',None),('py',None),('pt','padding-top'),('pb','padding-bottom'),
                      ('pl','padding-left'),('pr','padding-right'),
                      ('m','margin'),('mt','margin-top'),('mb','margin-bottom'),('ml','margin-left'),('mr','margin-right')]:
        m = re.fullmatch(rf'-?{pre}-(.+)', c)
        if m:
            neg = c.startswith('-')
            v = spacing(m.group(1))
            if not v: continue
            if neg: v = '-' + v
            if pre == 'px': return f"padding-left:{v};padding-right:{v}"
            if pre == 'py': return f"padding-top:{v};padding-bottom:{v}"
            return f"{prop}:{v}"

    m = re.fullmatch(r'gap-(.+)', c)
    if m and spacing(m.group(1)): return f"gap:{spacing(m.group(1))}"
    m = re.fullmatch(r'gap-x-(.+)', c)
    if m and spacing(m.group(1)): return f"column-gap:{spacing(m.group(1))}"
    m = re.fullmatch(r'gap-y-(.+)', c)
    if m and spacing(m.group(1)): return f"row-gap:{spacing(m.group(1))}"

    m = re.fullmatch(r'grid-cols-(\d+)', c)
    if m: return f"grid-template-columns:repeat({m.group(1)},minmax(0,1fr))"

    m = re.fullmatch(r'text-(.+)', c)
    if m and m.group(1) in TEXT_SIZES:
        fs, lh = TEXT_SIZES[m.group(1)]
        return f"font-size:{fs};line-height:{lh}"

    m = re.fullmatch(r'font-(.+)', c)
    if m and m.group(1) in WEIGHTS: return f"font-weight:{WEIGHTS[m.group(1)]}"

    m = re.fullmatch(r'tracking-(.+)', c)
    if m and m.group(1) in TRACKING: return f"letter-spacing:{TRACKING[m.group(1)]}"

    m = re.fullmatch(r'leading-(.+)', c)
    if m and m.group(1) in LEADING: return f"line-height:{LEADING[m.group(1)]}"

    m = re.fullmatch(r'rounded(?:-(.+))?', c)
    if m:
        key = m.group(1) or ''
        if key in RADII: return f"border-radius:{RADII[key]}"

    m = re.fullmatch(r'(top|right|bottom|left)-(.+)', c)
    if m and spacing(m.group(2)): return f"{m.group(1)}:{spacing(m.group(2))}"
    if c == 'top-1/2': return 'top:50%'
    if c == 'top-0': return 'top:0'
    if c == 'left-0': return 'left:0'

    m = re.fullmatch(r'z-(\d+)', c)
    if m: return f"z-index:{m.group(1)}"

    m = re.fullmatch(r'opacity-(\d+)', c)
    if m: return f"opacity:{int(m.group(1))/100}"

    return None

classes = [l.strip() for l in open('/tmp/classes.txt') if l.strip()]
out, missing = [], []
for c in sorted(classes):
    body = rules_for(c)
    if body is None:
        missing.append(c)
    elif body:
        out.append(f".{esc(c)}{{{body}}}")

# space-y-* / space-x-* need child selectors
extra = []
for c in classes:
    m = re.fullmatch(r'space-y-(.+)', c)
    if m and spacing(m.group(1)):
        extra.append(f".{esc(c)}>:not([hidden])~:not([hidden]){{margin-top:{spacing(m.group(1))}}}")
    m = re.fullmatch(r'space-x-(.+)', c)
    if m and spacing(m.group(1)):
        extra.append(f".{esc(c)}>:not([hidden])~:not([hidden]){{margin-left:{spacing(m.group(1))}}}")
    if c == 'divide-y':
        extra.append(".divide-y>:not([hidden])~:not([hidden]){border-top-width:1px;border-style:solid}")
    if c == 'active:opacity-80':
        extra.append(".active\\:opacity-80:active{opacity:0.8}")

css = "\n".join(out + extra)
open('/tmp/app-utilities.css','w').write(css)
print('generated rules:', len(out)+len(extra))
print('unsupported (need manual check):', missing)
