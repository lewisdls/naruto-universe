import Link from "next/link";

const Navbar = () => {
  return (
    <div className="sticky top-0 p-4 flex gap-6 bg-[#1b1b1b] justify-center lg:justify-end z-50">
      <Link href="/" className="text-blue-300 font-semibold">
        Home
      </Link>
      <Link href="/characters" className="text-blue-300 font-semibold">
        Characters
      </Link>
      <Link href="/jutsus" className="text-blue-300 font-semibold">
        Jutsus
      </Link>
    </div>
  );
};

export default Navbar;
