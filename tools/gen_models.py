import numpy as np, json, os
from PIL import Image, ImageFilter
SRC="/home/claude/fe/orhanza-frontend/public/lookbook/7.webp"
OUT="public/custom-made/models"; os.makedirs(OUT,exist_ok=True)
fabs=json.load(open("fabrics.json"))
im=Image.open(SRC).convert("RGBA"); a=np.asarray(im).astype(float)
rgb=a[...,:3]; al=a[...,3]; H,W=al.shape
mx=rgb.max(2); mn=rgb.min(2); sat=(mx-mn)/(mx+1e-6); lum=rgb@[.299,.587,.114]
r,g,b=rgb[...,0],rgb[...,1],rgb[...,2]
skin=(r>g*1.08)&(g>b*1.12)&(sat>.22)&(lum<215)
m=(al>200)&(lum>75)&(~skin); m[:int(H*.14)]=False; m[int(H*.93):]=False
mask=(al>200)*np.asarray(Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(1.0))).astype(float)/255
ref=np.percentile(lum[m],60)
shade=np.clip(lum/ref,.35,1.3)**1.5
def tile(fp,scale):
    t=Image.open(fp).convert("RGB"); t=t.resize((int(t.width*scale),int(t.height*scale)),Image.LANCZOS)
    ta=np.asarray(t).astype(float); ry=int(np.ceil(H/ta.shape[0])); rx=int(np.ceil(W/ta.shape[1]))
    row=[ta if i%2==0 else ta[:,::-1] for i in range(rx)]; r1=np.concatenate(row,1)
    rows=[r1 if i%2==0 else r1[::-1] for i in range(ry)]
    return np.concatenate(rows,0)[:H,:W]
def fade_crop(img,frac,fade=70):
    h=int(H*frac); c=np.asarray(img)[:h].copy().astype(float)
    ramp=np.clip((h-np.arange(h))/fade,0,1)[:,None]; c[...,3]*=ramp
    return Image.fromarray(c.astype(np.uint8))
def save(img,p): img.save(p,quality=90,method=6)
# original, as-shot
save(im,f"{OUT}/base-suit.webp"); save(fade_crop(im,.60),f"{OUT}/base-jacket.webp")
for f in fabs:
    tex=tile(f"public/custom-made/fabrics/{f['slug']}.webp",.38)
    col=np.clip(tex*shade[...,None],0,255)
    out=rgb*(1-mask[...,None])+col*mask[...,None]
    res=Image.fromarray(np.dstack([out,al]).astype(np.uint8),"RGBA")
    save(res,f"{OUT}/suit-{f['slug']}.webp"); save(fade_crop(res,.60),f"{OUT}/jacket-{f['slug']}.webp")
print(W,H)
