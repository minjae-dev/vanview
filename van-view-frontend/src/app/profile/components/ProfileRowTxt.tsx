export default function ProfileRowTxt({ left, right }) {
  return (
    <>
      <div className="m-4 flex w-2/2">
        <div className="flex-1">{left}</div>
        <div className="flex-1 text-right">{right}</div>
      </div>
    </>
  );
}
