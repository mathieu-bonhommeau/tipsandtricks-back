import dependencyContainer from '../../_dependencyContainer/dependencyContainer';
import RegisterUserUseCase from '../../user/domain/use_cases/registerUserUseCase';
import UserRepositoryInterface from '../../user/domain/ports/userRepositoryInterface';
import UserRepositoryPostgres from '../../user/server-side/repositories/userRepositoryPostrges';
import postgres, { Sql } from 'postgres';
import process from 'process';
import AuthUserUseCase from '../../user/domain/use_cases/authUserUseCase';

dependencyContainer.set<Sql>('sql', () => {
    return postgres({
        host: process.env.PGHOST || '127.0.0.1', // Postgres ip address[s] or domain name[s]
        port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5433, // Postgres server port[s]
        database: process.env.PGDB || 'tipsandtricks', // Name of database to connect to
        username: process.env.PGUSER || 'ttuser', // Username of database user
        password: process.env.PGPASSWORD || 'changeme', // Username of database user
        ssl: process.env.ENVIRONMENT === 'production'
    });
});
dependencyContainer.set<UserRepositoryInterface>('UserRepository', () => {
    return new UserRepositoryPostgres(dependencyContainer.get<Sql>('sql'));
});
dependencyContainer.set<RegisterUserUseCase>('RegisterUserUseCase', () => {
    return new RegisterUserUseCase(dependencyContainer.get<UserRepositoryInterface>('UserRepository'));
});
dependencyContainer.set<AuthUserUseCase>('AuthUserUseCase', () => {
    return new AuthUserUseCase(dependencyContainer.get<UserRepositoryInterface>('UserRepository'));
});

export default dependencyContainer;
