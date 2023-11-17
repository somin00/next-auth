import { getSession } from "next-auth/client";
import AuthForm from "../components/auth/auth-form";

function AuthPage() {
  return <AuthForm />;
}

export default AuthPage;

export const getServerSideProps = async (context) => {
  const session = getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};
