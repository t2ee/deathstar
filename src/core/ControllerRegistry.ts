import {
    ClassConstructor,
} from '@t2ee/core';

class ControllerRegistry {
    private static controllers: ClassConstructor<any>[] = [];
    static put(klass: ClassConstructor<any>): void {
        ControllerRegistry.controllers.push(klass);
    }
    static list(): ClassConstructor<any>[] {
        return ControllerRegistry.controllers;
    }
}

export default ControllerRegistry;