import React from 'react';

export function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '60px 0',
            marginTop: 'auto',
            backgroundColor: 'var(--surface)'
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
                        Code<span className="text-gradient">Mastery</span>
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        실전 중심의 코딩 교육을 통해<br />
                        누구나 개발자가 될 수 있습니다.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Platform</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)' }}>
                            <li>강의 목록</li>
                            <li>멘토링</li>
                            <li>가격 정책</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Company</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)' }}>
                            <li>소개</li>
                            <li>블로그</li>
                            <li>채용</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)' }}>
                            <li>support@codemastery.com</li>
                            <li>KakaoTalk: @CodeMastery</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
