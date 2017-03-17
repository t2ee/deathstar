import DeathStarEntry from './DeathStar';
import DeathStarConfiguration from './DeathStarConfiguration';
import DeathStarControllerRegistry from './core/ControllerRegistry';
import DeathStarProvider from './core/DeathStarProvider';
import DeathStarController from './decorators/Controller';

import {
    Path as RouterPath,

    GET as RouterGET,
    POST as RouterPOST,
    DELETE as RouterDELETE,
    PUT as RouterPUT,

    Context as RouterContext,
    Method as RouterMethod,
    Param as RouterParam,
    After as RouterAfter,
    Before as RouterBefore,
    HttpMethod as RouterHttpMethod,

    Query as RouterQuery,
    QueryParam as RouterQueryParam,
    Body as RouterBody,
    PathParam as RouterPathParam,
    PathParams as RouterPathParams,
    Headers as RouterHeaders,
    HeaderParam as RouterHeaderParam,
    
    Response as RouterResponse,
    Request as RouterRequest,
    ParamHook as RouterParamHook,

} from '@t2ee/vader';

export namespace decorators {
    export const Controller = DeathStarController;

    export const GET = RouterGET;
    export const POST = RouterPOST;
    export const DELETE = RouterDELETE;
    export const PUT = RouterPUT;

    export const Path = RouterPath;
    export const Context = RouterContext;
    export const Method = RouterMethod;
    export const Param = RouterParam;
    export const After = RouterAfter;
    export const Before = RouterBefore;

    export const Query = RouterQuery;
    export const QueryParam = RouterQueryParam;
    export const Body = RouterBody;
    export const PathParam = RouterPathParam;
    export const PathParams = RouterPathParams;
    export const Headers = RouterHeaders;
    export const HeaderParam = RouterHeaderParam;
}

export namespace enums {
    export const HttpMethod = RouterHttpMethod;
}

export namespace core {
    export type ParamHook = RouterParamHook;
    export const Response = RouterResponse;
    export const Request = RouterRequest;
    export const DeathStar = DeathStarEntry;
}