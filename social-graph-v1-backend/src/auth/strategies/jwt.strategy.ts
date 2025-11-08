import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConstants from "../../shared/security/constants";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.JWT_SECRET
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateEmail(payload.name);
        if (!user) {
            throw new UnauthorizedException("Invalid token");
        }
        return { role: payload.sub, email: payload.name, id: user.id };
    }
}