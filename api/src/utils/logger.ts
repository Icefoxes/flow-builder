import log4js from 'log4js';

log4js.configure({
    appenders: {
        app: {
            type: "dateFile",
            filename: "/tmp/logs/app.log",
            pattern: "yyyy-MM-dd",
            compress: true,
        }, out: { type: "stdout" }
    },
    categories: { default: { appenders: ["app"], level: "info" } },
});

export const logger = log4js.getLogger();
