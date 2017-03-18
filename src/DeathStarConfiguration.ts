import {
    Configurable,
    ConfigStore,
    ConfigField,
} from '@t2ee/configurable';
import {
    RouterConfiguration,
} from '@t2ee/vader';

@Configurable('application')
class DeathStarConfiguration {
    @ConfigField
    public port: number;

    @ConfigField
    public log: boolean;

    @ConfigField
    public router: RouterConfiguration;
}

export default DeathStarConfiguration;
