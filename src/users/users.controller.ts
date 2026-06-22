import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors, ClassSerializerInterceptor, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dtos';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './users.entity';



@Controller('auth')
@Serialize(UserDto)

export class UsersController {

    constructor(private userService: UsersService,
        private authService: AuthService
    ) { }


    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color;
    }

    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color;
    }

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.userId);
    // }

    //making custom decorator for getting current user
    // @UseInterceptors(CurrentUserInterceptor) // not globally scoped interceptor
    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        console.log("created a new user successfully", body);
        // this.userService.create(body.email, body.password);
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        // console.log("user logged in successfully"); 
        // this.userService.create(body.email, body.password);
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }


    // @UseInterceptors(ClassSerializerInterceptor)
    // @UseInterceptors(new SerializeInterceptor(UserDto)) 
    @Serialize(UserDto) //invoking decorator of the above code
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running');
        const user = await this.userService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }


    @Get()
    findAlluser(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));

    }



}
