/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    district: '',
    userName: '',
    phone1: '',
    phone2: '',
    carNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userName || !formData.phone1 || !formData.carNumber) {
      return;
    }

    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbwKln626Fkt9MAgZAnlylpQrpkMDbhlFyrLkpseEO8xF6Xd0smAePbDT5AJuwaLxLRjow/exec";

    if (!scriptUrl) {
      alert("시스템 설정 오류: Google Sheets 연동 URL이 설정되지 않았습니다. 관리자에게 문의하세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 데이터를 URLSearchParams 형식으로 변환 (Google Apps Script에서 e.parameter로 받기 위함)
      const formBody = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        formBody.append(key, value as string);
      });

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // CORS 에러 방지
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      // no-cors 모드에서는 응답을 읽을 수 없으므로 에러가 throw되지 않으면 성공으로 간주
      console.log("제출된 데이터:", formData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("제출 오류:", error);
      alert("데이터 전송 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      district: '',
      userName: '',
      phone1: '',
      phone2: '',
      carNumber: ''
    });
  };

  return (
    <div className="flex flex-col min-h-screen relative z-0">
      {/* 배경 데코레이션 */}
      <div className="bg-gradient-blob blob-blue"></div>
      <div className="bg-gradient-blob blob-purple"></div>

      {/* 메인 컨텐츠 구역 */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="glass-card w-full max-w-2xl p-6 sm:p-10 shadow-2xl">
          {/* 헤더 섹션 */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 mb-6 tracking-tight leading-tight py-1">
              수성교회 주차관리<br />Data 수집
            </h1>
            <div className="p-5 sm:p-6 bg-blue-50/80 rounded-2xl border border-blue-100 text-lg sm:text-xl text-gray-800 leading-relaxed text-left font-medium shadow-sm break-keep">
              안녕하세요! <strong>수성교회 주차관리실</strong>입니다.<br className="hidden sm:block" />
              원활한 주차 관리를 위해 <strong>차량 정보(차량번호, 연락처)</strong>를 수집합니다. 수집된 정보는 주차 안내 및 긴급 연락 목적 외에는 사용되지 않습니다. 이에 동의하시는 경우에만 정보를 제공해 주시기 바랍니다. 감사합니다.
            </div>
          </div>

          {/* 데이터 수집 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* 교구 */}
            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2 ml-1">교구</label>
              <input 
                type="text" 
                name="district" 
                value={formData.district}
                onChange={handleChange}
                placeholder="예: 1교구" 
                className="input-field w-full px-5 py-4 rounded-xl text-xl sm:text-2xl" 
                disabled={isSubmitting}
              />
            </div>

            {/* 이름 (필수) */}
            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2 ml-1">이름 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="userName" 
                value={formData.userName}
                onChange={handleChange}
                required 
                placeholder="성함을 입력해 주세요" 
                className="input-field w-full px-5 py-4 rounded-xl text-xl sm:text-2xl" 
                disabled={isSubmitting}
              />
            </div>

            {/* 연락처1 (필수) */}
            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2 ml-1">연락처 1 <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                name="phone1" 
                value={formData.phone1}
                onChange={handleChange}
                required 
                placeholder="010-0000-0000" 
                className="input-field w-full px-5 py-4 rounded-xl text-xl sm:text-2xl" 
                disabled={isSubmitting}
              />
            </div>

            {/* 연락처2 */}
            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2 ml-1">연락처 2</label>
              <input 
                type="tel" 
                name="phone2" 
                value={formData.phone2}
                onChange={handleChange}
                placeholder="비상 연락처 (선택사항)" 
                className="input-field w-full px-5 py-4 rounded-xl text-xl sm:text-2xl" 
                disabled={isSubmitting}
              />
            </div>

            {/* 차량번호 (필수) */}
            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2 ml-1">차량번호 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="carNumber" 
                value={formData.carNumber}
                onChange={handleChange}
                required 
                placeholder="예: 12가 3456" 
                className="input-field w-full px-5 py-4 rounded-xl text-xl sm:text-2xl tracking-wider" 
                disabled={isSubmitting}
              />
            </div>

            {/* 제출 버튼 */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-submit w-full py-5 mt-8 rounded-2xl font-bold text-2xl text-white shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '제출 중...' : '정보 제출하기'}
            </button>
          </form>
        </div>
      </main>

      {/* 성공 안내 커스텀 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="glass-card relative z-10 w-full max-w-sm p-8 sm:p-10 text-center border-blue-200/50 bg-white">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">제출 완료!</h2>
            <p className="text-gray-700 text-lg mb-8 font-medium">수집된 차량 정보가<br />성공적으로 등록되었습니다.</p>
            <button onClick={closeModal} className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-colors font-bold text-xl">
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="text-center py-8 text-gray-500 text-sm font-medium relative z-10">
        © 2026 수성교회. All Rights Reserved.
      </footer>
    </div>
  );
}
