import {
    Component,
    Value,
} from '@t2ee/core';
import DeathStarSessionConfig from './DeathStarSessionConfig';

@Component
class DeathStarConfiguration {
    @Value('server.port')
    public port: number;

    @Value('server.session')
    public session: DeathStarSessionConfig;
}

export default DeathStarConfiguration;
