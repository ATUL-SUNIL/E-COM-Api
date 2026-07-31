// import fs from 'fs';
// const fsPromise=fs.promises;
//          using file system
// async function log(logData){
//     try {
//         logData=`\n ${new Date().toString()}-${'.Log Data'}-${logData}`;
//         await fsPromise.appendFile("log.txt",logData);
//     } catch (error) {
//         console.log(error);
//     }
// }

import winston from 'winston';

const logger= winston.createLogger({
    level:"info",
    format:winston.format.json(),
    defaultMeta:{service:'request-logging'},
    transports:[
        new winston.transports.File({filename:'logs.txt'})
    ]

})

// Never write secrets to the log — mask these fields anywhere in the body.
const SENSITIVE_KEYS=['password','newPassword','currentPassword','token','authorization'];
const redact=(body)=>{
    if(!body || typeof body!=='object') return body;
    const clone=Array.isArray(body)?[...body]:{...body};
    for(const key of Object.keys(clone)){
        if(SENSITIVE_KEYS.includes(key)){
            clone[key]='[REDACTED]';
        }else if(clone[key] && typeof clone[key]==='object'){
            clone[key]=redact(clone[key]);
        }
    }
    return clone;
};

const loggerMiddleware=async(req,res,next)=>{
    //1. Log request (body with sensitive fields masked)
    const logData=`${req.method} ${req.url} - ${JSON.stringify(redact(req.body))}`;
    logger.info(logData);
    next();
}

export default loggerMiddleware;