import Image from "next/image";

export default function ProfileHeader({ pic, name, email }) {
  return (
    <div className="flex my-4 mx-2 bg-slate-300 rounded-sm p-4 lg:w-1/3 md:w-2/3 items-center self-center md:mx-auto">
      <div className="left-side self-center flex-[1]">
        <Image
          src="/genProfPic.png"
          alt="Generic Profile Pic"
          width={60}
          height={38}
          // priority
        />
      </div>
      <div className="middle-side flex-[4]">
        <div> Name </div>
        <div>email@something.com</div>
      </div>
      <div className="right-side self-start flex-[0.3] my-1">
        <Image
          src="/settings.svg"
          alt="Generic Profile Pic"
          width={20}
          height={38}
        />
      </div>
    </div>
  );
}

//genProfPic.png
