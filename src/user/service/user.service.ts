import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/service/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
    
   constructor(
    private auth: AuthService,
    @InjectRepository(UserEntity) private readonly userReposotiry: Repository<UserEntity>,
  
   ){}

    create(user: User): Observable<User> {

        return this.auth.hashPassword(user.password).pipe(
            switchMap((pasawordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = pasawordHash
                return from(this.userReposotiry.save(newUser)).pipe(
                    map((user: User) => {
                        const { password, ...result } = user;
                        return result 
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userReposotiry.findOne({ where: { id: id } })).pipe(
            map((user: User) => {
                const {password, ...result } = user;
                return result
            })
        )
    }
    findAll(): Observable<User[]> {
        return from(this.userReposotiry.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) { delete v.password })
                return users
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userReposotiry.delete(id))
    }


    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;

        return from(this.userReposotiry.update(id, user))
    }

    login(user: User): Observable<any> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) =>{
                if(user){
                    return this.auth.generateJwt(user).pipe(map((jwt: string)=> jwt))
                }
            })
        )
    }

    // validateUser(email: string, password: string): Observable<User> {
    //     return this.findByMail(email).pipe(
    //         switchMap((user: User) => this.auth.comparePassword(password, user.password).pipe(
    //             map((match: boolean) =>{
    //                 if(match) {
    //                     const { password, ...result} = user;
    //                     return result
    //                 }
    //                 else{
    //                     throw Error
    //                 }
    //             })
    //         ))
    //     )
    // }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.auth.comparePassword(password, user.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )

    }



    findByMail(email: string): Observable<User> {
        return from(this.userReposotiry.findOne({where: {email: email}}))
    }
}
