import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
    @InjectRepository(UserEntity) private readonly userReposotiry: Repository<UserEntity>


    create(user: User): Observable<User>{
        return from(this.userReposotiry.save(user))
    }


    findOne(id: number): Observable<User>{
        return from(this.userReposotiry.findOne({where: {id: id}}))
     //  return from(this.userReposotiry.findOne({id}))
    }


    findAll(): Observable<User[]>{
        return from(this.userReposotiry.find())
    }

    deleteOne(id: number): Observable<any>{
        return from(this.userReposotiry.delete(id))
    }


    updateOne(id: number , user: User): Observable<any>{
        return from(this.userReposotiry.update(id, user))
    }
}
