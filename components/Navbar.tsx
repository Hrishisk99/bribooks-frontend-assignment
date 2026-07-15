import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark mb-4">
      <div className="container">
        <Link href="/" className="navbar-brand mb-0 h1 text-decoration-none">
          BriBooks Store
        </Link>
      </div>
    </nav>
  );
}
