import SessionProvider from './SessionProvider';

class SessionManager {
    private static provider: SessionProvider;

    public static use(provider: SessionProvider): void {
        SessionManager.provider = provider;
    }

    /** @internal */
    public static getProvider(): SessionProvider {
        return SessionManager.provider;
    }
}

export default SessionManager;
