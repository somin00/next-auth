import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

const MIN_PWD_LENGTH = 7;

export default async function signupHandler(req, res) {
  const { email, password } = req.body();

  if (!email || !email.includes("@") || !password || password.trim().length < MIN_PWD_LENGTH) {
    res.status(422).json({
      message: "입력 값이 올바르지 않습니다. ",
    });
    return;
  }

  let client = null;

  try {
    client = await connectToDatabase();
  } catch (e) {
    res.status(500).json({
      message: "데이터베이스 연결에 실패했습니다.",
    });
  }

  const db = client.db();

  try {
    const hashedPassword = hashPassword(password);
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
    });
  } catch (e) {
    res.status(500).json({
      message: "데이터 저장에 실패했습니다.",
    });
    return;
  }

  client.close();

  res.status(201).json({
    message: "데이터 저장을 성공했습니다.",
  });
}
