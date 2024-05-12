const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { sleep } = require("./utils");

/** 小美评审任务编号 */
const VOTE_TASK_LIST = [
  "XM_JA240512697214878",
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
];

const COOKIE =
  "network=wifi; WEBDFPID=0683zwu70ww65ww9zyy7x7u8xz78z56981u3x8738yy97958y89zz9w9-2030865095120-1715505094826IESICAG868c0ee73ab28e1d0b03bc83148500069925; _lx_utm=utm_term%3D12.20.403%26utm_source%3DAppStore%26utm_content%3D0000000000000012B501788DC4378AD9597650D218A89A166715221906114248%26utm_medium%3Diphone%26utm_campaign%3DAgroupBgroupD0Ghomepage_searchH0; _utm_campaign=AgroupBgroupD0Ghomepage_searchH0; _utm_content=0000000000000012B501788DC4378AD9597650D218A89A166715221906114248; _utm_medium=iphone; _utm_source=AppStore; _utm_term=12.20.403; cityid=1; dpid=; lt=AgFDJMJylhP1VXYOSA7YWJOFasxvCqO29GAcPFpTWC1JnxKesfv7iI8-8gFszfFQSWNuq_SttrAbiAAAAAAJIAAAr6DZag5fhF_HroTKYx6q9vjkR8bt35aMu0Aaln4meswAFghxqaAD40iMh0eyaLuG; passport_token=AgFDJMJylhP1VXYOSA7YWJOFasxvCqO29GAcPFpTWC1JnxKesfv7iI8-8gFszfFQSWNuq_SttrAbiAAAAAAJIAAAr6DZag5fhF_HroTKYx6q9vjkR8bt35aMu0Aaln4meswAFghxqaAD40iMh0eyaLuG; token=AgFDJMJylhP1VXYOSA7YWJOFasxvCqO29GAcPFpTWC1JnxKesfv7iI8-8gFszfFQSWNuq_SttrAbiAAAAAAJIAAAr6DZag5fhF_HroTKYx6q9vjkR8bt35aMu0Aaln4meswAFghxqaAD40iMh0eyaLuG; uuid=0000000000000012B501788DC4378AD9597650D218A89A166715221906114248; cap_login_type=PASSPORT; com.sankuai.fspfecap.fe.xiaomeimobile_random=; com.sankuai.fspfecap.fe.xiaomeimobile_strategy=; logan_session_token=fdlbmrg58wxfgdf0s4ht; passport_token=AgFDJMJylhP1VXYOSA7YWJOFasxvCqO29GAcPFpTWC1JnxKesfv7iI8-8gFszfFQSWNuq_SttrAbiAAAAAAJIAAAr6DZag5fhF_HroTKYx6q9vjkR8bt35aMu0Aaln4meswAFghxqaAD40iMh0eyaLuG; passport_userid=647666359; token2=AgFDJMJylhP1VXYOSA7YWJOFasxvCqO29GAcPFpTWC1JnxKesfv7iI8-8gFszfFQSWNuq_SttrAbiAAAAAAJIAAAr6DZag5fhF_HroTKYx6q9vjkR8bt35aMu0Aaln4meswAFghxqaAD40iMh0eyaLuG; userId=647666359; xm_c_token_v2=AgFDJMJylhP1VXYOSA7YWJOFasxvCqO29GAcPFpTWC1JnxKesfv7iI8-8gFszfFQSWNuq_SttrAbiAAAAAAJIAAAr6DZag5fhF_HroTKYx6q9vjkR8bt35aMu0Aaln4meswAFghxqaAD40iMh0eyaLuG; mt_c_token=AgFDJMJylhP1VXYOSA7YWJOFasxvCqO29GAcPFpTWC1JnxKesfv7iI8-8gFszfFQSWNuq_SttrAbiAAAAAAJIAAAr6DZag5fhF_HroTKYx6q9vjkR8bt35aMu0Aaln4meswAFghxqaAD40iMh0eyaLuG; _lxsdk=0000000000000012B501788DC4378AD9597650D218A89A166715221906114248; _lxsdk_dpid=012b501788dc4378ad9597650d218a89a166715221906114248; _lxsdk_s=18f6c1261b0-3e4-dd8-492%7C647666359%7CNaN; _lxsdk_unoinid=012b501788dc4378ad9597650d218a89a166715221906114248; _lxsdk_cuid=184282dc991c8-0afb011e150a16-7d2d1a50-505c8-184282dc991c8";

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
