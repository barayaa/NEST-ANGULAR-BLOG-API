import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){}


    @Post()
    create(@Body() user: User): Observable<User>{
        return this.userService.create(user);
    }

    @Get(':id')
    findOne(@Param() params: any): Observable<User>{
        return this.userService.findOne(params.id);
    }

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

}
