const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { sleep } = require("./utils");

/** 小美评审任务编号 */
const VOTE_TASK_LIST = [
  // "XM_JA240512697214878",
  //   "XM_JA240512686495752",
  //   "XM_JA24051269228183X",
  //   "XM_JA240511680984256",
  //   "XM_JA240512705172069",
  //   "MOCK-1-XM_JA231126004939522",
  //   "MOCK-1-XM_JA231028933196985",
  //   "MOCK-1-XM_JA231121013177714",
  //   "MOCK-1-XM_JA231223119995428",
  //   "MOCK-1-XM_JA211223078042042",
  //   "MOCK-1-XM_JA220223087377205",
  //   "MOCK-1-XM_JA231215088750767",
  //   "MOCK-1-XM_JA24012427683408X",
  //   "MOCK-1-XM_JA221112568769730",
  //   "MOCK-1-XM_JA22120565256459X",
  //   "MOCK-1-XM_JA240103179776328",
  //   "MOCK-1-XM_JA230915780426650",
  //   "MOCK-1-XM_JA240225386557013",
  //   "MOCK-1-XM_JA240130311647347",
  //   "MOCK-1-XM_JA221015465389521",
  "MOCK-1-XM_A240221391034779",
];

const COOKIE =
  "WEBDFPID=9u1z41wv27w15884y582z9ww19160u2w81u28y30672979581u731x43-2030959741737-1715599741737SSGWSQU868c0ee73ab28e1d0b03bc83148500064635; _lx_utm=utm_term%3D12.20.403%26utm_source%3DAppStore%26utm_content%3D0000000000000956E8E2252504E0D8478CC5A4927BD6BA163794932809878060%26utm_medium%3Diphone%26utm_campaign%3DAgroupBgroupD0GmineH0; _lxsdk_s=18f721106ed-f5a-08d-f17%7C158312167%7CNaN; lt=AgFTIHaDtQuW_Zl09Zx02qwsfk-d7Zpt58LEsDS4D4CKLARbypNPnB63XDGAO49Z0YGhqkVp7iwtyAAAAAAJIAAAXckZH6YoJzLijh5de_5E6olfPLyxySl6CL-uAQl76JpR7KMclMG8c2dNB9OYfZmT; passport_token=AgFTIHaDtQuW_Zl09Zx02qwsfk-d7Zpt58LEsDS4D4CKLARbypNPnB63XDGAO49Z0YGhqkVp7iwtyAAAAAAJIAAAXckZH6YoJzLijh5de_5E6olfPLyxySl6CL-uAQl76JpR7KMclMG8c2dNB9OYfZmT; cap_login_type=PASSPORT; com.sankuai.fspfecap.fe.xiaomeimobile_random=; com.sankuai.fspfecap.fe.xiaomeimobile_strategy=; logan_session_token=tmppgbjv8xmybogyna5b; passport_token=AgFTIHaDtQuW_Zl09Zx02qwsfk-d7Zpt58LEsDS4D4CKLARbypNPnB63XDGAO49Z0YGhqkVp7iwtyAAAAAAJIAAAXckZH6YoJzLijh5de_5E6olfPLyxySl6CL-uAQl76JpR7KMclMG8c2dNB9OYfZmT; passport_userid=158312167; token2=AgFTIHaDtQuW_Zl09Zx02qwsfk-d7Zpt58LEsDS4D4CKLARbypNPnB63XDGAO49Z0YGhqkVp7iwtyAAAAAAJIAAAXckZH6YoJzLijh5de_5E6olfPLyxySl6CL-uAQl76JpR7KMclMG8c2dNB9OYfZmT; userId=158312167; xm_c_token_v2=AgFTIHaDtQuW_Zl09Zx02qwsfk-d7Zpt58LEsDS4D4CKLARbypNPnB63XDGAO49Z0YGhqkVp7iwtyAAAAAAJIAAAXckZH6YoJzLijh5de_5E6olfPLyxySl6CL-uAQl76JpR7KMclMG8c2dNB9OYfZmT; _utm_campaign=AgroupBgroupD0GmineH0; _utm_content=0000000000000956E8E2252504E0D8478CC5A4927BD6BA163794932809878060; _utm_medium=iphone; _utm_source=AppStore; _utm_term=12.20.403; cityid=1; dpid=; network=wifi; token=AgFTIHaDtQuW_Zl09Zx02qwsfk-d7Zpt58LEsDS4D4CKLARbypNPnB63XDGAO49Z0YGhqkVp7iwtyAAAAAAJIAAAXckZH6YoJzLijh5de_5E6olfPLyxySl6CL-uAQl76JpR7KMclMG8c2dNB9OYfZmT; uuid=0000000000000956E8E2252504E0D8478CC5A4927BD6BA163794932809878060; mt_c_token=AgFTIHaDtQuW_Zl09Zx02qwsfk-d7Zpt58LEsDS4D4CKLARbypNPnB63XDGAO49Z0YGhqkVp7iwtyAAAAAAJIAAAXckZH6YoJzLijh5de_5E6olfPLyxySl6CL-uAQl76JpR7KMclMG8c2dNB9OYfZmT; _lxsdk=0000000000000956E8E2252504E0D8478CC5A4927BD6BA163794932809878060; _lxsdk_cuid=18f71b66686c8-037d7443e17d82-18576f0d-505c8-18f71b66688c8; _lxsdk_dpid=956e8e2252504e0d8478cc5a4927bd6ba163794932809878060; _lxsdk_unoinid=956e8e2252504e0d8478cc5a4927bd6ba163794932809878060";

/** 获取当前页面的评论 */
const getCurPageComment = async (pageNo, voteTaskNo) => {
  console.log("正在获取评论:::", {
    pageNo,
    voteTaskNo,
  });
  const res = await axios.post(
    `https://zqt.meituan.com/xiaomei/vote/jury/api/comment/r/pageQueryComment`,
    {
      voteTaskNo: voteTaskNo,
      pageSize: 30,
      replyPageSize: 100000,
      pageNo: pageNo,
      commentSortTypeEnum: "POPULAR",
    },
    {
      headers: {
        Cookie: COOKIE,
      },
    }
  );
  await sleep(3, 10);

  return res;
};

/** 获取所有页面的评论 */
const getAllVoteComment = async (voteTaskNo) => {
  let page = 1;
  let dataSource = [];
  let next = true;

  while (next) {
    const { data: res } = await getCurPageComment(page, voteTaskNo);
    if (res.code === 0) {
      if (res.data.pageContent && res.data.pageContent.length > 0) {
        dataSource.push(res.data.pageContent);
        page++;
      } else {
        next = false;
      }
    } else {
      console.log("请求异常:::", res);
      break;
    }
  }

  // 写入文件
  fs.writeFile(
    path.join(__dirname + "/comments", `${voteTaskNo}.json`),
    JSON.stringify(dataSource),
    (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
      } else {
        console.log("写入成功:::", voteTaskNo);
      }
    }
  );
};

/** 执行获取小美评审团评论 */
const excuteGetVoteComment = async () => {
  for (let voteTaskNo of VOTE_TASK_LIST) {
    try {
      await getAllVoteComment(voteTaskNo);
    } catch (err) {
      console.log("获取评论失败:::", voteTaskNo, err);
    }
  }
};

excuteGetVoteComment();
