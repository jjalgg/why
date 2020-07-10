import { isAdmin } from "../../../utils/utils";
import prisma from "../../../utils/prisma";
import logger from "../../../config/winston";

const commentUpdate = (published) =>
  prisma.comment.update({
    where: {
      id: contentId,
    },
    data: {
      published,
    },
  });

const postUpdate = (published) =>
  prisma.post.update({
    where: {
      id: contentId,
    },
    data: {
      published,
    },
  });

export default {
  Mutation: {
    editReport: async (_, args, { ctx }) => {
      //   isAdmin(ctx);
      const userId = ctx.state.user.id;
      const {
        id,
        contentId,
        suspectId,
        reoprterId,
        cause,
        done,
        action,
        type,
        term,
      } = args;
      try {
        if (action === "done") {
          try {
            await prisma.report.update({
              where: {
                id,
              },
              data: {
                done: !done,
              },
            });
            return !done ? "완료" : "취소";
          } catch (err) {
            logger.error(err);
            throw Error("오류: 잠시 후 다시 시도해주세요");
          }
        }
        if (action === "closed") {
          try {
            let result;
            if (type === "comment") {
              result = await commentUpdate(false);
            }
            if (type === "post") {
              result = postUpdate(false);
            }
            await prisma.report.update({
              where: {
                id,
              },
              data: {
                done: true,
                penalty: {
                  create: {
                    cause: cause || "규정 위반",
                    marshal: userId,
                    punishment:
                      type === "post" ? "게시물 비공개" : "댓글 비공개",
                  },
                },
              },
            });
            return type === "post" ? "게시물 비공개" : "댓글 비공개";
          } catch (err) {
            logger.error(err);
            throw Error("오류: 이미 삭제된 게시물(댓글)입니다");
          }
        }
        if (action === "open") {
          try {
            let result;
            if (type === "comment") {
              result = await commentUpdate(true);
            }
            if (type === "post") {
              result = await postUpdate(true);
            }
            await prisma.report.update({
              where: {
                id,
              },
              data: {
                done: true,
                penalty: {
                  create: {
                    cause: cause || "",
                    marshal: userId,
                    punishment: type === "post" ? "게시물 공개" : "댓글 공개",
                  },
                },
              },
            });
            return type === "post" ? "게시물 공개" : "댓글 공개";
          } catch (err) {
            throw Error("오류: 이미 삭제된 게시물(댓글)입니다");
          }
        }
        if (action === "forbidden") {
          try {
            if (!suspectId) throw Error("오류: 존재하지 않는 이용자입니다");
            await prisma.user.update({
              where: {
                id: suspectId,
              },
              data: {
                isForbidden: term === 0 ? false : true,
              },
            });
            const exist = await prisma.forbidden.findMany({
              where: {
                subjectId: suspectId,
                released: false,
              },
              select: {
                id: true,
              },
            });
            const now = new Date().getTime();

            if (exist.length > 0) {
              await prisma.forbidden.update({
                where: {
                  id: exist[0].id,
                },
                data: {
                  released: term === 0 ? true : false,
                  term: term === 0 ? 0 : now + term * 24 * 3600 * 1000,
                },
              });
            }

            let whereContent;
            if (type === "comment") {
              whereContent = await prisma.comment.findOne({
                where: {
                  id: contentId,
                },
                select: {
                  text: true,
                },
              });
            }

            if (type === "post") {
              whereContent = await prisma.post.findOne({
                where: {
                  id: contentId,
                },
                select: {
                  title: true,
                  text: true,
                },
              });
            }

            if (exist.length === 0) {
              await prisma.forbidden.create({
                data: {
                  subject: {
                    connect: {
                      id: suspectId,
                    },
                  },
                  cause: cause || "규정 위반",
                  where:
                    type === "post"
                      ? `(게시물) 제목: ${whereContent.title || ""} \n내용: ${
                          whereContent.text || ""
                        }`
                      : `(댓글) 내용: ${whereContent.text || ""}`,
                  term: now + term * 24 * 3600 * 1000,
                  marshal: userId,
                },
              });
            }

            await prisma.report.update({
              where: {
                id,
              },
              data: {
                done: true,
                penalty: {
                  create: {
                    original:
                      type === "post"
                        ? `(게시물) 제목: ${whereContent.title} \n내용: ${whereContent.text}`
                        : `(댓글) 내용: ${whereContent.text}`,
                    marshal: userId,
                    punishment:
                      term === 0 ? `차단해제` : `차단 ${term * 24} 시간 `,
                  },
                },
              },
            });

            return term === 0 ? `차단해제` : `${term * 24}시간 차단완료`;
          } catch (err) {
            logger.error(err);
            throw Error(err);
          }
        }
        if (action === "violation") {
          try {
            const result = await prisma.post.update({
              where: {
                id: contentId,
              },
              data: {
                category: "위반",
              },
              select: {
                id: true,
                title: true,
                text: true,
              },
            });
            await prisma.report.update({
              where: {
                id,
              },
              data: {
                done: true,
                penalty: {
                  create: {
                    post: {
                      connect: {
                        id: result.id,
                      },
                    },
                    original: `(게시물) 제목: ${result.title} \n내용: ${result.text}`,
                    cause: "규정 위반",
                    marshal: userId,
                    punishment: `규정 위반 게시물 이동 완료`,
                  },
                },
              },
            });
            return `규정 위반 게시물 이동 완료`;
          } catch (err) {
            throw Error("오류: 삭제된 게시물입니다");
          }
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
