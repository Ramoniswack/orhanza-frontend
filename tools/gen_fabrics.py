import numpy as np, os, json
from PIL import Image, ImageFilter
rng=np.random.default_rng(7)
OUT="public/custom-made/fabrics"; os.makedirs(OUT,exist_ok=True)
N=900
def hexrgb(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],float)
yy,xx=np.mgrid[0:N,0:N].astype(float)
def noise(scale,amp):
    s=max(2,int(N/scale)); a=rng.random((s,s))
    im=Image.fromarray((a*255).astype(np.uint8)).resize((N,N),Image.BICUBIC)
    return (np.asarray(im)/255.-.5)*amp
def twill(p=6,amp=.10):
    d=((xx+yy)/p)%1.0
    return (np.where(d<.5,1,-1)*amp*0.6+np.sin(d*2*np.pi)*amp*.4)
def herring(p=22,amp=.12):
    cell=(xx//p).astype(int); d=((xx%p)+ (yy%(p*2)) * np.where(cell%2==0,1,-1))
    t=(np.where(cell%2==0,xx%p+yy,xx%p-yy)/ 5.0)
    return np.sin(t*1.2)*amp + np.where(cell%2==0,.05,-.05)
def threads(amp=.05):
    return (np.sin(xx*2.2)*np.sin(yy*2.2))*amp
def fuzz(amp=.12): return rng.normal(0,amp,(N,N))
def slub(amp=.14):
    h=noise(90,1)[...,None] ; row=rng.random(N//3+1).repeat(3)[:N][:,None]; col=rng.random(N//3+1).repeat(3)[:N][None,:]
    return ((row-.5)*amp*.7+(col-.5)*amp*.6)+noise(40,amp*.25)
def stripe(c,w=2,gap=44,a=.55,col='#d9d4c7'):
    m=((xx%gap)<w).astype(float)*a; return m,hexrgb(col)
def build(spec):
    base=hexrgb(spec['c']); k=spec['t']
    L=threads(.05)+noise(14,.05)+noise(120,.05)
    if k=='twill': L+=twill()
    elif k=='herring': L+=herring()
    elif k=='flannel': L+=fuzz(.10)+noise(6,.08)
    elif k=='linen': L+=slub()
    elif k=='barathea': L+=twill(4,.05)+fuzz(.04)
    elif k=='plain': L+=twill(5,.06)+fuzz(.03)
    elif k=='sharkskin': L+=twill(5,.07)+(np.sin(xx/7)*.05)
    elif k in('pinstripe','chalk','check','windowpane','glen'): L+=twill(5,.07)+fuzz(.03)
    img=np.clip(base[None,None,:]*(1+L[...,None]),0,255)
    if k in('pinstripe','chalk'):
        m,col=stripe(img,2 if k=='pinstripe' else 4,48 if k=='pinstripe' else 64,.55 if k=='pinstripe' else .28,spec.get('s','#d9d4c7'))
        img=img*(1-m[...,None])+col*m[...,None]*(1+L[...,None]*.5)
    if k=='windowpane':
        m=(((xx%220)<2)|((yy%220)<2)).astype(float)*.32; col=hexrgb(spec.get('s','#c9b78c'))
        img=img*(1-m[...,None])+col*m[...,None]
    if k=='check':
        m=(((xx%70)<3)|((yy%70)<3)).astype(float)*.28+(((xx%70)<3)&((yy%70)<3)).astype(float)*.1
        img=img*(1-m[...,None])+hexrgb(spec.get('s','#000000'))*m[...,None]
    if k=='glen':
        a=(((xx//18+yy//18)%2)==0)&(((xx//9)%2==0)|((yy//9)%2==0)); m=a.astype(float)*.28
        img=img*(1-m[...,None])+hexrgb(spec.get('s','#000000'))*m[...,None]
        m2=(((xx%180)<3)|((yy%180)<3)).astype(float)*.45
        img=img*(1-m2[...,None])+hexrgb(spec.get('o','#9aa3b2'))*m2[...,None]
    # soft vignette / light fold
    fold=1+0.07*np.sin((xx*.6+yy)/260)
    img=np.clip(img*fold[...,None],0,255).astype(np.uint8)
    return Image.fromarray(img).filter(ImageFilter.GaussianBlur(.6))
F=[
 ("navy-pure-wool","Navy Pure Wool","Suiting","#1d2b4a","twill",640),
 ("midnight-barathea","Midnight Barathea","Evening","#0f1424","barathea",780),
 ("charcoal-herringbone","Charcoal Herringbone","Suiting","#3b3e45","herring",720),
 ("mid-grey-sharkskin","Mid-Grey Sharkskin","Suiting","#7d8186","sharkskin",690),
 ("light-grey-flannel","Light Grey Flannel","Flannel","#a7a9ab","flannel",760),
 ("navy-pinstripe","Navy Pinstripe","Business","#1a2440","pinstripe",820),
 ("charcoal-chalk-stripe","Charcoal Chalk Stripe","Business","#34373d","chalk",820,{"s":"#c9c6bd"}),
 ("grey-glen-check","Grey Glen Check","Heritage","#8a8d92","glen",880,{"s":"#2b2d31","o":"#6f86a8"}),
 ("navy-check","Navy Check","Heritage","#222d4b","check",840,{"s":"#ffffff"}),
 ("stone-windowpane","Stone Windowpane","Heritage","#b9ad98","windowpane",860,{"s":"#6d5a3c"}),
 ("sand-linen","Sand Linen","Summer","#c8b698","linen",520),
 ("ivory-linen","Ivory Linen","Summer","#e6dfcf","linen",520),
 ("sky-blue-cotton","Sky Blue Cotton","Summer","#9fb4cc","plain",420),
 ("tobacco-wool-flannel","Tobacco Wool Flannel","Flannel","#6a4a33","flannel",810),
 ("forest-green-twill","Forest Green Twill","Statement","#1f4535","twill",790),
 ("olive-herringbone","Olive Herringbone","Statement","#4b4f2f","herring",760),
 ("burgundy-twill","Burgundy Twill","Statement","#5b1f27","twill",790),
 ("black-wool","Black Wool","Evening","#141416","plain",740),
]
man=[]
for row in F:
    slug,name,cat,c,t,price=row[:6]; extra=row[6] if len(row)>6 else {}
    im=build({"c":c,"t":t,**extra})
    im.save(f"{OUT}/{slug}.webp",quality=88)
    im.resize((240,240),Image.LANCZOS).save(f"{OUT}/{slug}-sm.webp",quality=85)
    man.append({"slug":slug,"name":name,"category":cat,"hex":c,"price":price,"image":f"/custom-made/fabrics/{slug}.webp","thumb":f"/custom-made/fabrics/{slug}-sm.webp"})
json.dump(man,open("fabrics.json","w"),indent=1)
print(len(man))
