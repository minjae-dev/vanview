import ProfileBody from "./components/ProfileBody";
import ProfileHeader from "./components/ProfileHeader";
import ProfileToDroplist from "./components/ProfileToDroplist";

export default function page() {
  return (
    <div>
      <h2 className="my-2 mx-2 font-bold">Profile</h2>
      <ProfileHeader
        pic="/genProfPic.png"
        name="name"
        email="email@something.com"
      />
      <ProfileBody />
      <ProfileToDroplist />
    </div>
  );
}
