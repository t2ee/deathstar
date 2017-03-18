import SessionConfig from './SessionConfig';

interface RedisSessionConfig extends SessionConfig {
    redisUri: string;
}

export default RedisSessionConfig;
