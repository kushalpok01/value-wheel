import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service"
import { User } from "./users.entity";


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        // create a fake copy of the users service
        const fakeUsersService: Partial<UsersService> = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) =>
                Promise.resolve({ id: 1, email, password } as User)
        };



        const module = await Test.createTestingModule({
            providers: [
                AuthService, {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();


        service = module.get(AuthService);
    });


    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });


    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('asdf@asdf.com', 'asdf');

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.spli('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });
    it('throws an error if user signs up with email that is in user', async (done) => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User])
        try {
            await service.signup('asdf@asdf.com', 'asdf');
        } catch (err) {
            done();
        }
    })




    it('throws if an invalid password is provided', async (done) => {
        fakeUsersService.find =
            () => Promise.resolve([{ email: "adf@gmail.com", password: 'fada' } as User]);
        try {
            await service.signin('lasdfa@efail.com', 'passwrod');
        } catch (err) {
            // done();
        }


    })



    it('returns auser if correct password is provided', async () => {
        // fakeUsersService.find =
        //     () => Promise.resolve([{ email: "adf@gmail.com", password: 'fada' } as User]);
        // const user = await service.signin('asdf@asd.com', 'mypaswerod');
        // expect(user).toBeDefined();



        const user = await service.signup('asdf@gmail.com', 'mypassword');
        console.log(user);
    });
});

