import dependencyContainer from '../dependencyContainer';

describe('A dependency container', () => {
    beforeEach(() => {
        dependencyContainer.clear();
    });

    test('the dependency container provide a service', () => {
        dependencyContainer.set<NullService>('NullService', () => {
            return new NullService();
        });

        expect(dependencyContainer.get<NullService>('NullService')).toBeInstanceOf(NullService);
    });

<<<<<<< Updated upstream
    test('the dependency container throw an errors if the service is not initialized', () => {
=======
    test('the dependency container throw an error if the service is not initialized', () => {
>>>>>>> Stashed changes
        expect(() => dependencyContainer.get<NullService>('NullService')).toThrow(Error);
    });
});

class NullService {}
