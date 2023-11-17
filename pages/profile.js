import UserProfile from "../components/profile/user-profile";
import { getSession } from "next-auth/client";

function ProfilePage() {
  return <UserProfile />;
}

export default ProfilePage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false, //리디렉션 임시로 설정
      },
    };
  }
  return {
    props: { session },
  };
};
