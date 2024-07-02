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

const loggerMiddleware=async(req,res,next)=>{
    //1. Log request body
    if(!req.url.includes('signin')){
        
    const logData=`${req.url} - ${JSON.stringify(req.body)}}`
    logger.info(logData);
    }
    next();

}

export default loggerMiddleware;