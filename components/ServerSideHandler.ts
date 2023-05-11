import { Json } from "@thirdweb-dev/auth";
import { ThirdwebAuthUser } from "@thirdweb-dev/auth/next";
import { UserWithData } from "@thirdweb-dev/react";
import { GetServerSidePropsContext } from "next";
import { getUser } from "pages/api/auth/[...thirdweb]";

const serverSidePropsHandler = async (
  ctx: GetServerSidePropsContext
): Promise<{ props: { user: ThirdwebAuthUser<any, Json> | null } }> => {
  try {
    const user = await getUser(ctx.req);

    return {
      props: {
        user,
      },
    };
    //   const refreshToken: string = getCookie("refreshToken", ctx) as string;

    //   if (!refreshToken) {
    //     throw new Error("Missing token");
    //   }
    //   const detectedIp = requestIp.getClientIp(ctx.req);
    //   internalApi.defaults.headers.common["x-forwarded-for"] = detectedIp || "0";

    //   const response = await internalApi.post<ILoginAuth>(
    //     ApiRoutes.AUTH_LOGIN_REFRESH,
    //     { refreshToken }
    //   );

    //   internalApi.defaults.headers.common.Authorization = `Bearer ${response.data.idToken}`;
    //   return {
    //     props: {},
    //   };
  } catch (err) {
    console.log("Error in server =>", err);
    //   if (ctx.res.writeHead) {
    //     ctx.res.writeHead(302, { Location: AppRoutes.ACCESS });
    //     ctx.res.end();
    //   }

    return {
      props: {} as never,
    };
  }
};

export default serverSidePropsHandler;
