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
    ClassConstructor,
} from '@t2ee/core';
import {
    Router,
    RouterFactory,
    Request,
} from '@t2ee/vader';
import {
    LogManager,
    Logger,
} from 'sl4js';
import DeathStartConfiguration from './DeathStarConfiguration';
import ControllerRegistry from './core/ControllerRegistry';
import DeathStarProvider from './core/DeathStarProvider';
import SessionCookie from './session/SessionCookie';


@Injectable
class DeathStar {

    @AutoWired
    private configuration: DeathStartConfiguration;

    private run(): void {
        const logger: Logger = LogManager.getInstance().getLogger();
        const callerDirectory: string = MiscUtil.getCallerDirectory();
        const files: string[] = FileUtil.walk(callerDirectory).filter((file: string) => path.extname(file) === '.js');
        for (const file of files) {
            require(file);
        }

        const controllers: ClassConstructor<any>[] = ControllerRegistry.list();
        const app: Koa = new Koa();
        const router: Router = RouterFactory.createRouter(this.configuration.router);
        router.provideContext(SessionCookie, (req: Request) => req.extra.get('cookie'));

        for (const controller of controllers) {
            router.use(controller);
        }
        app.use(router.routes());
        app.listen(this.configuration.port);


        if (this.configuration.log) {
            logger.info(`SERVER STARTED ON PORT ${this.configuration.port}`);
        }
    }

    public static launch(): void {
        const top: string = MiscUtil.getCallerDirectory();
        ConfigStore.setRoot(path.resolve(top, '../config'));
        const star: DeathStar = Container.get(DeathStar, new DeathStarProvider());
        star.run();
    }
}

export default DeathStar;
