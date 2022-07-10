import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/role.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { UserRole } from '../models/user.entity';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){}


    @Post()
    create(@Body() user: User): Observable<User | Object>{
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({error: err.message}))
        );
    }


    @Post('login')
    login(@Body() user: User): Observable<User | Object>{
        return this.userService.login(user).pipe(
            map((jwt: string)=>{
                return { accessToken: jwt}
            })
        )
    }


  

    @Get(':id')
    findOne(@Param() params: any): Observable<User>{
        return this.userService.findOne(params.id);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getAll(): Observable<User[]>{
        return this.userService.findAll()
    }


    @Delete(':id')
    delete(@Param('id')id:string): Observable<User>{
        return this.userService.deleteOne(Number(id)); 
    }


    @Put(':id')
    updateOne(@Param('id')id:string, @Body() user: User): Observable<any>{
        return this.userService.updateOne(Number(id), user)
    }


    @Put(':id/role')
    updateRoleOfUser(@Param('id')id:string, @Body() user: User): Observable<any>{
        return this.userService.updateUserRole(Number(id), user)
    }

}

