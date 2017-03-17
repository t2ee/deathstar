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
    port: number;    

    @ConfigField
    log: boolean;

    @ConfigField
    router: RouterConfiguration;
}

export default DeathStarConfiguration;
