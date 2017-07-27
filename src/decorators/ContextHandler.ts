import ContextProviderRegistry from '../core/ContextProviderRegistry';
import {
    Component,
} from '@t2ee/core';

export default function ControllerDecorator(klass: any) {
    return (target: any): any =>  {
        Component(target);
        ContextProviderRegistry.put(klass, target);

        //return target;
    };
}

