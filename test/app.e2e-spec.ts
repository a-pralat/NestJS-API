import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBoardgameDto, EditBoardgameDto } from '../src/boardgame/dto';
import { PrismaClient } from '@prisma/client';
import { cleanDb } from './db-helper';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaClient)
    await cleanDb(prisma)

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  // beforeEach(async ()=>{
  //   await cleanDb(prisma)
  // })

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const signUpPath = '/auth/signup';
    const signInPath = '/auth/signin';
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '123',
    };

    describe('Sign Up', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(signUpPath)
          .withBody({ password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST); // 400
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(signUpPath)
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST); // 400
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post(signUpPath)
          .expectStatus(HttpStatus.BAD_REQUEST); // 400
      });
      it('should sign up', () => {
        return pactum
          .spec()
          .post(signUpPath)
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED); // 201
      });
    });

    describe('Sign In', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(signInPath)
          .withBody({ password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST); // 400
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(signInPath)
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST); // 400
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post(signInPath)
          .expectStatus(HttpStatus.BAD_REQUEST); // 400
      });
      it('should sign in', () => {

        // Given
        
        // When

        // Then
        return pactum
          .spec()
          .post(signInPath)
          .withBody(dto)
          .expectStatus(HttpStatus.OK) // 200
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    const currentUserPath = '/users/me';
    const editUserPath = '/users';

    describe('Get current user', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get(currentUserPath)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK); // 200
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Tester',
          email: 'test@gmail.com',
        };
        return pactum
          .spec()
          .patch(editUserPath)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK) // 200
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Boardgame', () => {
    const defaultBoardgamesPath = '/boardgames';

    describe('Get empty boardgames', () => {
      it('should get boardgames', () => {
        return pactum
          .spec()
          .get(defaultBoardgamesPath)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK) // 200
          .expectBody([]);
      });
    });

    describe('Create boardgame', () => {
      const dto: CreateBoardgameDto = {
        title: 'Everdell',
        link: 'https://www.rebel.pl/gry-planszowe/everdell-edycja-polska-109580.html',
      };
      it('should create boardgame', () => {
        return pactum
          .spec()
          .post(defaultBoardgamesPath)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED) // 201
          .stores('boardgameId', 'id')
          .inspect();
      });
    });

    describe('Get boardgames', () => {
      it('should get boardgames', () => {
        return pactum
          .spec()
          .get(defaultBoardgamesPath)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK) // 200
          .expectJsonLength(1);
      });
    });

    describe('Get boardgame by id', () => {
      it('should get boardgame by id', () => {
        return pactum
          .spec()
          .get(defaultBoardgamesPath + '/{id}')
          .withPathParams('id', '$S{boardgameId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK) // 200
          .expectBodyContains('$S{boardgameId}');
      });
    });

    describe('Edit boardgame by id', () => {
      const dto: EditBoardgameDto = {
        title: 'Here to Slay',
        description:
          'Here to Slay is a competitive role-playing fantasy strategy card game ' +
          "that's all about assembling a party of Heroes and slaying monsters",
      };
      it('should edit boardgame by id', () => {
        return pactum
          .spec()
          .patch(defaultBoardgamesPath + '/{id}')
          .withPathParams('id', '$S{boardgameId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK) // 200
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete boardgame by id', () => {
      it('should delete boardgame by id', () => {
        return pactum
          .spec()
          .delete(defaultBoardgamesPath + '/{id}')
          .withPathParams('id', '$S{boardgameId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.NO_CONTENT); // 204
      });

      it('should get empty boardgames', () => {
        return pactum
          .spec()
          .get(defaultBoardgamesPath)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK) // 200
          .expectJsonLength(0);
      });
    });
  });
});
