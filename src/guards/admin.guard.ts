import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.currentUser) {
            return false;
        }
        return request.currentUser.admin; //option 1
        // return request.currentUser.admin ? true : false; //option 2
        
        //3rd option
        // if (request.currentUser.admin){
        //     return true;
        // }
        // else{
        //     return false;
        // }
    }
}