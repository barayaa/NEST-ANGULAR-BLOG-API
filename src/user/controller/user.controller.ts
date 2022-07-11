import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/role.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { UserRole } from '../models/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';


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

   
    @Get()
    index(@Query('page') page: number = 1 , @Query('limit') limit: number = 10): Observable<Pagination<User>>{
        limit = limit > 100 ? 100 : limit;
        return this.userService.pagination({page , limit, route: 'http://localhost:3000/user'})
    }

    @Delete(':id')
    delete(@Param('id')id:string): Observable<User>{
        return this.userService.deleteOne(Number(id)); 
    }


    @Put(':id')
    updateOne(@Param('id')id:string, @Body() user: User): Observable<any>{
        return this.userService.updateOne(Number(id), user)
    }


    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id')id:string, @Body() user: User): Observable<any>{
        return this.userService.updateUserRole(Number(id), user)
    }

}

