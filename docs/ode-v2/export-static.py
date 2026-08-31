#!/usr/bin/env python3
"""Esporta /OdE/test come sito statico apribile in Chrome con un doppio clic.

    npm run build
    python3 docs/ode-v2/export-static.py            # -> sito-ode-v2/
    python3 docs/ode-v2/export-static.py /altro/percorso

Il build di Astro usa percorsi assoluti (/OdE/test/..., /_astro/...) e script
ES module. Nessuna delle due cose funziona sotto file://, quindi qui:
  - i percorsi assoluti diventano relativi, calcolati sulla profondita' della pagina;
  - i link a directory diventano link espliciti a index.html;
  - gli script module diventano script classici, con la dashboard inlinata,
    perche' Chrome blocca i moduli su file:// per via del CORS.

Il contenuto non cambia: cambiano solo il modo di referenziarlo e il modo di
caricare gli script.
"""
import io, re, shutil, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
DIST = ROOT / 'dist'
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'sito-ode-v2'

if not (DIST / 'OdE' / 'test').is_dir():
    sys.exit('dist/OdE/test non esiste: esegui prima `npm run build`')

# ── I due file che accompagnano l'esportazione ──────────────────────────────
# L'indice locale usa i token di OdE_Brand_System, come il resto del sito.

LANDING = """<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>OdE, sito di prova &middot; indice locale</title>
<link rel="icon" type="image/svg+xml" href="images/ode/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&amp;family=Roboto+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
<style>
  :root{
    --mint:#afdfc7; --ink:#1c2620; --body:#243029; --accent:#2f5a44;
    --rule:rgba(28,38,32,.18); --panel:rgba(255,255,255,.42);
    --mono:"Roboto Mono",ui-monospace,monospace;
  }
  *{box-sizing:border-box}
  body{
    margin:0; background:var(--mint); color:var(--body);
    font:300 16px/1.6 Roboto,-apple-system,BlinkMacSystemFont,sans-serif;
    padding:0 1.4rem 4rem;
  }
  .bar{
    background:var(--ink); color:var(--mint); margin:0 -1.4rem 2.6rem;
    padding:.55rem 1.4rem; font-family:var(--mono); font-size:.7rem;
    letter-spacing:.08em; text-transform:uppercase;
  }
  .wrap{max-width:56rem; margin:0 auto}
  h1{font-size:clamp(1.7rem,4vw,2.5rem); font-weight:300; color:var(--ink); line-height:1.12; margin:0 0 .8rem; letter-spacing:-.015em}
  .lede{font-size:1.05rem; max-width:42rem; margin:0 0 2.4rem}
  h2{font-size:1.1rem; font-weight:500; color:var(--ink); margin:2.6rem 0 .9rem; padding-bottom:.5rem; border-bottom:1px solid var(--rule)}
  .doors{display:grid; grid-template-columns:repeat(auto-fit,minmax(15rem,1fr)); gap:1rem; margin:1.2rem 0 0}
  .door{
    display:block; text-decoration:none; background:var(--panel);
    border:1px solid var(--rule); border-radius:8px; padding:1.3rem 1.4rem;
    transition:border-color .16s ease, transform .16s ease;
  }
  .door:hover{border-color:var(--accent); transform:translateY(-2px)}
  .door-k{display:block; font-family:var(--mono); font-size:.66rem; letter-spacing:.09em; text-transform:uppercase; color:var(--accent); margin-bottom:.45rem}
  .door-t{display:block; font-size:1.25rem; color:var(--ink); font-weight:400}
  .door-d{display:block; font-size:.86rem; margin-top:.35rem}
  ul.pages{list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(auto-fill,minmax(13rem,1fr)); gap:.45rem 1.4rem}
  ul.pages a{color:var(--accent); text-decoration:none; font-size:.94rem}
  ul.pages a:hover{text-decoration:underline}
  .note{font-size:.85rem; color:rgba(36,48,41,.72); max-width:42rem; margin:1rem 0 0}
  .note a{color:var(--accent)}
  code{font-family:var(--mono); font-size:.85em; background:rgba(255,255,255,.5); padding:.1em .35em; border-radius:3px}
</style>
</head>
<body>
<p class="bar">Versione di prova &middot; non indicizzata &middot; copia locale dell&rsquo;area di test /OdE/test</p>
<div class="wrap">
  <h1>Officina degli Estratti, sito di prova</h1>
  <p class="lede">
    Copia statica navigabile in locale. L&rsquo;inglese &egrave; la lingua in cui il sito &egrave;
    scritto, l&rsquo;italiano la sua traduzione. Da qui si entra nell&rsquo;una o nell&rsquo;altra.
  </p>

  <div class="doors">
    <a class="door" href="OdE/test/index.html">
      <span class="door-k">Source language</span>
      <span class="door-t">English</span>
      <span class="door-d">There is no clinical study measuring what tallow does to human skin.</span>
    </a>
    <a class="door" href="OdE/test/it/index.html">
      <span class="door-k">Traduzione</span>
      <span class="door-t">Italiano</span>
      <span class="door-d">Non esiste uno studio clinico che misuri l&rsquo;effetto del sego sulla pelle umana.</span>
    </a>
  </div>

  <h2>English</h2>
  <ul class="pages">
    <li><a href="OdE/test/index.html">Home</a></li>
    <li><a href="OdE/test/audit/index.html">The Audit</a></li>
    <li><a href="OdE/test/thesis/index.html">The Thesis</a></li>
    <li><a href="OdE/test/amsa/index.html">AMSA</a></li>
    <li><a href="OdE/test/supply-chain/index.html">Supply chain</a></li>
    <li><a href="OdE/test/position/index.html">Position</a></li>
    <li><a href="OdE/test/regulation/index.html">Regulation</a></li>
    <li><a href="OdE/test/open-evidence/index.html">Open questions</a></li>
    <li><a href="OdE/test/investors/index.html">Investors</a></li>
    <li><a href="OdE/test/glossary/index.html">Glossary</a></li>
    <li><a href="OdE/test/amsa-live/index.html">AMSA Live</a></li>
  </ul>

  <h2>Italiano</h2>
  <ul class="pages">
    <li><a href="OdE/test/it/index.html">Home</a></li>
    <li><a href="OdE/test/it/audit/index.html">L&rsquo;Audit</a></li>
    <li><a href="OdE/test/it/tesi/index.html">La Tesi</a></li>
    <li><a href="OdE/test/it/amsa/index.html">AMSA</a></li>
    <li><a href="OdE/test/it/filiera/index.html">Filiera</a></li>
    <li><a href="OdE/test/it/posizione/index.html">Posizione</a></li>
    <li><a href="OdE/test/it/normativa/index.html">Normativa</a></li>
    <li><a href="OdE/test/it/evidenza/index.html">Domande aperte</a></li>
    <li><a href="OdE/test/it/investitori/index.html">Investitori</a></li>
    <li><a href="OdE/test/it/glossario/index.html">Glossario</a></li>
    <li><a href="OdE/test/it/amsa-live/index.html">AMSA Live</a></li>
  </ul>

  <h2>Come si legge</h2>
  <p class="note">
    Basta aprire questo file in Chrome: i percorsi sono relativi, quindi funziona anche con un
    doppio clic, senza server e senza rete. I caratteri Roboto arrivano da Google Fonts: offline
    il sito ripiega sul carattere di sistema e resta leggibile.
  </p>
  <p class="note">
    La dashboard <a href="OdE/test/amsa-live/index.html">AMSA Live</a> &egrave; una simulazione
    dimostrativa, e lo dichiara in ogni schermata: le assegnazioni delle bande spettrali sono
    corrette, intensit&agrave; e punteggi sono euristiche calibrate per chiarezza.
  </p>
  <p class="note">
    Se preferisci servirlo via HTTP, da questa cartella:
    <code>python3 -m http.server 8000</code> e poi <code>http://localhost:8000</code>.
  </p>
</div>
</body>
</html>
"""

README = """OdE, area di test /OdE/test, copia statica locale
===============================================

COME APRIRLO
  Doppio clic su index.html. Si apre in Chrome e funziona subito:
  nessun server, nessuna installazione, nessuna connessione necessaria.

  In alternativa, da dentro questa cartella:
      python3 -m http.server 8000
  e poi http://localhost:8000 nel browser.

CHE COSA CONTIENE
  index.html          l'indice locale, con le due lingue e tutte le pagine
  OdE/test/           le 11 pagine inglesi, che sono il default
  OdE/test/it/        le 11 pagine italiane
  _astro/             fogli di stile e script
  images/ode/         la favicon

NOTE
  L'inglese e' la lingua in cui il sito e' scritto, l'italiano la traduzione.
  Il selettore di lingua in alto a destra porta sempre alla stessa pagina
  nell'altra lingua.

  I caratteri Roboto arrivano da Google Fonts. Senza rete il sito ripiega sul
  carattere di sistema: cambia il colore tipografico, non la leggibilita'.

  Ogni pagina porta meta robots "noindex, nofollow" e la barra nera in cima:
  e' una versione di prova, non il sito pubblico.

  AMSA Live e' una simulazione dimostrativa e lo dichiara in ogni schermata.
  Le assegnazioni delle bande spettrali sono corrette; intensita', punteggi e
  shelf-life sono euristiche calibrate per chiarezza, senza valore predittivo.

  Rispetto al sito servito da un web server, qui i link puntano esplicitamente
  a .../index.html e gli script sono classici invece che ES module, perche'
  Chrome blocca i moduli sotto file://. Il contenuto e' identico.

  Per rigenerare questa cartella dopo una modifica al sito:
      npm run build
      python3 docs/ode-v2/export-static.py
"""


if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

# ── 1. le pagine ──
shutil.copytree(DIST / 'OdE' / 'test', OUT / 'OdE' / 'test')
pages = sorted((OUT / 'OdE' / 'test').rglob('index.html'))
print(f'pagine: {len(pages)}')

# ── 2. gli asset realmente referenziati ──
wanted = set()
for p in pages:
    for m in re.finditer(r'(?:href|src)="(/(?:_astro|images)/[^"]+)"', p.read_text(encoding='utf-8')):
        wanted.add(m.group(1).lstrip('/'))
# dashboard-ui e' importato dal js, non dall'html
wanted |= {f'_astro/{f.name}' for f in (DIST / '_astro').glob('dashboard-ui.*.js')}
for rel in sorted(wanted):
    src = DIST / rel
    if not src.exists():
        print('  MANCANTE:', rel); continue
    dst = OUT / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
print(f'asset copiati: {len(wanted)}')

# ── 3. la dashboard, convertita da modulo a globale ──
dash_src = next((DIST / '_astro').glob('dashboard-ui.*.js'))
dash = dash_src.read_text(encoding='utf-8')
assert 'export{' in dash, 'export non trovato in dashboard-ui'
dash = re.sub(r'export\{(\w+) as i\};?\s*$', r'window.__odeDash=\1;', dash.rstrip())
assert 'window.__odeDash' in dash, 'conversione della dashboard fallita'

def to_classic(html: str, prefix: str) -> str:
    """Trasforma gli script module in script classici."""
    def one(m):
        attrs, body = m.group(1), m.group(2)
        # I percorsi sono gia' stati resi relativi, quindi risolvo per nome file.
        src = re.search(r'src="[^"]*_astro/([^"/]+)"', attrs)
        if src:
            js = (DIST / '_astro' / src.group(1)).read_text(encoding='utf-8')
            # toglie l'import e chiama la globale al posto del simbolo importato
            js = re.sub(r'import\{(\w+)\}from"\./dashboard-ui\.[^"]+";', '', js)
            js = re.sub(r'(^|[^\w.$])i\(\{', r'\1window.__odeDash({', js, count=1)
            assert 'window.__odeDash({' in js, 'chiamata alla dashboard non riscritta'
            assert 'import' not in js.split('window.__odeDash')[0], 'import residuo'
            return f'<script>{dash}\n{js}</script>'
        if 'import' in body or re.search(r'\bexport\b', body):
            raise AssertionError('script inline con import non gestito')
        return f'<script>{body}</script>'
    return re.sub(r'<script([^>]*type="module"[^>]*)>(.*?)</script>', one, html, flags=re.S)

# ── 4. riscrittura dei percorsi, pagina per pagina ──
for p in pages:
    depth = len(p.relative_to(OUT).parts) - 1          # cartelle sopra il file
    prefix = '../' * depth if depth else './'
    h = p.read_text(encoding='utf-8')

    def rel(m):
        attr, url = m.group(1), m.group(2)
        frag = ''
        if '#' in url:
            url, frag = url.split('#', 1)
            frag = '#' + frag
        if url.startswith('/_astro/') or url.startswith('/images/'):
            target = url.lstrip('/')
        elif url == '/OdE/test':
            target = 'OdE/test/index.html'
        elif url.startswith('/OdE/test/'):
            target = url.lstrip('/').rstrip('/') + '/index.html'
        else:
            return m.group(0)                          # esterno o sconosciuto: invariato
        return f'{attr}="{prefix}{target}{frag}"'

    h = re.sub(r'(href|src)="(/[^"]*)"', rel, h)
    h = to_classic(h, prefix)
    p.write_text(h, encoding='utf-8')

leftover = sum(len(re.findall(r'(?:href|src)="/(?!/)', p.read_text(encoding='utf-8'))) for p in pages)
print(f'riferimenti assoluti rimasti: {leftover}')
assert leftover == 0, 'restano percorsi assoluti'
mods = sum(len(re.findall(r'type="module"', p.read_text(encoding='utf-8'))) for p in pages)
print(f'script module rimasti: {mods}')
assert mods == 0
(OUT / 'index.html').write_text(LANDING, encoding='utf-8')
(OUT / 'LEGGIMI.txt').write_text(README, encoding='utf-8')

total = sum(f.stat().st_size for f in OUT.rglob('*') if f.is_file())
print(f'esportazione completata in {OUT}  ({len(list(OUT.rglob("*.html")))} file html, {total/1024:.0f} KB)')
print('apri', OUT / 'index.html', 'in Chrome')
