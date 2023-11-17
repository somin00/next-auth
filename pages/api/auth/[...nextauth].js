import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { connectToDatabase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";

export default NextAuth({
  session: { jwt: true },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const userCollection = await client.db().collection("users");
        const user = await userCollection.findOne({ email: credentials.email });
        if (!user) {
          client.close();
          throw new Error("존재하지 않는 사용자입니다.");
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          client.close();
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        client.close();
        return { email: user.email }; //사용자 이메일로 JSON 웹토큰 생성
      },
    }),
  ],
});
