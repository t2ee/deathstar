import {
    Configurable,
    ConfigField,
} from '@t2ee/configurable';
import {
    RouterConfiguration,
} from '@t2ee/vader';
import DeathStarSessionConfig from './DeathStarSessionConfig';

@Configurable('application')
class DeathStarConfiguration {
    @ConfigField
    public port: number;

    @ConfigField
    public log: boolean;

    @ConfigField
    public router: RouterConfiguration;

    @ConfigField
    public session: DeathStarSessionConfig;
}

export default DeathStarConfiguration;
