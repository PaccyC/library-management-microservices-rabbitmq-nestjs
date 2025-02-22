import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser= createParamDecorator(
    (tata: unknown, ctx: ExecutionContext)=>{

        const request= ctx.switchToHttp().getRequest();
        return request.user;
    }
)