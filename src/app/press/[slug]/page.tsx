'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface PressData {
  slug: string;
  published_date: string;
  press_name: string;
  title: string;
  body: string;
  external_link?: string;
  is_active: boolean;
}

const PressDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [pressData, setPressData] = useState<PressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPressData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/press/${slug}?lang=${i18n.language}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('not_found');
          } else {
            setError('fetch_error');
          }
          return;
        }
        
        const data = await res.json();
        setPressData(data);
      } catch (err) {
        console.error('Error fetching press data:', err);
        setError('fetch_error');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPressData();
    }
  }, [slug, i18n.language]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
        <div className="text-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error === 'not_found' || !pressData) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('not_found', '해당 보도 자료를 찾을 수 없습니다.')}</h1>
          <Link href="/press" className="text-blue-600 hover:underline">
            {t('back_to_list', '목록으로 돌아가기')}
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'fetch_error') {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('error_occurred', '오류가 발생했습니다.')}</h1>
          <Link href="/press" className="text-blue-600 hover:underline">
            {t('back_to_list', '목록으로 돌아가기')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-2xl w-full mx-auto">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link href="/press" className="text-gray-600 hover:text-gray-800 flex items-center">
            <span className="mr-2">←</span>
            {t('back_to_list', '목록으로 돌아가기')}
          </Link>
        </div>
        
        {/* 제목 및 메타 정보 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{pressData.title}</h1>
          <div className="text-sm text-gray-500 mb-4">
            {pressData.press_name} | {new Date(pressData.published_date).toLocaleDateString()}
          </div>
        </div>
        
        {/* 본문 내용 */}
        <div className="prose prose-sm md:prose-base mx-auto mb-8 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: pressData.body }} />
        </div>
        
        {/* 외부 링크 버튼 */}
        {pressData.external_link && (
          <div className="text-center">
            <a 
              href={pressData.external_link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-[#bda191] text-white px-6 py-3 rounded shadow hover:bg-[#a88b6a] transition"
            >
              {t('go_to_original', '원본 기사 보기')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PressDetailPage; 