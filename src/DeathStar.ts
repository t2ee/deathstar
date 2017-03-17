import * as Koa from 'koa';
import * as path from 'path';
import {
    ConfigStore,
} from '@t2ee/configurable';
import {
    MiscUtil,
    FileUtil,
    AutoWired,
    Injectable,
    Container,
} from '@t2ee/core';
import {
    RouterFactory,
} from '@t2ee/vader';
import {
    LogManager,
} from 'sl4js';
import DeathStartConfiguration from './DeathStarConfiguration';
import ControllerRegistry from './core/ControllerRegistry';
import DeathStarProvider from './core/DeathStarProvider';


@Injectable
class DeathStar {

    @AutoWired
    private configuration: DeathStartConfiguration

    private run(): void {
        const logger = LogManager.getInstance().getLogger();
        const callerDirectory = MiscUtil.getCallerDirectory();
        const files = FileUtil.walk(callerDirectory).filter(file => path.extname(file) === '.js');
        for (const file of files) {
            require(file);
        }

        const controllers = ControllerRegistry.list();
        const app = new Koa();
        const router = RouterFactory.createRouter(this.configuration.router);
        for (const controller of controllers) {
            router.use(controller);
        }
        app.use(router.routes());
        app.listen(this.configuration.port);


        if (this.configuration.log) {
            logger.info(`SERVER STARTED ON PORT ${this.configuration.port}`);
        } 
    }

    static launch() {
        const top = MiscUtil.getCallerDirectory();
        ConfigStore.setRoot(path.resolve(top, '../config'));
        const star = Container.get(DeathStar, new DeathStarProvider());
        star.run(); 
    }
}

export default DeathStar;