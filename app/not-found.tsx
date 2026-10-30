import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-28">
      <p className="eyebrow text-gold">404</p>
      <h1 className="h-display mt-3 text-6xl md:text-8xl">Off the pattern.</h1>
      <p className="mt-4 text-slate">That page doesn’t exist — let’s get you back to the atelier.</p>
      <Link href="/" className="btn btn-burgundy mt-8">Back home</Link>
    </div>
  );
}
