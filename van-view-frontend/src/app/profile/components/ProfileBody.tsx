import ProfileRowTxt from "./ProfileRowTxt";

export default function ProfileBody() {
  return (
    <div className="flex flex-col my-4 mx-2 rounded-sm lg:w-1/3 md:w-2/3 items-center self-center md:mx-auto">
      <ProfileRowTxt left="Visa Type" right="Co-op Student" />
      <ProfileRowTxt left="Visa Expiry" right="August 5, 2026" />
      <ProfileRowTxt left="Minimun Wage" right="$17.85 / hour" />
      <ProfileRowTxt left="Working hours" right="24 hours per week" />
      <ProfileRowTxt left="Interests" right="Server, Barista" />
    </div>
  );
}
