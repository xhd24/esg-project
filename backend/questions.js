const questions = {
  Environment: [
    {
      id: 1,
      text: "귀사는 탄소배출량을 정기적으로 측정하고 있습니까?",
      options: ["예", "아니오"],
      description: "환경(Environment) 관련 ESG 질문 예시입니다."
    },
    {
      id: 2,
      text: "재생에너지를 사용하는 비율은 얼마입니까?",
      options: ["0~25%", "26~50%", "51~75%", "76~100%"],
      description: "재생에너지 사용 비율을 묻는 질문입니다."
    }
  ],
  Social: [
    {
      id: 1,
      text: "귀사는 직원 다양성과 포용성을 촉진하는 정책을 운영하고 있습니까?",
      options: ["예", "아니오"],
      description: "사회(Social) 관련 ESG 질문 예시입니다."
    },
    {
      id: 2,
      text: "직원 안전 교육을 정기적으로 실시합니까?",
      options: ["예", "아니오"],
      description: "안전 교육 관련 질문입니다."
    }
  ],
  Governance: [
    {
      id: 1,
      text: "귀사는 독립적인 감사위원회를 보유하고 있습니까?",
      options: ["예", "아니오"],
      description: "거버넌스(Governance) 관련 ESG 질문 예시입니다."
    },
    {
      id: 2,
      text: "윤리 규범(Code of Conduct)을 모든 임직원에게 적용하고 있습니까?",
      options: ["예", "아니오"],
      description: "윤리 경영 관련 질문입니다."
    }
  ]
};

export default questions;