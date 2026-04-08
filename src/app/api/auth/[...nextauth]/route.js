import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Внутри authorize(credentials)
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // ПРОВЕРЬ ЭТУ СТРОКУ:
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password, // то, что ты ввела в форму
          user.password, // то, что лежит в MongoDB (начинается с $2b$)
        );

        if (!isPasswordCorrect) return null;

        // 3. Если всё ок, возвращаем объект пользователя
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Используем токены
  },
  secret: process.env.NEXTAUTH_SECRET, // Добавь в .env случайную строку
  pages: {
    signIn: "/login", // Твоя будущая страница входа
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
