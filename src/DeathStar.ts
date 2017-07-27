import * as Koa from 'koa';
import * as path from 'path';
import {
    MiscUtil,
    FileUtil,
    AutoWired,
    Component,
    Container,
    ClassConstructor,
    ConfigurationStore,
    Class,
} from '@t2ee/core';
import {
    Router,
    Request,
    BeforeMiddleware,
    AfterMiddleware,
} from '@t2ee/vader';
import {
    LogManager,
    Logger,
} from '@t2ee/sl4js';
import DeathStarConfiguration from './DeathStarConfiguration';
import ControllerRegistry from './core/ControllerRegistry';
import ContextProviderRegistry from './core/ContextProviderRegistry';
import ContextProvider from './core/ContextProvider';
import SessionCookie from './session/SessionCookie';
import SessionProvider from './session/SessionProvider';
import MemoryProvider from './session/MemoryProvider';
import SessionManager from './session/SessionManager';
import Runnable from './core/Runnable';


@Component
class DeathStar {

    @AutoWired
    private configuration: DeathStarConfiguration;

    private run(target?: ClassConstructor<Runnable>): void {
        const logger: Logger = LogManager.getLogger();

        /*    LOAD CONTROLLERS    */
        const callerDirectory: string = MiscUtil.getCallerDirectory();
        const callerFile: string = MiscUtil.gtetCallerFile();
        const files: string[] = FileUtil.walk(callerDirectory).filter((file: string) => path.extname(file) === '.js');
        for (const file of files) {
            if (file === callerFile) {
                continue;
            }
            require(file);
        }

        if (target) {
            const instance: Runnable = Container.get(target);
            instance.run();
            logger.info(`Successfully bootstrapped ${target.name}`);
        } else {
            const controllers: ClassConstructor<any>[] = ControllerRegistry.list();
            const app: Koa = new Koa();
            const router: Router = Container.get(Router);
            const contextProviders: Map<ClassConstructor<any>, ClassConstructor<ContextProvider<any>>>
                = ContextProviderRegistry.list();

            for (const [klass, contextProvider] of contextProviders.entries()) {
                const provider: ContextProvider<any> = Container.get(contextProvider);
                router.provideContext(klass, provider.provide);
            }

            router.provideContext(SessionCookie, (req: Request) => req.extra.get('cookie'));

            let befores: BeforeMiddleware | BeforeMiddleware[] = <any> Container.get('DeathStarBefore') || [];
            let afters: AfterMiddleware | AfterMiddleware[] = <any> Container.get('DeathStarAfter') || [];

            if (!Array.isArray(befores)) {
                befores = [befores];
            }

            if (!Array.isArray(afters)) {
                afters = [afters];
            }

            router.use(befores, afters);

            for (const controller of controllers) {
                logger.info(`Autowired controller: ${controller.name}`);
                router.use(controller);
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
            app.listen(this.configuration.port, () => {
                logger.info(`SERVER STARTED ON PORT ${this.configuration.port}`);
            });
        }
    }

    public static launch(target: ClassConstructor<Runnable>): void;
    public static launch(): void;
    public static launch(target?: ClassConstructor<Runnable>): void {
        ConfigurationStore.loadFile(
            path.resolve(
                MiscUtil.getCallerDirectory(),
                '../config/application',
            ),
            process.env.ENV,
        );
        ConfigurationStore.loadFile(
            path.resolve(
                MiscUtil.getCallerDirectory(),
                '../config/logger',
            ),
            process.env.ENV,
        );
        const star: DeathStar = Container.get(DeathStar);
        star.run(target);
    }
}

export default DeathStar;
