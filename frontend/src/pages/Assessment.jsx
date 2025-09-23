import React, { useState } from "react";
import "./css/questions.css";

function Assessment() {
  const categories = ["Environment", "Social", "Governance"];
  const [selectedCategory, setSelectedCategory] = useState("Environment");

  // 카테고리별 샘플 질문 리스트
  const questions = {
    Environment: [
      // === 기후변화 대응 (Governance, 전략, 리스크 관리, 목표) ===
      {
        id: 1,
        category: "Environment",
        text: "이사회는 기후변화 대응 전략을 심의하고 승인합니까?",
        description: "TCFD(기후관련 재무정보공개 협의체) 권고안 및 EU CSRD 지침은 이사회가 기후리스크 감독을 담당해야 한다고 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 2,
        category: "Environment",
        text: "경영진은 탄소중립 달성을 위한 전사적 책임을 지고 있습니까?",
        description: "ISO 14064와 SBTi(과학 기반 목표 이니셔티브)는 최고 경영진의 감축목표 책임을 명시합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 3,
        category: "Environment",
        text: "Scope 1, 2 배출량을 정기적으로 산정하고 검증합니까?",
        description: "GHG Protocol과 ISO 14064는 기업이 Scope 1(직접배출), Scope 2(간접배출)를 산정·검증해야 함을 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 4,
        category: "Environment",
        text: "탄소중립 로드맵을 수립하여 공개했습니까?",
        description: "파리협정(1.5°C 목표)과 UNFCCC 요구사항에 따라 기업은 중장기 탄소중립 로드맵을 제시해야 합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 5,
        category: "Environment",
        text: "Scope 3 배출량을 산정 및 검증합니까?",
        description: "GHG Protocol과 CDP(Carbon Disclosure Project)는 공급망 전과정 배출량(Scope 3) 보고를 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 6,
        category: "Environment",
        text: "협력사 온실가스 감축을 지원하는 프로그램을 운영합니까?",
        description: "SBTi와 글로벌 밸류체인 감축 가이드라인은 협력사와 공동 감축 활동을 강조합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 7,
        category: "Environment",
        text: "에너지 관리 체계를 구축하고 있습니까?",
        description: "ISO 50001(에너지경영시스템)은 기업이 에너지 관리 체계를 갖출 것을 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 8,
        category: "Environment",
        text: "사업장 내 에너지 효율화 활동(고효율 장비 교체 등)을 실행합니까?",
        description: "IEA(국제에너지기구)는 제조업의 효율 개선을 가장 효과적인 단기 감축 방안으로 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 9,
        category: "Environment",
        text: "저탄소/무탄소 연료(LNG, 수소, 암모니아 등) 전환 계획이 있습니까?",
        description: "IMO의 연료 전환 규제(EEXI, CII) 및 EU Fit-for-55 전략은 저탄소 연료 사용 확대를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 10,
        category: "Environment",
        text: "재생에너지 도입 목표를 수립하고 있습니까?",
        description: "RE100 글로벌 캠페인과 EU CSRD는 재생에너지 도입 및 목표 설정을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 11,
        category: "Environment",
        text: "선박 건조 및 전과정평가(LCA)를 계획하고 있습니까?",
        description: "ISO 14040/14044는 제품 전과정평가(LCA)를 통한 환경영향 분석을 요구합니다.",
        options: ["예", "아니오"]
      },

      // === 기후변화 리스크 관리 ===
      {
        id: 12,
        category: "Environment",
        text: "기후변화 리스크를 식별하고 분류합니까?",
        description: "TCFD는 물리적·전환 리스크 식별과 공시를 기업 의무로 명시합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 13,
        category: "Environment",
        text: "물리적 리스크(태풍, 호우, 해일 등)를 평가합니까?",
        description: "IPCC AR6 보고서는 기후물리적 리스크 평가를 각 산업별 핵심 과제로 지정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 14,
        category: "Environment",
        text: "전환 리스크(규제, 시장 변화 등)를 평가합니까?",
        description: "TCFD는 전환 리스크(정책, 기술, 시장, 평판)를 반드시 고려할 것을 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 15,
        category: "Environment",
        text: "리스크 대응 전략을 문서화하고 실행합니까?",
        description: "ISO 14091(기후변화 적응 가이드라인)은 리스크 대응 전략의 문서화를 요구합니다.",
        options: ["예", "아니오"]
      },

      // === 기후변화 지표 및 목표 ===
      {
        id: 16,
        category: "Environment",
        text: "온실가스 감축 목표를 정량적으로 설정했습니까?",
        description: "SBTi는 과학 기반 감축 목표를 설정하고 공개할 것을 기업에 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 17,
        category: "Environment",
        text: "에너지 사용량 절감 목표를 수립했습니까?",
        description: "ISO 50001은 정량적 목표를 통해 에너지 관리 성과를 입증할 것을 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 18,
        category: "Environment",
        text: "목표 대비 성과를 매년 점검합니까?",
        description: "GRI Standards(302, 305) 및 CSRD는 매년 환경성과 점검 및 보고를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 19,
        category: "Environment",
        text: "성과를 대외적으로 공시합니까?",
        description: "CDP와 CSRD는 기후성과 및 배출량 공시를 필수화합니다.",
        options: ["예", "아니오"]
      },

      // === 환경영향 저감 기술 ===
      {
        id: 20,
        category: "Environment",
        text: "저탄소/무탄소 선박 R&D 전략을 수립했습니까?",
        description: "IMO GHG 전략과 EU Horizon Europe 프로그램은 저탄소 선박 개발을 주요 목표로 지정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 21,
        category: "Environment",
        text: "엔진 및 추진 기술 혁신을 통해 배출 저감을 추진합니까?",
        description: "IMO EEDI/EEXI 규정은 추진효율 기술개발을 통해 CO₂ 배출 저감을 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 22,
        category: "Environment",
        text: "선박 운항 효율화 기술을 적용하고 있습니까?",
        description: "IMO CII(탄소집약도지수)는 운항 효율 개선을 통해 규제치를 맞추도록 설계되었습니다.",
        options: ["예", "아니오"]
      },
      {
        id: 23,
        category: "Environment",
        text: "환경영향 저감 기술 실증 설비를 보유합니까?",
        description: "EU MRV 및 ISO 14064-2는 환경 저감 기술 실증 데이터 확보를 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 24,
        category: "Environment",
        text: "무탄소 선박 수주 확대 성과가 있습니까?",
        description: "IMO 2050 탄소중립 전략과 맞춰 무탄소 선박 시장 확대가 요구됩니다.",
        options: ["예", "아니오"]
      },

      // === 디지털 트랜스포메이션 ===
      {
        id: 25,
        category: "Environment",
        text: "스마트 조선소 구축 전략을 보유합니까?",
        description: "산업 디지털 전환(Industry 4.0) 전략은 효율적 생산 및 탄소저감을 동시에 추구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 26,
        category: "Environment",
        text: "AI 기반 자율운항 기술을 개발 중입니까?",
        description: "IMO MSC(해사안전위원회)는 자율운항 선박 규제체계를 준비 중이며 기술 확보가 요구됩니다.",
        options: ["예", "아니오"]
      },
      {
        id: 27,
        category: "Environment",
        text: "사이버 보안 체계를 구축했습니까?",
        description: "IMO Resolution MSC.428(98)은 해상 사이버 보안 리스크 관리를 의무화합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 28,
        category: "Environment",
        text: "2030년까지 디지털 전환 로드맵을 수립했습니까?",
        description: "UN SDGs(9번, 혁신 인프라)는 디지털 기술 활용을 통한 지속가능성을 강조합니다.",
        options: ["예", "아니오"]
      },

      // === 환경경영 ===
      {
        id: 29,
        category: "Environment",
        text: "환경경영 선언문 또는 방침을 공표했습니까?",
        description: "ISO 14001(환경경영시스템)은 방침 선언을 필수 요건으로 둡니다.",
        options: ["예", "아니오"]
      },
      {
        id: 30,
        category: "Environment",
        text: "환경경영 리스크 관리 체계를 운영합니까?",
        description: "ISO 14001은 환경 리스크 관리 체계 구축을 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 31,
        category: "Environment",
        text: "용수 사용 절감 및 재활용 프로그램을 실행합니까?",
        description: "GRI 303(수자원) 표준은 용수 사용 및 절감 활동 공시를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 32,
        category: "Environment",
        text: "대기오염물질 배출을 관리합니까?",
        description: "ISO 14001 및 지역 대기오염 규제(예: 한국 대기환경보전법)는 대기오염물질 관리를 의무화합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 33,
        category: "Environment",
        text: "휘발성유기화합물(VOCs)을 관리합니까?",
        description: "EU VOC 지침 및 한국 대기환경보전법은 VOC 관리 및 보고를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 34,
        category: "Environment",
        text: "폐기물 재활용 목표를 보유합니까?",
        description: "GRI 306(폐기물)과 EU 순환경제 전략은 폐기물 재활용 목표 설정을 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 35,
        category: "Environment",
        text: "환경경영 KPI를 경영진에 보고합니까?",
        description: "ISO 14001은 성과지표(KPI)의 보고 체계를 요구합니다.",
        options: ["예", "아니오"]
      },

      // === 생물다양성 ===
      {
        id: 36,
        category: "Environment",
        text: "생물다양성 보전 전략을 수립했습니까?",
        description: "COP15 글로벌 생물다양성 프레임워크는 기업의 보전 전략 수립을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 37,
        category: "Environment",
        text: "저소음 선박 건조 기술을 적용합니까?",
        description: "IMO MEPC 지침은 해양 생태계 보호를 위해 저소음 선박 기술 적용을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 38,
        category: "Environment",
        text: "선박 평형수 관리 기술을 도입했습니까?",
        description: "IMO Ballast Water Management Convention은 선박 평형수 관리 시스템을 의무화합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 39,
        category: "Environment",
        text: "생물다양성 영향 평가 절차를 보유합니까?",
        description: "ISO 14001 및 CBD(생물다양성협약)는 생물다양성 영향 평가를 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 40,
        category: "Environment",
        text: "부정적 영향 저감 방안을 수립했습니까?",
        description: "COP15 글로벌 목표는 부정적 생태 영향 저감을 기업 책임으로 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 41,
        category: "Environment",
        text: "자연 의존도/영향도를 평가합니까?",
        description: "TNFD(자연자본 공시 이니셔티브)는 기업이 자연 의존도/영향도를 평가하도록 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 42,
        category: "Environment",
        text: "해양생태계 보전 활동에 참여합니까?",
        description: "UN SDGs(목표 14: 해양생태계 보전)는 민간기업의 참여를 권장합니다.",
        options: ["예", "아니오"]
      },

      // === 종합 ===
      {
        id: 43,
        category: "Environment",
        text: "환경 성과를 주기적으로 공시합니까?",
        description: "GRI, CDP, CSRD는 성과 공시를 필수 요구사항으로 지정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 44,
        category: "Environment",
        text: "IMO, ISO 14064 등 국제 기준을 준수합니까?",
        description: "IMO, ISO 14064, GHG Protocol은 국제적으로 인정받는 핵심 기준입니다.",
        options: ["예", "아니오"]
      },
      {
        id: 45,
        category: "Environment",
        text: "환경 목표 달성 여부를 임직원 보상체계에 반영합니까?",
        description: "UN PRI 및 글로벌 ESG 투자자들은 인센티브와 ESG 목표 연계를 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 46,
        category: "Environment",
        text: "환경 리스크와 기회를 투자 의사결정에 반영합니까?",
        description: "TCFD와 EU CSRD는 재무의사결정에 기후리스크 반영을 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 47,
        category: "Environment",
        text: "환경 관련 글로벌 이니셔티브(UN SDGs 등)에 참여합니까?",
        description: "UN SDGs, UN Global Compact는 기업의 글로벌 참여를 강조합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 48,
        category: "Environment",
        text: "환경 교육을 전 직원 대상으로 실시합니까?",
        description: "ISO 14001은 직원 교육을 환경경영 필수 요건으로 둡니다.",
        options: ["예", "아니오"]
      },
      {
        id: 49,
        category: "Environment",
        text: "환경 관련 법규 위반 사례가 최근 3년간 없습니까?",
        description: "OECD 가이드라인과 UN Global Compact는 기업의 법규 준수를 ESG 기본 원칙으로 규정하며, 환경법규 위반은 ESG 평가에서 심각한 감점 요인으로 반영됩니다.",
        options: ["예", "아니오"]
      },
      {
        id: 50,
        category: "Environment",
        text: "환경 리스크 대응과 성과를 외부 이해관계자에게 투명하게 공개합니까?",
        description: "GRI Standards(102, 305)와 CDP 공개 기준은 환경 리스크 대응 및 성과를 주주, 고객, 투자자 등 이해관계자에게 투명하게 공시할 것을 요구합니다.",
        options: ["예", "아니오"]
      },
    ],
    Social: [
      {
        id: 1,
        category: "Social",
        text: "이사회는 안전보건 전략을 심의하고 승인합니까?",
        description: "산업안전보건법과 ISO 45001은 최고 의사결정기구의 안전 책임을 명확히 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 2,
        category: "Social",
        text: "최고안전책임자(CSO) 또는 전담 부서를 운영합니까?",
        description: "ILO 안전보건 가이드라인은 안전보건 전담 조직 설치를 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 3,
        category: "Social",
        text: "정기적인 안전보건 교육을 모든 임직원에게 실시합니까?",
        description: "산업안전보건법은 정기적 안전 교육을 법정 의무로 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 4,
        category: "Social",
        text: "안전작업 요구권을 직원에게 보장합니까?",
        description: "ILO 협약은 근로자가 안전하지 않은 작업을 거부할 권리를 보장해야 한다고 명시합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 5,
        category: "Social",
        text: "위험성 평가 및 리스크 관리를 정기적으로 수행합니까?",
        description: "ISO 45001은 정기적 리스크 평가와 개선 조치를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 6,
        category: "Social",
        text: "협력사에도 안전보건 정책을 동일하게 적용합니까?",
        description: "글로벌 공급망 관리 기준은 협력사 안전보건 적용을 필수로 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 7,
        category: "Social",
        text: "비상사태 대비 매뉴얼과 정기 훈련을 운영합니까?",
        description: "ISO 22301(비즈니스 연속성)은 비상 대응 계획과 훈련을 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 8,
        category: "Social",
        text: "산업재해 발생 시 조사 및 재발 방지 절차를 갖추고 있습니까?",
        description: "ILO 권고안과 국내법은 사고 원인 조사 및 재발 방지를 의무화합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 9,
        category: "Social",
        text: "정기 건강검진 및 보건 관리 체계를 운영합니까?",
        description: "산업안전보건법은 사업장의 근로자 정기 건강검진을 의무화합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 10,
        category: "Social",
        text: "안전보건 KPI를 경영 목표와 연계합니까?",
        description: "ISO 45001은 안전보건 성과를 KPI로 관리하고 경영진이 검토할 것을 권고합니다.",
        options: ["예", "아니오"]
      },

      // === 인재관리 (10문항) ===
      {
        id: 11,
        category: "Social",
        text: "체계적인 직무 역량 개발 교육을 제공합니까?",
        description: "GRI 404는 직원 교육 및 역량개발 제공을 권고합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 12,
        category: "Social",
        text: "성과 평가 기준이 투명하고 공정하게 운영됩니까?",
        description: "OECD 가이드라인은 투명한 인사평가 체계를 강조합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 13,
        category: "Social",
        text: "임직원 만족도 조사를 정기적으로 실시합니까?",
        description: "GRI 401은 임직원 참여도와 만족도 평가를 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 14,
        category: "Social",
        text: "유연근무제나 재택근무 제도를 운영합니까?",
        description: "현대적 인사관리 정책은 일·생활 균형을 핵심 요소로 보고 있습니다.",
        options: ["예", "아니오"]
      },
      {
        id: 15,
        category: "Social",
        text: "성과 보상 체계가 명확히 정의되어 있습니까?",
        description: "글로벌 HR 표준은 성과 기반 보상을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 16,
        category: "Social",
        text: "직원 복지를 위한 제도(휴가, 의료, 퇴직연금 등)를 운영합니까?",
        description: "OECD 사회정책 가이드라인은 근로자 복지를 기업 책임으로 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 17,
        category: "Social",
        text: "노사협의회나 노동조합과 정기적으로 소통합니까?",
        description: "ILO 협약은 단체교섭과 노사협의 의무를 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 18,
        category: "Social",
        text: "공정한 임금 체계를 운영합니까?",
        description: "ILO 협약은 동일가치노동 동일임금을 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 19,
        category: "Social",
        text: "퇴직 후 경력 개발이나 은퇴 설계를 지원합니까?",
        description: "OECD 인력관리 가이드라인은 은퇴 후 전환 지원을 권고합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 20,
        category: "Social",
        text: "외국인 근로자의 고용 조건과 차별 방지를 보장합니까?",
        description: "ILO 협약은 외국인 근로자 차별 금지를 명시합니다.",
        options: ["예", "아니오"]
      },

      // === 인권존중 (5문항) ===
      {
        id: 21,
        category: "Social",
        text: "인권경영 선언문을 공식적으로 발표했습니까?",
        description: "UNGP(기업과 인권 이행원칙)는 인권정책 발표를 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 22,
        category: "Social",
        text: "정기적인 인권 교육을 실시합니까?",
        description: "UN Global Compact는 인권 교육 확산을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 23,
        category: "Social",
        text: "아동 노동 및 강제 노동 방지 정책을 운영합니까?",
        description: "ILO 핵심협약은 아동·강제 노동 금지를 명시합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 24,
        category: "Social",
        text: "인권 영향평가를 정기적으로 수행합니까?",
        description: "UNGP는 인권 실사(due diligence)를 기업 의무로 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 25,
        category: "Social",
        text: "임직원 고충처리 제도를 운영합니까?",
        description: "OECD 가이드라인은 공정한 고충처리 절차를 요구합니다.",
        options: ["예", "아니오"]
      },

      // === 공급망 관리 (5문항) ===
      {
        id: 26,
        category: "Social",
        text: "공급망 ESG 정책을 공식적으로 수립했습니까?",
        description: "OECD 다국적기업 가이드라인은 공급망 ESG 정책 수립을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 27,
        category: "Social",
        text: "협력사 행동규범을 도입했습니까?",
        description: "UN Global Compact는 공급망 행동규범 도입을 권고합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 28,
        category: "Social",
        text: "협력사의 ESG 리스크 평가를 수행합니까?",
        description: "OECD 공급망 실사지침은 협력사 리스크 평가를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 29,
        category: "Social",
        text: "협력사 ESG 역량 강화를 지원합니까?",
        description: "글로벌 기업은 협력사 ESG 컨설팅 및 교육 지원을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 30,
        category: "Social",
        text: "공정거래 및 투명한 계약 절차를 운영합니까?",
        description: "OECD 가이드라인은 공정거래 및 계약 투명성을 필수 원칙으로 둡니다.",
        options: ["예", "아니오"]
      },

      // === 품질경영 (5문항) ===
      {
        id: 31,
        category: "Social",
        text: "품질경영 시스템(ISO 9001 등) 인증을 보유합니까?",
        description: "ISO 9001은 글로벌 품질경영 기본 표준입니다.",
        options: ["예", "아니오"]
      },
      {
        id: 32,
        category: "Social",
        text: "제품 품질 실패 비용을 관리합니까?",
        description: "GRI 416은 제품 품질 및 안전 관리 공시를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 33,
        category: "Social",
        text: "고객 만족도 조사를 정기적으로 수행합니까?",
        description: "ISO 10004는 고객 만족 측정과 개선을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 34,
        category: "Social",
        text: "공급망 품질 안정화 프로그램을 운영합니까?",
        description: "글로벌 품질경영 지침은 공급망 품질 관리 강화를 강조합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 35,
        category: "Social",
        text: "품질 관련 성과를 대외적으로 보고합니까?",
        description: "GRI 416은 품질성과 공시를 요구합니다.",
        options: ["예", "아니오"]
      },

      // === 사회공헌 (5문항) ===
      {
        id: 36,
        category: "Social",
        text: "사회공헌 전략과 비전을 보유합니까?",
        description: "ISO 26000(사회적 책임)은 사회공헌 전략을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 37,
        category: "Social",
        text: "지역사회 발전을 위한 봉사활동을 수행합니까?",
        description: "UN SDGs(목표 11: 지속가능한 도시)는 지역사회 기여를 강조합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 38,
        category: "Social",
        text: "기부금이나 사회공헌 성과를 투명하게 공개합니까?",
        description: "GRI 201은 기부금 및 사회공헌 지출 공시를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 39,
        category: "Social",
        text: "사회공헌 활동 효과를 평가합니까?",
        description: "ISO 26000은 사회공헌 성과 측정을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 40,
        category: "Social",
        text: "지역사회 이해관계자와 협력 네트워크를 보유합니까?",
        description: "UN SDGs는 민관협력(PPP)을 통한 사회적 가치 창출을 권장합니다.",
        options: ["예", "아니오"]
      },

      // === 추가 영역: 노사관계/고객책임/사회적 가치 (15문항) ===
      {
        id: 41,
        category: "Social",
        text: "최근 3년간 노사분규 사례가 없습니까?",
        description: "ILO 협약은 평화적 노사관계 유지와 분규 예방을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 42,
        category: "Social",
        text: "경영진과 직원 간 소통 채널을 운영합니까?",
        description: "OECD 가이드라인은 경영진과 직원 간 소통 절차를 권고합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 43,
        category: "Social",
        text: "외국인 근로자를 위한 전용 지원 제도를 운영합니까?",
        description: "ILO 협약은 외국인 근로자의 차별금지 및 지원을 강조합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 44,
        category: "Social",
        text: "고객 개인정보 보호 정책을 운영합니까?",
        description: "ISO 27701과 GDPR은 개인정보 보호를 핵심 원칙으로 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 45,
        category: "Social",
        text: "마케팅과 광고에서 허위·과장 표현을 금지합니까?",
        description: "OECD 소비자보호 가이드라인은 공정한 광고를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 46,
        category: "Social",
        text: "제품 및 서비스 안전 관련 사고 대응 절차를 갖추고 있습니까?",
        description: "ISO 10377은 소비자 안전사고 대응 절차를 규정합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 47,
        category: "Social",
        text: "지역사회 고용을 우선적으로 추진합니까?",
        description: "UN SDGs(목표 8: 양질의 일자리)는 지역 고용 창출을 강조합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 48,
        category: "Social",
        text: "취약계층 지원 프로그램을 운영합니까?",
        description: "ISO 26000은 취약계층 지원을 사회책임 핵심 영역으로 정의합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 49,
        category: "Social",
        text: "기술 인재 양성을 위한 산학협력 프로그램을 운영합니까?",
        description: "UN SDGs(목표 4: 교육)는 산학협력을 통한 역량 개발을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 50,
        category: "Social",
        text: "협력사 및 직원 대상 윤리 교육을 실시합니까?",
        description: "OECD 가이드라인은 윤리 교육을 공급망과 전 임직원에 확대할 것을 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 51,
        category: "Social",
        text: "비정규직 근로자에게 정규직과 동등한 복지를 제공합니까?",
        description: "ILO 협약은 고용형태와 무관한 차별금지를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 52,
        category: "Social",
        text: "직장 내 괴롭힘 방지 제도를 운영합니까?",
        description: "ILO 협약과 국내 근로기준법은 직장 내 괴롭힘 방지를 명시합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 53,
        category: "Social",
        text: "임직원의 사회봉사 활동 참여를 장려합니까?",
        description: "ISO 26000은 직원 사회참여를 권장합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 54,
        category: "Social",
        text: "사회공헌 성과를 정량적으로 측정하고 보고합니까?",
        description: "GRI 201은 사회공헌 지출과 효과 보고를 요구합니다.",
        options: ["예", "아니오"]
      },
      {
        id: 55,
        category: "Social",
        text: "이해관계자 의견을 경영 의사결정에 반영합니까?",
        description: "AA1000 Stakeholder Engagement Standard는 이해관계자 의견 반영을 요구합니다.",
        options: ["예", "아니오"]
      }
    ],
    Governance: [
      {
        id: 1,
        text: "귀사는 독립적인 감사위원회를 보유하고 있습니까?",
        options: ["예", "아니오"]
      },
      {
        id: 2,
        text: "귀사는 윤리 규범(Code of Conduct)을 모든 임직원에게 적용하고 있습니까?",
        options: ["예", "아니오"]
      },
      {
        id: 3,
        text: "귀사는 이사회 내 여성·소수자 비율이 일정 기준 이상입니까?",
        options: ["예", "아니오"]
      },
      {
        id: 4,
        text: "이사회 및 경영진의 ESG 관련 책임과 역할이 명확히 정의되어 있습니까?",
        options: ["예", "아니오"]
      },
      {
        id: 5,
        text: "부패 방지 및 리스크 관리 정책을 운영하고 있습니까?",
        options: ["예", "아니오"]
      }
    ]
  };

  return (
    <div className="assessment-container">
      {/* 왼쪽 사이드바 */}
      <aside className="assessment-sidebar">
        <h3>카테고리</h3>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* 오른쪽 설문 영역 */}
      <main className="assessment-content">
        <h2>{selectedCategory} 설문조사</h2>

        {questions[selectedCategory].map((q) => (
          <div key={q.id} className="question-box">
            {/* 질문 텍스트 */}
            <h4 className="question-text">{q.id}. {q.text}</h4>

            {/* description (선택적 표시) */}
            {q.description && (
              <p className="question-description">{q.description}</p>
            )}

            {/* 옵션 */}
            {q.options.map((opt, idx) => (
              <div key={idx}>
                <input type="radio" name={`q-${q.id}`} value={opt} />
                <label>{opt}</label>
              </div>
            ))}
          </div>
        ))}


        <button className="submit-btn">제출하기</button>
      </main>
    </div>
  );
}

export default Assessment;
