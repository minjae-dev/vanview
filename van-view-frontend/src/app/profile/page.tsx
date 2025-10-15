import ProfileBody from "./components/ProfileBody";
import ProfileHeader from "./components/ProfileHeader";

export default function page() {
  return (
    <div>
      <h2 className="my-2 mx-2 font-bold">Profile</h2>
      <ProfileHeader />
      <ProfileBody />
    </div>
  );
}
