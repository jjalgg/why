import appRoot from "app-root-path"; // app root 경로를 가져오는 import
import winston from "winston"; // winston lib
import process from "process";

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  const time = new Date(timestamp).toLocaleString();
  return `${time} [${label}] ${level}: ${message}`; // log 출력 포맷 정의
});

const options = {
  // log파일
  file: {
    level: "info",
    filename: `${appRoot}/logs/koaOps.log`, // 로그파일을 남길 경로
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: combine(
      label({ label: "koaOps" }),
      timestamp(),
      myFormat // log 출력 포맷
    ),
  },
  // 개발 시 console에 출력
  console: {
    level: "debug",
    handleExceptions: true,
    json: false, // 로그형태를 json으로도 뽑을 수 있다.
    colorize: true,
    format: combine(label({ label: "koa" }), timestamp(), myFormat),
  },
};

let logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file), // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
    new winston.transports.File(options.file), // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console(options.console)); // 개발 시 console로도 출력
}

export default logger;

// import winston from "winston";
// import appRoot from "app-root-path"; // app root 경로를 가져오는 import
// require("winston-daily-rotate-file");

// const { combine, timestamp, label, printf } = winston.format;

// const myFormat = printf(({ level, message, label, timestamp }) => {
//   return `${timestamp} [${label}] ${level}: ${message}`; // log 출력 포맷 정의
// });

// const options = {
//   // log파일
//   file: {
//     level: "info",
//     filename: `${appRoot}/logs/winston-test.log`, // 로그파일을 남길 경로
//     handleExceptions: true,
//     json: false,
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     colorize: false,
//     format: combine(
//       label({ label: "winston-test" }),
//       timestamp(),
//       myFormat // log 출력 포맷
//     ),
//   },
//   // 개발 시 console에 출력
//   console: {
//     level: "debug",
//     handleExceptions: true,
//     json: false, // 로그형태를 json으로도 뽑을 수 있다.
//     colorize: true,
//     format: combine(label({ label: "koa" }), timestamp(), myFormat),
//   },
// };

// const transport = new winston.transports.DailyRotateFile({
//   filename: `${appRoot}/logs/koa-%DATE%.log`,
//   datePattern: "YYYY-MM-DD-HH",
//   zippedArchive: true,
//   maxSize: "20m",
//   maxFiles: "14d",
// });

// transport.on("rotate", function (oldFilename, newFilename) {
//   // do something fun
// });

// const logger = winston.createLogger({
//   transports: [transport],
// });

// if (process.env.NODE_ENV !== "production") {
//   logger.add(new winston.transports.Console(options.console)); // 개발 시 console로도 출력
// }

// export default logger;
