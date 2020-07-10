import { isAdmin } from "../../../utils/utils";
import prisma from "../../../utils/prisma";
import logger from "../../../config/winston";

const postPenalty = (contentId, original, punishment, suspectId, userId) =>
  prisma.penalty.create({
    data: {
      post: {
        connect: {
          id: contentId,
        },
      },
      original: `${original}` || "",
      punishment: `${punishment}`,
      suspect: suspectId,
      marshal: userId,
    },
  });

const commentPenalty = (contentId, original, punishment, suspectId, userId) =>
  prisma.penalty.create({
    data: {
      comment: {
        connect: {
          id: contentId,
        },
      },
      original: `${original}` || "",
      punishment: `${punishment}` || "",
      suspect: suspectId,
      marshal: userId,
    },
  });

const postUpdate = (contentId, published) =>
  prisma.post.update({
    where: {
      id: contentId,
    },
    data: {
      published: published,
    },
    select: {
      authorId: true,
      title: true,
      text: true,
      category: true,
      url: true,
    },
  });

const commentUpdate = (contentId, published) =>
  prisma.comment.update({
    where: {
      id: contentId,
    },
    data: {
      published: published,
    },
    select: {
      authorId: true,
      text: true,
    },
  });

export default {
  Mutation: {
    manageContent: async (_, args, { ctx }) => {
      //   isAdmin(ctx);
      const userId = ctx.state.user.id;
      const { contentId, cause, action, type, term } = args;
      try {
        if (action === "closed") {
          try {
            let result;
            if (type === "comment") {
              result = await commentUpdate(contentId, false);
              const original = `(댓글) 내용:${result.text}`;
              const punishment = `댓글 비공개`;
              await commentPenalty(
                contentId,
                original,
                punishment,
                result.authorId,
                userId
              );
            }
            if (type === "post") {
              result = await postUpdate(contentId, false);
              const original = `(게시물) 제목:${result.title} \n내용:${result.text}`;
              const punishment = `게시물 비공개`;
              await postPenalty(
                contentId,
                original,
                punishment,
                result.authorId,
                userId
              );
            }
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
              result = await commentUpdate(contentId, true);
              const original = `(댓글) 내용:${result.text}`;
              const punishment = `댓글 공개`;
              await commentPenalty(
                contentId,
                original,
                punishment,
                result.authorId,
                userId
              );
            }
            if (type === "post") {
              result = await postUpdate(contentId, true);
              const original = `(게시물) 제목:${result.title} \n내용:${result.text}`;
              const punishment = `게시물 공개`;
              await postPenalty(
                contentId,
                original,
                punishment,
                result.authorId,
                userId
              );
            }
            return type === "post" ? "게시물 공개" : "댓글 공개";
          } catch (err) {
            throw Error("오류: 이미 삭제된 게시물(댓글)입니다");
          }
        }
        if (action === "forbidden") {
          try {
            let suspectId;
            let result;
            if (type === "post") {
              result = await prisma.post.findOne({
                where: {
                  id: contentId,
                },
                select: {
                  authorId: true,
                  title: true,
                  text: true,
                  createdAt: true,
                },
              });
              suspectId = result.authorId;
            }
            if (type === "comment") {
              result = await prisma.comment.findOne({
                where: {
                  id: contentId,
                },
                select: {
                  authorId: true,
                  text: true,
                  createdAt: true,
                },
              });
              suspectId = result.authorId;
            }
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
                  original:
                    type === "post"
                      ? `(게시물) 제목:${result.title} \n내용:${result.text}`
                      : `(댓글) 내용:${result.text}`,
                },
              });
            }

            if (type === "comment") {
              const original = `(댓글) 내용:${result.text}`;
              const punishment =
                term === 0 ? `차단해제` : `차단 ${term * 24} 시간 `;
              await commentPenalty(
                contentId,
                original,
                punishment,
                result.authorId,
                userId
              );
            }

            if (type === "post") {
              const original = `(게시물) 제목:${result.title} \n내용:${result.text}`;
              const punishment =
                term === 0 ? `차단해제` : `차단 ${term * 24} 시간 `;
              await postPenalty(
                contentId,
                original,
                punishment,
                result.authorId,
                userId
              );
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
                  where: contentId,
                  original:
                    type === "post"
                      ? `(게시물) 제목: ${result.title || ""} \n내용: ${
                          result.text || ""
                        }`
                      : `(댓글) 내용: ${result.text || ""}`,
                  term: now + term * 24 * 3600 * 1000,
                  marshal: userId,
                },
              });
            }
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
                authorId: true,
                id: true,
                title: true,
                text: true,
                url: true,
              },
            });
            const original = `(게시물) 제목:${result.title} \n내용:${result.text}`;
            const punishment = `규정 위반 게시물 이동 완료`;
            await postPenalty(
              result,
              id,
              original,
              punishment,
              result.authorId,
              userId
            );
            return `규정 위반 게시물 이동 완료`;
          } catch (err) {
            logger.error(err);
            throw Error("오류: 삭제된 게시물입니다");
          }
        }
      } catch (err) {
        throw Error(err);
      }
    },
  },
};
