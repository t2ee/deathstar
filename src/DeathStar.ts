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
    Class,
} from '@t2ee/core';
import {
    Router,
    RouterFactory,
    Request,
    CustomHandler,
} from '@t2ee/vader';
import {
    LogManager,
    Logger,
} from 'sl4js';
import DeathStarConfiguration from './DeathStarConfiguration';
import ControllerRegistry from './core/ControllerRegistry';
import DeathStarProvider from './core/DeathStarProvider';
import SessionCookie from './session/SessionCookie';
import SessionProvider from './session/SessionProvider';
import MemoryProvider from './session/MemoryProvider';
import SessionManager from './session/SessionManager';


@Injectable
class DeathStar {

    @AutoWired
    private configuration: DeathStarConfiguration;

    private static _customHandler: ClassConstructor<CustomHandler>;
    private _customHandler: ClassConstructor<CustomHandler>;

    private run(): void {
        const logger: Logger = LogManager.getInstance().getLogger();

        /*    LOAD CONTROLLERS    */
        const callerDirectory: string = MiscUtil.getCallerDirectory();
        const files: string[] = FileUtil.walk(callerDirectory).filter((file: string) => path.extname(file) === '.js');
        for (const file of files) {
            require(file);
        }

        const controllers: Class<any>[] = ControllerRegistry.list();
        const app: Koa = new Koa();
        const router: Router = RouterFactory.createRouter(this.configuration.router);
        router.customHandler = this._customHandler;
        router.provideContext(SessionCookie, (req: Request) => req.extra.get('cookie'));

        for (const controller of controllers) {
            logger.info(`Autowired controller: ${controller.name}`);
            router.use(controller.class);
        }
        /*    CONTROLLERS LOADED   */

        if (this.configuration.session) {
            const provider: string = this.configuration.session.provider;
            if (!provider) {
                logger.warn('Session Provider not specified, Session is disabled');
            } else {
                let providerInstance: SessionProvider;

                if (provider === 'MemoryProvider') {
                    providerInstance = new MemoryProvider(this.configuration.session);
                } else {
                    try {
                        const providerFile: string = path.resolve(callerDirectory, 'node_modules', provider);
                        const klass: Class<SessionProvider> = Class.forName<SessionProvider>(providerFile);
                        providerInstance = klass.newInstance(this.configuration.session);
                    } catch (e) {
                        logger.warn(`Session Provider '${provider}' is not found, Session is disabled`);
                    }
                }

                if (providerInstance) {
                    SessionManager.use(providerInstance);
                    logger.info(`Session is enabled, using ${providerInstance.constructor.name}`);
                }
            }
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
        star.customHandler = DeathStar._customHandler;
        star.run();
    }

    public set customHandler(handler: ClassConstructor<CustomHandler>) {
        this._customHandler = handler;
    }

    public static set customHandler(handler: ClassConstructor<CustomHandler>) {
        DeathStar._customHandler = handler;
    }
}

export default DeathStar;
