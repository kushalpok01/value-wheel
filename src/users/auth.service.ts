import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto"; //randomBytes for salt and scrypt for hashing
import { promisify } from "util";


const scrypt = promisify(_scrypt);



@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }


    async signup(email: string, password: string) {

        // See if email is in use
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException("email already in use");
        }
        // hash the users password
        //generate a salt
        const salt = randomBytes(8).toString('hex'); //16 characters long

        // hash the salt and the password togethere
        const hash = (await scrypt(password, salt, 32)) as Buffer; //hash is 64 characters long

        // join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // create a new user and save it
        const user = await this.usersService.create(email, result);


        // return the user
        return user;
        // return this.usersService.save(user);


    }

    async signin(email: string, password: string) {
        // see if the user is present in the db
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException("user not found");
        }

        // split the stored user's password(hash) into salt and hash
        const [salt, storedhash] = user.password.split('.');

        // making a new hash from the supplied password
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //compare the new hash and the stored hash
        if (storedhash !== hash.toString('hex')) {
            throw new BadRequestException('incorrect password');
        }
        return user;
        console.log("User logged in successfully")
    }


}