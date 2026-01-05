import { CourseCard } from '@/components/course/CourseCard';

// Dummy Data
const COURSES = [
    {
        id: 'fullstack-2026',
        title: '2026 풀스택 마스터 클래스',
        description: 'Next.js 14, TypeScript, Prisma로 완성하는 모던 웹 개발의 모든 것.',
        level: '중급',
        thumbnail: 'https://placehold.co/600x400/101010/6366f1?text=Fullstack',
        price: 330000,
    },
    {
        id: 'python-ai',
        title: '파이썬으로 시작하는 AI 입문',
        description: '기초 문법부터 데이터 분석, 간단한 머신러닝 모델 구현까지.',
        level: '초급',
        thumbnail: 'https://placehold.co/600x400/101010/ec4899?text=Python+AI',
        price: 220000,
    },
    {
        id: 'algorithm-pass',
        title: '코딩테스트 합격 알고리즘',
        description: '대기업 기출 문제 풀이와 효율적인 알고리즘 설계를 위한 필수 강의.',
        level: '고급',
        thumbnail: 'https://placehold.co/600x400/101010/22c55e?text=Algorithm',
        price: 180000,
    },
    {
        id: 'react-native',
        title: '리액트 네이티브 앱 개발',
        description: 'iOS와 Android 앱을 한 번에. 실전 배달 앱 클론 코딩.',
        level: '중급',
        thumbnail: 'https://placehold.co/600x400/101010/f59e0b?text=App+Dev',
        price: 290000,
    },
];

export default function CoursesPage() {
    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>
                    전체 강의 목록
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    당신의 커리어를 다음 단계로 끌어올릴 최고의 강의들을 만나보세요.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '30px'
            }}>
                {COURSES.map((course) => (
                    <CourseCard key={course.id} {...course} />
                ))}
            </div>
        </div>
    );
}
