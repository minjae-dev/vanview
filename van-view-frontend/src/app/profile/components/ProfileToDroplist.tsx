import Link from "next/link";

export default function ProfileToDroplist() {
  return (
    <div className="flex mx-auto">
      <Link
        href="/droplist"
        className="bg-slate-500 w-[72px] rounded-sm p-2 text-center block hover:bg-slate-600 text-white mx-auto"
      >
        Droplist
      </Link>
    </div>
  );
}
