import {
    Container,
    ClassConstructor,
    Provider,
    AutoWiredMeta,
} from '@t2ee/core';

class DeathStarProvider implements Provider {
    get<T>(meta: AutoWiredMeta): T {
        return Container.get(meta.klass, this);
    }
}

export default DeathStarProvider;