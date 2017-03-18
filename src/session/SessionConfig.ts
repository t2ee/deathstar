
interface SessionConfig {
    salt?: string;
    secure?: boolean;
    path?: string;
    maxAge?: number;
    httpOnly?: boolean;
}

export default SessionConfig;
