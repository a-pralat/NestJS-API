import { AuthService } from './auth.service';
import { Mocked, mockOf } from '../../test/mock-of';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker'

describe('AuthService', () => {
  let prismaClientMock: Mocked<PrismaClient>;
  let jwtServiceMock: Mocked<JwtService>;
  let configServiceMock: Mocked<ConfigService>;

  let authService: AuthService;

  beforeEach(() => {
    prismaClientMock = mockOf(PrismaClient);
    jwtServiceMock = mockOf(JwtService);
    configServiceMock = mockOf(ConfigService);

    authService = new AuthService(
      prismaClientMock,
      jwtServiceMock,
      configServiceMock,
    );
  });

  describe("signToken", ()=>{
    it("should create token", async ()=>{
      // Given

      configServiceMock.get.mockReturnValue('secret')
      jwtServiceMock.signAsync.mockResolvedValue('token')

      const userId = faker.datatype.number()
      const email = faker.internet.email()

      // When

      const result = await authService.signToken(userId, email)

      // Then

      expect(result).toEqual({
        access_token: 'token'
      })
      expect(jwtServiceMock.signAsync).toBeCalled()
      expect(configServiceMock.get).toBeCalledWith('JWT_SECRET')
    })
  })
});
