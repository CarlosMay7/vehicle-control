import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { ExceptionService } from 'src/common/exception.service';
import { Invitation } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    private readonly dataSource : DataSource,
    
    private readonly jwtService: JwtService,
    private readonly exceptionService: ExceptionService
  ){}

  async create(createUserDto : CreateUserDto) {
    const { password, invitationCode, ...userData } = createUserDto;
    const invitation = await this.validateInvitation(invitationCode);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });
      await queryRunner.manager.save(user);
      await queryRunner.manager.delete(Invitation, { id: invitation.id });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      delete user.password;
      
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.exceptionService.handleDBExceptions(error);
    }
  }
  
  async login(loginUserDto : LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true } 
    });

    if(!user) 
      throw new UnauthorizedException('Credentials are not valid (email)');
      
    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async createInvitation(user: User) {
    const code = this.generateRandomCode(8);
    const createInvitationDto = {
      code,
      creator: { id: user.id },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días de expiración
    }

    try {
      const invitation = this.invitationsRepository.create(createInvitationDto);
      return await this.invitationsRepository.save(invitation);
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }

  private async validateInvitation(code: string) {
    if (!code) {
      throw new BadRequestException('Invitation code is required');
    }
  
    const invitation = await this.invitationsRepository.findOne({
      where: { code },
    });
  
    if (!invitation) {
      throw new NotFoundException('Invalid or already used invitation code');
    }
  
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      throw new UnauthorizedException('Invitation code has expired');
    }

    return invitation;
  }

  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
