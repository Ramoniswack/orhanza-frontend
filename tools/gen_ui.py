import os, json, numpy as np
from PIL import Image
G="public/custom-made/garments"; U="public/custom-made/ui"; T="public/custom-made/trims"
for d in (G,U,T): os.makedirs(d,exist_ok=True)
S='fill="none" stroke="#111318" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"'
icons={
"jacket":f'<path d="M24 10l-14 8-4 36 10 2V30l6 30h40l6-30v28l10-2-4-36-14-8-8 6-8 24-8-24z" {S}/><path d="M32 10l12 38 12-38" {S}/>',
"trousers":f'<path d="M20 6h40l4 68H46L40 30l-6 44H16z" {S}/><path d="M20 14h40" {S}/>',
"waistcoat":f'<path d="M22 6l18 26 18-26 8 10-4 52H18l-4-52z" {S}/><path d="M40 32v36" {S}/><circle cx="40" cy="42" r="1.6" fill="#111318"/><circle cx="40" cy="52" r="1.6" fill="#111318"/><circle cx="40" cy="62" r="1.6" fill="#111318"/>',
"shirt":f'<path d="M28 8l12 10 12-10 20 12-8 14-8-4v38H24V30l-8 4-8-14z" {S}/><path d="M40 18v52" {S}/>',
"overcoat":f'<path d="M26 6l14 12 14-12 14 8 4 56H62l-4-30-4 30H26l-4-30-4 30H8l4-56z" {S}/><path d="M40 18v52" {S}/>',
}
for k,v in icons.items(): open(f"{G}/{k}.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">{v}</svg>')
# skeleton silhouette (loader)
open(f"{U}/skeleton-suit.svg","w").write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 1113"><g fill="#ECECEC"><ellipse cx="165" cy="52" rx="46" ry="58"/><path d="M118 108l47 30 47-30 62 22 24 330-30 6-12-240-10 262 6 410h-60l-14-380-14 380h-60l6-410-10-262-12 240-30-6 24-330z"/></g></svg>')
# soft ground shadow
open(f"{U}/ground-shadow.svg","w").write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 90"><defs><radialGradient id="shadow"><stop stop-color="#111318" stop-opacity=".38"/><stop offset=".65" stop-color="#111318" stop-opacity=".14"/><stop offset="1" stop-color="#111318" stop-opacity="0"/></radialGradient></defs><ellipse cx="350" cy="45" rx="290" ry="28" fill="url(#shadow)"/></svg>')
# trims: lining + buttons (200px discs/squares)
def disc(c,name,shine=True):
    N=200; yy,xx=np.mgrid[0:N,0:N]; r=np.hypot(xx-N/2,yy-N/2)/(N/2)
    base=np.array([int(c[i:i+2],16) for i in (1,3,5)],float)
    light=np.clip(1.15-0.5*np.hypot(xx-N*.35,yy-N*.3)/N,.55,1.2)
    rgb=np.clip(base[None,None,:]*light[...,None]*(1-0.18*(r>.78)[...,None]),0,255)
    a=(r<=1).astype(np.uint8)*255; Image.fromarray(np.dstack([rgb.astype(np.uint8),a]),"RGBA").save(f"{T}/{name}.png")
buttons=[("button-horn-brown","#4a3426"),("button-horn-black","#16161a"),("button-gold","#b98b45"),("button-mother-of-pearl","#e8e3d8"),("button-navy","#1d2b4a")]
for n,c in buttons: disc(c,n)
lin=[("lining-burgundy","#5b1f27"),("lining-navy","#1d2b4a"),("lining-ivory","#e8e0cf"),("lining-forest","#1f4535"),("lining-gold-paisley","#b98b45"),("lining-charcoal","#2b2d31")]
for n,c in lin:
    base=np.array([int(c[i:i+2],16) for i in (1,3,5)],float); N=200; yy,xx=np.mgrid[0:N,0:N]
    s=np.sin(xx/3.0)*np.sin(yy/3.0)*.05+np.sin((xx+yy)/38)*.04
    Image.fromarray(np.clip(base*(1+s[...,None]),0,255).astype(np.uint8)).save(f"{T}/{n}.webp",quality=88)
json.dump({"buttons":[n for n,_ in buttons],"linings":[n for n,_ in lin]},open("trims.json","w"))
