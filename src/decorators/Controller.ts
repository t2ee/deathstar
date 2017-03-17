import {
    Injectable,
} from '@t2ee/core';
import ControllerRegistry from '../core/ControllerRegistry';

function ControllerDecorator() {
    return (target: any): any => {
        ControllerRegistry.put(target);
        Injectable(target);
    }
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