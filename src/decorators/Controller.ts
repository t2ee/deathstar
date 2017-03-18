import {
    Injectable,
} from '@t2ee/core';
import {
    BeforeMiddleware,
    AfterMiddleware,
    After,
    Before,
    Request,
    Response,
} from '@t2ee/vader';
import ControllerRegistry from '../core/ControllerRegistry';
import SessionManager from '../session/SessionManager';

const beforeMiddleware: BeforeMiddleware = async (req: Request): Promise<Request> => {
    req.extra.set('cookie', await SessionManager.getProvider().getCookie(req));

    return req;
};

const afterMiddleware: AfterMiddleware = async (res: Response): Promise<Response> => {
    await SessionManager.getProvider().saveCookie(res);

    return res;
};

function ControllerDecorator(): (target: any) => any {
    return (target: any): any => {
        ControllerRegistry.put(target);
        Injectable(target);
        Before(beforeMiddleware)(target);
        After(afterMiddleware)(target);
    };
}

function Controller(): (target: any) => any;
function Controller(target: any): any;
function Controller(target?: any): any {
    if (target) {
        return ControllerDecorator()(target);
    } else {
        return ControllerDecorator();
    }
}

export default Controller;
