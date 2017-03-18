
class SessionCookie {
    private _expiresAt: Date;
    private _httpOnly: boolean;
    private _path: string;
    private _secure: boolean;
    private _id: string;
    private _data: any;
    private _domain: string;
    private _deleted: boolean;

    public constructor(id: string) {
        this._id = id;
    }

    public get expiresAt(): Date {
        return this._expiresAt;
    }

    public set expiresAt(expiresAt: Date) {
        this._expiresAt = expiresAt;
    }

    public get httpOnly(): boolean {
        return this._httpOnly;
    }

    public set httpOnly(httpOnly: boolean) {
        this._httpOnly = httpOnly;
    }

    public get path(): string {
        return this._path;
    }

    public set path(path: string) {
        this._path = path;
    }

    public get secure(): boolean {
        return this._secure;
    }

    public set secure(secure: boolean) {
        this._secure = secure;
    }

    public get id(): string {
        return this._id;
    }

    public get data(): any {
        return this._data;
    }

    public set data(data: any) {
        this._data = data;
    }

    public get domain(): string {
        return this._domain;
    }

    public set domain(domain: string) {
        this._domain = domain;
    }

    public toString(): string {
        const components: string[] = [];
        components.push(`TSESSION=${this._id}`);
        if (this._path) {
            components.push(`Path=${this._path}`);
        }
        if (this._secure) {
            components.push(`Secure`);
        }
        if (this._httpOnly) {
            components.push(`HttpOnly`);
        }
        if (this._domain) {
            components.push(`Domain=${this._domain}`);
        }
        if (this._expiresAt) {
            components.push(`Expires:${this._expiresAt.toUTCString()}`);
        }

        return components.join('; ');
    }

    public delete(): void {
        this._deleted = true;
    }

    public get deleted(): boolean {
        return this._deleted;
    }
}

export default SessionCookie;
