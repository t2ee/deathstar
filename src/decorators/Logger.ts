import {
    AutoWired,
    ClassConstructor,
} from '@t2ee/core';
import * as sl4js from 'sl4js';

const Logger: (target: any, key?: string, index?: number | TypedPropertyDescriptor<any>) => any = AutoWired({
    resolve: (klass: ClassConstructor<sl4js.Logger>, meta: Map<string, string>): sl4js.Logger => {
        if (klass === sl4js.Logger) {
            return sl4js.LogManager.getInstance().getLogger();
        }

        return null;
    },
});

export default Logger;
