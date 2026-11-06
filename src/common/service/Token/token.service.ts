import jwt, { JwtPayload } from 'jsonwebtoken'
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
    constructor(private readonly configService: ConfigService) {}

    generateToken(user:any){
        let signature = undefined
        let audience = undefined
        let refreshSignature = undefined
        switch (user.role) {
            case 0:
                signature = this.configService.getOrThrow<string>('user_signature')
                audience = 'User'
                refreshSignature = this.configService.getOrThrow<string>('user_refresh_signature')
                break;
            default:
                signature = this.configService.getOrThrow<string>('admin_signature')
                audience = 'Admin'
                refreshSignature = this.configService.getOrThrow<string>('admin_refresh_signature')
                break;
        }        
        let accessToken = jwt.sign({id:user._id},signature as string,{audience,expiresIn:'30m'})
        let refreshToken = jwt.sign({id:user._id},signature as string,{audience,expiresIn:'1y'})

        return {accessToken,refreshToken}
    }

    decodeToken(token:string){
        let decodedtoken = jwt.decode(token) as JwtPayload
        if(!decodedtoken){
            throw new BadRequestException('invalid token')
        }
        let signature = undefined
        switch (decodedtoken.aud) {
            case "Admin":
                signature = this.configService.getOrThrow<string>('admin_signature')
                break;
            default:
                signature = this.configService.getOrThrow<string>('user_signature')
                break;
        }
        try {
            let data = jwt.verify(token,signature as string)
            return data
        } catch (error) {
            throw new BadRequestException('invalid token1')
        }
    }

    decodeRefreshToken(refreshtoken:string){
        let decodedtoken = jwt.decode(refreshtoken) as JwtPayload
        if(!decodedtoken){
            throw new BadRequestException('invalid token')
        }
        let signature = undefined
        switch (decodedtoken.aud) {
            case "Admin":
                signature = this.configService.getOrThrow<string>('admin_signature')
                break;
            default:
                signature = this.configService.getOrThrow<string>('user_signature')
                break;
        }
        let data = jwt.verify(refreshtoken,signature as string)
        return data
    }
}