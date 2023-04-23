import {
  ThirdwebAuthProvider,
  authSession,
} from "@thirdweb-dev/auth/next-auth";
import NextAuth from "next-auth";

export default NextAuth({
  providers: [
    // Add the thirdweb auth provider to the providers configuration
    ThirdwebAuthProvider({
      domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
    }),
    // other providers...
  ],
  callbacks: {
    // Add the authSession callback to the callbacks configuration
    session: authSession,
  },
});
