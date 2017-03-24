
interface SessionConfig {
    salt?: string;
    secure?: boolean;
    name: string;
    path?: string;
    maxAge?: number;
    httpOnly?: boolean;
}

export default SessionConfig;
