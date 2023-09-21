export interface DependencyContainerInterface {
    get<T>(name: string): T;
    set<T>(name: string, callback: () => T): void;
}

export class DependencyContainer implements DependencyContainerInterface {
    private _services: Map<string, () => unknown> = new Map();

    static init(): DependencyContainer {
        return new DependencyContainer();
    }

    clear(): void {
        this._services.clear();
    }
    get<T>(name: string): T {
        if (!this._services.has(name)) {
            throw new Error('Service not initialized');
        }
        return this._services.get(name)!() as T;
    }

    set<T>(name: string, callback: () => T): void {
        this._services.set(name, callback);
    }
}

export default DependencyContainer.init();
