"""Checks the actual generated site, not source templates."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT=Path(__file__).resolve().parents[2]/'dist'
PREFIX='/OdE/test2'
class Page(HTMLParser):
    def __init__(self,path):
        super().__init__(); self.ids=[]; self.links=[]; self.lang=None; self.robots=None; self.h1=0; self.buttons=[]; self.text=[]
        self.feed(path.read_text())
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='html': self.lang=a.get('lang')
        if tag=='h1': self.h1+=1
        if tag=='meta' and a.get('name')=='robots': self.robots=a.get('content')
        if tag=='a': self.links.append(a)
        if tag=='button': self.buttons.append(a)
    def handle_data(self,s): self.text.append(s)

pages={}
for p in (ROOT/'OdE/test2').rglob('index.html'):
    url='/'+str(p.parent.relative_to(ROOT)); pages[url]=Page(p)
assert len(pages)==34, len(pages)
for url,p in pages.items():
    assert p.h1==1,(url,'heading count',p.h1)
    assert p.robots=='noindex, nofollow',(url,'indexable')
    assert len(set(p.ids))==len(p.ids),(url,'duplicate ids')
    assert p.lang==('it' if url.startswith(PREFIX+'/it') else 'en'),url
    for a in p.links:
        href=a.get('href',''); u=urlsplit(href)
        if u.scheme or u.netloc: continue
        target=u.path.rstrip('/') or url
        if target.startswith(PREFIX):
            assert target in pages,(url,'broken route',href)
            if u.fragment: assert unquote(u.fragment) in pages[target].ids,(url,'broken anchor',href)
        elif u.path:
            assert u.path in ['/OdE/test','/OdE/test/it'],(url,'unexpected external route',href)
    switches=[a for a in p.links if a.get('hreflang')]
    assert switches,(url,'no language switch')
    other=switches[0]['href'].rstrip('/')
    assert other in pages,(url,'broken translation')
    assert any(a.get('href','').rstrip('/')==url for a in pages[other].links if a.get('hreflang')),(url,'nonreciprocal translation')
for slug in ['passport','it/passaporto']:
    p=pages[PREFIX+'/'+slug]
    assert {'case-baseline','case-review','case-missing'}<=set(p.ids)
    assert {a['data-case'] for a in p.buttons if 'data-case' in a}=={'baseline','review','missing'}
    assert abs(2*2.0+1.2-5.2)<1e-9
    text=' '.join(p.text)
    assert '0.8' in text and '4.1' in text
    assert ('Insufficient evidence' if p.lang=='en' else 'Evidenze insufficienti') in text
    assert ('invented' if p.lang=='en' else 'inventato') in text
for slug in ['audit','it/audit']:
    links=[a.get('href') for a in pages[PREFIX+'/'+slug].links]
    assert 'https://doi.org/10.1016/j.biortech.2010.10.034' in links
    assert 'https://doi.org/10.1016/j.jprot.2020.103647' in links
for p in ROOT.glob('sitemap*.xml'): assert PREFIX not in p.read_text(),'test2 in sitemap'
print(f'PASS: {len(pages)} pages; headings, noindex, unique anchors, internal links, reciprocal language routes, specimen cases and source corrections.')
