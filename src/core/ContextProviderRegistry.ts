import ContextProvider from './ContextProvider';
import {
    ClassConstructor,
} from '@t2ee/core';

class ContextProviderRegistry {
    private static providers = new Map<ClassConstructor<any>, ClassConstructor<ContextProvider<any>>>();

    public static put(klass: ClassConstructor<any>, provider: ClassConstructor<ContextProvider<any>>): void {
        ContextProviderRegistry.providers.set(klass, provider);
    }

    public static list(): Map<ClassConstructor<any>, ClassConstructor<ContextProvider<any>>> {
        return ContextProviderRegistry.providers;
    }
}

export default ContextProviderRegistry;
