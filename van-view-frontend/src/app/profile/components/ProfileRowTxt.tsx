export default function ProfileRowTxt({ left, right }) {
  return (
    <>
      <div className="m-2 pb-4 flex w-2/2 border-b-1 border-slate-200  ">
        <div className="flex-1 text-slate-500">{left}</div>
        <div className="flex-1 text-right">{right}</div>
      </div>
    </>
  );
}
