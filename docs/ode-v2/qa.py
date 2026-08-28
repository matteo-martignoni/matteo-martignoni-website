#!/usr/bin/env python3
"""QA del sito di test /OdE-v2. Esegue le verifiche della Fase 6 sul build."""
import re, sys, pathlib, subprocess, html as htmlmod

ROOT = pathlib.Path('.')
DIST = ROOT / 'dist'
V2 = DIST / 'OdE-v2'
fails, warns = [], []

def ok(msg): print(f'  OK   {msg}')
def bad(msg): fails.append(msg); print(f'  FAIL {msg}')
def warn(msg): warns.append(msg); print(f'  WARN {msg}')

pages = sorted(V2.rglob('index.html'))
print(f'\n=== 0. Pagine generate: {len(pages)} ===')
for p in pages: print('  ', p.relative_to(DIST))

# 1. Isolamento: nessun file del sito originale modificato
print('\n=== 1. Isolamento: file toccati rispetto a main ===')
diff = subprocess.run(['git','diff','--name-only','main'], capture_output=True, text=True).stdout.split()
untracked = subprocess.run(['git','ls-files','--others','--exclude-standard'], capture_output=True, text=True).stdout.split()
touched = sorted(set(diff) | set(untracked))
PROTECTED = ('src/pages/OdE/', 'src/layouts/OdeLayout.astro', 'src/styles/ode-theme.css',
             'src/i18n/ode.ts', 'src/components/ode/', 'src/lib/ode/', 'astro.config.mjs',
             'src/components/Header.astro', 'src/components/Navigation.astro',
             'src/layouts/BaseLayout.astro')
viol = [f for f in touched if f.startswith(PROTECTED)]
for f in touched: print('  ', f)
if viol: bad(f'file protetti modificati: {viol}')
else: ok('nessun file del sito originale, del layout host o della config e toccato')

# 2. noindex su ogni pagina
print('\n=== 2. noindex, nofollow ===')
missing = [str(p.relative_to(DIST)) for p in pages
           if not re.search(r'<meta name="robots" content="noindex, ?nofollow"', p.read_text(encoding='utf-8'))]
if missing: bad(f'noindex mancante su: {missing}')
else: ok(f'presente su tutte le {len(pages)} pagine')

# 3. Nessun link in ingresso verso /OdE-v2 dal sito ospitante o da /OdE
print('\n=== 3. Nessun link in ingresso ===')
inbound = []
for p in DIST.rglob('*.html'):
    rel = str(p.relative_to(DIST))
    if rel.startswith('OdE-v2/'): continue
    if 'OdE-v2' in p.read_text(encoding='utf-8'): inbound.append(rel)
if inbound: bad(f'link o menzioni verso /OdE-v2 in: {inbound}')
else: ok('nessuna pagina del sito ospitante o di /OdE menziona /OdE-v2')

# 4. Nessun link in uscita da /OdE-v2 verso /OdE
print('\n=== 4. Nessun link in uscita verso /OdE ===')
outbound = []
for p in pages:
    for m in re.finditer(r'href="(/OdE(?!-v2)[^"]*)"', p.read_text(encoding='utf-8')):
        outbound.append((str(p.relative_to(DIST)), m.group(1)))
if outbound: bad(f'link verso il sito originale: {outbound}')
else: ok('nessuna pagina di /OdE-v2 linka /OdE')

# 5. Sitemap
print('\n=== 5. Esclusione dal sitemap ===')
sm = list(DIST.glob('sitemap*.xml'))
hits = [str(f) for f in sm if 'OdE' in f.read_text(encoding='utf-8')]
if hits: bad(f'/OdE o /OdE-v2 presenti nel sitemap: {hits}')
else: ok(f'{len(sm)} file sitemap, nessuna occorrenza di OdE')

def visible_text(h):
    t = re.sub(r'<(script|style)\b.*?</\1>', ' ', h, flags=re.S|re.I)
    t = re.sub(r'<!--.*?-->', ' ', t, flags=re.S)
    t = re.sub(r'<[^>]+>', ' ', t)
    return htmlmod.unescape(t)

# 6. Trattini lunghi nella prosa italiana
print('\n=== 6. Nessun trattino lungo nel testo italiano ===')
it_pages = [p for p in pages if '/en/' not in str(p).replace('\\','/')]
dash = []
for p in it_pages:
    txt = visible_text(p.read_text(encoding='utf-8'))
    if '—' in txt or '–' in txt:
        dash.append(str(p.relative_to(DIST)))
if dash: bad(f'trattino lungo o medio nel testo di: {dash}')
else: ok(f'nessun trattino lungo o medio nelle {len(it_pages)} pagine italiane')

# 7. Claim vietate
print('\n=== 7. Claim vietate ===')
# Frasi che il sito non puo affermare. Ogni riga: (pattern, descrizione).
# Le pagine Audit e Tesi le citano per smontarle: la verifica distingue i contesti
# ammessi (tabella della tassonomia, callout di smontaggio) dall'uso affermativo.
FORBIDDEN = [
    (r'(?<!non )\brafforza la barriera', 'rafforza la barriera'),
    (r'\bripara la barriera\b', 'ripara la barriera'),
    (r'\bcalma (le )?infiammazion', 'calma infiammazioni'),
    (r'\bcura (acne|eczema|dermatite)\b', 'cura patologie'),
    (r'\bidentico al sebo\b', 'identico al sebo'),
    (r'\bsuperiore agli ingredienti (vegetal|di sintesi)', 'superiorita su vegetale o sintesi'),
    (r'\bstrengthens the skin barrier\b(?! )', 'strengthens the barrier (EN)'),
]
found = []
for p in pages:
    txt = visible_text(p.read_text(encoding='utf-8')).lower()
    for pat, name in FORBIDDEN:
        for mm in re.finditer(pat, txt):
            ctx = txt[max(0, mm.start()-120):mm.end()+120].replace('\n',' ')
            found.append((str(p.relative_to(DIST)), name, ' '.join(ctx.split())))
if found:
    for f in found: warn(f'{f[0]} :: {f[1]} :: ...{f[2]}...')
    print('  (ogni occorrenza va letta: la tassonomia dell Audit le cita per negarle)')
else:
    ok('nessuna occorrenza affermativa delle claim vietate')

# 8. Link interni risolvono
print('\n=== 8. Link interni ===')
broken = set()
for p in pages:
    h = p.read_text(encoding='utf-8')
    for m in re.finditer(r'href="(/[^"#?]*)', h):
        href = m.group(1)
        if href.startswith('/images/') or href.startswith('/cv/') or '.' in href.rsplit('/',1)[-1]:
            target = DIST / href.lstrip('/')
            if not target.exists(): broken.add((str(p.relative_to(DIST)), href))
            continue
        target = DIST / href.strip('/') / 'index.html'
        if href.rstrip('/') == '': target = DIST / 'index.html'
        if not target.exists(): broken.add((str(p.relative_to(DIST)), href))
if broken:
    for b in sorted(broken): bad(f'link rotto: {b[0]} -> {b[1]}')
else: ok('tutti i link interni risolvono a una pagina esistente')

# 9. Note in calce: ogni riferimento ha la sua voce e viceversa
print('\n=== 9. Note in calce ===')
bad_notes = []
for p in pages:
    h = p.read_text(encoding='utf-8')
    refs = set(re.findall(r'href="#odev2-src-(\d+)"', h))
    srcs = set(re.findall(r'id="odev2-src-(\d+)"', h))
    backs = set(re.findall(r'href="#odev2-ref-(\d+)"', h))
    anchors = set(re.findall(r'id="odev2-ref-(\d+)"', h))
    if refs - srcs: bad_notes.append((str(p.relative_to(DIST)), 'riferimento senza voce', sorted(refs-srcs)))
    if srcs - refs: bad_notes.append((str(p.relative_to(DIST)), 'voce senza riferimento', sorted(srcs-refs)))
    if backs - anchors: bad_notes.append((str(p.relative_to(DIST)), 'ritorno senza ancora', sorted(backs-anchors)))
    if srcs: print(f'  {p.relative_to(DIST)}: {len(srcs)} note')
if bad_notes:
    for b in bad_notes: bad(f'{b[0]} :: {b[1]} :: {b[2]}')
else: ok('ogni riferimento ha la sua voce e ogni voce il suo riferimento')

# 10. Responsivita: nessuna larghezza fissa in px sul contenitore
print('\n=== 10. Responsivita ===')
srcfiles = list(pathlib.Path('src/pages/OdE-v2').rglob('*.astro')) + \
           list(pathlib.Path('src/components/ode-v2').rglob('*.astro')) + \
           [pathlib.Path('src/layouts/OdeV2Layout.astro'), pathlib.Path('src/styles/ode-v2-theme.css')]
fixed = []
for f in srcfiles:
    for m in re.finditer(r'(?<!max-)width:\s*(\d{3,})px', f.read_text(encoding='utf-8')):
        if int(m.group(1)) > 320: fixed.append((str(f), m.group(0)))
if fixed:
    for x in fixed: warn(f'larghezza fissa: {x[0]} :: {x[1]}')
else: ok('nessuna larghezza fissa oltre 320px nei sorgenti v2')
tables_no_scroll = []
for p in pages:
    h = p.read_text(encoding='utf-8')
    for m in re.finditer(r'<table', h):
        seg = h[max(0,m.start()-400):m.start()]
        if 'tbl-wrap' not in seg and 'class="tw"' not in seg and 'overflow' not in seg:
            tables_no_scroll.append(str(p.relative_to(DIST)))
            break
if tables_no_scroll: warn(f'tabelle forse senza contenitore scorrevole: {sorted(set(tables_no_scroll))}')
else: ok('ogni tabella e dentro un contenitore a scorrimento orizzontale')

# 11. Peso delle pagine
print('\n=== 11. Peso delle pagine ===')
for p in pages:
    kb = p.stat().st_size / 1024
    flag = ' <-- oltre 120 KB' if kb > 120 else ''
    print(f'  {kb:7.1f} KB  {p.relative_to(DIST)}{flag}')
    if kb > 200: warn(f'pagina pesante: {p.relative_to(DIST)} ({kb:.0f} KB)')

# 12. Placeholder da segnalare al committente
print('\n=== 12. Placeholder in pagina ===')
ph = []
for p in pages:
    h = p.read_text(encoding='utf-8')
    for m in re.finditer(r'class="ph"[^>]*>([^<]*)<', h):
        seg = visible_text(h[m.end():m.end()+260])
        ph.append((str(p.relative_to(DIST)), ' '.join(seg.split())[:150]))
for x in ph: print(f'  {x[0]}: {x[1]}')
print(f'  totale: {len(ph)}')

print('\n' + '='*60)
print(f'FALLIMENTI: {len(fails)}   AVVISI: {len(warns)}')
sys.exit(1 if fails else 0)
