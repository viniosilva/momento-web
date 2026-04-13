export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border ">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-chart-3">Momento</h3>
          <p className="mt-3">Organizing your events with ease</p>
          <p className="mt-2">© {currentYear} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
