import { getSession } from "next-auth/client";
import AuthForm from "../components/auth/auth-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace("/");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <p>로딩중입니다.</p>;
  }

  return <>{!isLoading && <AuthForm />}</>;
}

export default AuthPage;
