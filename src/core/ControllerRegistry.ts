import {
    Class,
} from '@t2ee/core';

class ControllerRegistry {
    private static controllers: Class<any>[] = [];
    public static put(klass: Class<any>): void {
        ControllerRegistry.controllers.push(klass);
    }
    public static list(): Class<any>[] {
        return ControllerRegistry.controllers;
    }
}

export default ControllerRegistry;
