import {
    Request,
} from '@t2ee/vader';

interface ContextProvider<T> {
    provide(request: Request): T;
}

export default ContextProvider;
