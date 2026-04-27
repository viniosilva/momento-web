import { Link } from "@tanstack/react-router"
import { Button } from "./button";
import { SearchInput } from "./search-input";

export function Header() {
  return (
    <header className="text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between gap-4">
          <Link to="/momentos" className="flex-shrink-0 text-2xl text-chart-3 font-bold hover:cursor-default">
            Momento
          </Link>

          <SearchInput />

          <Link to="/sign-in" className="hidden md:block" >
            <Button className="text-lg p-4 cursor-pointer">Logout</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
