import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../lib/db";
import { hashPassword, verifyPassword } from "../../../lib/auth";

export default async function changePassword(req, res) {
  if (req.method !== "PATCH") return;

  // 1. 인증 사용자 확인
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "인증이 필요한 요청입니다." });
    return;
  }

  // 2. 데이터 베이스에 사용자 있는지 확인
  const userEmail = session.user.email;

  const client = await connectToDatabase();
  const userCollection = await client.db().collection("users");
  const user = await userCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({
      message: "사용자를 찾을 수 없습니다.",
    });
    client.close();
    return;
  }

  // 3. 입력한 비밀번호가 이전 비밀번호와 다른지 확인

  const { oldPassword, newPassword } = JSON.parse(req.body);
  const currentPassword = user.password;
  const isValid = await verifyPassword(oldPassword, currentPassword);

  if (!isValid) {
    res.status(403).json({
      message: "비밀번호가 일치하지 않습니다.",
    });
    client.close();
    return;
  }

  // 4. 새로운 비밀번호 해싱 후 데이터베이스에 저장
  const newHashedPassword = hashPassword(newPassword);
  const result = await userCollection.updateOne({ email: userEmail }, { $set: { password: newHashedPassword } });

  client.close();

  res.status(200).json({
    message: "비밀번호를 변경했습니다.",
  });
}
