import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto/edit-user.dto';

describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            })
        );
        await app.init();
        await app.listen(3333);

        prisma = app.get(PrismaService);
        await prisma.cleanDb()
        pactum.request.setBaseUrl('http://localhost:3333')
    });

    afterAll(() => {
        app.close();
    })

    describe('Auth', () => {
        const dto: AuthDto = {
            email: 'test@gmail.com',
            password: '1234'
        }
        describe('Signup', () => {
            it('should signup', () => {
                return pactum
                    .spec()
                    .post(
                        '/auth/signup',
                    )
                    .withBody(dto)
                    .expectStatus(201)
            })
            it('should throw if email empty', () => {
                return pactum
                    .spec()
                    .post(
                        '/auth/signup',
                    )
                    .withBody({ password: dto.password })
                    .expectStatus(400)
            })
            it('should throw if password empty', () => {
                return pactum
                    .spec()
                    .post(
                        '/auth/signup',
                    )
                    .withBody({ password: dto.email })
                    .expectStatus(400)
            })
            it('should throw if no body provided', () => {
                return pactum
                    .spec()
                    .post(
                        '/auth/signup',
                    )
                    .withBody({})
                    .expectStatus(400)
            })
        })
        describe('Signin', () => {
            it('should throw if email empty', () => {
                return pactum
                    .spec()
                    .post(
                        '/auth/signin',
                    )
                    .withBody({ password: dto.password })
                    .expectStatus(400)
            })
            it('should throw if password empty', () => {
                return pactum
                    .spec()
                    .post(
                        '/auth/signin',
                    )
                    .withBody({ email: dto.email })
                    .expectStatus(400)
            })
            it('should throw if no body provided', () => {
                return pactum
                    .spec()
                    .post(
                        '/auth/signin',
                    )
                    .withBody({})
                    .expectStatus(400)
            })
            it('should signin', () => {
                return pactum
                    .spec()
                    .post(
                        '/auth/signin',
                    )
                    .withBody(dto)
                    .expectStatus(200)
                    .stores('userAt', 'access_token')
            })
        })
    })

    describe('Users', () => {
        describe('Get me', () => {
            it('should get current user', () => {
                return pactum
                    .spec()
                    .get('/users/me')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(200)
            })
        })
        describe('Edit user', () => {
            it('should edit user', () => {
                const dto: EditUserDto = {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'test@mail.com'
                }
                return pactum
                    .spec()
                    .patch('/users')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .withBody(dto)
                    .expectStatus(200)
                    .expectBodyContains(dto.firstName)
                    .expectBodyContains(dto.lastName)
                    .expectBodyContains(dto.email)
            })
        })
    })
    //Authorization: 'Bearer $S{userAt}',
    describe('Bookmarkks', () => {
        const dto = {
            title: 'My first bookmark',
            description: 'This is a test bookmark',
            link: 'https://example.com'
        }
        describe('Create bookmarks', () => {
            it('should create bookmarks', () => {
                return pactum
                    .spec()
                    .post('/bookmark')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .withBody(dto)
                    .expectStatus(201)
                    .expectBodyContains(dto.title)
                    .expectBodyContains(dto.description)
                    .stores('bookmarkId', 'id')
            })
        })
        describe('Get bookmarks', () => {
            it('should get bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmark')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(200)
                    .expectBodyContains(dto.title)
                    .expectBodyContains(dto.description)
            })
        })
        describe('Get bookmarks by id', () => {
            it('should get bookmarks by id', () => {
                return pactum
                    .spec()
                    .get('/bookmark/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(200)
                    .expectBodyContains('$S{bookmarkId}')
            })
        })
        describe('Edit bookmarks', () => {
            it('should edit bookmarks', () => {
                const dto = {
                    title: 'My first bookmark edited',
                    description: 'This is a test bookmark edited',
                    link: 'https://example.com/edited'
                }
                return pactum
                    .spec()
                    .patch('/bookmark/edit/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .withBody(dto)
                    .expectStatus(200)
                    .expectBodyContains(dto.title)
                    .expectBodyContains(dto.description)
            })
        })
        describe('Delete bookmarks', () => {
            it('should delete bookmarks', () => {
                return pactum
                    .spec()
                    .delete('/bookmark/delete/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(204)
            })
        })
    })

    it.todo('should pass')
})