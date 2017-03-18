import {
    Request,
    Response,
} from '@t2ee/vader';
import * as Chance from 'chance';
import SessionCookie from './SessionCookie';
import SessionConfig from './SessionConfig';


abstract class SessionProvider {
    private chance: Chance.Chance = new Chance();

    public constructor(private config: SessionConfig) {}

    public async getCookie(req: Request): Promise<SessionCookie> {
        const cookieString: string = req.headers.get('cookie') || '';
        const cookieComponents: Map<string, string> = new Map<string, string>();
        const cookieParts: string[] = cookieString.split(';');
        for (const part of cookieParts) {
            const [key, value]: string[] = part.split('=');
            if (!key) {
                continue;
            }
            cookieComponents.set(key.trim(), (value || '').trim());
        }

        const id: string = cookieComponents.get('TSESSION');
        const data: any = await this.get(id);
        let cookie: SessionCookie = null;
        if (data) {
            cookie = new SessionCookie(id);
            cookie.path = cookieComponents.get('Path');
            cookie.secure = !!cookieComponents.get('Secure');
            cookie.httpOnly = !!cookieComponents.get('HttpOnly');
            cookie.domain = cookieComponents.get('Domain');
            cookie.data = data;
            if (cookieComponents.get('Expires')) {
                cookie.expiresAt = new Date(cookieComponents.get('Expires'));
            }
        } else {
            cookie = new SessionCookie(this.chance.guid());
        }

        return cookie;
    }

    public async saveCookie(res: Response): Promise<void> {
        const cookie: SessionCookie = res.extra.get('cookie');
        if (cookie) {
            if (cookie.deleted) {
                await this.delete(cookie.id);
            } else {
                await this.set(cookie.id, cookie.data);
                res.headers.set('Set-Cookie', cookie.toString());
            }
        }
    }

    // tslint:disable
    protected abstract get(id: string): Promise<any>;
    protected abstract set(id: string, data: any): Promise<void>;
    protected abstract delete(id: string): Promise<void>;
    // tslint:enable
}

export default SessionProvider;
